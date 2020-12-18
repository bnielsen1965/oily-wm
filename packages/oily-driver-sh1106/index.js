
const Constants = require('./constants');
const SPIDevice = require('spi-device');
const RPiSysfsIO = require('rpi-sysfs-io');

// values to set mode on spi data/command gpio pin
const SPI_MODE_DATA = 1;
const SPI_MODE_COMMAND = 0;

const Defaults = {
  // character draw settings
  lineSpacing: 1, // space between lines when writing strings
  letterSpacing: 1, // space between characters when writing characters

  // display settings
  rows: 64, // number of rows or height of the display
  columns: 128, // number of columns or width of the display
  columnOffset: 2, // column offset in RAM
  multiplexRatio: 0x3F, // the display device multiplex ratio setting
  commonPadConfig: 0x12, // the display device common pad configuration setting

  // spi-device configuration
  spi: {
    bus: 0,
    device: 0,
    mode: 0,
    chipSelectHigh: false,
    lsbFirst: false,
    threeWire: false,
    loopback: false,
    noChipSelect: false,
    ready: false,
    bitsPerWord: 8,
    maxSpeedHz: 1000000
  },

  // gpio pins
  spiDCPin: 24,  // data / command control GPIO pins
  resetPin: 25 // hardware reset GPIO pin
};

// SH1106 OLED driver for oily-wm
class Display {
  constructor (config) {
    this.Config = Object.assign({}, Defaults, config);
    this.displayPages = Math.ceil(this.Config.rows / 8);
    this.displayBuffer = Buffer.alloc(this.Config.columns * this.displayPages);
    this.dirtyAll = false;
    this.dirtyBytes = {};
    this.cursorx = 0;
    this.cursory = 0;
    this.spiMode = SPI_MODE_COMMAND;
  }



  //************************//
  // initialization methods //
  //************************//

  // initialize the display
  async init () {
    this.clearBuffer();
    await this.spiInit();
    await this.gpioInit();
    await this.reset();
    await this.displayOff();
    await this.displayInit();
    await this.updateDisplay();
    await this.displayOn();
  }

  // initialize spi-device
  spiInit () {
    return new Promise((resolve, reject) => {
      this.spiDevice = SPIDevice.open(this.Config.spi.bus, this.Config.spi.device, this.Config.spi, error => {
        this.spiDevice.setOptionsSync(this.Config.spi)
        if (error) reject(new Error(error));
        else resolve();
      });
    });
  }

  // initialize gpio pins
  async gpioInit () {
    this.gpio = new RPiSysfsIO();
    // init spi data/command gpio pin
    await this.gpio.exportGPIO(this.Config.spiDCPin, true);
    await this.gpio.directionGPIO(this.Config.spiDCPin, 'out');
    await this.setSpiDCMode(this.spiMode);
    // init reset gpio pin
    await this.gpio.exportGPIO(this.Config.resetPin, true);
    await this.gpio.directionGPIO(this.Config.resetPin, 'out');
    await this.gpio.writeGPIO(this.Config.resetPin, 1);
  }

  // toggle reset pin
  async reset () {
    await this.setReset(0, 10);
    await this.setReset(1);
  }

  // set reset pin value with optional delay
  async setReset (value, delay) {
    await this.gpio.writeGPIO(this.Config.resetPin, value);
    if (delay) await this.delay(delay);
  }

  delay (delay) {
  	return new Promise((resolve, reject) => {
  		setTimeout(() => { resolve(); }, delay);
  	});
  }



  //******************//
  // spi comm methods //
  //******************//

  // switch to data command mode then transfer data array
  async sendData (dataArray) {
    if (this.spiMode !== SPI_MODE_DATA) await this.setSpiDCMode(SPI_MODE_DATA);
    return await this.transfer(dataArray);
  }

  // transfer data array over SPI
  async sendCommand (dataArray) {
    if (this.spiMode !== SPI_MODE_COMMAND) await this.setSpiDCMode(SPI_MODE_COMMAND);
    return await this.transfer(dataArray);
  }

  // set data or command for next spi transfer
  async setSpiDCMode (spiMode) {
    this.spiMode = spiMode;
    await this.gpio.writeGPIO(this.Config.spiDCPin, spiMode);
  }

  // transfer array of data over spi
  transfer (dataArray) {
    return new Promise((resolve, reject) => {
      let message = {
        sendBuffer: Buffer.from(dataArray),
        receiveBuffer: Buffer.alloc(dataArray.length),
        byteLength: dataArray.length,
        speedHz: this.Config.spi.maxSpeedHz
      };
      this.spiDevice.transfer([message], (error, message) => {
        if (error) reject(new Error(error));
        else resolve(message.receiveBuffer);
      });
    });
  }



  //************************//
  // display buffer methods //
  //************************//

  // clear the display buffer contents
  clearBuffer () {
    this.displayBuffer.fill(0x00);
    this.dirtyAll = true;
  }

  // update the display with the buffer contents
  updateDisplay () {
    if (this.dirtyAll) return this.updateAll();
    return this.updateDirty();
  }

  // update the entire display
  async updateAll () {
    // setup RAM addressing
    let set_page_address = Constants.SET_PAGE_ADDRESS | 0x00;
    let set_col_low_bits = Constants.SET_COL_ADDR_LB | this.Config.columnOffset;
    let set_col_high_bits = Constants.SET_COL_ADDR_HB | 0x00;
    for (let p = 0; p < this.displayPages; p++) {
      // set RAM address before write
      await this.sendCommand([set_page_address, set_col_low_bits, set_col_high_bits]);
      let offset = p * this.Config.columns;
      // get page from buffer and write to RAM
      let pageBuffer = Buffer.from(this.displayBuffer.slice(offset, offset + this.Config.columns));
      await this.sendData(pageBuffer);
      set_page_address += 1; // next page
    }
    this.dirtyAll = false;
    this.dirtyBytes = {};
  }

  // update display RAM with changes made to the display buffer based on dirtyBytes
  async updateDirty () {
    // get a list of page numbers
    let pages = Object.keys(this.dirtyBytes);
    pages.sort();
    // loop through dirty page numbers
    for (let pi = 0; pi < pages.length; pi++) {
      let page = pages[pi];
      // get dirty columns from the dirty page
      let columns = Object.keys(this.dirtyBytes[page]);
      columns.sort();
      // simple efficiency, write all buffer bytes from dirty min x to max x
      let minx = Math.min(...columns);
      let maxx = Math.max(...columns);
      // setup RAM addressing
      let columnAddr = minx + this.Config.columnOffset;
      let set_page_address = Constants.SET_PAGE_ADDRESS | page;
      let set_col_low_bits = Constants.SET_COL_ADDR_LB | (columnAddr & 0x0F);
      let set_col_high_bits = Constants.SET_COL_ADDR_HB | ((columnAddr & 0xF0) >> 4);
      await this.sendCommand([set_page_address, set_col_low_bits, set_col_high_bits]);
      // send the buffer contents that cover the entire range of changed columns
      let offset = page * this.Config.columns + minx;
      let pageBuffer = Buffer.from(this.displayBuffer.slice(offset, offset + (maxx - minx) + 1));
      await this.sendData(pageBuffer);
      delete this.dirtyBytes[page];
    }
  }

  // update a byte in the display buffer at bufferOffset and add dirty byte at page and column
  updateBufferByte (bufferOffset, page, column, byte) {
    if (byte === null || byte === this.displayBuffer[bufferOffset]) return;
    this.displayBuffer[bufferOffset] = byte;
    this.dirtyBytes[page] = this.dirtyBytes[page] || {};
    this.dirtyBytes[page][column] = byte;
  }



  //******************//
  // display commands //
  //******************//

  // reverse the display, on pixels show as off and off pixels show as on
  async reverseDisplay (reversed) {
    await this.sendCommand([Constants.SET_DISPLAY_REVERSE | (reversed ? 0x01 : 0x00)])
  }

  // set the display contrast
  async displayContrast (contrast) {
    await this.sendCommand([Constants.SET_CONTRAST, contrast & 0xFF]);
  }

  // turn the display off
  async displayOff () {
    await this.sendCommand([Constants.DISPLAY_ON_OFF]);
  }

  // turn the display on
  async displayOn () {
    await this.sendCommand([Constants.DISPLAY_ON_OFF | 0x01]);
  }

  // initialize display
  async displayInit () {
    await this.sendCommand([
      Constants.SET_COL_ADDR_LB | 0x00,
      Constants.SET_COL_ADDR_HB | 0x00,
      Constants.SET_SEGMENT_REMAP | 0x00,
      Constants.SET_DISPLAY_REVERSE | 0x00,
      Constants.SET_MULTIPLEX_RATIO, this.Config.multiplexRatio,
      Constants.SET_ENTIRE_DISPLAY_ON_OFF | 0x00,
      Constants.SET_DISPLAY_OFFSET, 0x00,
      Constants.SET_DISPLAY_CLOCK_RATIO, 0xF0,
      Constants.SET_CHARGE_PERIOD, 0x22,
      Constants.SET_COMMON_PAD_CONFIG, this.Config.commonPadConfig,
      Constants.SET_VCOM_LEVEL, 0x20
    ]);
  }



  //**************************//
  // display clipping methods //
  //**************************//

  // check if a coordinate is clipped
  clipped (x, y) {
    if (this.Config.clippedMethod) return this.Config.clippedMethod(x, y);
    if (x !== null && (x < 0 || x >= this.Config.columns)) return true;
    if (y !== null && (y < 0 || y >= this.Config.rows)) return true;
    return false;
  }

  // set an external clipping method
  setClipped (clippedMethod) {
    this.Config.clippedMethod = clippedMethod;
  }



  //*****************//
  // drawing methods //
  //*****************//

  // set starting position of a text string on the oled
  setCursor (x, y) {
    this.cursorx = x;
    this.cursory = y;
  }

  // draw a string using provided font image map
  drawString (str, fontIM, wrap) {
    let words = str.split(' ');
    let colOffset = this.cursorx;
    for (let wi = 0; wi < words.length; wi++) {
      // handle word wrapping
      if (wrap && wi && colOffset > 0 && colOffset + fontIM.width * words[wi].length > this.Config.columns) {
        colOffset = 0;
        this.cursory += fontIM.height + this.Config.lineSpacing;
        this.setCursor(colOffset, this.cursory);
      }
      // replace lost space between words
      if (wi < words.length - 1 || !words[wi].length) words[wi] += ' ';
      let wordChars = words[wi].split('');
      for (let ci = 0; ci < wordChars.length; ci++) {
        if (wordChars[ci] === '\n') {
          colOffset = 0;
          this.cursory += fontIM.height + this.Config.lineSpacing;
          this.setCursor(colOffset, this.cursory);
        }
        else if (fontIM[wordChars[ci]]) {
          let charImage = fontIM[wordChars[ci]];
          // if not transparent font image then fill in spacing before drawing char image
          if (charImage.channels !== 2 && charImage.channels !== 4) {
            this.drawFillRect(colOffset, this.cursory, charImage.width + this.Config.letterSpacing, charImage.height + this.Config.lineSpacing, 0);
          }
          this.drawImage(colOffset, this.cursory, charImage);
          colOffset += charImage.width + this.Config.letterSpacing;
          // check if wrap and no room for next char
          if (wrap && colOffset >= this.Config.columns - fontIM.width) {
            colOffset = 0;
            this.cursory += fontIM.height + this.Config.lineSpacing;
          }
          this.setCursor(colOffset, this.cursory);
        }
      }
    }
  }

  // draw pixels in the buffer, pixels is an array where each element is an array [x, y, color]
  drawPixels (pixels) {
    // if one pixel is passed then convert to array of one pixel
    if (!Array.isArray(pixels[0])) pixels = [pixels];
    let pixelByte;
    let bufferPage;
    let bufferOffset;
    let bufferByte;

    pixels.forEach(pixel => {
      // don't process if coords are outside of display buffer
      if (this.clipped(pixel[0], pixel[1])) return;

      // determine display page number and bit in column byte from pixel y coord
      bufferPage = Math.floor(pixel[1] / 8);
      pixelByte = 0x01 << (pixel[1] - 8 * bufferPage);

      // determine offset into display buffer from x coord and page
      bufferOffset = pixel[0] + this.Config.columns * bufferPage;

      // get current buffer byte value
      bufferByte = this.displayBuffer[bufferOffset];

      // turn pixel off by inverting pixel column byte and anding with existing buffer column byte
      if (!pixel[2]) bufferByte &= ~pixelByte;
      // turn pixel on by anding pixel column byte with existing buffer column byte
      else if (pixel[2]) bufferByte |= pixelByte;

      // update buffer
      this.updateBufferByte(bufferOffset, bufferPage, pixel[0], bufferByte);
    });
  }

  // using Bresenham's line algorithm
  drawLine (x0, y0, x1, y1, color) {
    // protect against infinite loops
    x0 = Math.round(x0 || 0);
    y0 = Math.round(y0 || 0);
    x1 = Math.round(x1 || 0);
    y1 = Math.round(y1 || 0);

    let dx = Math.abs(x1 - x0);
    let sx = x0 < x1 ? 1 : -1;
    let dy = Math.abs(y1 - y0);
    let sy = y0 < y1 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;
    let linePixels = [];
    while (true) {
      linePixels.push([x0, y0, color]);
      if (x0 === x1 && y0 === y1) {
        this.drawPixels(linePixels);
        break;
      }
      let e2 = err;
      if (e2 > -dx) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dy) {
        err += dx;
        y0 += sy;
      }
    }
  }

  // draw a rectangle
  drawRect (x, y, w, h, color) {
    this.drawLine(x, y, x, y + h, color);
    this.drawLine(x, y + h, x + w, y + h, color);
    this.drawLine(x + w, y + h, x + w, y, color);
    this.drawLine(x + w, y, x, y, color);
  }

  // draw a filled rectangle on the oled
  drawFillRect (x, y, w, h, color) {
    // one iteration for each column of the rectangle
    for (let i = x; i < x + w; i += 1) this.drawLine(i, y, i, y + h - 1, color, false);
  }

  // draw image from pngparse at the specified coordinates
  drawImage (dx, dy, image) {
    dx = dx || 0;
    dy = dy || 0;
    let dyy;
    let dxx;
    let dyyPage;
    let dxxByte = null;
    let bufferOffset = 0;
    let page;
    let imageOffset;
    let pixelByte;
    let color;

    // outer loop through columns
    for (let x = 0; x < image.width; x++) {
      dxx = dx + x;
      if (this.clipped(dxx, null)) continue;
      page = -1; // reset page
      // inner loop through rows
      for (let y = 0; y < image.height; y++) {
        dyy = dy + y;
        if (this.clipped(null, dyy)) continue;
        // calculate buffer page for y coord
        dyyPage = Math.floor(dyy / 8);
        // check if new page
        if (dyyPage > page) {
          // update buffer
          this.updateBufferByte(bufferOffset, page, dxx, dxxByte);
          // prepare settings for new page
          page = dyyPage;
          bufferOffset = page * this.Config.columns + dxx;
          dxxByte = this.displayBuffer[bufferOffset];
        }
        // calculate offset into image data (4 bytes per RGBA pixel)
        imageOffset = (image.width * image.channels * y + image.channels * x);

        // transparency check
        if ((image.channels === 2 || image.channels === 4) && !image.data[imageOffset + (image.channels - 1)]) continue;

        // convert pixel y position into buffer column byte
        pixelByte = 0x01 << (dyy - 8 * dyyPage);
        // convert image pixel color to monochrome
        color = (image.channels < 3 ? image.data[imageOffset] : image.data[imageOffset] || image.data[imageOffset + 1] || image.data[imageOffset + 2]);

        // apply pixel to buffer byte
        if (color) dxxByte |= pixelByte;
        else dxxByte &= ~pixelByte;
      }
      // update buffer
      this.updateBufferByte(bufferOffset, page, dxx, dxxByte);
      dxxByte = null;
    }
  }

  // convert an oled js font to a font image map
  fontToImageMap (font, transparent) {
    let fontIM = { width: font.width, height: font.height };
    let colPages = Math.ceil(font.height / 8); // number of byte pages to represent column
    let charBytes = colPages * font.width; // bytes per character
    let padBits = (colPages * 8) % font.height; // height may be less total bit height
    for (let li = 0; li < font.lookup.length; li++) {
      let idata = [];
      let cdata = font.fontData.slice(li * charBytes, (li + 1) * charBytes);
      for (let p = 0; p < colPages; p++) {
        for (let b = 0; b < 8; b++) {
          if (!p && b >= 8 - padBits) continue; // first page may have padding bits
          let bitMask = 0x01 << b; // create mask for this bit position in char byte
          for (let c = 0; c < font.width; c++) {
            let pixelState = cdata[c + p * font.width] & bitMask ? 1 : 0;
            idata.push(pixelState);
            if (transparent) idata.push(pixelState ? 0xff : 0x00);
          }
        }
      }
      fontIM[font.lookup[li]] = {
        width: font.width,
        height: font.height,
        channels: (transparent ? 2 : 1),
        data: Buffer.from(idata)
      };
    }
    return fontIM;
  }

}

module.exports = Display;
