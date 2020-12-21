
const Constants = require('./constants');
const I2C = require('i2c-bus');

const Defaults = {
  // character draw settings
  lineSpacing: 1, // space between lines when writing strings
  letterSpacing: 1, // space between characters when writing characters

  // display settings
  rows: 64, // number of rows or height of the display
  columns: 128, // number of columns or width of the display
  columnOffset: 0, // column offset in RAM
  multiplexRatio: 0x3F, // the display device multiplex ratio setting
  commonPadConfig: 0x12, // the display device common pad configuration setting

  // i2c-bus configuration
  i2c: {
    bus: 1,       // i2c bus number
    address: 0x3c // address of device
  }
};

// SSD1306 OLED driver for oily-wm
class Display {
  constructor (config) {
    this.Config = Object.assign({}, Defaults, config);
    this.displayPages = Math.ceil(this.Config.rows / 8);
    this.displayBuffer = Buffer.alloc(this.Config.columns * this.displayPages);
    this.dirtyAll = false;
    this.dirtyBytes = {};
    this.cursorx = 0;
    this.cursory = 0;
  }



  //************************//
  // initialization methods //
  //************************//

  // initialize the display
  async init () {
    this.clearBuffer();
    await this.i2cInit();
    await this.displayOff();
    await this.displayInit();
    await this.updateDisplay();
    await this.displayOn();
  }

  // initialze i2c device
  async i2cInit() {
    this.i2c = await I2C.openPromisified(this.Config.i2c.bus);
  }



  //******************//
  // i2c comm methods //
  //******************//

  // send data array
  async sendData (dataArray) {
    let sendBuffer = Buffer.concat([Buffer.from([Constants.CONTROL_DATA]), Buffer.from(dataArray)]);
    await this.i2c.i2cWrite(this.Config.i2c.address, sendBuffer.length, sendBuffer);
  }

  // send command array
  async sendCommand (dataArray) {
    let sendBuffer = Buffer.concat([Buffer.from([Constants.CONTROL_COMMAND]), Buffer.from(dataArray)]);
    await this.i2c.i2cWrite(this.Config.i2c.address, sendBuffer.length, sendBuffer);
  }



  //************************//
  // display buffer methods //
  //************************//

  // clear the display buffer contents
  clearBuffer () {
    this.displayBuffer.fill(0x00);
    this.dirtyAll = true;
  }

  // update the dislay with the buffer contents
  updateDisplay () {
    if (this.dirtyAll) return this.updateAll();
    return this.updateDirty();
  }

  // update the entire display
  async updateAll () {
    // setup RAM addressing
    await this.sendCommand([
      Constants.SET_COL_ADDR_START,
      this.Config.columnOffset,
      (this.Config.columnOffset + this.Config.columns - 1),
      Constants.SET_PAGE_ADDRESS_START,
      0,
      ((this.Config.rows / 8) - 1)
    ]);
    await this.sendData(this.displayBuffer);
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
      await this.sendCommand([
        Constants.SET_COL_ADDR_START,
        minx + this.Config.columnOffset,
        (maxx + this.Config.columnOffset),
        Constants.SET_PAGE_ADDRESS_START,
        parseInt(page),
        parseInt(page)
      ]);
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

  // initialze display
  async displayInit () {
    await this.sendCommand([
      Constants.NOP,
      Constants.NOP,
      Constants.NOP,
      Constants.DISPLAY_ON_OFF,
      Constants.SET_DISPLAY_CLOCK_RATIO, 0x80,
      Constants.SET_MULTIPLEX_RATIO, this.Config.multiplexRatio,
      Constants.SET_DISPLAY_OFFSET, 0x00,
      Constants.SET_COL_ADDR_LB,
      Constants.SET_COL_ADDR_HB,
      Constants.SET_CHARGE_PUMP, 0x14,
      Constants.SET_MEMORY_MODE, 0x00, // 0x00 act like ks0108
      Constants.SET_SEGMENT_REMAP | 0x01,
      Constants.SET_COMMON_OUTPUT_SCAN_DIRECTION | 0x08,
      Constants.SET_COMMON_PAD_CONFIG, this.Config.commonPadConfig,
      Constants.SET_CONTRAST, 0x8F,
      Constants.SET_CHARGE_PERIOD, 0xF1,
      Constants.SET_VCOM_LEVEL, 0x40,
      Constants.SET_ENTIRE_DISPLAY_ON_OFF,
      Constants.SET_DISPLAY_REVERSE,
      Constants.DISPLAY_ON_OFF | 0x01
    ]);
  }



  //**************************//
  // display clipping methods //
  //**************************//

  // check if a coordinate is clipped
  clipped (x, y) {
    if (x !== null && (x < 0 || x >= this.Config.columns)) return true;
    if (y !== null && (y < 0 || y >= this.Config.rows)) return true;
    return false;
  }



  //*****************//
  // drawing methods //
  //*****************//

  // set starting position of a text string on the oled
  setCursor (x, y) {
    this.cursorx = x;
    this.cursory = y;
  }

// TODO consider window method as alternative drawString
  // draw a string using provided font image map
  drawString (str, fontIM, wrap, clipping) {
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
          if (charImage.channels !== 2 && charImage.channels !== 4)
            this.drawFillRect(colOffset, this.cursory, charImage.width + this.Config.letterSpacing, charImage.height + this.Config.lineSpacing, 0, clipping);
          this.drawImage(colOffset, this.cursory, charImage, clipping);
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
  drawPixels (pixels, clipping) {
    // if one pixel is passed then convert to array of one pixel
    if (!Array.isArray(pixels[0])) pixels = [pixels];
    let pixelByte;
    let bufferPage;
    let bufferOffset;
    let bufferByte;

    pixels.forEach(pixel => {
      // don't process if coords are clipped or outside of display buffer
      if ((clipping && clipping(pixel[0], pixel[1])) || this.clipped(pixel[0], pixel[1])) return;

      // determine buffer page and column byte from pixel y coord
      bufferPage = Math.floor(pixel[1] / 8);
      pixelByte = 0x01 << (pixel[1] - 8 * bufferPage);

      // determine offset into buffer from x coord and page
      bufferOffset = pixel[0] + this.Config.columns * bufferPage;

      // determine the buffer byte value
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
  drawLine (x0, y0, x1, y1, color, clipping) {
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
        this.drawPixels(linePixels, clipping);
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
  drawRect (x, y, w, h, color, clipping) {
    this.drawLine(x, y, x, y + h, color, clipping);
    this.drawLine(x, y + h, x + w, y + h, color, clipping);
    this.drawLine(x + w, y + h, x + w, y, color, clipping);
    this.drawLine(x + w, y, x, y, color, clipping);
  }

  // draw a filled rectangle on the oled
  drawFillRect (x, y, w, h, color, clipping) {
    // one iteration for each column of the rectangle
    for (let i = x; i < x + w; i += 1) this.drawLine(i, y, i, y + h - 1, color, clipping);
  }

  // draw image from pngparse at the specified coordinates
  drawImage (dx, dy, image, clipping) {
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
      page = -1; // reset page
      // inner loop through rows
      for (let y = 0; y < image.height; y++) {
        dyy = dy + y;
        if ((clipping && clipping(dxx, dyy)) || this.clipped(dxx, dyy)) continue;
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
