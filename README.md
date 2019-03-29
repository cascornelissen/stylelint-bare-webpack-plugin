# Stylelint Bare Webpack Plugin
[![npm](https://img.shields.io/npm/v/stylelint-bare-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/stylelint-bare-webpack-plugin)
[![npm](https://img.shields.io/npm/dm/stylelint-bare-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/stylelint-bare-webpack-plugin)
[![license](https://img.shields.io/github/license/cascornelissen/stylelint-bare-webpack-plugin.svg?style=flat-square)](LICENSE.md)

This [webpack](https://webpack.github.io/) plugin allows you to lint your CSS/SASS/SCSS/LESS etc. files through any version of [Stylelint](http://stylelint.io/). It is heavily inspired by [`stylelint-webpack-plugin`](https://www.npmjs.com/package/stylelint-webpack-plugin) with the key difference being that `stylelint` isn't included in this package, allowing you to use any version you want instead of waiting on the webpack plugin to be updated to the newest version.

**Compatibility**  
Version `^1.0.0` of this plugin is compatible with webpack `^4.0.0`. If you're using an older version of webpack, make sure to install the `^0.1.0` (`npm install stylelint-bare-webpack-plugin@^0.1.0`) release of this plugin.

## Installation
```shell
npm install stylelint-bare-webpack-plugin stylelint --save-dev
```

## Usage
```js
// webpack.config.js
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');

module.exports = {
    // ...
    plugins: [
        new StylelintBarePlugin({
            // Optional options object
        })
    ]
}
```

## Options
You can pass an object containing several options to `StylelintBarePlugin()`, this object can contain the following keys.

| Option        | Default                          | Description                                                                                                                                                          
| ------------- | -------------------------------- | ------------
| `files`       | `'**/*.s?(c\|a)ss'`              | [`glob`](http://npmjs.com/package/glob) used for finding the files that will be linted                                                                               
| `configFile`  |                                  | Location of the [Stylelint configuration](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#loading-the-configuration-object) file, not specifying this will allow stylelint to find the file by itself
| `emitErrors`  | `true`                           | Whether to emit webpack errors or only warnings, note that all stylelint errors will still be shown when disabling this
| `failOnError` | `false`                          | Whether to stop the entire Webpack process when a stylelint error is found
| `formatter`   | `stringFormatter` from Stylelint | [Formatter](http://stylelint.io/developer-guide/formatters/) used to display warnings/errors in console                                                              

## License
This project is [licensed](LICENSE.md) under the [MIT](https://opensource.org/licenses/MIT) license.
