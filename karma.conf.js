// Karma configuration
// Generated on Mon Oct 05 2015 20:50:50 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-sinon-chai',
      'karma-nyan-reporter',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
    ],

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.spec.js': ['webpack']
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js/, exclude: [ /node_modules/], loader: 'babel' },
          { test: /\.html/, loader: 'raw' }
        ]
      }
    },

    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['nyan'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
