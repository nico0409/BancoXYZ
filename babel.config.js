module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Este plugin SIEMPRE debe ir al final del arreglo de plugins
      'react-native-reanimated/plugin',
    ],
  };
};
