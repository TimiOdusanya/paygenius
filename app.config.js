const googleClientId =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const iosUrlScheme = googleClientId
  ? `com.googleusercontent.apps.${googleClientId.replace(/\.apps\.googleusercontent\.com$/, '')}`
  : 'com.googleusercontent.apps.placeholder';

// Always pass iosUrlScheme so the plugin skips Firebase / google-services.json
const googleSignInPlugin = [
  '@react-native-google-signin/google-signin',
  { iosUrlScheme },
];

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
      infoPlist: {
        NSMicrophoneUsageDescription:
          'Allow PayGenius to record voice notes for Genie.',
        NSPhotoLibraryUsageDescription:
          'Allow PayGenius to access your photos.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.paygenius.app',
      allowBackup: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '26a4c2a1-42af-4ddb-8059-87daa11db8bd',
      },
    },
    scheme: 'paygenius',
    plugins: [
      './plugins/withDisableAndroidBackup',
      'expo-font',
      'expo-system-ui',
      [
        'expo-build-properties',
        {
          android: {
            enablePngCrunchInReleaseBuilds: false,
            usesCleartextTraffic: true,
          },
        },
      ],
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
      [
        'expo-av',
        {
          microphonePermission:
            'Allow PayGenius to record voice notes for Genie.',
        },
      ],
      'expo-web-browser',
      [
        'expo-notifications',
        {
          icon: './assets/images/notifications/notification-icon.png',
          color: '#191970',
          sounds: [],
        },
      ],
      googleSignInPlugin,
    ],
  },
};
