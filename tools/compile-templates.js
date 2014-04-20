var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    glob = require('glob'),
    shell = require('shelljs'),
    compiler = require('ember-template-compiler'),
    argv = require('yargs')
        .usage('Usage: $0 -i [dir] -o [dir]')
        .demand(['i', 'o'])
        .options('i', {
            describe: 'input directory',
            alias: 'input'
        })
        .options('o', {
            describe: 'output directory',
            alias: 'output'
        })
        .argv;



function buildTemplate(name, content) {
    return "define('" + name +"', ['exports'], function(__exports__){ __exports__['default'] = " + content + "; });";
}

function processFile(f) {
    var body = fs.readFileSync(f, 'utf8'),
    name = path.join(path.dirname(path.normalize(f)), path.basename(f, path.extname(f))),
    template;

    template = compiler.precompile(body).toString();

    console.log(chalk.green('compiling: ' + f));
    return buildTemplate(name, template);
}

function writeFile(f, contents) {
    var input = path.join(path.dirname(path.normalize(f)), path.basename(f, path.extname(f)) + '.js'),
        out = path.join(argv.output, input.substr(input.indexOf('/') + 1));

    shell.mkdir('-p', path.dirname(out));
    fs.writeFile(out, contents, function(err){
        if (err) {
            console.log(chalk.red(err));
        }
        else {
            console.log(chalk.green('finished'));
        }
    }); 
}

if (fs.statSync(argv.input).isDirectory()) {
    glob(path.join(argv.input, "**/*.hbs"), function(er, files) {
        files.forEach(function(f) {
            writeFile(f, processFile(f));
        });
    });
} else {
    writeFile(argv.input, processFile(argv.input));    
}
