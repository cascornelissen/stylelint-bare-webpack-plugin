var _ = require('lodash'),
    path = require('path'),
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

            if ( typeof done === 'function' ) done();
        }).catch(function(e) {
            var pkg = require(path.join(__dirname, 'package.json'));
            console.error(chalk.red(['', 'Error in ' + pkg.name + ' (v' + pkg.version + ')'].join('\n')));
            console.trace(chalk.red(e));

            if ( typeof done === 'function' ) done();
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
