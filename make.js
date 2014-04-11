require('shelljs/make');
var chalk = require('chalk'),
    path = require('path'),
    buildDir = '_build';

target.all = function() {
    console.log(chalk.green('running: all'));
    target.clean();
    target.traceur();
};

target.clean = function() {
    console.log(chalk.green('running: clean'));
    rm('-rf', '_build/')
}

target.traceur = function() {
    var tr = './node_modules/traceur/traceur',
        options = '--modules=amd --dir app ' + path.join(buildDir, 'traceur');

    console.log(chalk.green('running: traceur'));
    if (exec(tr + ' ' + options).code != 0) {
        console.log(chalk.red('error: traceur'));    
        exit(1);
    }
};
