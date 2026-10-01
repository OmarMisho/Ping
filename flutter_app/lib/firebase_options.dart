import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// ⚠️ IMPORTANT: Replace these values with YOUR Firebase project config
/// 
/// How to get these values:
/// 1. Go to Firebase Console: https://console.firebase.google.com/
/// 2. Select your project "SafeReach"
/// 3. Go to Project Settings → General → Your apps
/// 4. Copy the config values for each platform
///
/// For web: Copy from Firebase SDK snippet
/// For Android: Copy from google-services.json
/// For iOS: Copy from GoogleService-Info.plist
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  // 🔽 REPLACE WITH YOUR WEB CONFIG FROM FIREBASE CONSOLE 🔽
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'YOUR_WEB_API_KEY',
    appId: 'YOUR_WEB_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'saferch-app',
    authDomain: 'saferch-app.firebaseapp.com',
    storageBucket: 'saferch-app.appspot.com',
  );

  // 🔽 REPLACE WITH YOUR ANDROID CONFIG FROM google-services.json 🔽
  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'YOUR_ANDROID_API_KEY',
    appId: 'YOUR_ANDROID_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'saferch-app',
    storageBucket: 'saferch-app.appspot.com',
  );

  // 🔽 REPLACE WITH YOUR iOS CONFIG FROM GoogleService-Info.plist 🔽
  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'YOUR_IOS_API_KEY',
    appId: 'YOUR_IOS_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'saferch-app',
    storageBucket: 'saferch-app.appspot.com',
    iosBundleId: 'com.saferch.app',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'YOUR_MACOS_API_KEY',
    appId: 'YOUR_MACOS_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'saferch-app',
    storageBucket: 'saferch-app.appspot.com',
    iosBundleId: 'com.saferch.app',
  );
}
