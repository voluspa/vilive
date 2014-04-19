var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    glob = require('glob'),
    compiler = require('ember-template-compiler'),
    argv = require('yargs')
        .usage('Usage: $0 -i [dir] -o [file]')
        .demand(['i', 'o'])
        .options('i', {
            describe: 'input directory',
            alias: 'input'
        })
        .options('o', {
            describe: 'output file',
            alias: 'output'
        })
        .argv;
            
            

function buildTemplate(name, content) {
    return "define('" + name +"', ['exports'], function(__exports__){ __exports__['default'] = " + content + "; });"
}

glob(path.join(argv.input, "**/*.hbs"), function(er, files) {
    var output  = [];

    files.forEach(function(f){
        var body = fs.readFileSync(f, 'utf8'),
            name = f.replace(/\.hbs/, ''),
            template;

        template = compiler.precompile(body).toString();

        output.push(buildTemplate(name, template));
        console.log(chalk.green('compiling: ' + f));
    });

    fs.writeFile(argv.output, output.join('\n'), function(err){
        if (err) {
            console.log(chalk.red(err));
        }
        else {
            console.log(chalk.green('finished'));
        }
    }); 
});
