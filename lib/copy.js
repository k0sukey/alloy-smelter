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

	var userConst = path.join(process.env.HOME, '.smelter', 'constants.json'),
		constants;

	if (fs.existsSync(userConst)) {
		constants = require(userConst);
		constants.DIR && _.extend(CONST.DIR, constants.DIR);
		constants.FILE_EXT && _.extend(CONST.FILE_EXT, constants.FILE_EXT);
	}

	var controller = path.join(alloyDir, CONST.DIR.CONTROLLER, _params.name + '.' + CONST.FILE_EXT.CONTROLLER),
		view = path.join(alloyDir, CONST.DIR.VIEW, _params.name + '.' + CONST.FILE_EXT.VIEW),
		style = path.join(alloyDir, CONST.DIR.STYLE, _params.name + '.' + CONST.FILE_EXT.STYLE),
		controllerDest = path.join(alloyDir, CONST.DIR.CONTROLLER, _params.destination + '.' + CONST.FILE_EXT.CONTROLLER),
		viewDest = path.join(alloyDir, CONST.DIR.VIEW, _params.destination + '.' + CONST.FILE_EXT.VIEW),
		styleDest = path.join(alloyDir, CONST.DIR.STYLE, _params.destination + '.' + CONST.FILE_EXT.STYLE),
		controllerExists = fs.existsSync(controller),
		viewExists = fs.existsSync(view),
		styleExists = fs.existsSync(style),
		controllerDestExists = fs.existsSync(controllerDest),
		viewDestExists = fs.existsSync(viewDest),
		styleDestExists = fs.existsSync(styleDest);

	if (controllerExists && viewExists && styleExists) {
		if (!_params.program.force &&
			(controllerDestExists || viewDestExists || styleDestExists)) {
			console.error(chalk.red('[ERROR]') + ' Failed: destination files already exists, ' +
				'either change the destination name or re-run this command with the --force flag');
			controllerDestExists && console.info(chalk.magenta('[DEBUG]') + ' Exists ' + chalk.cyan(controllerDest));
			viewDestExists && console.info(chalk.magenta('[DEBUG]') + ' Exists ' + chalk.cyan(viewDest));
			styleDestExists && console.info(chalk.magenta('[DEBUG]') + ' Exists ' + chalk.cyan(styleDest));
		} else {
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
		}
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