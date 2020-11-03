const WebpackError = require('webpack/lib/WebpackError');

module.exports = class StylelintError extends WebpackError {
    constructor(errors) {
        super();

        this.name = 'StylelintError';
        this.message = [
            require('../package.json').name,
            errors.trim()
        ].join('\n');

        Error.captureStackTrace(this, this.constructor);
    }
};
