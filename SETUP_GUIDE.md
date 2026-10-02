# 🛠️ Complete Setup Guide - SafeReach

## What You're Building

```
┌──────────────┐   Visit URL    ┌──────────────┐    Firebase     ┌──────────────┐
│   User's     │ ─────────────► │   Website    │ ─────────────► │  Flutter App │
│   Browser    │                │  (React)     │   Real-time    │  (iOS/Andrd) │
└──────────────┘                └──────────────┘                └──────────────┘
     User visits            User sends msg              Owner receives &
     your website           from browser                replies from app
```

---

## 📋 COMPLETE TOOLS LIST

### 1️⃣ Computer Setup

| Tool | Purpose | Download | Required For |
|------|---------|----------|--------------|
| **VS Code** | Code editor | https://code.visualstudio.com | Everything |
| **Flutter SDK** | Build mobile apps | https://docs.flutter.dev/get-started/install | iOS & Android app |
| **Node.js (v18+)** | Run website | https://nodejs.org | Website |
| **Android Studio** | Android emulator | https://developer.android.com/studio | Android testing |
| **Xcode** (Mac only) | iOS simulator | Mac App Store | iOS testing |
| **Git** | Version control | https://git-scm.com | Everything |
| **CocoaPods** (Mac only) | iOS dependencies | Terminal: `sudo gem install cocoapods` | iOS build |

### 2️⃣ VS Code Extensions

Install these in VS Code:
```
✅ Dart (by Dart Code)
✅ Flutter (by Dart Code)  
✅ Firebase Snippets
✅ Error Lens
✅ Tailwind CSS IntelliSense
```

### 3️⃣ Firebase Account (FREE)

1. Go to https://console.firebase.google.com/
2. Click "Add Project" → Name it **"SafeReach"**
3. Disable Google Analytics (optional)
4. Create project

Then enable these services:
- **Firestore Database** → Create database → Start in test mode
- **Authentication** → Enable "Anonymous" sign-in method

### 4️⃣ Register Apps in Firebase

#### Web App:
1. Firebase Console → Project Settings → Add app → Web (</> icon)
2. Name: "SafeReach Web"
3. Copy the config object:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "saferch-app.firebaseapp.com",
  projectId: "saferch-app",
  storageBucket: "saferch-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

#### Android App:
1. Firebase Console → Add app → Android
2. Package name: `com.saferch.app`
3. Download `google-services.json`
4. Place in: `flutter_app/android/app/google-services.json`

#### iOS App (Mac only):
1. Firebase Console → Add app → iOS
2. Bundle ID: `com.saferch.app`
3. Download `GoogleService-Info.plist`
4. Place in: `flutter_app/ios/Runner/GoogleService-Info.plist`

---

## 🔧 STEP-BY-STEP SETUP

### Step 1: Install Flutter

```bash
# macOS
brew install flutter

# Windows (using Chocolatey)
choco install flutter

# Linux
sudo snap install flutter --classic

# Verify installation
flutter doctor
```

### Step 2: Create Flutter Project

```bash
# Create project
flutter create saferch_app --org com.saferch

# Navigate to project
cd saferch_app

# Copy all files from flutter_app/ folder into this project
# (Replace lib/, pubspec.yaml, etc.)

# Install dependencies
flutter pub get
```

### Step 3: Configure Firebase in Flutter

1. Open `flutter_app/lib/firebase_options.dart`
2. Replace ALL placeholder values with your actual Firebase config
3. For Android: also add `google-services.json` to `android/app/`
4. For iOS: also add `GoogleService-Info.plist` to `ios/Runner/`

### Step 4: Configure Firebase in Website

1. Open `src/firebase.ts`
2. Replace ALL placeholder values with your web app Firebase config
3. Save the file

### Step 5: Set Firestore Rules

In Firebase Console → Firestore → Rules, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      allow read, write: if true;
      match /messages/{messageId} {
        allow read, write: if true;
      }
    }
  }
}
```

### Step 6: Run the Website

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser: http://localhost:5173
```

### Step 7: Run the Flutter App

```bash
# Check available devices
flutter devices

# Run on Android emulator
flutter run -d android

# Run on iOS simulator (Mac only)
flutter run -d ios

# Run on Chrome (web)
flutter run -d chrome
```

---

## 📱 Testing the Full Flow

### Test 1: Local Demo Mode (No Firebase needed)
1. Open website → Click "Start Emergency Chat"
2. Enter a name → Send messages
3. Go to Owner Dashboard → See messages appear
4. Reply → See reply on user side

### Test 2: Real-time with Firebase
1. Set up Firebase (steps above)
2. Deploy website to a URL (Vercel, Netlify, etc.)
3. Open website in one browser tab
4. Open Flutter app on phone/emulator
5. Send message from website → Appears instantly in app
6. Reply from app → Appears instantly on website

---

## 🏗️ Build for Production

### Website:
```bash
npm run build
# Deploy dist/ folder to: Vercel, Netlify, Firebase Hosting, etc.
```

### Android APK:
```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

### iOS App (Mac only):
```bash
flutter build ios --release
# Then open in Xcode to archive and distribute
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `flutter: command not found` | Add Flutter to system PATH |
| Android emulator won't start | Enable VT-x in BIOS, install HAXM |
| iOS build fails | Run `cd ios && pod install && pod update` |
| Firebase connection error | Check firebase_options.dart values |
| Messages not appearing | Verify Firestore rules allow read/write |
| "App not configured" warning | Fill in Firebase config values |

---

## 📦 Project File Structure

```
saferch/
├── flutter_app/              ← Flutter mobile app
│   ├── lib/
│   │   ├── main.dart         ← App entry point
│   │   ├── firebase_options.dart  ← YOUR CONFIG HERE
│   │   ├── models/
│   │   │   ├── message.dart
│   │   │   ├── chat_session.dart
│   │   │   └── emergency_contact.dart
│   │   ├── services/
│   │   │   ├── auth_service.dart
│   │   │   ├── chat_service.dart
│   │   │   └── settings_service.dart
│   │   └── screens/
│   │       ├── login_screen.dart
│   │       ├── home_screen.dart
│   │       ├── chat_list_screen.dart
│   │       ├── chat_detail_screen.dart
│   │       └── settings_screen.dart
│   ├── pubspec.yaml          ← Dependencies
│   ├── android/
│   │   └── app/
│   │       └── google-services.json  ← YOUR ANDROID CONFIG
│   └── ios/
│       └── Runner/
│           └── GoogleService-Info.plist  ← YOUR iOS CONFIG
│
├── src/                      ← React website
│   ├── App.tsx               ← Main router
│   ├── firebase.ts           ← YOUR WEB CONFIG HERE
│   ├── services/
│   │   └── firebaseService.ts
│   └── pages/
│       ├── PublicPage.tsx    ← Landing page
│       ├── ChatPage.tsx      ← User chat
│       └── OwnerDashboard.tsx ← Owner interface
│
└── SETUP_GUIDE.md            ← This file
```
