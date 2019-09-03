const webpack = require("webpack"); // access built-in plugins
const glob = require("glob"); // sync all css files, no need to import css
const TerserPlugin = require("terser-webpack-plugin"); // minify js: ES6
const HtmlWebpackPlugin = require("html-webpack-plugin"); // to build from html template
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // to extract css into it own file
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // to use with transpileOnly in ts-loader
const nodeExternals = require("webpack-node-externals"); // for backend
const path = require("path");

class WebpackConfig {

    setModeResolve() {
        return {
            mode: "production",
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
            new TerserPlugin({
                cache: true,
                parallel: true,
                // sourceMap: true
            })
        ];
    }

    setCommonPlugins(tsconfigPath, tslintPath) {
        return [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HashedModuleIdsPlugin(), // so that file hashes dont change unexpectedly
            new MomentLocalesPlugin({
                localesToKeep: ["en", "en-ca"],
            }),
            new ForkTsCheckerWebpackPlugin({
                tsconfig: tsconfigPath,
                tslint: tslintPath,
                async: false, // check Typing first then build
                useTypescriptIncrementalApi: true,
                memoryLimit: 4096
            })
        ];
    }

    setClientConfig(
        fromDir = "./client", entryTs = "index.tsx", entryHtml = "index.html", toDir = "./dist/client",
        instanceName = "client", tsconfigDir = ".", tsconfigFile = "tsconfig.client.json",
        tslintDir = ".", tslintFile = "tslint.json"
    ) {
        const entryTsPath = path.resolve(__dirname, fromDir, entryTs);
        const entryHtmlPath = path.resolve(__dirname, fromDir, entryHtml);
        const allStyles = path.resolve(__dirname, fromDir, "**", "*.scss");
        const outPath = path.resolve(__dirname, toDir);
        const tsconfigPath = path.resolve(__dirname, tsconfigDir, tsconfigFile);
        const tslintPath = path.resolve(__dirname, tslintDir, tslintFile);

        return {
            ...this.setModeResolve(),
            entry: {
                main: [entryTsPath].concat(glob.sync(allStyles)),
                pageIntro: path.resolve(__dirname, fromDir, "./pages/intro/IntroPage.tsx")
            },
            output: {
                filename: "[name].[contenthash:8].js",
                path: outPath
            },
            module: {
                rules: [
                    ...this.setModuleRulesTypescript(instanceName, tsconfigPath),
                    {
                        test: /\.scss$/,
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
                            }
                        ]
                    },
                    {
                        test: /\.(jpe?g|png|gif|svg|pdf)$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    name: "[hash]/[name].[ext]",
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
                ],
                runtimeChunk: "single",
                splitChunks: {
                    chunks: "all",
                    maxInitialRequests: Infinity,
                    minSize: 0,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // get the name. E.g. node_modules/packageName/not/this/part.js
                                // or node_modules/packageName
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                                // npm package names are URL-safe, but some servers don"t like @ symbols
                                return `npm.${packageName.replace("@", "")}`;
                            }
                        }
                    }
                }
            },
            plugins: [
                ...this.setCommonPlugins(tsconfigPath, tslintPath),
                new HtmlWebpackPlugin({
                    template: entryHtmlPath,
                    hash: true,
                    inject: true,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                    }
                }),
                new MiniCssExtractPlugin({
                    filename: "[name].[hash].css",
                    chunkfilename: "[id].[hash].css"
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
        instanceName = "server", tsconfigDir = ".", tsconfigFile = "tsconfig.server.json",
        tslintDir = ".", tslintFile = "tslint.json"
    ) {
        const entryTsPath = path.resolve(__dirname, fromDir, entryTs);
        const outPath = path.resolve(__dirname, toDir);
        const tsconfigPath = path.resolve(__dirname, tsconfigDir, tsconfigFile);
        const tslintPath = path.resolve(__dirname, tslintDir, tslintFile);

        return {
            ...this.setModeResolve(),
            entry: entryTsPath,
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
                    },
                ]
            },
            optimization: {
                minimizer: this.setOptMinimizerUglifyJs()
            },
            plugins: this.setCommonPlugins(tsconfigPath, tslintPath),
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
        instanceName = "client", tsconfigDir = "./client", tsconfigFile = "tsconfig.json",
        tslintDir = ".", tslintFile = "tslint.json"
    );
    const server = webpackConfig.setServerConfig(
        fromDir = "./server", entryTs = "server.ts", toDir = "./dist", toServerFile = "server.js",
        instanceName = "server", tsconfigDir = "./server", tsconfigFile = "tsconfig.json",
        tslintDir = ".", tslintFile = "tslint.json"
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