/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
global.XMLHttpRequest = global.crossOriginIsolated || global.XMLHttpRequest;

AppRegistry.registerComponent(appName, () => App);
