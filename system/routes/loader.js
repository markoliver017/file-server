const fs = require('fs');
const path = require('path');

const controllers = {};
const controllersPath = require('@controllers'); // Using alias

fs.readdirSync(controllersPath).forEach(file => {
    if (file.endsWith('.js')) {
        const name = file.replace('.js', '');
        controllers[name.toLowerCase()] = require(path.join(controllersPath, file));
    }
});

module.exports = controllers;
