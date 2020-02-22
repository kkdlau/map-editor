test -e ./docs && rm -rf ./docs && rmdir ./docs
npm run build
mv ./build ./docs