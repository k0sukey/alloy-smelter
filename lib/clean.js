var _ = require('lodash'),
	chalk = require('chalk'),
	fs = require('fs-extra'),
	path = require('path'),
	CONST = require('alloy/Alloy/common/constants');

module.exports = function(_params){
	_params = _params || {};

	var alloyDir = path.resolve(path.join(_params.program.projectDir, CONST.ALLOY_DIR));

	if (!fs.existsSync(alloyDir)) {
		console.error(chalk.red('[ERROR]') + ' Not exists directory containing the alloy project ' + chalk.cyan(_params.program.projectDir));
		return;
	}

	var resourcesDir = path.join(_params.program.projectDir, 'Resources'),
		buildDir = path.join(_params.program.projectDir, 'build');

	fs.remove(resourcesDir, function(err){
		if (err) {
			console.error(chalk.red('[ERROR]') + ' Failed: Resources directory was not cleaned ' + chalk.cyan(resourcesDir));
		} else {
			console.info(chalk.green('[INFO]') + ' Success: Resources directory was cleaned ' + chalk.cyan(resourcesDir));
		}
	});

	fs.remove(buildDir, function(err){
		if (err) {
			console.error(chalk.red('[ERROR]') + ' Failed: build directory was not cleaned ' + chalk.cyan(buildDir));
		} else {
			console.info(chalk.green('[INFO]') + ' Success: build directory was cleaned ' + chalk.cyan(buildDir));
		}
	});
};