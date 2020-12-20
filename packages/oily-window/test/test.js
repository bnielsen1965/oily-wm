const Window = require('../index.js');
const Display = require('../../oily-driver-sh1106/index.js');

console.log('Create display instance...');
let display = new Display();

let win2, win3, win4;

let win1 = new Window({
  display: display,
  position: { x: 15, y: 15 },
  border: { size: 2 },
  size: { width: 40, height: 20 }
});

let win = new Window({
  display: display,
  position: { x: 10, y: 10 },
  border: { size: 1 },
  size: { width: 20, height: 20 },
});

console.log('Initialize display...');
display.init()
  .then(() => {
    return win1.init();
  })
  .then(() => {
    return win.init();
  })
  .then(() => {
    win.drawLine(0, 0, 19, 19, 1);
    return win.updateDisplay();
  })
  .then(() => {
    return drawLines();
  })
  .then(() => {
    win2 = new Window({
      display: display,
      position: { x: 5, y: 18 },
      border: { size: 1 },
      size: { width: 20, height: 20 },
    });
    return win2.init();
  })
  .then(() => {
    win2.drawPixels([[0, 0, 1], [0, 2, 1]]);
    win2.drawLine(19, 0, 0, 19, 1);
    win2.drawRect(2, 2, 10, 10, 1);
    win2.drawFillRect(8, 14, 15, 3, 1);
    return win2.updateDisplay();
  })
  .then(() => {
    display.drawImage(60, 0, win2.image);
    return display.updateDisplay();
  })
  .then(() => {
    win3 = new Window({
      display: display,
      position: { x: 64, y: 18 },
      border: { size: 1 },
      size: { width: 20, height: 20 },
    });
    return win3.init();
  })
  .then(() => {
    win3.drawImage(0, 0, win2.image)
    return win3.updateDisplay();
  })
  .then (() => {
    win4 = new Window({
      display: display,
      position: { x: 86, y: 18 },
      border: { size: 3 },
      size: { width: 24, height: 24 },
    });
    return win4.init();
  })
  .then(() => {
    win4.drawImage(2, 2, win2.image)
    return win4.updateDisplay();
  })
  .catch(error => {
    console.log(error.stack);
    process.exit(1);
  });


async function drawLines () {
  let count = 10;
  do {
    win1.drawLine(Math.random() * display.Config.columns, Math.random() * display.Config.rows, Math.random() * display.Config.columns, Math.random() * display.Config.rows, 1);
    await win1.updateDisplay();
    win.drawLine(Math.random() * display.Config.columns, Math.random() * display.Config.rows, Math.random() * display.Config.columns, Math.random() * display.Config.rows, 1);
    await win.updateDisplay();
    await wait(100);
  } while(count--);

}

function wait (ms) {
  return new Promise((resolve, rejecct) => setTimeout(resolve, ms));
}
