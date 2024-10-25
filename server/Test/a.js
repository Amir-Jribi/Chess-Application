// const b = require('./b');
const c=require('./c'); // the whole functions and values that are exported from that folder
const {su} = require('./b'); // apply the destruction proprety so that to extract each funtion ,  
console.log(module);
console.log(su); // undefined , because we didnt export anything called su

// console.log(b);
// console.log(c);
// console.log(b.sum(2,3));

// TODO : before adding express.json and express.urlencoded , how the message arrives