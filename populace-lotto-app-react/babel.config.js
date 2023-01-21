module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@styles': './src/styles/styles.tsx',
          '@images': './src/assets/images/',
          '@Utils': './src/utils/Utils.tsx',
          '@Navigator': './src/routers/Navigator.tsx',
          '@components': './src/components/',
          '@redux': './src/redux/',
          '@screens': './src/screens/',
          '@services': './src/services/',
          '@screenName': './src/routers/registerScreens.tsx',
          '@MyAsyncStorage': './src/storage/MyAsyncStorage.tsx',
          '@keyName': './src/storage/keyName.tsx',
          '@strings': './src/styles/strings.tsx',
          '@ApiClient': './src/services/ApiServices.tsx',
        },
      },
    ],
  ],
};
