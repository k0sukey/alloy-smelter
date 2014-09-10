var _ = require('lodash'),
	chalk = require('chalk'),
	fs = require('fs-extra'),
	path = require('path'),
	Table = require('cli-table'),
	sprintf = require('sprintf-js').sprintf,
	wrench = require('wrench'),
	CONST = require('alloy/Alloy/common/constants');

module.exports = function(_params){
	_params = _params || {};

	var alloyDir = path.resolve(path.join(_params.program.projectDir, CONST.ALLOY_DIR));

	if (!fs.existsSync(alloyDir)) {
		console.error(chalk.red('[ERROR]') + ' Not exists directory containing the alloy project ' + chalk.cyan(_params.program.projectDir));
		return;
	}

	var controllers = [],
		views = [],
		styles = [],
		models = [],
		widgets = [],
		files,
		controllerRegex = new RegExp('\\.' + CONST.FILE_EXT.CONTROLLER + '$'),
		viewRegex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$'),
		styleRegex = new RegExp('\\.' + CONST.FILE_EXT.STYLE + '$'),
		modelRegex = new RegExp('\\.' + CONST.FILE_EXT.MODEL + '$');

	files = wrench.readdirSyncRecursive(path.join(alloyDir, CONST.DIR.CONTROLLER));
	_.each(files, function(_controller){
		if (_controller.match(controllerRegex)) {
			controllers.push(path.join(alloyDir, CONST.DIR.CONTROLLER, _controller));
		}
	});

	files = wrench.readdirSyncRecursive(path.join(alloyDir, CONST.DIR.VIEW));
	_.each(files, function(_view){
		if (_view.match(viewRegex)) {
			views.push(path.join(alloyDir, CONST.DIR.VIEW, _view));
		}
	});

	files = wrench.readdirSyncRecursive(path.join(alloyDir, CONST.DIR.STYLE));
	_.each(files, function(_style){
		if (_style.match(styleRegex)) {
			styles.push(path.join(alloyDir, CONST.DIR.STYLE, _style));
		}
	});

	files = wrench.readdirSyncRecursive(path.join(alloyDir, CONST.DIR.MODEL));
	_.each(files, function(_model){
		if (_model.match(styleRegex)) {
			models.push(path.join(alloyDir, CONST.DIR.STYLE, _model));
		}
	});

	if (fs.existsSync(path.join(alloyDir, CONST.DIR.WIDGET))) {
		files = fs.readdirSync(path.join(alloyDir, CONST.DIR.WIDGET));
		_.each(files, function(_widget){
			if (_widget.match(styleRegex)) {
				widgets.push(path.join(alloyDir, CONST.DIR.STYLE, _widget));
			}
		});
	}

	var table = new Table();
	table.push(['File summary', [
			'controllers: ' + sprintf('%3s', controllers.length),
			'      views: ' + sprintf('%3s', views.length),
			'     styles: ' + sprintf('%3s', styles.length),
			'     models: ' + sprintf('%3s', models.length),
			'    widgets: ' + sprintf('%3s', widgets.length)
		].join('\n')]);
	console.log(table.toString());
};