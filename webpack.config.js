const { resolve } = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackEntryList = require('webpack-entry-list');

module.exports = (env, argv) => {

	let settings = {};
	let HTMLList = WebpackEntryList.generateHTMLPluginList('src/pug');

	if (argv.mode == 'development') {
		settings.devtool = 'eval';
	} else {
		settings.devtool = false;
	}

	return {
		stats: 'minimal',
		devtool: settings.devtool,
		entry: WebpackEntryList.generateEntryList('src/js'),
		output: {
			filename: 'js/[name].[contenthash].js',
			path: resolve(__dirname, 'dist'),
			publicPath: '/'
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendor: {
						name: 'vendor',
						chunks: 'all',
						reuseExistingChunk: true
					}
				}
			}
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			}),
			new MiniCssExtractPlugin({
				filename: 'css/[name].[contenthash].css'
			}),
			new webpack.DefinePlugin({
				DOMAIN: JSON.stringify('test')
			}),
			new CleanWebpackPlugin(['dist/js/*.*', 'dist/css/*.*', 'dist/*.*']),
			...HTMLList

		],
		module: {
			rules: [{
				test: /\.js$/,
				exclude: [
					resolve(__dirname, 'node_modules'),
					resolve(__dirname, 'src/js/libs')
				],
				use: [{
					loader: 'babel-loader',
					query: {
						'plugins': [
							['babel-plugin-root-import', {
								'rootPathSuffix': 'src/js'
							}]
						],
						'presets': [
							[
								'@babel/preset-env', {
									'useBuiltIns': 'usage'
								}
							]
						]
					}
				}, 'eslint-loader']
			}, {
				test: /\.(scss|sass)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader', {
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [
								require('autoprefixer')({}),
								require('cssnano')({ preset: 'advanced' })
							],
							minimize: true
						}
					}, {
						loader: 'sass-loader',
						options: {
							includePaths: ['./node_modules']
						}
					}
				]
			}, {
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader', {
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [
								require('autoprefixer')({}),
								require('cssnano')({ preset: 'advanced' })
							],
							minimize: true
						}
					}
				]
			}, {
				test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'images/',
						name: '[name].[ext]'
					}
				}]
			}, {
				test: /\.(pug)$/,
				use: [{
					loader: 'html-loader?attrs=false'
				}, 'pug-html-loader']
			}]
		}
	}
};