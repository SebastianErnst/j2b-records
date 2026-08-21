/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable import/no-nodejs-modules*/
/* eslint-disable no-undef */
const path = require('path');
const webpackConfig = require('../../vendor/sulu/sulu/webpack.config.js');

module.exports = (env, argv) => {
    env = env ? env : {};
    argv = argv ? argv : {};

    env.project_root_path = path.resolve(__dirname, '..', '..');
    env.node_modules_path = path.resolve(__dirname, 'node_modules');

    const config = webpackConfig(env, argv);
    config.resolve.alias['core-js'] = path.resolve(__dirname, 'node_modules/core-js');
    config.resolve.alias['fos-jsrouting'] = path.resolve(__dirname, 'fos-jsrouting');
    config.resolve.alias['fos-jsrouting/router$'] = path.resolve(__dirname, 'fos-jsrouting/router.js');
    config.resolve.alias['fos-jsrouting/router.js$'] = path.resolve(__dirname, 'fos-jsrouting/router.js');
    config.optimization = config.optimization || {};
    config.optimization.concatenateModules = false;
    const javascriptRule = config.module.rules.find((rule) => String(rule.test) === '/\\.js$/');
    javascriptRule.exclude = /node_modules[/\\](?!(sulu-(.*)-bundle|@ckeditor|ckeditor5|array-move|lodash-es|@react-leaflet|react-leaflet)[/\\])/;
    javascriptRule.exclude = [javascriptRule.exclude, path.resolve(env.project_root_path, 'vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.js')];
    config.entry = path.resolve(__dirname, 'index.js');

    return config;
};
