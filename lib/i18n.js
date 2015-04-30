var _ = require('lodash'),
	chalk = require('chalk'),
	fs = require('fs-extra'),
	path = require('path'),
	tiappxml = require('tiapp.xml');

module.exports = function(_params){
	_params = _params || {};

	if (!fs.existsSync(path.join(_params.program.projectDir, 'tiapp.xml'))) {
		console.error(chalk.red('[ERROR]') + ' tiapp.xml file does not exists ' + chalk.cyan(_params.program.projectDir));
		return;
	}

	var i18nDir = path.join(_params.program.projectDir, 'i18n'),
		langDir = path.join(i18nDir, _params.lang);
	!fs.existsSync(i18nDir) && fs.mkdirsSync(i18nDir);

	if (_params.subcommand === 'add' &&
		fs.existsSync(langDir)) {
		console.error(chalk.red('[ERROR]') + ' Specified language exists ' + chalk.cyan(_params.lang));
		return;
	} else if (_params.subcommand === 'remove' &&
		!fs.existsSync(langDir)) {
		console.error(chalk.red('[ERROR]') + ' Specified language does not exists ' + chalk.cyan(_params.lang));
		return;
	}

	if (_params.subcommand === 'add') {
		var tiapp = tiappxml.load(path.join(_params.program.projectDir, 'tiapp.xml'));

		fs.mkdirsSync(langDir);
		fs.writeFile(path.join(langDir, 'app.xml'), [
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<resources>',
				'\t<string name="appname">' + tiapp.name + '</string>',
				'</resources>'
			].join('\n'), function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Failed: not add language dir/file ' + chalk.cyan(_params.lang));
			} else {
				fs.writeFile(path.join(langDir, 'strings.xml'), [
						'<?xml version="1.0" encoding="UTF-8"?>',
						'<resources>',
						'\t<string name="hello">Hello</string>',
						'</resources>'
					].join('\n'), function(err){
					if (err) {
						console.error(chalk.red('[ERROR]') + ' Failed: not add language dir/file ' + chalk.cyan(_params.lang));
					} else {
						console.info(chalk.green('[INFO]') + ' Success: language dir/file added ' + chalk.cyan(_params.lang));
					}
				});
			}
		});
	} else if (_params.subcommand === 'remove') {
		fs.remove(path.join(i18nDir, _params.lang), function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Failed: not removed language dir/file ' + chalk.cyan(_params.lang));
			} else {
				console.info(chalk.green('[INFO]') + ' Success: language dir/file removed ' + chalk.cyan(_params.lang));
			}
		});
	}
};