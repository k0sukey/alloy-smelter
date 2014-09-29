var _ = require('lodash'),
	chalk = require('chalk'),
	fs = require('fs-extra'),
	path = require('path'),
	Table = require('cli-table'),
	sprintf = require('sprintf-js').sprintf,
	wrench = require('wrench'),
	CONST = require('alloy/Alloy/common/constants'),
	STYLER = require('alloy/Alloy/commands/compile/styler');

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
		files,
		controllerRegex = new RegExp('\\.' + CONST.FILE_EXT.CONTROLLER + '$'),
		viewRegex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$'),
		styleRegex = new RegExp('\\.' + CONST.FILE_EXT.STYLE + '$'),
		modelRegex = new RegExp('\\.' + CONST.FILE_EXT.MODEL + '$'),
		len = 0;

	if (fs.existsSync(path.join(alloyDir, CONST.DIR.CONTROLLER))) {
		files = wrench.readdirSyncRecursive(path.join(alloyDir, CONST.DIR.CONTROLLER));
		_.each(files, function(_controller){
			if (_controller.match(controllerRegex)) {
				controllers.push(path.join(alloyDir, CONST.DIR.CONTROLLER, _controller));
			}
		});
	} else {
		console.warn(chalk.yellow('[WARN]') + ' Not exists controllers directory containing the alloy project ' + chalk.cyan(path.join(alloyDir, CONST.DIR.CONTROLLER)));
	}

	if (fs.existsSync(path.join(alloyDir, CONST.DIR.VIEW))) {
		files = wrench.readdirSyncRecursive(path.join(alloyDir, CONST.DIR.VIEW));
		_.each(files, function(_view){
			if (_view.match(viewRegex)) {
				views.push(path.join(alloyDir, CONST.DIR.VIEW, _view));
			}
		});
	} else {
		console.warn(chalk.yellow('[WARN]') + ' Not exists views directory containing the alloy project ' + chalk.cyan(path.join(alloyDir, CONST.DIR.VIEW)));
	}

	if (fs.existsSync(path.join(alloyDir, CONST.DIR.STYLE))) {
		files = wrench.readdirSyncRecursive(path.join(alloyDir, CONST.DIR.STYLE));
		_.each(files, function(_style){
			if (_style.match(styleRegex)) {
				styles.push(path.join(alloyDir, CONST.DIR.STYLE, _style));
			}
		});
	} else {
		console.warn(chalk.yellow('[WARN]') + ' Not exists styles directory containing the alloy project ' + chalk.cyan(path.join(alloyDir, CONST.DIR.STYLE)));
	}

	if (fs.existsSync(path.join(alloyDir, CONST.DIR.MODEL))) {
		files = wrench.readdirSyncRecursive(path.join(alloyDir, CONST.DIR.MODEL));
		_.each(files, function(_model){
			if (_model.match(modelRegex)) {
				models.push(path.join(alloyDir, CONST.DIR.STYLE, _model));
			}
		});
	} else {
		console.warn(chalk.yellow('[WARN]') + ' Not exists models directory containing the alloy project ' + chalk.cyan(path.join(alloyDir, CONST.DIR.MODEL)));
	}

	var tags = {};

	_.each(views, function(_view){
		var _xml = fs.readFileSync(_view).toString(),
			_tags = _xml.match(/<("[^"]*"|'[^']*'|[^'">])*>/ig);

		_.each(_tags, function(_tag){
			if (_tag.match(/<Alloy/i) || _tag.match(/<\//i) || _tag.match(/<!--/i)) {
				return;
			}

			_tag = _tag.replace(/[<>]/ig, '').split(' ')[0];
			var __tag = _tag[0].toUpperCase() + _tag.substr(1);

			if (_.has(tags, __tag)) {
				tags[__tag]++;
			} else {
				tags[__tag] = 1;
			}
		});
	});

	var sortable = [];

	for (var key in tags) {
		sortable.push([key, tags[key]]);
	}

	sortable.sort(function(a, b){
		return b[1] - a[1];
	});

	tags = [];
	_.each(sortable, function(_item){
		tags.push(sprintf('%30s: ', _item[0]) + sprintf('%3s', _item[1]));
	});

	var properties = {},
		colors = {},
		selectors = {
			el: 0,
			id: 0,
			cl: 0
		};

	_.each(styles, function(_style){
		_.each(STYLER.loadStyle(_style), function(_props, _name){
			if (_name.match(/^\#/)) {
				selectors.id++;
			} else if (_name.match(/^\./)) {
				selectors.cl++;
			} else {
				selectors.el++;
			}

			for (var key in _props) {
				if (_.has(properties, key)) {
					properties[key]++;
				} else {
					properties[key] = 1;
				}

				if (_.isObject(_props[key])) {
					for (var _key in _props[key]) {
						if (_.has(properties, _key)) {
							properties[_key]++;
						} else {
							properties[_key] = 1;
						}
					}
				}

				if (key.match(/color/i)) {
					var _color = _props[key].toLowerCase();

					if (_.has(colors, _color)) {
						colors[_color]++;
					} else {
						colors[_color] = 1;
					}
				}
			}
		});
	});

	sortable = [];

	for (var key in properties) {
		sortable.push([key, properties[key]]);
	}

	sortable.sort(function(a, b){
		return b[1] - a[1];
	});

	properties = [];
	_.each(sortable, function(_item){
		properties.push(sprintf('%30s: ', _item[0]) + sprintf('%3s', _item[1]));
	});

	sortable = [];

	for (var key in colors) {
		sortable.push([key, colors[key]]);
	}

	sortable.sort(function(a, b){
		return b[1] - a[1];
	});

	colors = [];
	_.each(sortable, function(_item){
		colors.push(sprintf('%30s: ', _item[0]) + sprintf('%3s', _item[1]));
	});

	var table = new Table({
		head: [
				'Category',
				'Summary'
			]
	});
	table.push(['File', [
			sprintf('%30s: ', 'controllers') + sprintf('%3s', controllers.length),
			sprintf('%30s: ', 'views') + sprintf('%3s', views.length),
			sprintf('%30s: ', 'styles') + sprintf('%3s', styles.length),
			sprintf('%30s: ', 'models') + sprintf('%3s', models.length)
		].join('\n')]);
	table.push(['View node', tags.join('\n')]);
	table.push(['Selector', [
			sprintf('%30s: ', 'element') + sprintf('%3s', selectors.el),
			sprintf('%30s: ', 'id') + sprintf('%3s', selectors.id),
			sprintf('%30s: ', 'class') + sprintf('%3s', selectors.cl)
		].join('\n')]);
	table.push(['Property', properties.join('\n')]);
	table.push(['Color', colors.join('\n')]);

	console.log(table.toString());
};