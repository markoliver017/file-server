module.exports = {
    splitPath: (url) => url.split('/').filter(part => part), // Splits route into segments
    isValidMethod: (controller, method) => typeof controller?.[method] === 'function'
};
