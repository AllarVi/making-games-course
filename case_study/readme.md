# Useful scripts
## Compiling Javascript
```
browserify main.js -o bundle.js -t [ babelify --presets [ es2015 ] ]
```
## Generating test files
https://www.npmjs.com/package/generator-jest

1. install Yeoman and generator-jest using npm
```
npm install -g yo generator-jest
```
2. generate tests for your components
```
yo jest:test path/to/file-to-test.js
```