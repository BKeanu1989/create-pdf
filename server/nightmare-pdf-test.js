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
console.log("artist:", artist);
console.log("date:", date);

  process.argv.forEach((val, index) => {
    console.log(`argv-foreach::${index}: ${val}`);
  });

nightmare
  .goto(`http://localhost:3000/pdf-create?artist=${artist}&date=${date}`)
  .pdf(`./abrechnung-${artist}-${date}.pdf`)
  .end()
  .then(() => {
    console.log(`PDF 'abrechnung-${artist}-${date}.pdf' Created `);
  })
  .catch((err) => {
    console.log(err);
  })
