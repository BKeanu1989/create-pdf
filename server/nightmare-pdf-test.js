"use strict";

const moment = require('moment');
const queryString = require('query-string');
var Nightmare = require('nightmare'),
  nightmare = Nightmare({
    // show: true,
    width: 1300
  });

const artist = process.argv[2];
const artistUpperCase = artist.toUpperCase();
// console.log(artistUpperCase);
const date = process.argv[3];
const artistID = process.argv[4];
const billNumber = process.argv[5];
const dateWithoutHiphens = moment(date).format('YYYYMM');

const query = {};
query.artist = artist;
query.date = date;

const paramsEncoded = queryString.stringify(query);
const url = `http://localhost:3000/pdf-create?${paramsEncoded}`;

  process.argv.forEach((val, index) => {
    // console.log(`argv-foreach::${index}: ${val}`);
  });
  // artistCapsLock = artist.toUpperCase();
// ABRECHNUNG_${billNumber}_${artistID}${date}_${artist}.pdf
nightmare
  .goto(url)
  .wait(7500)
  .pdf(`./ABRECHNUNG_${billNumber}_${artistID}${dateWithoutHiphens}_${artistUpperCase}.pdf`)
  .end()
  .then(() => {
    console.log(`PDF Created `);
  })
  .catch((err) => {
    console.log(err);
  })
