var _ = require('lodash'),
	chalk = require('chalk'),
	fs = require('fs-extra'),
	path = require('path'),
	wrench = require('wrench'),
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
		controllerExists = fs.existsSync(controller),
		viewExists = fs.existsSync(view),
		styleExists = fs.existsSync(style);

	if (controllerExists && viewExists && styleExists) {
		fs.remove(controller, function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Failed: not removed controller file ' + chalk.cyan(controller));
			} else {
				console.info(chalk.green('[INFO]') + ' Success: controller file removed ' + chalk.cyan(controller));
				cleanup({
					root: path.join(alloyDir, CONST.DIR.CONTROLLER),
					path: _.initial(path.join(alloyDir, CONST.DIR.CONTROLLER, _params.name).split(path.sep)).join(path.sep)
				});
			}
		});

		fs.remove(view, function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Failed: not removed view file ' + chalk.cyan(view));
			} else {
				console.info(chalk.green('[INFO]') + ' Success: view file removed ' + chalk.cyan(view));
				cleanup({
					root: path.join(alloyDir, CONST.DIR.VIEW),
					path: _.initial(path.join(alloyDir, CONST.DIR.VIEW, _params.name).split(path.sep)).join(path.sep)
				});
			}
		});

		fs.remove(style, function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Failed: not removed style file ' + chalk.cyan(style));
			} else {
				console.info(chalk.green('[INFO]') + ' Success: style file removed ' + chalk.cyan(style));
				cleanup({
					root: path.join(alloyDir, CONST.DIR.STYLE),
					path: _.initial(path.join(alloyDir, CONST.DIR.STYLE, _params.name).split(path.sep)).join(path.sep)
				});
			}
		});
	} else {
		console.error(chalk.red('[ERROR]') + ' Failed: not removed controller, view, style files');

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

function cleanup(_params) {
	_params = _params || {};

	files = wrench.readdirSyncRecursive(_params.path);
	if (files.length === 0) {
		fs.rmdir(_params.path, function(err){
			if (err) {
				console.error(chalk.red('[ERROR]') + ' Failed: delete empty directory ' + chalk.cyan(_params.path));
			} else {
				var recursive = _.initial(_params.path.split(path.sep)).join(path.sep);

				if (recursive !== _params.root) {
					cleanup({
						root: _params.root,
						path: recursive
					});
				}
			}
		});
	}
}