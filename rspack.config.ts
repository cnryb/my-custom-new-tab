import rspack, { Configuration } from "@rspack/core";
import {VueLoaderPlugin} from "vue-loader";

const isDev = process.env.NODE_ENV == "development";

const config: Configuration = {
	context: __dirname,
	resolve: {
		extensions: [".ts", ".js", ".vue"],
	},
	entry: {
		main: "./src/main.ts"
	},
	plugins: [
		new VueLoaderPlugin() as any,
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		}),
		new rspack.DefinePlugin({
			"__VUE_PROD_DEVTOOLS__": isDev
		})
	],
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					experimentalInlineMatchResource: true
				}
			},
			{
				test: /\.(js|ts)$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							sourceMap: true,
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: false
								}
							},
							env: {
								targets: [
									"chrome >= 120",
									"edge >= 120"
								]
							}
						}
					}
				]
			},
			{
				test: /\.svg/,
				type: "asset/resource"
			}
		]
	}
};
module.exports = config;
