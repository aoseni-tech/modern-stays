// FILE CREATED TO COPY STATIC FILES IN  PUBLIC FOLDER INTO /dist  

const fs = require('fs-extra');

const filterFunc = (src, dest) => {
    return !(src.indexOf('scripts') > -1)
  }

fs.copy('./src/public', './dist/public',{ filter: filterFunc })
  .then(() => console.log('successfully copied files from static folders!'))
  .catch(err => console.error(err))