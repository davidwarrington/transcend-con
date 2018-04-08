let fs = require('fs');
let path = require('path');

// fs.renameSync('./assets/img/temp', `./assets/img/chris`);
const files = fs.readdirSync('./assets/img/david-warrington');

console.log(files);

// const file = files.filter(file => (path.basename(file) - path.extname(file)) === 'david-warrington')[0];
// const file = path.parse(files[0])
const file = files.filter(file => path.parse(file).name === 'david-warrington')
console.log(file)