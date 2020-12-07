module.exports = (api) => {
    api.cache(false);
    const presets = ['@babel/preset-env'];
    const plugins = [
        [require('./bableplugin.js')]
    ];
    return {
        presets,
        plugins
    }
}