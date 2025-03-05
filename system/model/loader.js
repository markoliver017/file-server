const path = require('path');
const { autoload_models } = require('@config/autoload');

const models = {};
const modelsPath = require('@models');


// Load each model file and add it to the models object

// for (let i = 0; i < autoload_models.length; i++) {

//     const modelName = autoload_models[i];
//     const model = require(path.join(__dirname, '..', '..', 'application', 'models', modelName));
//     models[modelName] = model;

// }

fs.readdirSync(controllersPath).forEach(file => {
    if (file.endsWith('.js')) {
        const name = file.replace('.js', '');
        models[name.toLowerCase()] = require(path.join(modelsPath, file));
    }
});

module.exports = models;

