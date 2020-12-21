
const Defaults = {
  position: { x: 0, y: 0 },
  size: { width: 20, height: 20 },
  border: { size: 1 },

  // character draw settings
  lineSpacing: 1, // space between lines when writing strings
  letterSpacing: 1 // space between characters when writing characters
};


class Window {
  constructor(config) {
    this.Config = Object.assign({}, Defaults, config);
    // calculate the display coordinates that encompass the window's display area
    this.home = this.translateCoord({ x: 0, y: 0 });
    this.bounds = this.translateCoord({ x: this.Config.size.width - 1, y: this.Config.size.height - 1 });
    // define image object to store window buffer as an image
    this.image = {
      width: this.Config.size.width,
      height: this.Config.size.height,
      channels: 1,
      data: Buffer.alloc(this.Config.size.width * this.Config.size.height)
    };
    this.image.data.fill(0x00);
    this.cursor = { x: 0, y: 0 };
  }

  // initialize window content
  async init(excludeBackground) {
    // skip filling in window background if it is excluded
    if (!excludeBackground) await this.drawWindow();
    await this.drawBorder();
    await this.updateDisplay();
  }

  // destroy the window
  destroy () {
    this.Config.display.drawFillRect(
      this.home.x - this.Config.border.size,
      this.home.y - this.Config.border.size,
      this.Config.size.width + 2 * this.Config.border.size,
      this.Config.size.height + 2 * this.Config.border.size,
      0
    );
    delete this.Config;
  }

  // update the window on the display device
  async updateDisplay() {
    await this.Config.display.updateDisplay();
  }


  // draw window border
  async drawBorder() {
    if (!this.Config.border.size) return;
    for (let b = this.Config.border.size; b > 0; b--) {
      let xl = this.Config.position.x + this.Config.border.size - b;
      let yt = this.Config.position.y + this.Config.border.size - b;
      let xr = xl + this.Config.size.width - 1 + 2 * b;
      let yb = yt + this.Config.size.height - 1 + 2 * b;
      this.Config.display.drawLine(xl, yt, xr, yt, 1, this.externalClipped.bind(this));
      this.Config.display.drawLine(xr, yt, xr, yb, 1, this.externalClipped.bind(this));
      this.Config.display.drawLine(xr, yb, xl, yb, 1, this.externalClipped.bind(this));
      this.Config.display.drawLine(xl, yb, xl, yt, 1, this.externalClipped.bind(this));
    }
  }

  // draw window
  drawWindow () {
    this.Config.display.drawImage(this.home.x, this.home.y, this.image, this.externalClipped.bind(this));
  }


  // check display coord for clipping
  clipped (x, y) {
    return this.displayClipped(x, y) || this.externalClipped(x, y);
  }

  // check display coord for clipping by external objects
  externalClipped (x, y) {
    return (this.Config.clipped ? this.Config.clipped(x, y, this) : false);
  }

  // check display coord for clipping by this window object
  internalClipped (x, y) {
    if (
      x >= this.home.x - this.Config.border.size &&
      x <= this.bounds.x + this.Config.border.size &&
      y >= this.home.y - this.Config.border.size &&
      y <= this.bounds.y + this.Config.border.size
    ) return true;
    return false;
  }

  // check display coord for clipping by window limits
  displayClipped (x, y) {
    if (x < this.home.x || x > this.bounds.x || y < this.home.y || y > this.bounds.y) return true;
    return false;
  }

  // check local window coord for clipping by window limits
  localClipped (x, y) {
    if (x !== null && (x < 0 || x >= this.Config.size.width)) return true;
    if (y !== null && (y < 0 || y >= this.Config.size.height)) return true;
    return false;
  }

  // translate window coords to display coords based on window position and border size
  translateCoord (coord) {
    return {
      x: this.translateX(coord.x),
      y: this.translateY(coord.y)
    }
  }

  // translate window x coord to display coord
  translateX (x) {
    return x + this.Config.position.x + this.Config.border.size;
  }

  // translate window y coord to display coord
  translateY (y) {
    return y + this.Config.position.y + this.Config.border.size;
  }

  // set window and display cursor position
  setCursor (x, y) {
    this.cursor.x = x;
    this.cursor.y = y;
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
    for (let i = x; i < x + w; i += 1) this.drawLine(i, y, i, y + h - 1, color);
  }

  // draw a line
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
      if (x0 === x1 && y0 === y1) break;
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
    this.drawPixels(linePixels);
  }

  // draw pixels in the buffer, pixels is an array where each element is an array [x, y, color]
  drawPixels (pixels) {
    // if one pixel is passed then convert to array of one pixel
    if (typeof pixels[0] !== 'object') pixels = [pixels];
    pixels.forEach(pixel => {
      // draw in local image buffer if not clipped by local window clipped
      if (!this.localClipped(pixel[0], pixel[1])) this.image.data[pixel[0] + pixel[1] * this.Config.size.width] = pixel[2];
      // translate to display coords
      pixel[0] = this.translateX(pixel[0]);
      pixel[1] = this.translateY(pixel[1]);
    });
    // draw in the display and apply clipping
    this.Config.display.drawPixels(pixels, this.clipped.bind(this));
  }

  // draw the
  drawImagePixel (pixel) {
    this.image.data[pixel[0] + pixel[1] * this.Config.size.width] = pixel[2];
  }

// TODO look into oled-js-font-foundry
// TODO support non-monospaced fonts
  // draw a string using provided font image map
  drawString (str, fontIM, wrap) {
    let colOffset = this.cursor.x;
    let lines = str.split('\n');
    for (let li = 0; li < lines.length; li++) {
      let words = lines[li].split(' ');
      let addSpace = false;
      for (let wi = 0; wi < words.length; wi++) {
        let word = words[wi];
        if (wrap && colOffset > 0 && colOffset + word.length * fontIM.width > this.Config.size.width + (addSpace ? fontIM.width : 0)) {
          // wrap word
          this.cursor.y += fontIM.height + this.Config.lineSpacing;
          this.cursor.x = 0;
          colOffset = 0;
          addSpace = false;
        }
        let chars = word.split('');
        if (addSpace) chars.unshift(' ');
        for (let ci = 0; ci < chars.length; ci++) {
          let charImage = fontIM[chars[ci]];
          // if not transparent font image then fill in spacing before drawing char image
          if (charImage.channels !== 2 && charImage.channels !== 4)
            this.drawFillRect(colOffset, this.cursor.y, charImage.width + this.Config.letterSpacing, charImage.height + this.Config.lineSpacing, 0);
          this.drawImage(colOffset, this.cursor.y, charImage);
          colOffset += charImage.width + this.Config.letterSpacing;
          // check if wrap and no room for next char
          if (wrap && colOffset >= this.Config.size.width - fontIM.width) {
            this.cursor.y += fontIM.height + this.Config.lineSpacing;
            this.cursor.x = 0;
            colOffset = 0;
            addSpace = false;
          }
          else addSpace = true;
          this.setCursor(colOffset, this.cursor.y);
        }
      }
      // if not last line then new line
      if (li < lines.length - 1) {
        this.cursor.y += fontIM.height + this.Config.lineSpacing;
        this.cursor.x = 0;
        colOffset = 0;
      }
    }
  }

  // draw image from pngparse at the specified coordinates
  drawImage (dx, dy, image) {
    dx = dx || 0;
    dy = dy || 0;
    let dyy;
    let dxx;
    let imageOffset;
    let color;

    // outer loop through columns
    for (let x = 0; x < image.width; x++) {
      dxx = dx + x;
      if ( this.localClipped(dxx, null)) continue;
      // inner loop through rows
      for (let y = 0; y < image.height; y++) {
        dyy = dy + y;
        if ( this.localClipped(null, dyy)) continue;
        imageOffset = (image.width * image.channels * y + image.channels * x);
        // transparency check
        if ((image.channels === 2 || image.channels === 4) && !image.data[imageOffset + (image.channels - 1)]) continue;
        // convert image pixel color to monochrome
        color = (image.channels < 3 ? image.data[imageOffset] : image.data[imageOffset] || image.data[imageOffset + 1] || image.data[imageOffset + 2]);
        this.drawImagePixel([dxx, dyy, color]);
      }
    }
    this.Config.display.drawImage(this.translateX(dx), this.translateY(dy), image, this.clipped.bind(this));
  }

}

module.exports = Window;
