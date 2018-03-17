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

        this.options = merge({
            files: '**/*.s?(c|a)ss',
            configFile: '.stylelintrc',
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

    apply(compiler) {
        // Run the linter when required
        compiler.hooks.run.tapAsync(plugin, this.lint.bind(this));
        compiler.hooks.watchRun.tapAsync(plugin, this.lint.bind(this));

        // Show the lint formatter output in the next tick (after the stats)
        compiler.hooks.done.tap(plugin, () => {
            setTimeout(() => {
                console.log(this.options.formatter(this.results));
            }, 0);
        });
    }

    lint(compilation, callback) {
        stylelint.lint(this.options).then((linter) => {
            this.results = linter.results;
        }).catch((e) => {
            console.error(chalk.red(['', `Error in ${plugin.name}`].join('\n')));
            console.trace(chalk.red(e));
        }).then(callback);
    }
}
