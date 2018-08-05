
import * as karmaChromeLauncher from 'karma-chrome-launcher';
import * as karmaJasmine from 'karma-jasmine';
import * as nyanReporter from 'karma-nyan-reporter';
import * as karmaWebpack from 'karma-webpack';


export default (config: any) => {
    config.set({

        basePath: '',

        frameworks: ['jasmine'],


        files: [
            'src/app.spec.js'
        ],


        preprocessors: {
            'src/app.spec.js': [ 'webpack' ]
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        use: 'ts-loader',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            'style-loader', 
                            'css-loader', 
                            'sass-loader'
                        ]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            'style-loader',
                            'css-loader'
                        ]
                    }
                ]
            },
            resolve: {
                extensions: [ '.ts', '.js' ]
            },
        },

        plugins: [
            karmaChromeLauncher,
            karmaJasmine,
            nyanReporter,
            karmaWebpack,
        ],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // reporter types:
        // - dots
        // - progress (default)
        // - spec (karma-spec-reporter)
        // - junit
        // - growl
        // - coverage
        reporters: ['nyan'],


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        browsers: ['ChromeHeadless'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};