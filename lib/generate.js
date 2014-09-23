var _ = require('lodash'),
	chalk = require('chalk'),
	spawn = require('child_process').spawn,
	fs = require('fs-extra'),
	path = require('path'),
	CONST = require('alloy/Alloy/common/constants');

module.exports = function(_params){
	_params = _params || {};
	_params.program.template = _params.program.template || '';

	var alloyDir = path.resolve(path.join(_params.program.projectDir, CONST.ALLOY_DIR));

	if (!fs.existsSync(alloyDir)) {
		console.error(chalk.red('[ERROR]') + ' Not exists directory containing the alloy project ' + chalk.cyan(_params.program.projectDir));
		return;
	}

	var templateDir = path.join(process.env.HOME, '.smelter', 'template', _params.program.template),
		controller = path.join(templateDir, 'controller.' + CONST.FILE_EXT.CONTROLLER),
		view = path.join(templateDir, 'view.' + CONST.FILE_EXT.VIEW),
		style = path.join(templateDir, 'style.' + CONST.FILE_EXT.STYLE),
		controllerError = false,
		viewError = false,
		styleError = false;

	if (!_params.program.template) {
		var ti = spawn('alloy', [
				'generate',
				_params.type,
				_params.name,
				'--project-dir',
				_params.program.projectDir
			], {
				stdio: 'inherit'
			});
	} else {
		if (!fs.existsSync(templateDir)) {
			console.error(chalk.red('[ERROR]') + ' Not exists directory containing your selected template ' + chalk.cyan(templateDir));
		} else {
			switch (_params.type) {
				case 'controller':
					if (!fs.existsSync(controller)) {
						controllerError = true;
					} else {
						_generate('controller', controller, path.join(alloyDir, CONST.DIR.CONTROLLER, _params.name + '.' + CONST.FILE_EXT.CONTROLLER));
					}
					if (!fs.existsSync(view)) {
						viewError = true;
					} else {
						_generate('view', view, path.join(alloyDir, CONST.DIR.VIEW, _params.name + '.' + CONST.FILE_EXT.VIEW));
					}
					if (!fs.existsSync(style)) {
						styleError = true;
					} else {
						_generate('style', style, path.join(alloyDir, CONST.DIR.STYLE, _params.name + '.' + CONST.FILE_EXT.STYLE));
					}
					break;
				case 'view':
					if (!fs.existsSync(view)) {
						viewError = true;
					} else {
						_generate('view', view, path.join(alloyDir, CONST.DIR.VIEW, _params.name + '.' + CONST.FILE_EXT.VIEW));
					}
					if (!fs.existsSync(style)) {
						styleError = true;
					} else {
						_generate('style', style, path.join(alloyDir, CONST.DIR.STYLE, _params.name + '.' + CONST.FILE_EXT.STYLE));
					}
					break;
				case 'style':
					if (!fs.existsSync(style)) {
						styleError = true;
					} else {
						_generate('style', style, path.join(alloyDir, CONST.DIR.STYLE, _params.name + '.' + CONST.FILE_EXT.STYLE));
					}
					break;
				default:
					console.error(chalk.red('[ERROR]') + ' Failed: invalid generate target ' + chalk.cyan(_params.type));
					return;
			}

			if (controllerError || viewError || styleError) {
				controllerError && console.error(chalk.red('[ERROR]') + ' Failed: not exists template controller ' + chalk.cyan(controller));
				viewError && console.error(chalk.red('[ERROR]') + ' Failed: not exists template view ' + chalk.cyan(view));
				styleError && console.error(chalk.red('[ERROR]') + ' Failed: not exists template style ' + chalk.cyan(style));
			}
		}
	}
};

function _generate(_type, _source, _destination) {
	switch (_type) {
		case 'controller':
			fs.copy(_source, _destination, function(err){
				if (err) {
					console.error(chalk.red('[ERROR]') + ' Failed: does not generate controller file ' + chalk.cyan(_destination));
				} else {
					console.info(chalk.green('[INFO]') + ' Success: controller file generated ' + chalk.cyan(_destination));
				}
			});
			break;
		case 'view':
			fs.copy(_source, _destination, function(err){
				if (err) {
					console.error(chalk.red('[ERROR]') + ' Failed: does not generate view file ' + chalk.cyan(_destination));
				} else {
					console.info(chalk.green('[INFO]') + ' Success: view file generated ' + chalk.cyan(_destination));
				}
			});
			break;
		case 'style':
			fs.copy(_source, _destination, function(err){
				if (err) {
					console.error(chalk.red('[ERROR]') + ' Failed: does not generate style file ' + chalk.cyan(_destination));
				} else {
					console.info(chalk.green('[INFO]') + ' Success: style file generated ' + chalk.cyan(_destination));
				}
			});
			break;
	}
}