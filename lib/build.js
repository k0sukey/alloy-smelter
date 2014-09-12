var _ = require('lodash'),
	chalk = require('chalk'),
	spawn = require('child_process').spawn,
	fs = require('fs-extra'),
	path = require('path'),
	tiappxml = require('tiapp.xml'),
	CONST = require('alloy/Alloy/common/constants');

module.exports = function(_params){
	_params = _params || {};
	_params.program.titanium = _params.program.titanium || '';

	var alloyDir = path.resolve(path.join(_params.program.projectDir, CONST.ALLOY_DIR));

	if (!fs.existsSync(alloyDir)) {
		console.error(chalk.red('[ERROR]') + ' Not exists directory containing the alloy project ' + chalk.cyan(_params.program.projectDir));
		return;
	}

	var tiapp, plugins, tialloy;

	if (!_params.program.compile) {
		tiapp = tiappxml.load(path.join(_params.program.projectDir, 'tiapp.xml'));

		plugins = tiapp.getPlugins();
		_.each(plugins, function(_plugin){
			if (_plugin.id === 'ti.alloy') {
				tialloy = _plugin;
				tiapp.removePlugin('ti.alloy');
				tiapp.write();
				console.info(chalk.green('[INFO]') + ' Remove: ti.alloy plugin in a tiapp.xml');
			}
		});
	}

	var revert = function(){
		if (!_params.program.compile) {
			tiapp.setPlugin(tialloy.id, tialloy.version);
			tiapp.write();
			console.info(chalk.green('[INFO]') + ' Revert: Removed ti.alloy plugin in a tiapp.xml');
		}
	};

	var options = _params.program.titanium.split(' ');
	options.unshift('build');
	options.push('--project-dir', _params.program.projectDir);

	var ti = spawn('ti', options, {
			stdio: 'inherit'
		});
	process.on('SIGCHLD', revert);
	process.on('SIGINT', revert);
	process.on('SIGTERM', revert);
};