require('shelljs/make');
var chalk = require('chalk');

target.all = function() {
    console.log(chalk.green('running: all'));
    target.clean();
    target.es6();
};

target.clean = function() {
    console.log(chalk.green('running: clean'));
    rm('-rf', '_build/')
}

target.es6 = function() {
    var transpiler = './node_modules/es6-module-transpiler/bin/compile-modules',
        options = ' --to _build/es6 --type=amd --infer-name',
        files = ' '; // file1 file2 file3

    console.log(chalk.green('running: es6-module-transpiler'));
    
    find('app', 'spec').filter(function(file) { return file.match(/\.js$/); })
                       .forEach(function(file) { files += ' ' + file });

    if (exec(transpiler + files + options).code != 0) {
        console.log(chalk.red('error: es6-module-transpiler failed'));    
        exit(1);
    }
};
