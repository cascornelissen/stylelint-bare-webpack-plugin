# Stylelint Bare Webpack Plugin
This [webpack](https://webpack.github.io/) plugin allows you to lint your CSS/SASS/SCSS/LESS etc. files through any version of [Stylelint](http://stylelint.io/). It is heavily inspired by [`stylelint-webpack-plugin`](https://www.npmjs.com/package/stylelint-webpack-plugin) with the key difference being that `stylelint` isn't included in this package, allowing you to use any version you want instead of waiting on the webpack plugin to be updated to the newest version.

NPM: [`stylelint-bare-webpack-plugin`](https://npmjs.com/package/stylelint-bare-webpack-plugin)

## Installation
```shell
npm install stylelint-bare-webpack-plugin stylelint --save-dev
```

## Usage
```js
// webpack.config.js
var StylehintBarePlugin = require('stylelint-bare-webpack-plugin');

module.exports = {
    // ...
    plugins: [
        new StylehintBarePlugin({
            // Optional options object
        })
    ]
}
```

## Options
You can pass an object containing several options to `StylehintBarePlugin()`, this object can contain the following keys.

| Option       | Default                          | Description                                                                                             |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `files`      | `'**/*.s?(c|a)ss'`               | [`glob`](http://npmjs.com/package/glob) used for finding the files that will be linted                  |
| `configFile` | `'.stylelintrc'`                 | Location of the [Stylelint configuration](http://stylelint.io/user-guide/configuration/) file           |
| `formatter`  | `stringFormatter from Stylelint` | [Formatter](http://stylelint.io/developer-guide/formatters/) used to display warnings/errors in console |

## License
This project is [licensed](LICENSE.md) under the [MIT](https://opensource.org/licenses/MIT) license.
