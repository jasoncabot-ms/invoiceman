const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist/GetInvoiceStatus'),
		filename: 'index.js',
		library: 'GetInvoiceStatus',
		libraryTarget: 'commonjs'
	},
	target: 'node',
	plugins: [
		new CopyPlugin([
			{ from: './src/function.json', to: 'function.json' }
		]),
	],
};

module.exports = config;
