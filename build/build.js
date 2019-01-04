'use strict'
require('./check-versions')()

// process.env.NODE_ENV = 'production'
// console.log(process.env.NODE_ENV,'process.env.NODE_ENV');
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
// let webpackConfig;
console.log(process.env.NODE_ENV,'process.env.NODE_ENV');

// if (process.env.NODE_ENV === 'prod'){
//   webpackConfig = require('./webpack.prod.conf')
// } else if (process.env.NODE_ENV === 'dev'){
//   webpackConfig = require('./webpack.dev.conf')
// } else if (process.env.NODE_ENV === 'sit'){
//   webpackConfig = require('./webpack.prod.conf')
// } else if (process.env.NODE_ENV === 'pet'){
//   webpackConfig = require('./webpack.prod.conf')
// } else {
//   console.log('Cannot find process.env.NODE_ENV')
// }
const spinner = ora('building for ' + process.env.NODE_ENV + ' of ' + process.env.env_config+ ' mode...' )
// const spinner = ora('building for '+ process.env.NODE_ENV )
// const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
