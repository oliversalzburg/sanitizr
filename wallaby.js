module.exports = wallaby => { // eslint-disable-line arrow-body-style
	return {
		name : "sanitizr",
		env : {
			type : "node"
		},
		files : [
			"lib/**/*.js",
			{
				pattern : "test/fixtures/*",
				instrument : false
			}
		],
		tests : [
			"test/decorate/*.js",
			"test/error/*.js",
			"test/info/*.js",
			"test/paranoid/*.js",
			"test/processing/*.js"
		],
		testFramework : "mocha"
	};
};
