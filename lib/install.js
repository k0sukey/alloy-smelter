var _ = require('lodash'),
	base64 = require('base64'),
	chalk = require('chalk'),
	spawn = require('child_process').spawn,
	fs = require('fs-extra'),
	ini = require('ini'),
	npm = require('npm'),
	request = require('request'),
	path = require('path'),
	CONST = require('alloy/Alloy/common/constants');

module.exports = function(_params){
	_params = _params || {};

	var _npmrc = path.join(process.env.HOME, '.npmrc'),
		npmrc = ini.parse(fs.readFileSync(_npmrc).toString());

	request.get({
		url: 'https://api.github.com/repos/appcelerator/titanium_releases/contents/titanium.json?ref=' + _params.branch,
		headers: {
			'User-Agent': 'alloy-smelter',
			proxy: npmrc.proxy || null
		}
	}, function(err, res){
		if (err) {
			console.error(chalk.red('[ERROR]') + ' Failed: could not receive titanium.json ' + chalk.cyan(_params.branch));
		}

		var body = JSON.parse(res.body);
			releases = _params.branch !== '3_3_X' ? JSON.parse(base64.decode(body.content)) : JSON.parse(base64.decode(body.content).replace('"3.3.0.v20140524224144"\n        "modules"', '"3.3.0.v20140524224144","modules"'));

		npm.load(_.extend(npmrc, {
				global: true
			}), function(err){
				if (err) {
					console.error(chalk.red('[ERROR]') + ' Failed: does not found npm config file ' + chalk.cyan(_npmrc));
				}

				var packages = [];
				_.each(releases.dependencies.studioTitanium.npmPackages, function(_package){
					packages.push(_package.name + '@' + _package.version);
				});

				npm.commands.install(packages, function(err){
					if (err) {
						console.error(chalk.red('[ERROR]') + ' Failed: could not install npm packages ' + chalk.cyan(packages.join(', ')));
					}

				/* in develop
				spawn('titanium', [
						'sdk',
						'install',
						releases.dependencies.sdk.version
					], {
						stdio: 'inherit'
					});
				});*/
			});
	});
};