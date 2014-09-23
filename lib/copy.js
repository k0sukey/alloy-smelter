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

	var controller = path.join(alloyDir, CONST.DIR.CONTROLLER, _params.name + '.' + CONST.FILE_EXT.CONTROLLER),
		view = path.join(alloyDir, CONST.DIR.VIEW, _params.name + '.' + CONST.FILE_EXT.VIEW),
		style = path.join(alloyDir, CONST.DIR.STYLE, _params.name + '.' + CONST.FILE_EXT.STYLE),
		controllerDest = path.join(alloyDir, CONST.DIR.CONTROLLER, _params.destination + '.' + CONST.FILE_EXT.CONTROLLER),
		viewDest = path.join(alloyDir, CONST.DIR.VIEW, _params.destination + '.' + CONST.FILE_EXT.VIEW),
		styleDest = path.join(alloyDir, CONST.DIR.STYLE, _params.destination + '.' + CONST.FILE_EXT.STYLE),
		controllerExists = fs.existsSync(controller),
		viewExists = fs.existsSync(view),
		styleExists = fs.existsSync(style);

	if (controllerExists && viewExists && styleExists) {
		fs.copy(controller, controllerDest, function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Failed: not copied controller file ' + chalk.cyan(controller));
			} else {
				console.info(chalk.green('[INFO]') + ' Success: controller file copied ' + chalk.cyan(controller) + ' => ' + chalk.cyan(controllerDest));
			}
		});

		fs.copy(view, viewDest, function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Failed: not copied view file ' + chalk.cyan(view));
			} else {
				console.info(chalk.green('[INFO]') + ' Success: view file copied ' + chalk.cyan(view) + ' => ' + chalk.cyan(viewDest));
			}
		});

		fs.copy(style, styleDest, function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Failed: not copied style file ' + chalk.cyan(style));
			} else {
				console.info(chalk.green('[INFO]') + ' Success: style file copied ' + chalk.cyan(style) + ' => ' + chalk.cyan(styleDest));
			}
		});
	} else {
		console.error(chalk.red('[ERROR]') + ' Failed: not copied controller, view, style files');

		if (controllerExists) {
			console.info(chalk.magenta('[DEBUG]') + ' Exists ' + chalk.cyan(controller));
		} else {
			console.info(chalk.magenta('[DEBUG]') + ' Not exists ' + chalk.cyan(controller));
		}

		if (viewExists) {
			console.info(chalk.magenta('[DEBUG]') + ' Exists ' + chalk.cyan(view));
		} else {
			console.info(chalk.magenta('[DEBUG]') + ' Not exists ' + chalk.cyan(view));
		}

		if (styleExists) {
			console.info(chalk.magenta('[DEBUG]') + ' Exists ' + chalk.cyan(style));
		} else {
			console.info(chalk.magenta('[DEBUG]') + ' Not exists ' + chalk.cyan(style));
		}
	}
};