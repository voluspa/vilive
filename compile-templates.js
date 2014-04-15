var fs = require('fs'),
    chalk = require('chalk'),
    glob = require('glob'),
    compiler = require('ember-template-compiler');

function buildTemplate(name, content) {
    return "define(" + name +", ['exports'], function(__exports__){ __exports__['default'] = " + content + "; });"
}

glob("app/templates/**.hbs", function(er, files) {
    var output  = [];

    files.forEach(function(f){
        var body = fs.readFileSync(f, 'utf8'),
            name = f.replace(/\.hbs/, ''),
            template;

        template = compiler.precompile(body).toString();

        output.push(buildTemplate(name, template));
        console.log(chalk.green('compiling: ' + f));
    });

    fs.writeFile('_build/handlebars/template.js', output.join('\n'), function(err){
        if (err) {
            console.log(chalk.red(err));
        }
        else {
            console.log(chalk.green('finished'));
        }
    }); 
});
