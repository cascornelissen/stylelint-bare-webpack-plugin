const get = require('get-value');
const chalk = require('chalk');
const merge = require('webpack-merge');
const stylelint = require('stylelint');
const isPlainObject = require('is-plain-object');
const moduleAvailable = require('module-available');

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
            this.results = linter.results;
            if ( this.options.emitErrors ) {
                this.errors = this.results.filter((file) => file.errored);
                this.warnings = this.results.filter((file) => file.errored && file.warnings && file.warnings.length);
            } else {
                this.warnings = this.results.filter((file) => file.errored || (file.warnings && file.warnings.length));
            }

            (this.options.failOnError && this.errors.length)
                ? callback(new Error('Failed because of a stylelint error.'))
                : callback();

        }).catch((e) => {
            console.error(chalk.red(['', `Error in ${plugin.name}`].join('\n')));
            console.trace(chalk.red(e));
        });
    }
    
    report(compilation) {
        if(this.errors.length){
            compilation.errors.push(new Error(this.options.formatter(this.errors)));
            this.errors = [];
        }
        if(this.warnings.length){
            compilation.warnings.push(new Error(this.options.formatter(this.warnings)));
            this.warnings = [];
        }
    }

    apply(compiler) {
        // Run the linter when required
        let linter = this.lint.bind(this);
        compiler.hooks.run.tapAsync(plugin, linter);
        compiler.hooks.watchRun.tapAsync(plugin, linter);

        // Show the lint formatter output in the next tick (after the stats)
        let reporter = this.report.bind(this);
        let hook = this.options.emitErrors ? 'afterCompile' : 'afterEmit';
        compiler.hooks[hook].tap(plugin, reporter);
    }
    
}
