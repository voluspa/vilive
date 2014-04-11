require('shelljs/make');
var chalk = require('chalk');

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
        options = '--modules=amd --dir app _build/traceur',
        files = ' '; // file1 file2 file3

    console.log(chalk.green('running: traceur'));
    if (exec(tr + ' ' + options).code != 0) {
        console.log(chalk.red('error: traceur'));    
        exit(1);
    }
};
