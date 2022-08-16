
# IOS troubleshooting
##pod issue:  
CocoaPods could not find compatible versions for pod "React/Core":  workaround(every time add new package): in root directory run: 
`grep -rl "s.dependency 'React/Core'" node_modules/ | xargs sed -i '' 's=React/Core=React-Core=g'`
(Source: https://stackoverflow.com/questions/58305191/react-native-fetch-blob-issue-pod-not-installing-for-ios)

for m1 computer, when installing pods, run:
`sudo arch -x86_64 gem install ffi`
`arch -x86_64 pod install`
(Source: https://stackoverflow.com/questions/64901180/running-cocoapods-on-apple-silicon-m1/65334677#65334677)

## linker issue: 
clean build, remove all pops file ,pod update

##Image issue
(react issue): https://github.com/facebook/react-native/issues/29279#issuecomment-658244428

## Ld issue: 
`Undefined symbol: __swift_FORCE_LOAD_$_swiftUniformTypeIdentifiers:`
Create an empty swift file will solve this. (Source: https://github.com/zalando/SwiftMonkey/issues/80)

## New slug app requires publish first to run
Terminating app due to uncaught exception 'NSInternalInconsistencyException', reason: 'expo-updates is enabled, but no valid URL is configured under EXUpdatesURL. If you are making a release build for the first time, make sure you have run `expo publish` at least once.'

## others
building for iOS Simulator, but linking in dylib built for iOS: In build config add this : EXCLUDED_ARCHS = arm64

## Flipper-Folly error：
`Typedef redefinition with different types ('uint8_t' (aka 'unsigned char') vs 'enum clockid_t') when building latest react-native rc`
change: `__IPHONE_10_0 to __IPHONE_12_0` in Time.h
check here: https://github.com/facebook/flipper/issues/834#issuecomment-605448785 

## ld: library not found for -lboost_context
This error occurs after upgrading Flipper to latest version, can solved by this:
>open project.xcworkspace on Build Phases tab > Link Binary With Libraries > + (add items) > then you will see "boost_context.xcframework"

check here: https://stackoverflow.com/questions/67351517/reactnative-ld-library-not-found-for-lboost-context