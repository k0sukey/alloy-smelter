var chalk = require('chalk'),
	editor = require('editor'),
	fs = require('fs-extra'),
	path = require('path'),
	program = require('commander');

program.version(require('../package.json').version)
	.usage('COMMAND [options]')
	.option('-d, --project-dir [value]', 'the directory containing the project [default: .]', '.')
	.option('-T, --template <value>', 'Using custom template, for generate command')
	.option('-t, --titanium <value>', 'pass to Titanium build command options, for build command')
	.option('--no-compile', 'avoid Alloy compile, for build command');

program.command('generate <type> <name>')
	.description(chalk.gray('Pass to Alloy generate command(controler, view, style)'))
	.action(function(type, name){
		var dir = path.join(process.env.HOME, '.smelter', 'template');
		fs.ensureDir(dir, function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Does not created a .smelter/template directory ' + chalk.cyan(dir));
			} else {
				require('../lib/generate')({
						type: type,
						name: name,
						program: program
					});
			}
		});
	});

program.command('copy <name> <destination>')
	.description(chalk.gray('Copy a Alloy controler, view, style files'))
	.action(function(name, destination){
		require('../lib/copy')({
				name: name,
				destination: destination,
				program: program
			});
	});

program.command('move <name> <destination>')
	.description(chalk.gray('Move or rename a Alloy controler, view, style files'))
	.action(function(name, destination){
		require('../lib/move')({
				name: name,
				destination: destination,
				program: program
			});
	});

program.command('remove <name>')
	.description(chalk.gray('Remove a Alloy controler, view, style files'))
	.action(function(name){
		require('../lib/remove')({
				name: name,
				program: program
			});
	});

program.command('build [preset]')
	.description(chalk.gray('Pass to Titanium build command'))
	.action(function(preset){
		require('../lib/build')({
				preset: preset || '',
				program: program
			});
	});

program.command('preset')
	.description(chalk.gray('Edit preset options for build command'))
	.action(function(){
		var dir = path.join(process.env.HOME, '.smelter');
		fs.ensureDir(dir, function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Does not created a .smelter directory ' + chalk.cyan(dir));
			} else {
				editor(path.join(dir, 'preset.json'));
			}
		});
	});

program.command('install <branch>')
	.description(chalk.gray('Bulk install from appcelerator/titanium_releases'))
	.action(function(branch){
		require('../lib/install')({
				branch: branch,
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
	.description(chalk.gray('Statistics a Alloy project(yet files count only)'))
	.action(function(){
		require('../lib/stats')({
				program: program
			});
	});

program.parse(process.argv);