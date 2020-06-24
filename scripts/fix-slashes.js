// the script runs after build, it fixes the backslashes in generated es/index.mjs file to work with unix
// export { ZArray } from "./utils\\zarray.mjs";    ==>    export { ZArray } from "./utils/zarray.mjs";

const startStr = 'export {';
const endStr = '.mjs";';

const path = require('path');
const fs = require('fs');
let file = fs.readFileSync('es/index.mjs', 'utf8');
// console.log('file:', file);



const ixStart = file.indexOf(startStr);
if (ixStart === -1) {
	console.error(`Error in scripts/fix-slashes.js, the start string '${startStr}' was not found`);
	process.exit(1);
}

let ixEnd = file.lastIndexOf(endStr);
if (ixEnd === -1) {
	console.error(`Error in scripts/fix-slashes.js, the end string '${endStr}' was not found`);
	process.exit(1);
}
ixEnd += endStr.length;

let exportText = file.substring(ixStart, ixEnd);
exportText = exportText.replace(/\\\\/g, '/');
file = file.substring(0, ixStart) + exportText + file.substr(ixEnd);
try {
	fs.writeFileSync('es/index.mjs', file, 'utf8');
	console.log('fixing slashes ended successfully');
} catch(e) {
	console.error('Error in scripts/fix-slashes.js:', e);
	process.exit(1);
}
