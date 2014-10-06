var _ = require('lodash'),
	chalk = require('chalk'),
	cheerio = require('cheerio'),
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

	var tags = {},
		properties = {},
		bindings = {},
		events = {
			type: {},
			listener: {}
		};

	_.each(views, function(_view){
		var _xml = fs.readFileSync(_view).toString(),
			_tags = _xml.match(/<("[^"]*"|'[^']*'|[^'">])*>/ig),
			_events,
			$ = cheerio.load(_xml, {
				xmlMode: true
			});

		_.each(_tags, function(_tag){
			if (_tag.match(/<Alloy/i) || _tag.match(/<\//i) || _tag.match(/<!--/i)) {
				return;
			}

			if (_events = _tag.match(/\son.+?=['"].+?['"]/ig)) {
				_.each(_events, function(_event){
					var _tmp = _event.split('=');

					if (_.indexOf(CONST.SPECIAL_PROPERTY_NAMES, _tmp[0]) > -1) {
						return;
					}

					var _type = _tmp[0].replace('on', '').toLowerCase(),
						_listener = _tmp[1].replace(/['"]/ig, '');

					if (_.has(events.type, _type)) {
						events.type[_type]++;
					} else {
						events.type[_type] = 1;
					}

					if (_.has(events.listener, _listener)) {
						events.listener[_listener]++;
					} else {
						events.listener[_listener] = 1;
					}
				});
			}

			_tag = _tag.replace(/[<>]/ig, '').split(' ')[0];
			var __tag = _tag[0].toUpperCase() + _tag.substr(1);

			if (_.has(tags, __tag)) {
				tags[__tag]++;
			} else {
				tags[__tag] = 1;
			}

			var _attributes = $(__tag).attr();
			_.each(_attributes, function(_value, _attr){
				if (_attr.match(/^on.+/ig) &&
					_.indexOf(CONST.SPECIAL_PROPERTY_NAMES, _attr) === -1) {
					return;
				}

				if (_.indexOf(CONST.BIND_PROPERTIES, _attr) > -1) {
					if (_.has(bindings, _attr)) {
						bindings[_attr]++;
					} else {
						bindings[_attr] = 1;
					}

					return;
				}

				if (_.has(properties, _attr)) {
					properties[_attr]++;
				} else {
					properties[_attr] = 1;
				}
			});
		});
	});

	var colors = {},
		selectors = {
			el: 0,
			id: 0,
			cl: 0
		},
		recursive = function(_props){
			for (var key in _props) {
				if (_.has(properties, key)) {
					properties[key]++;
				} else {
					properties[key] = 1;
				}

				if (key.match(/color/i) &&
					_.isString(_props[key])) {
					var _color = _props[key].toLowerCase();

					if (_.has(colors, _color)) {
						colors[_color]++;
					} else {
						colors[_color] = 1;
					}
				}

				if (_.isObject(_props[key]) &&
					!_.isArray(_props[key])) {
					recursive(_props[key]);
				}
			}
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

			recursive(_props);
		});
	});

	var table = new Table();
	table.push(['Project files', [
			sprintf('%30s: ', 'controllers') + sprintf('%3s', controllers.length),
			sprintf('%30s: ', 'views') + sprintf('%3s', views.length),
			sprintf('%30s: ', 'styles') + sprintf('%3s', styles.length),
			sprintf('%30s: ', 'models') + sprintf('%3s', models.length)
		].join('\n')]);
	table.push(['View nodes', prettify(tags).join('\n')]);
	table.push(['Selectors', [
			sprintf('%30s: ', 'element') + sprintf('%3s', selectors.el),
			sprintf('%30s: ', 'id') + sprintf('%3s', selectors.id),
			sprintf('%30s: ', 'class') + sprintf('%3s', selectors.cl)
		].join('\n')]);
	table.push(['Using properties', prettify(properties).join('\n')]);
	table.push(['Unique colors', prettify(colors).join('\n')]);
	table.push(['Event type', prettify(events.type).join('\n')]);
	table.push(['Event listener', prettify(events.listener).join('\n')]);
	table.push(['Data binding', prettify(bindings).join('\n')]);

	console.log(table.toString());
};

function prettify(_target) {
	var result = [],
		sortable = [];

	for (var key in _target) {
		sortable.push([key, _target[key]]);
	}

	sortable.sort(function(a, b){
		return b[1] - a[1];
	});

	_.each(sortable, function(_item){
		result.push(sprintf('%30s: ', _item[0]) + sprintf('%3s', _item[1]));
	});

	return result;
}