<!-- config-overrides.js -->

const webpack = require("webpack");

module.exports = function override(config) {
const fallback = config.resolve.fallback || {};
Object.assign(fallback, {
crypto: require.resolve("crypto-browserify"),
stream: require.resolve("stream-browserify"),
assert: require.resolve("assert"),
http: require.resolve("stream-http"),
https: require.resolve("https-browserify"),
os: require.resolve("os-browserify"),
url: require.resolve("url"),
});
config.resolve.fallback = fallback;
config.plugins = (config.plugins || []).concat([
new webpack.ProvidePlugin({
process: "process/browser",
Buffer: ["buffer", "Buffer"],
}),
]);
config.ignoreWarnings = [/Failed to parse source map/];
return config;
};

<!-- dependencies -->

"assert": "^2.0.0",
"buffer": "^6.0.3",
"crypto-browserify": "^3.12.0",
"https-browserify": "^1.0.0",
"os-browserify": "^0.3.0",
"process": "^0.11.10",
"react-app-rewired": "^2.2.1",
"stream-browserify": "^3.0.0",
"stream-http": "^3.2.0",
"url": "^0.11.0"

<!-- scripts -->

"start": "react-app-rewired start",
"build": "react-app-rewired build",
"test": "react-app-rewired test",
"eject": "react-app-rewired eject"
