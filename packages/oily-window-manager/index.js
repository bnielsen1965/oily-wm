
const Window = require('../oily-window'); // TODO replace with package name when ready to publish

const Defaults = {
  border: { size: 1 }
};

class WindowManager {
  constructor(config) {
    this.Config = Object.assign({}, Defaults, config);
    this.windows = [];
  }

  // check display coords coming from specified window are clipped by other windows
  clipped (x, y, window) {
    for (let i = window.Config.zIndex - 1; i >= 0; i--) {
      if (this.windows[i].internalClipped(x, y)) return true;
    }
    return false;
  }

  // create new window
  async createWindow (config) {
    let window = new Window(Object.assign({}, this.Config, config, { clipped: this.clipped.bind(this) }));
    this.windows.unshift(window);
    this.setZIndicies();
    await window.init();
    return window;
  }

  // destroy the passed window
  destroyWindow (window) {
    let di = window.Config.zIndex;
    // remove window
    this.windows.splice(di, 1);
    this.setZIndicies();
    window.Config.zIndex = null;//this.windows.length;
    window.destroy();
    // redraw all windows
    for (let i = this.windows.length - 1; i >= 0; i--) {
      this.windows[i].drawBorder();
      this.windows[i].drawWindow();
    }
  }

  // update the display device
  async updateDisplay() {
    await this.Config.display.updateDisplay();
  }

  // set the z index on each window
  setZIndicies () {
    for (let i = 0; i < this.windows.length; i++) {
      this.windows[i].Config.zIndex = i;
    }
  }

}

module.exports = WindowManager;
