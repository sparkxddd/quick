# Mobile Release Plan (Capacitor)

This plan outlines how to convert your Next.js web app into a native mobile app for iOS and Android using Capacitor.

## 1. Prerequisites
- **Mobile Environment**:
    - **Android**: Install [Android Studio](https://developer.android.com/studio).
    - **iOS**: Install Xcode (macOS only) and CocoaPods.
- **Project Config**:
    - Ensure `next.config.ts` has `output: 'export'`.
    - Ensure `capacitor.config.ts` points to the `out` directory.

## 2. Build Process (The Loop)
Every time you want to test on a device or build for the store, follow this loop:

### Step A: Production Build
Compile your Next.js app to static assets.
```bash
npm run build
```
*Note: This creates an `out/` folder with your HTML/CSS/JS.*

### Step B: Sync to Native
Copy the web assets to the native Android/iOS project folders.
```bash
npx cap sync
```

### Step C: Open Native IDE
Open the respective studio to build/run the app.
```bash
# Android
npx cap open android

# iOS (Mac only)
npx cap open ios
```

## 3. Deployment Checklist

### Android (Google Play Store)
1.  **Icon & Splash**: Use `@capacitor/assets` to generate icons.
    ```bash
    npm install -g @capacitor/assets
    npx capacitor-assets generate --android
    ```
2.  **Permissions**: Check `android/app/src/main/AndroidManifest.xml`.
    - Add `ACCESS_FINE_LOCATION` for maps.
    - Add `INTERNET` (default).
3.  **Signing**:
    - Generate a keystore file in Android Studio (Build > Generate Signed Bundle/APK).
    - **Keep this safe!** You cannot update your app if you lose it.
4.  **Release**: Upload the `.aab` (App Bundle) to Google Play Console.

### iOS (App Store)
1.  **Icon & Splash**:
    ```bash
    npx capacitor-assets generate --ios
    ```
2.  **Permissions**: Check `Info.plist`.
    - Add `NSLocationWhenInUseUsageDescription` (Reason for using location).
3.  **Signing**:
    - You need an Apple Developer Account ($99/year).
    - Configure Signing & Capabilities in Xcode (Team -> Your Account).
4.  **Release**: Archive the build in Xcode (Product > Archive) and upload to App Store Connect.

## 4. Updates (Over-the-Air)
For instant updates without App Store review, consider using **Capacitor Live Updates** (or Ionic Appflow).
- Allows you to push changes to the HTML/JS/CSS directly to user devices.
- **Rule**: Only for UI/JS changes. Native plugin changes require a full store release.

## 5. Troubleshooting Common Issues
- **White Screen on Launch**: Usually means `next.config.ts` is not set to `output: 'export'`.
- **Cors Errors**: Mobile apps run on `capacitor://localhost` (iOS) or `http://localhost` (Android). Ensure your backend CORS settings allow these origins.
- **Back Button**: On Android, handle the hardware back button using logic in `App.tsx` or `layout.tsx`:
    ```typescript
    import { App } from '@capacitor/app';
    App.addListener('backButton', ({ canGoBack }) => {
      if(!canGoBack){ App.exitApp(); } else { window.history.back(); }
    });
    ```
