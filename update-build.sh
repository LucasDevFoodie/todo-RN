rm -rf node_modules
rm -rf android/.gradle
rm -rf android/build
rm -rf android/app/build
npm install
cd android
./gradlew clean --no-daemon
./gradlew --refresh-dependencies
cd ..

echo "Run npx expo prebuild --clean before building"