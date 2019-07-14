const webpack = require("webpack"); // access built-in plugins
const glob = require("glob"); // sync all css files, no need to import css
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // to minize js file
const HtmlWebpackPlugin = require("html-webpack-plugin"); // to build from html template
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // to extract css into it own file
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // to use with transpileOnly in ts-loader
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const nodeExternals = require("webpack-node-externals"); // for backend
const path = require("path");


class WebpackConfig {

    setModeResolve() {
        return {
            mode: "development",
            devtool: "source-map",
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"]
            },
        };
    }

    setModuleRulesTypescript(instanceName, tsconfigPath) {
        return [
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            instance: instanceName,
                            configFile: tsconfigPath
                        }
                    }
                ]
            },
        ];
    }

    setOptMinimizerUglifyJs() {
        return [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ];
    }

    setCommonPlugins(tsconfigPath) {
        return [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new MomentLocalesPlugin({
                localesToKeep: ["en", "en-ca"],
            }),
            new ForkTsCheckerWebpackPlugin({
                tsconfig: tsconfigPath,
                tslint: true,
                useTypescriptIncrementalApi: true
            }),
            new ForkTsCheckerNotifierWebpackPlugin({
                title: "TypeScript",
                excludeWarnings: false
            })
        ];
    }

    setClientConfig(
        fromDir = "./client", entryTs = "index.tsx", entryHtml = "index.html", toDir = "./dist/client",
        instanceName = "client", tsconfigDir = ".", tsconfigFile = "tsconfig.client.json"
    ) {
        const entryTsPath = path.resolve(__dirname, fromDir, entryTs);
        const entryHtmlPath = path.resolve(__dirname, fromDir, entryHtml);
        const allStyles = path.resolve(__dirname, fromDir, "**", "*.scss");
        const outPath = path.resolve(__dirname, toDir);
        const tsconfigPath = path.resolve(__dirname, tsconfigDir, tsconfigFile);

        return {
            ...this.setModeResolve(),
            entry: [entryTsPath].concat(glob.sync(allStyles)),
            output: {
                filename: "[name].js",
                path: outPath
            },
            devServer: {
                open: true,
                contentBase: outPath,
                compress: true,
                historyApiFallback: true,
                hot: true,
                clientLogLevel: "warn",
                stats: "errors-only",
                proxy: [
                    {
                        context: ["/auth", "/api"],
                        target: "http://localhost:3000"
                    }
                ]
            },
            module: {
                rules: [
                    ...this.setModuleRulesTypescript(instanceName, tsconfigPath),
                    {
                        test: /\.s?css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                        ]
                    },
                    {
                        test: /\.(jpe?g|png|gif|svg|pdf)$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    name: "[name].[ext]",
                                    outputPath: "assets"
                                }
                            }
                        ]
                    },
                    {
                        test: /\.(jpe?g|png|gif|svg)$/,
                        loader: "image-webpack-loader",
                        enforce: "pre"
                    }
                ]
            },
            optimization: {
                minimizer: [
                    ...this.setOptMinimizerUglifyJs(),
                    new OptimizeCSSAssetsPlugin({})
                ]
            },
            plugins: [
                ...this.setCommonPlugins(tsconfigPath),
                new webpack.HotModuleReplacementPlugin(),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: entryHtmlPath
                }),
                new MiniCssExtractPlugin({
                    filename: "[name].css",
                    chunkfilename: "[id].css"
                }),
                new ImageminPlugin({}),
            ],
            externals: {
                "react": "React",
                "react-dom": "ReactDOM",
                "react-dom/server": "ReactDOMServer",
                "lodash": "_"
            },
        };
    }

    setServerConfig(
        fromDir = "./server", entryTs = "server.ts", toDir = "./dist", toServerFile = "server.js",
        instanceName = "server", tsconfigDir = ".", tsconfigFile = "tsconfig.server.json"
    ) {
        const entryTsPath = path.resolve(__dirname, fromDir, entryTs);
        const outPath = path.resolve(__dirname, toDir);
        const tsconfigPath = path.resolve(__dirname, tsconfigDir, tsconfigFile);

        return {
            ...this.setModeResolve(),
            entry: [entryTsPath],
            output: {
                filename: toServerFile,
                path: outPath
            },
            module: {
                rules: [
                    ...this.setModuleRulesTypescript(instanceName, tsconfigPath),
                    {
                        test: /\.(jpe?g|png|gif|svg|pdf)$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    emitFile: false
                                }
                            }
                        ]
                    }
                ]
            },
            optimization: {
                minimizer: this.setOptMinimizerUglifyJs()
            },
            plugins: this.setCommonPlugins(tsconfigPath),
            target: "node",
            externals: [nodeExternals()],
            node: {
                __dirname: false
            }
        };
    }
}

module.exports = (env, argv) => {
    const webpackConfig = new WebpackConfig();
    const client = webpackConfig.setClientConfig(
        fromDir = "./client", entryTsx = "index.tsx", entryHtml = "index.html", toDir = "./dist/client",
        instanceName = "client", tsconfigDir = ".", tsconfigFile = "tsconfig.client.json"
    );
    const server = webpackConfig.setServerConfig(
        fromDir = "./server", entryTs = "server.ts", toDir = "./dist", toFile = "server.js",
        instanceName = "server", tsconfigDir = ".", tsconfigFile = "tsconfig.server.json"
    );

    if (argv["stack"] === "client") {
        return client;
    }
    else if (argv["stack"] === "server") {
        return server;
    }
    else {
        return [client, server];
    }
};