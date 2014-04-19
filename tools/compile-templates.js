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

function processFile(f) {
    var body = fs.readFileSync(f, 'utf8'),
    name = f.replace(/\.hbs/, ''),
    template;

    template = compiler.precompile(body).toString();

    console.log(chalk.green('compiling: ' + f));
    return buildTemplate(name, template);
}

function writeFile(contents) {
    fs.writeFile(argv.output, contents, function(err){
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
        var output  = [];
        files.forEach(function(f) {
            output.push(processFile(f));
        });
        writeFile(output.join('\n'));
    });
} else {
    writeFile(processFile(argv.input));    
}
