
const WindowManager = require('../packages/oily-window-manager');
const Display = require('../packages/oily-driver-sh1106');
const FiveSevenFont = require('./oled-font-5x7');
//const FSFontImageMap = display.fontToImageMap(FiveSevenFont, false); // not transparent

let display = new Display();
let manager = new WindowManager({ display });

const FSFontImageMap = display.fontToImageMap(FiveSevenFont, false); // not transparent

let win1, win2, win3;

tests()
  .catch(error => {
    console.log(error.stack);
    process.exit(1);
  });

async function tests () {
  await display.init();
  win1 = await manager.createWindow({
    position: { x: 16, y: 15 },
    border: { size: 2 },
    size: { width: 40, height: 40 }
  });
  await manager.updateDisplay();
//  win1.drawLine(0, 0, 19, 19, 1);
  win1.setCursor(0, 0);
  win1.drawString('A test string', FSFontImageMap, true);
  await win1.updateDisplay();
//  await drawLines(win1);

  win2 = await manager.createWindow({
    position: { x: 25, y: 20 },
    border: { size: 2 },
    size: { width: 40, height: 20 }
  });
  await drawLines(win2);

  win3 = await manager.createWindow({
    position: { x: 20, y: 25 },
    border: { size: 3 },
    size: { width: 40, height: 30 }
  });
//  await drawLines(win1);
  await drawLines(win3);

//  await drawLines(win1);
console.log('DRAW LINE')
win1.drawLine(38,2,37,3,1)
await manager.updateDisplay();
await wait(1000)
console.log('DESTROY WIN2')
  await manager.destroyWindow(win2);
  await manager.updateDisplay();
    await wait(1000)
    console.log('DESTROY WIN3')
    await manager.destroyWindow(win3);
    await wait(1000)
    await manager.updateDisplay();
    await wait(1000)
  process.exit(0)
  await wait(1000)
//  await drawLines(win1);
//  await drawLines(win1);
  await manager.destroyWindow(win3);
  await wait(1000)
  await manager.updateDisplay();
  await wait(1000)
  win1.drawString(' 000\nAnother string.', FSFontImageMap, true);
  await manager.updateDisplay();
}

async function drawLines (win) {
  let count = 20;
  do {
    win.drawLine(Math.random() * display.Config.columns, Math.random() * display.Config.rows, Math.random() * display.Config.columns, Math.random() * display.Config.rows, 1);
    await win.updateDisplay();
    await wait(100);
  } while(count--);

}

function wait (ms) {
  return new Promise((resolve, rejecct) => setTimeout(resolve, ms));
}
