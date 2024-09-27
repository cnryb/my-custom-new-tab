import { defineConfig } from "@rspack/cli";
import { type RspackPluginFunction, rspack } from "@rspack/core";
import { VueLoaderPlugin } from "vue-loader";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 120", "edge >= 120"];

export default defineConfig({
	context: __dirname,
	resolve: {
		extensions: [".ts", ".js", ".vue"],
	},
	entry: {
		main: "./src/main.ts"
	},
	plugins: [
		new VueLoaderPlugin() as RspackPluginFunction,
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		}),
		new rspack.DefinePlugin({
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false
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
									syntax: "typescript"
								}
							},
							env: { targets }
						}
					}
				]
			},
			{
				test: /\.svg/,
				type: "asset/resource"
			}
		]
	},
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets }
			})
		]
	},
	experiments: {
		css: true
	}
});
