const { writeFile } = require('fs');

function writeJson(filename, data) {
    return writeFile(filename, JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        } else {
            console.log('The file ' + filename + ' has been saved');
        }
    });
}

module.exports = writeJson;