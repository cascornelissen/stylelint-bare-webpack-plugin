const WebpackError = require('webpack/lib/WebpackError');

module.exports = class StylelintWarning extends WebpackError {
    constructor(warnings) {
        super();

        this.name = 'StylelintWarning';
        this.message = [
            require('../package.json').name,
            warnings.trim()
        ].join('\n');

        Error.captureStackTrace(this, this.constructor);
    }
};
