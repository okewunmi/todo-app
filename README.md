##  Quick Start (For Examiner)

### Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Mobile device** with Expo Go app ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npx expo start

# 3. Scan the QR code with Expo Go app on your device
#    - iOS: Use Camera app to scan
#    - Android: Use Expo Go app to scan

```

**Alternative: Run on emulator**
```bash
# Android emulator
npx expo start --android

# iOS simulator (Mac only)
npx expo start --ios
```

---
##  Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (interactive)
npm run test:watch

# Run with coverage report
npm test -- --coverage
```

**Test Coverage:**
-  Button component (4 tests)
-  TaskItem component (4 tests)
-  StorageService (6 tests)
-  VoiceService task parsing (6 tests)

---

##  Testing Voice Input Feature

### Quick Test (Mock Mode - No API Key Required)

The app runs in **mock mode** by default for easy testing:

1. Tap the **red microphone** FAB button (bottom right)
2. Allow microphone permissions when prompted
3. Speak clearly: *"Buy groceries and call mom"*
4. Tap **"Stop & Process"**
5. **Result:** 2 tasks created automatically
6. ### Test with Real OpenAI API (Optional)

 test with actual speech-to-text by:

```bash
# 1. Create .env file in project root
echo "EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key" > .env

# 2. Open src/services/VoiceService.ts

# 4. Restart app
npx expo start -c
```

**Note:** Requires OpenAI API key with credits. Get one at [platform.openai.com](https://platform.openai.com/api-keys)

---
