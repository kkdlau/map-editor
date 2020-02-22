if [ -d "./docs"]; then
     rm -rf ./docs && rmdir ./docs
fi

npm run build
mv ./build ./docs