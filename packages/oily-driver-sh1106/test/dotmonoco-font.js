/**
 * “Dot Monoco” 16 X 16 font
 * by Nathan Boyer (prettyuglycode.net) based on the “Monaco” font
 * Designed for use with the the “Wrobot 16*16 Dot Matrix LED Shield” for Arduino
 * http://prettyuglycode.net/16X16_font.pdf
 *
 * “Dot Monoco” font by Nathan Boyer is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 *
 * Converted by Jonathan Reisdorf for the use with the Onion Omega OLED expansion
 *
 * Reformatted to noopkat oled-js format 2018-11-23
 */
module.exports = {
  monospace: true,
  width: 16,
  height: 16,
  lookup: [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "!", "?", '"', "'", ":", ",", ";", "+", "-", "=", "(", ")", "$", ".", "/", "@", " "
  ],
  fontData: [
    '0xf0','0xf8','0xfc','0x0c','0x06','0x02','0x82','0xc2','0x62','0x32','0x1c','0x1c','0xf8','0xf0','0xe0','0x00','0x01','0x03','0x07','0x0e','0x0e','0x13','0x11','0x10','0x10','0x10','0x18','0x0e','0x0f','0x07','0x03','0x00',
    '0x00','0x08','0x04','0x04','0x04','0x02','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x10','0x10','0x10','0x10','0x10','0x1f','0x1f','0x1f','0x10','0x10','0x10','0x10','0x10','0x00','0x00',
    '0x00','0x04','0x06','0x02','0x02','0x02','0x82','0x82','0xc2','0x62','0x66','0x3e','0x1c','0x1c','0x00','0x00','0x00','0x18','0x1c','0x1e','0x12','0x13','0x11','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x00','0x00',
    '0x00','0x04','0x04','0x42','0x42','0x42','0x42','0x42','0x62','0xe6','0xbe','0xbc','0x98','0x00','0x00','0x00','0x00','0x08','0x18','0x10','0x10','0x10','0x10','0x10','0x10','0x18','0x08','0x0f','0x0f','0x07','0x00','0x00',
    '0x00','0x80','0xc0','0xe0','0x70','0x78','0x3c','0x1e','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x00','0x00','0x03','0x03','0x03','0x02','0x02','0x02','0x02','0x02','0x1f','0x1f','0x1f','0x02','0x02','0x02','0x02','0x00',
    '0x00','0x3e','0x3e','0x3e','0x22','0x22','0x22','0x22','0x62','0x62','0xc2','0xc2','0x82','0x80','0x00','0x00','0x00','0x08','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x18','0x0c','0x0f','0x07','0x03','0x00','0x00',
    '0x00','0xe0','0xf8','0xfc','0x8c','0x44','0x46','0x22','0x22','0x22','0x22','0x62','0xc2','0xc0','0x80','0x00','0x00','0x03','0x07','0x0f','0x0f','0x18','0x10','0x10','0x10','0x10','0x18','0x1c','0x0f','0x07','0x03','0x00',
    '0x00','0x02','0x02','0x02','0x02','0x02','0x82','0xc2','0xe2','0x72','0x32','0x1a','0x0e','0x0e','0x06','0x00','0x00','0x00','0x00','0x1c','0x1e','0x1f','0x03','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x00','0x18','0xbc','0xbe','0xe2','0x62','0x42','0x42','0xe2','0xbe','0xbc','0x1c','0x00','0x00','0x00','0x00','0x06','0x0f','0x1f','0x19','0x10','0x10','0x10','0x10','0x10','0x19','0x0f','0x0f','0x06','0x00','0x00',
    '0x70','0xf8','0xfc','0x8c','0x06','0x02','0x02','0x02','0x02','0x82','0x86','0x7c','0xfc','0xf8','0xf0','0x00','0x00','0x00','0x10','0x11','0x11','0x11','0x11','0x11','0x11','0x18','0x08','0x0c','0x07','0x07','0x01','0x00',
    '0x00','0x00','0x00','0x80','0xc0','0xf0','0x3c','0x0e','0x0e','0x3e','0xfc','0xf0','0xc0','0x00','0x00','0x00','0x10','0x18','0x1e','0x07','0x03','0x02','0x02','0x02','0x02','0x02','0x02','0x03','0x0f','0x1f','0x1c','0x00',
    '0x00','0xfe','0xfe','0xfe','0x42','0x42','0x42','0x42','0x42','0x62','0xe6','0xbe','0x9c','0x1c','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x10','0x10','0x10','0x10','0x10','0x10','0x18','0x19','0x0f','0x0f','0x07','0x00',
    '0x00','0xe0','0xf8','0xf8','0x1c','0x0c','0x06','0x02','0x02','0x02','0x02','0x02','0x02','0x02','0x00','0x00','0x00','0x01','0x07','0x07','0x0e','0x0c','0x18','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x00','0x00',
    '0x00','0xfe','0xfe','0xfe','0x02','0x02','0x02','0x02','0x02','0x02','0x06','0x0c','0xfc','0xf8','0xf0','0x00','0x00','0x1f','0x1f','0x1f','0x10','0x10','0x10','0x10','0x10','0x10','0x18','0x0c','0x0f','0x07','0x01','0x00',
    '0x00','0x00','0xfe','0xfe','0xfe','0x42','0x42','0x42','0x42','0x42','0x42','0x42','0x42','0x02','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x00','0x00',
    '0x00','0x00','0xfe','0xfe','0xfe','0x42','0x42','0x42','0x42','0x42','0x42','0x42','0x42','0x02','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0xe0','0xf8','0xf8','0x1c','0x0c','0x06','0x02','0x02','0x82','0x82','0x82','0x82','0x82','0x00','0x00','0x00','0x01','0x07','0x07','0x0e','0x08','0x18','0x10','0x10','0x10','0x10','0x1f','0x1f','0x1f','0x00','0x00',
    '0x00','0xfe','0xfe','0xfe','0x40','0x40','0x40','0x40','0x40','0x40','0x40','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00',
    '0x00','0x02','0x02','0x02','0x02','0x02','0xfe','0xfe','0xfe','0x02','0x02','0x02','0x02','0x02','0x00','0x00','0x00','0x10','0x10','0x10','0x10','0x10','0x1f','0x1f','0x1f','0x10','0x10','0x10','0x10','0x10','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x02','0x02','0x02','0x02','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x00','0x00','0x18','0x10','0x10','0x10','0x10','0x10','0x10','0x18','0x0f','0x0f','0x07','0x00','0x00','0x00','0x00',
    '0x00','0xfe','0xfe','0xfe','0xc0','0xc0','0xe0','0x70','0x38','0x18','0x0c','0x06','0x06','0x02','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x01','0x03','0x03','0x06','0x0c','0x0c','0x18','0x10','0x10','0x00',
    '0x00','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x00','0x00','0x00','0x00',
    '0xfe','0xfe','0x1e','0x38','0xf0','0xc0','0x00','0x00','0x00','0xc0','0xf0','0x38','0x0e','0xfe','0xfe','0x00','0x1f','0x1f','0x00','0x00','0x00','0x01','0x07','0x06','0x07','0x01','0x00','0x00','0x00','0x1f','0x1f','0x00',
    '0x00','0xfe','0xfe','0xfe','0x1c','0x38','0x70','0xc0','0x80','0x00','0x00','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x03','0x07','0x0e','0x1f','0x1f','0x1f','0x00','0x00',
    '0xf0','0xf8','0xfc','0x0c','0x06','0x02','0x02','0x02','0x02','0x02','0x06','0x0c','0xfc','0xf8','0xf0','0x00','0x03','0x07','0x0f','0x0c','0x18','0x10','0x10','0x10','0x10','0x10','0x18','0x0c','0x0f','0x07','0x03','0x00',
    '0x00','0xfe','0xfe','0xfe','0x82','0x82','0x82','0x82','0x82','0x82','0xc2','0x66','0x7c','0x3c','0x18','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0xf0','0xf8','0xfc','0x0c','0x06','0x02','0x02','0x02','0x02','0x02','0x06','0x0c','0xfc','0xf8','0xf0','0x00','0x01','0x07','0x0f','0x0c','0x18','0x10','0x10','0x10','0x30','0x70','0x58','0xcc','0x8f','0x87','0x83','0x80',
    '0x00','0xfe','0xfe','0xfe','0x82','0x82','0x82','0x82','0xc2','0x7e','0x3c','0x1c','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x01','0x03','0x03','0x07','0x0e','0x1c','0x18','0x10','0x00','0x00',
    '0x00','0x18','0x3c','0x3c','0x66','0x62','0x62','0xc2','0xc2','0xc2','0x82','0x82','0x02','0x00','0x00','0x00','0x00','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x11','0x19','0x0f','0x0f','0x06','0x00','0x00',
    '0x02','0x02','0x02','0x02','0x02','0x02','0xfe','0xfe','0xfe','0x02','0x02','0x02','0x02','0x02','0x02','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x07','0x0f','0x0f','0x18','0x10','0x10','0x10','0x10','0x10','0x18','0x0f','0x0f','0x07','0x00','0x00',
    '0x06','0x0e','0x3c','0xf0','0xc0','0x80','0x00','0x00','0x00','0x80','0xc0','0xf0','0x3c','0x0e','0x06','0x00','0x00','0x00','0x00','0x00','0x01','0x07','0x1e','0x18','0x1e','0x07','0x01','0x00','0x00','0x00','0x00','0x00',
    '0x3e','0x7e','0xfe','0xc0','0x00','0xc0','0xf8','0x3e','0x3e','0xfe','0xf0','0x00','0x80','0xf8','0x7e','0x06','0x00','0x00','0x03','0x1f','0x1f','0x1f','0x07','0x00','0x00','0x03','0x1f','0x1f','0x1f','0x07','0x00','0x00',
    '0x00','0x02','0x06','0x0e','0x1c','0xb8','0xf0','0xe0','0xe0','0xb0','0x18','0x0c','0x06','0x02','0x00','0x00','0x10','0x18','0x1c','0x0e','0x07','0x03','0x01','0x00','0x01','0x01','0x03','0x06','0x0c','0x18','0x10','0x00',
    '0x02','0x06','0x0c','0x18','0x30','0x60','0xe0','0xc0','0xc0','0x60','0x30','0x18','0x0c','0x06','0x02','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x02','0x02','0x02','0x02','0x02','0x82','0xc2','0xe2','0x72','0x3a','0x1e','0x0e','0x06','0x00','0x00','0x00','0x10','0x18','0x1c','0x1e','0x17','0x13','0x11','0x10','0x10','0x10','0x10','0x10','0x10','0x00','0x00',
    '0x00','0x80','0xc0','0xe0','0x60','0x30','0x10','0x10','0x10','0x10','0x10','0xf0','0xf0','0xf0','0x00','0x00','0x00','0x07','0x0f','0x1f','0x18','0x10','0x10','0x10','0x18','0x08','0x0c','0x1f','0x1f','0x1f','0x00','0x00',
    '0x00','0x00','0xfe','0xfe','0xfe','0x60','0x20','0x30','0x10','0x10','0x10','0x30','0xf0','0xe0','0xc0','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x10','0x10','0x10','0x10','0x10','0x18','0x0c','0x0f','0x07','0x03','0x00',
    '0x00','0x00','0x80','0xc0','0xe0','0x60','0x30','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x20','0x00','0x00','0x00','0x03','0x07','0x0f','0x0c','0x18','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x00',
    '0x00','0x00','0x80','0xc0','0xe0','0x60','0x30','0x10','0x10','0x10','0x10','0x10','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x07','0x0f','0x1f','0x18','0x10','0x10','0x10','0x18','0x08','0x0c','0x1f','0x1f','0x1f','0x00',
    '0x00','0x80','0xc0','0xe0','0x60','0x30','0x10','0x10','0x10','0x10','0x10','0x30','0xe0','0xe0','0xc0','0x00','0x00','0x03','0x07','0x0f','0x0d','0x19','0x11','0x11','0x11','0x11','0x11','0x11','0x11','0x19','0x09','0x00',
    '0x40','0x40','0x40','0xf8','0xfc','0xfc','0x46','0x46','0x42','0x42','0x42','0x42','0x42','0x02','0x02','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x80','0xc0','0xe0','0x60','0x30','0x10','0x10','0x10','0x10','0x10','0xf0','0xf0','0xf0','0x00','0x00','0x00','0x47','0xcf','0x9f','0x98','0x90','0x90','0x90','0x98','0x88','0xcc','0x7f','0x7f','0x3f','0x00','0x00',
    '0x00','0xfe','0xfe','0xfe','0x60','0x20','0x30','0x10','0x10','0x10','0x30','0xf0','0xe0','0xe0','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00',
    '0x00','0x00','0x10','0x10','0x10','0x10','0xf2','0xf2','0xf2','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x10','0x10','0x10','0x10','0x00','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x10','0x10','0x10','0x10','0x10','0x10','0xf2','0xf2','0xf2','0x00','0x00','0x00','0x00','0x00','0x00','0x80','0x80','0x80','0x80','0x80','0x80','0xc0','0x7f','0x7f','0x3f','0x00','0x00','0x00',
    '0x00','0x00','0xfe','0xfe','0xfe','0x00','0x80','0x80','0x40','0x20','0x20','0x10','0x10','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x01','0x01','0x03','0x03','0x06','0x0c','0x1c','0x18','0x18','0x10','0x00',
    '0x00','0x00','0x02','0x02','0x02','0x02','0xfe','0xfe','0xfe','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x10','0x10','0x10','0x10','0x00','0x00','0x00',
    '0xf0','0xf0','0xf0','0x20','0x20','0x10','0xf0','0xf0','0xe0','0x20','0x20','0x10','0xf0','0xf0','0xe0','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00',
    '0x00','0xf0','0xf0','0xf0','0x60','0x20','0x30','0x10','0x10','0x10','0x30','0xf0','0xe0','0xe0','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00',
    '0x80','0xc0','0xe0','0x60','0x30','0x10','0x10','0x10','0x10','0x10','0x30','0x60','0xe0','0xc0','0x80','0x00','0x03','0x07','0x0f','0x0c','0x18','0x10','0x10','0x10','0x10','0x10','0x18','0x0c','0x0f','0x07','0x03','0x00',
    '0x00','0xf0','0xf0','0xf0','0x60','0x20','0x30','0x10','0x10','0x10','0x30','0xf0','0xe0','0xc0','0x00','0x00','0x00','0xff','0xff','0xff','0x10','0x10','0x10','0x10','0x10','0x18','0x0c','0x0f','0x07','0x03','0x00','0x00',
    '0x00','0x80','0xc0','0xe0','0x60','0x30','0x10','0x10','0x10','0x10','0x10','0xf0','0xf0','0xf0','0x00','0x00','0x00','0x07','0x0f','0x1f','0x18','0x10','0x10','0x10','0x18','0x08','0x0c','0xff','0xff','0xff','0x00','0x00',
    '0x00','0x00','0xf0','0xf0','0xf0','0x60','0x20','0x30','0x10','0x10','0x70','0x70','0x70','0x00','0x00','0x00','0x00','0x00','0x1f','0x1f','0x1f','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x60','0xe0','0xf0','0xb0','0x90','0x10','0x10','0x10','0x10','0x10','0x30','0x20','0x00','0x00','0x00','0x00','0x08','0x08','0x10','0x10','0x11','0x11','0x11','0x11','0x13','0x1b','0x1f','0x0e','0x0e','0x00','0x00',
    '0x20','0x20','0x20','0x20','0xfc','0xfc','0xfc','0x20','0x20','0x20','0x20','0x20','0x20','0x20','0x00','0x00','0x00','0x00','0x00','0x00','0x07','0x0f','0x1f','0x18','0x10','0x10','0x10','0x10','0x10','0x18','0x00','0x00',
    '0x00','0xf0','0xf0','0xf0','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0xf0','0xf0','0xf0','0x00','0x00','0x00','0x0f','0x0f','0x1f','0x18','0x10','0x10','0x10','0x18','0x08','0x0c','0x1f','0x1f','0x1f','0x00','0x00',
    '0x10','0x70','0xe0','0xc0','0x80','0x00','0x00','0x00','0x00','0x00','0x00','0xc0','0xe0','0x70','0x10','0x00','0x00','0x00','0x00','0x01','0x03','0x0e','0x1c','0x18','0x1c','0x0e','0x03','0x01','0x00','0x00','0x00','0x00',
    '0x30','0xf0','0xf0','0x80','0x00','0x00','0xe0','0x70','0x70','0xe0','0x00','0x00','0x00','0xf0','0xf0','0x30','0x00','0x01','0x0f','0x1f','0x18','0x0f','0x01','0x00','0x00','0x03','0x0f','0x18','0x1f','0x0f','0x01','0x00',
    '0x00','0x10','0x30','0x30','0x60','0xc0','0x80','0x80','0x80','0xc0','0x60','0x30','0x10','0x10','0x00','0x00','0x10','0x10','0x18','0x0c','0x06','0x06','0x03','0x01','0x03','0x06','0x06','0x0c','0x18','0x10','0x10','0x00',
    '0x00','0x10','0x30','0x60','0xc0','0x80','0x00','0x00','0x00','0x00','0x00','0x00','0xc0','0xe0','0x70','0x10','0x80','0x80','0x80','0x80','0x80','0xc1','0x47','0x6e','0x3c','0x1c','0x0e','0x07','0x01','0x00','0x00','0x00',
    '0x00','0x10','0x10','0x10','0x10','0x10','0x10','0x10','0x90','0xd0','0x50','0x70','0x30','0x10','0x00','0x00','0x00','0x10','0x18','0x1c','0x14','0x16','0x13','0x11','0x11','0x10','0x10','0x10','0x10','0x10','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x1e','0xfe','0xfe','0x1e','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x18','0x1b','0x1b','0x18','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x00','0x02','0x02','0x02','0x02','0x02','0x82','0xc2','0x62','0x76','0x3e','0x1c','0x1c','0x00','0x00','0x00','0x00','0x00','0x00','0x18','0x1b','0x1b','0x1b','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x00','0x4c','0x6e','0x3e','0x3e','0x1c','0x00','0x00','0x4c','0x6e','0x3e','0x3e','0x1c','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x4c','0x6e','0x3e','0x3e','0x1c','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x30','0x30','0x30','0x30','0x30','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x18','0x18','0x18','0x18','0x18','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x98','0xdc','0x7c','0x7c','0x38','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x30','0x30','0x30','0x30','0x30','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x98','0xdc','0x7c','0x7c','0x38','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0xf0','0xf0','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x01','0x01','0x01','0x01','0x01','0x01','0x1f','0x1f','0x01','0x01','0x01','0x01','0x01','0x01','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x01','0x01','0x01','0x01','0x01','0x01','0x01','0x01','0x01','0x01','0x01','0x00','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x05','0x05','0x05','0x05','0x05','0x05','0x05','0x05','0x05','0x05','0x05','0x05','0x05','0x05','0x05','0x00',
    '0x00','0x00','0x80','0xe0','0xf0','0x78','0x18','0x0c','0x0c','0x04','0x04','0x02','0x02','0x02','0x02','0x00','0x00','0x00','0x03','0x0f','0x1f','0x3c','0x30','0x60','0x60','0x40','0xc0','0x80','0x80','0x80','0x80','0x00',
    '0x00','0x02','0x02','0x02','0x02','0x04','0x04','0x0c','0x0c','0x18','0x78','0xf0','0xe0','0x80','0x00','0x00','0x00','0x80','0x80','0x80','0x80','0xc0','0x40','0x60','0x60','0x30','0x3c','0x1f','0x0f','0x03','0x00','0x00',
    '0x00','0x18','0x3c','0x3c','0x66','0x62','0x42','0xff','0xff','0x82','0x82','0x82','0x02','0x02','0x00','0x00','0x00','0x08','0x18','0x18','0x10','0x10','0x10','0x3f','0x3f','0x10','0x19','0x19','0x0f','0x0f','0x06','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x18','0x18','0x18','0x18','0x18','0x00','0x00','0x00','0x00','0x00','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x00','0x80','0xc0','0x60','0x30','0x18','0x18','0x0c','0x06','0x02','0x00','0x10','0x18','0x18','0x0c','0x06','0x03','0x01','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
    '0xe0','0xf8','0x18','0xcc','0xe4','0x32','0x12','0x12','0x92','0x92','0xf2','0xf2','0x06','0x04','0x8c','0xf8','0x01','0x07','0x0e','0x0c','0x19','0x11','0x11','0x11','0x11','0x10','0x11','0x09','0x01','0x01','0x01','0x00',
    '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00'
  ]
};
