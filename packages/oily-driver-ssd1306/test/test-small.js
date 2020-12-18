
const Display = require('../index.js');

console.log('Create display instance...');
let display = new Display({
  i2cDeviceId: 0,
  displayRows: 32, // number of rows or height of the display
  displayColumns: 128, // number of columns or width of the display
  columnOffset: 0, // column offset in RAM
  multiplexRatio: 0x1F, // the display device multiplex ratio setting
  commonPadConfig: 0x02, // the display device common pad configuration setting

});

// load test fonts and convert to image map
const FiveSevenFont = require('./oled-font-5x7');
const DotMonocoFont = require('./dotmonoco-font');
const FSFontImageMap = display.fontToImageMap(FiveSevenFont, false); // not transparent
const DMFontImageMap = display.fontToImageMap(DotMonocoFont);

console.log('Initialize display...');
display.init()
  .then(() => {
    console.log('Draw strings on display...');
    // start in upper left corner
    display.setCursor(0, 0);
    // use 5x7 font to draw string with newline to jump cursor to next line
    display.drawString('Hello world!\n', FSFontImageMap);
    // use Dot Monoco font to draw string with wrap turned on
    display.drawString('Hello world!', DMFontImageMap, true);
    // update the display with the content we have drawn
    return display.updateDisplay();
  })
  .then(() => {
    return sleep(5000);
  })
  .then(() => {
    console.log('Draw pixels...');
    display.clearBuffer();
    display.drawPixels([[0, 0, 1], [2, 0, 1], [1, 1, 1], [0, 2, 1], [2, 2, 1]]);
    return display.updateDisplay();
  })
  .then(() => {
    return sleep(5000);
  })
  .then(() => {
    console.log('Draw lines...');
    display.clearBuffer();
    display.drawLine(0, 0, 10, 10, 1);
    display.drawLine(5, 0, 5, 10, 1);
    return display.updateDisplay()
  })
  .then(() => {
    return sleep(5000);
  })
  .then(() => {
    console.log('Draw rectangle...');
    display.clearBuffer()
    display.drawFillRect(10, 10, 30, 20, 1);
    return display.updateDisplay();
  })
  .then(() => {
    return sleep(5000);
  })
  .then(() => {
    console.log('Draw png js image...');
    display.clearBuffer();
    let image = require('./test-png.js');
    display.drawImage(10, 10, image);
    return display.updateDisplay();
  })
  .then(() => {
    return sleep(5000);
  })
  .then(() => {
    console.log('Spiral...');
    display.clearBuffer();
    return spiral(1);
  })
  .then(() => {
    return spiral(0);
  })
  .then(() => {
    console.log('Clipping test...');
    display.clearBuffer();
    display.drawRect(20, 10, 40, 30, 1);
    display.setClipped((x, y) => {
      if (x >= 19 && x <= 61 && y >= 9 & y <= 41) return true;
      return false;
    });
    return display.updateDisplay();
  })
  .then(() => {
    display.drawFillRect(5, 5, 100, 50, 1);
    return display.updateDisplay();
  })
  .then(() => {
    return sleep(3000);
  })
  .then(() => {
    return display.reverseDisplay(true);
  })
  .then(() => {
    return sleep(3000);
  })
  .then(() => {
    display.drawFillRect(5, 20, 30, 30, 0);
    display.drawFillRect(50, 5, 50, 50, 1);
    return display.updateDisplay();
  })
  .then(() => {
    return sleep(3000);
  })
  .then(() => {
    return display.reverseDisplay(false);
  })
  .then(() => {
    display.setClipped();
    return contrast();
  })
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.log(error.stack);
    process.exit(1);
  });


function sleep (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}


async function spiral (c) {
  let d = 10;
  let dec = 0;
  let x = 0;
  let y = 0;
  let xi = 127;
  let yi = 63;
  do {
    display.drawLine(x, y, x, y + yi, c);
    y += yi;
    yi -= dec;
    await display.updateDisplay();
    await sleep(d);
    display.drawLine(x, y, x + xi, y, c);
    x += xi--;
    await display.updateDisplay();
    await sleep(d);
    display.drawLine(x, y, x, y - yi, c);
    y -= yi--;
    await display.updateDisplay();
    await sleep(d);
    display.drawLine(x, y, x - xi, y, c);
    x -= xi--;
    await display.updateDisplay();
    await sleep(d);
    if (!dec) dec = 1;
  } while (xi && yi);
}

async function contrast () {
  /*
  let c = 0;
  do {
    display.drawFillRect(64, 10, 20, )
    display.setCursor(64, 10);
    // use 5x7 font to draw string with newline to jump cursor to next line
    display.drawString(`${c}`, FSFontImageMap);
    await display.updateDisplay();
    await display.displayContrast(c);
    await sleep(20);
  } while(c++ < 256);
  await display.displayContrast(128);
  await display.displayOff();
  await sleep(1000);
  await display.displayOn();
  await sleep(1000);
  */
  display.clearBuffer();
  await display.updateDisplay();

  for (let i = 0; i < 32; i++) {
    display.setCursor(64, 0);
    display.drawString(`${i}`, FSFontImageMap);
    console.log('PX', i)
    display.drawPixels([i, i, 1]);
    await display.updateDisplay();
    await sleep(500);
  }
  display.clearBuffer();
  await display.updateDisplay();
}


/*
// create pngjs file from png file
const FS = require('fs');
const PNGParse = require('pngparse');
PNGParse.parseFile('./test.png', (error, image) => {
  console.log(Object.keys(image));
  let rgbajs = `module.exports = {
  width: ${image.width},
  height: ${image.height},
  channels: ${image.channels},
  data: Buffer.from([${[...image.data].join(', ')}])
};`;
  FS.writeFileSync('./test.pngjs', rgbajs);
});
*/
