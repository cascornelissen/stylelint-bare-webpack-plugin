var _ = require('lodash'),
    chalk = require('chalk'),
    stylelint = require('stylelint');

var linter = function(options) {
    return new Promise(function(resolve, reject) {
        stylelint.lint(options).then(function(data) {
            resolve(data);
        }).catch(function(e) {
            reject(e);
        });
    });
}

function StylelintBarePlugin(options) {
    // Merge specified options with default options
    this.options = _.merge({}, {
        files: '**/*.s?(c|a)ss',
        configFile: '.stylelintrc',
        formatter: require('stylelint/dist/formatters/stringFormatter').default
    }, options);

    if ( !Array.isArray(this.options.files) ) this.options.files = [this.options.files];
}

StylelintBarePlugin.prototype.apply = function(compiler) {
    var options = this.options;

    var compile = function(compilation, done) {
        linter(options).then(function(lint) {
            if ( lint.errored ) {
                var errors = lint.results.filter(function(f) {
                    return f.errored;
                }).map(function(f) {
                    return f.source;
                });

                console.log(options.formatter(lint.results));
            }

            done();
        }).catch(function(e) {
            console.error(chalk.red(['', 'Error in stylelint-bare-webpack-plugin', e].join('\n')))
            done();
        });

        compilation.plugin && compilation.plugin('compilation', function(compilation) {
            errors.forEach(function(err) {
                compilation.errors.push(err);
            });
        });
    }

    compiler.plugin('done', compile);
};

module.exports = StylelintBarePlugin;
