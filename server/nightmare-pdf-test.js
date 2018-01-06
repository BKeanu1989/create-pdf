"use strict";

const moment = require('moment');
console.log(moment().format('LLLL'));
var Nightmare = require('nightmare'),
  nightmare = Nightmare({
    // show: true,
    width: 1300
  });

const artist = process.argv[2];
const date = process.argv[3];
const artistID = process.argv[4];
const billNumber = process.argv[5];
const dateWithoutHiphens = moment(date).format('YYYYMM');
  process.argv.forEach((val, index) => {
    // console.log(`argv-foreach::${index}: ${val}`);
  });
  // artistCapsLock = artist.toUpperCase();
// ABRECHNUNG_${billNumber}_${artistID}${date}_${artist}.pdf
nightmare
  .goto(`http://localhost:3000/pdf-create?artist=${artist}&date=${date}`)
  .pdf(`./ABRECHNUNG_${billNumber}_${artistID}${dateWithoutHiphens}_${artist}.pdf`)
  .end()
  .then(() => {
    console.log(`PDF Created `);
  })
  .catch((err) => {
    console.log(err);
  })
