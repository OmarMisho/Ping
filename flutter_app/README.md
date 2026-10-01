# 🛡️ SafeReach - Emergency Contact System

## Complete System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   QR Code       │  scan   │   Website        │  send   │   Firebase      │
│   (printed)     │ ──────► │   (React)        │ ──────► │   Firestore     │
│                 │         │   /chat page     │         │   (Real-time)   │
└─────────────────┘         └──────────────────┘         └────────┬────────┘
                                                                  │
                                                                  │ receive
                                                                  ▼
                                                         ┌─────────────────┐
                                                         │   Flutter App   │
                                                         │   (iOS/Android) │
                                                         │   Owner device  │
                                                         └─────────────────┘
```

---

## 🛠️ Required Tools & Setup

### 1. Development Tools (Install on your computer)

| Tool | Purpose | Download Link |
|------|---------|---------------|
| **VS Code** | Code editor | https://code.visualstudio.com/ |
| **Flutter SDK** | Build iOS & Android apps | https://docs.flutter.dev/get-started/install |
| **Dart SDK** | Comes with Flutter | (included with Flutter) |
| **Android Studio** | Android emulator & SDK | https://developer.android.com/studio |
| **Xcode** (Mac only) | iOS simulator & build | App Store |
| **CocoaPods** (Mac only) | iOS dependencies | `sudo gem install cocoapods` |
| **Git** | Version control | https://git-scm.com/ |
| **Node.js** | For website development | https://nodejs.org/ |

### 2. VS Code Extensions (Install these)

```
- Dart (by Dart Code)
- Flutter (by Dart Code)
- Firebase Snippets
- Error Lens
- Pretty TypeScript Errors
```

### 3. Firebase Setup (Free tier is enough)

1. Go to https://console.firebase.google.com/
2. Create a new project: **"SafeReach"**
3. Enable **Firestore Database** (start in test mode)
4. Enable **Authentication** → Anonymous sign-in
5. Register your app:
   - **Web app** → copy the `firebaseConfig` object
   - **Android app** → download `google-services.json`
   - **iOS app** → download `GoogleService-Info.plist`

### 4. Flutter Project Setup

```bash
# Create the Flutter project
flutter create saferch_app
cd saferch_app

# Replace lib/ folder with the code from this repository
# Then install dependencies:
flutter pub get

# Run on emulator or device:
flutter run

# Or run on specific platform:
flutter run -d chrome      # Web
flutter run -d android     # Android emulator
flutter run -d ios         # iOS simulator (Mac only)
```

### 5. Website Setup

```bash
# In the website folder:
npm install
npm run dev        # Development
npm run build      # Production build
```

---

## 📁 Project Structure

```
saferch/
├── flutter_app/          ← Flutter mobile app
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/
│   │   ├── services/
│   │   ├── screens/
│   │   └── widgets/
│   ├── pubspec.yaml
│   ├── android/
│   └── ios/
│
├── website/              ← React website (this project)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── README.md             ← This file
```

---

## 🔥 Firebase Firestore Rules

Set these rules in Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read/write chats (for demo)
    match /chats/{chatId} {
      allow read, write: if true;
      match /messages/{messageId} {
        allow read, write: if true;
      }
    }
    // Settings are per-owner
    match /settings/{ownerId} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ For production, add proper authentication rules!

---

## 🚀 How It Works

### User Flow (Website):
1. User scans QR code → opens website
2. Enters their name
3. Starts chatting in real-time
4. Messages appear instantly on owner's app

### Owner Flow (Flutter App):
1. Opens the app
2. Sees all incoming chats
3. Replies to messages
4. Manages emergency contacts
5. Views/shares QR code

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| **Login** | Simple owner authentication |
| **Chat List** | All received conversations |
| **Chat Detail** | Individual chat with reply |
| **Settings** | Profile, contacts, preferences |
| **QR Code** | View and share your QR code |

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Flutter not found | Add Flutter to PATH, restart terminal |
| Android emulator not starting | Install HAXM, enable virtualization in BIOS |
| iOS build fails (Mac) | Run `cd ios && pod install` |
| Firebase connection error | Check `firebase_options.dart` config |
| Messages not syncing | Verify Firestore rules allow read/write |

---

## 📋 Complete Command Reference

```bash
# Flutter commands
flutter doctor              # Check setup
flutter pub get             # Install dependencies
flutter run                 # Run app
flutter build apk           # Build Android APK
flutter build ios           # Build iOS (Mac only)
flutter clean               # Clean build cache

# Website commands
npm install                 # Install dependencies
npm run dev                 # Start dev server
npm run build               # Build for production
```
