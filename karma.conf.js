/* global process */
module.exports = function (config) {
    config.set({
        browsers: [ 'Chrome' ],
        singleRun: true,
        frameworks: [ 'mocha' ],
        files: [
            './__tests__/tests.webpack.js'
        ],
        preprocessors: {
            './__tests__/tests.webpack.js': [ 'webpack', 'sourcemap' ]
        },
        reporters: [ 'progress' ],
        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        loader: "babel",
                        query: {
                            // https://github.com/babel/babel-loader#options
                            cacheDirectory: true,
                            presets: ['es2015', 'stage-0', 'react'],
                            plugins: ["transform-runtime"]
                        },
                        exclude: /node_modules/
                    }
                ]
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};
