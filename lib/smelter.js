var chalk = require('chalk'),
	program = require('commander');

program.version(require('../package.json').version)
	.usage('COMMAND [options]')
	.option('-d, --project-dir [value]', 'the directory containing the project [default: .]', '.')
	.option('-t, --titanium <value>', 'pass to Titanium build command options, for build command')
	.option('--no-compile', 'avoid alloy compile, for build command');

program.command('move <name> <destination>')
	.description(chalk.gray('Move or rename a alloy controler, view, style files'))
	.action(function(name, destination){
		require('../lib/move')({
				name: name,
				destination: destination,
				program: program
			});
	});

program.command('remove <name>')
	.description(chalk.gray('Remove a alloy controler, view, style files'))
	.action(function(name){
		require('../lib/remove')({
				name: name,
				program: program
			});
	});

program.command('build')
	.description(chalk.gray('Pass to Titanium build command'))
	.action(function(){
		require('../lib/build')({
				program: program
			});
	});

program.command('clean')
	.description(chalk.gray('Removes previous build and Resources directories'))
	.action(function(){
		require('../lib/clean')({
				program: program
			});
	});

program.command('stats')
	.description(chalk.gray('Statistics a alloy project(yet files count only)'))
	.action(function(){
		require('../lib/stats')({
				program: program
			});
	});

program.parse(process.argv);