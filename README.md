# Convose Mobile App

## Install

Clone this repo on your local folder.
If you encounter any password issue cloning the repo, you can follow this blog: (https://www.shanebart.com/clone-repo-using-token/)

Setting up the development environment.
Please visit the React Native Environment setup page and follow "React Native CLI Quickstart" guideline based on your development OS:
[React Native Environment](https://reactnative.dev/docs/environment-setup)

Before you need to have `node -v >= 8`
if you have any problem running the app install node@12.10.0

You will need to have Xcode(with CocoaPods configured) and/or Andriod Studio(with JDK configured) to build the project

Run to install dependencies

    yarn install
    npx pod-install // for ios

Using Xcode or Android Studio to build IOS and Android debug or production app, you may meet some bugs, check the troubleshooting.md file to find possible solutions.

## Development

Bofore working on new features or bug fixes, branch from develop
`git checkout develop`
`git checkout -b feature/new-feature` or `git checkout bugFix/bug-name`
Then make a pull request to develop. 

For testing on simulators or phones run:

    yarn start

Open the debug app built in the previous step, shake your physical phone in the same WIFI to navigate to the menu, and enter your computer's IP adress as the server IP address

## Development tools:

For checking redux actions and store you can use extension reduxDevtools. The only diffrece in mobile app is you need to run it in remote mode.

## Test

For runing tests (Currently we don't do tests, but plan to do it in the future):

    yarn test

## Release

Most js bundle changes and assets updates can be put on production OTA. Simply run `expo publish --release-channel version-code` under the root folder. The updates will be pushed to expo's production slug (we set it the same as the app identifier), so that who installed the base app with the same `version-code` and `expo sdk version` can load the updates by Over-the-air(OTA), version code can be found in `OTA-versions-record.md`. Make sure the slug name is correct before you publish updates. You can check and change slug name here:

`app.json \\ root folder`
`AndroidManifest.xml \\ android/app/src/main look up EXPO_UPDATE_URL`
`Expo.plist \\ ios/Convose/Supporting/Expo.plist look up EXUpdatesURL`

Important: But when adding a new native module to the app, if you push it directly, then it will cause the previous users' base app to crash, so after adding a new native module, we need to increment OTA version code in the following places:
`AndroidManifest.xml \\ android/app/src/main look up EXPO_RELEASE_CHANNEL`
`Expo.plist \\ ios/Convose/Supporting/Expo.plist look up EXUpdatesReleaseChannel`

After incrementing version code, we need to build apps then submit them to their App stores.
`AndroidManifest.xml \\ android/app/src/main look up EXPO_SDK_VERSION`
`Expo.plist \\ ios/Convose/Supporting/Expo.plist look up EXUpdatesSDKVersion`

## Maintain

Sometimes, React Native/EXPO and other Libraries would be out-dated, in this case, we need to upgrade these libraries according to their guidance, make sure after doing so we need to increment version code, if EXPO got upgrade, also increment it in the following places：

There's a test app build (apk, ipa file in Google Drive, build 2.4.1(1) in TestFlight), it's slug name is `convosetest`, you can push your updates here to share the testing updates. Or you can create your own test build.
