var _ = require('lodash'),
	chalk = require('chalk'),
	spawn = require('child_process').spawn,
	fs = require('fs-extra'),
	path = require('path'),
	CONST = require('alloy/Alloy/common/constants');

module.exports = function(_params){
	_params = _params || {};
	_params.program.titanium = _params.program.titanium || '';

	var alloyDir = path.resolve(path.join(_params.program.projectDir, CONST.ALLOY_DIR));

	if (!fs.existsSync(alloyDir)) {
		console.error(chalk.red('[ERROR]') + ' Not exists directory containing the alloy project ' + chalk.cyan(_params.program.projectDir));
		return;
	}

	var ti = spawn('alloy', [
			'generate',
			_params.type,
			_params.name,
			'--project-dir',
			_params.program.projectDir
		], {
			stdio: 'inherit'
		});
};