const get = require('get-value');
const chalk = require('chalk');
const stylelint = require('stylelint');
const isPlainObject = require('is-plain-object');
const moduleAvailable = require('module-available');
const { merge } = require('webpack-merge');

const plugin = {
    name: 'StylelintBarePlugin'
};

module.exports = class StylelintBarePlugin {
    constructor(options = {}) {
        if ( typeof options !== 'undefined' && !isPlainObject(options) ) {
            throw new Error(`${plugin.name} options should be an object`);
        }

        this.warnings = [];
        this.errors = [];
        this.shouldError = false;

        this.options = merge({
            files: '**/*.s?(c|a)ss',
            emitErrors: true,
            failOnError: false,
            formatter: (() => {
                if ( get(stylelint, 'formatters.string') ) {
                    return stylelint.formatters.string;
                } else if ( moduleAvailable('stylelint/dist/formatters/stringFormatter') ) {
                    return require('stylelint/dist/formatters/stringFormatter').default;
                }
            })()
        }, options);

        // Mutate option.files to array
        if ( !Array.isArray(this.options.files) ) {
            this.options.files = [this.options.files];
        }

        // Make sure the formatter is set up correctly
        if ( typeof this.options.formatter !== 'function' ) {
            throw new Error(`The formatter for ${plugin.name} is not of type 'function'`);
        }
    }

    lint(compilation, callback) {
        stylelint.lint(this.options).then((linter) => {
            this.warnings = linter.results.map((file) => {
                return Object.assign({}, file, {
                    warnings: file.warnings.filter((warning) => warning.severity === 'warning')
                });
            }).filter((file) => file.warnings.length);

            this.errors = linter.results.map((file) => {
                return Object.assign({}, file, {
                    warnings: file.warnings.filter((warning) => warning.severity === 'error')
                });
            }).filter((file) => file.warnings.length);

            this.shouldError = this.options.failOnError && this.errors.length;

            callback();
        }).catch((e) => {
            console.error(chalk.red(['', `Error in ${plugin.name}`].join('\n')));
            console.trace(chalk.red(e));
        });
    }

    report(compilation) {
        if ( this.options.emitErrors ) {
            if ( this.errors.length ) {
                compilation.errors.push(new Error(this.options.formatter(this.errors)));
            }

            if ( this.warnings.length ) {
                compilation.warnings.push(new Error(this.options.formatter(this.warnings)));
            }
        } else {
            if ( this.warnings.length || this.errors.length ) {
                compilation.warnings.push(new Error(this.options.formatter(this.errors.concat(this.warnings))));
            }
        }

        this.errors = [];
        this.warnings = [];
    }

    apply(compiler) {
        const linter = this.lint.bind(this);
        compiler.hooks.run.tapAsync(plugin, linter);
        compiler.hooks.watchRun.tapAsync(plugin, linter);

        const reporter = this.report.bind(this);
        compiler.hooks[this.options.emitErrors ? 'afterCompile' : 'afterEmit'].tap(plugin, reporter);

        compiler.hooks.done.tap(plugin, () => {
            if ( this.shouldError ) {
                // Throw in the next tick to make sure the webpack output
                // containing the linter warnings and errors is at least shown
                setTimeout(() => {
                    throw new Error('Failed because of a stylelint error.');
                });
            }
        })
    }
};
