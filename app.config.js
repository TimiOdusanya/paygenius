const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const iosUrlScheme = iosClientId
  ? `com.googleusercontent.apps.${iosClientId.replace(/\.apps\.googleusercontent\.com$/, '')}`
  : undefined;

const googleSignInPlugin = iosUrlScheme
  ? ['@react-native-google-signin/google-signin', { iosUrlScheme }]
  : '@react-native-google-signin/google-signin';

module.exports = {
  expo: {
    name: 'paygenius',
    slug: 'paygenius',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.paygenius.app',
      usesAppleSignIn: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.paygenius.app',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    scheme: 'paygenius',
    plugins: [
      '@react-native-community/datetimepicker',
      'expo-apple-authentication',
      [
        'expo-camera',
        {
          cameraPermission:
            'Allow PayGenius to access your camera for selfie verification.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow PayGenius to access your photos.',
        },
      ],
      'expo-web-browser',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#191970',
          sounds: [],
        },
      ],
      googleSignInPlugin,
    ],
  },
};
