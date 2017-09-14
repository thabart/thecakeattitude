'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

module.exports = {
  appBuild: __dirname  + '/build',
  appPublic: __dirname  + '/public',
  appHtml: __dirname  + '/public/index.html',
  appIndexJs: __dirname  + '/src/index.js',
  appPackageJson:  __dirname  + '/package.json',
  appSrc: __dirname  + '/src',
  appNodeModules: __dirname  + '/node_modules',
};
