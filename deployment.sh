if [ -d "docs" ]; then
    rm -rf ./docs
fi
npm run build
mv ./build ./docs