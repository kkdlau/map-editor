test -e ./docs && rm -rf ./docs && rmdir ./docs
if [ -d "docs" ]; then
    rm -rf ./docs
fi
npm run build
mv ./build ./docs