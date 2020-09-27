const webpack = require("webpack"); // access built-in plugins
const glob = require("glob"); // sync all css files, no need to import css
const TerserPlugin = require("terser-webpack-plugin"); // minify js: ES6
const HtmlWebpackPlugin = require("html-webpack-plugin"); // to build from html template
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // to extract css into it own file
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // to use with transpileOnly in ts-loader
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const nodeExternals = require("webpack-node-externals"); // for backend
const fs = require("fs");
const dotenv = require("dotenv");
const webpackConstants = require("./webpack.config.const");

/*
* Custom plugin to trigger a compile when
* saving files outside the bundle
*/
class WatchExternalFilesPlugin {
    constructor(files = []) {
        this.files = files;
    }
    // Define `apply` as its prototype method which is supplied with compiler as its argument
    apply(compiler) {
        if (this.files.length === 0) return;
        // Specify the event hook to attach to
        compiler.plugin("after-compile", (compilation, callback) => {
            this.files.forEach(path => compilation.contextDependencies.add(path));
            callback();
        });
    }
}


class WebpackConfig {

    constructor() {
        this.common = { envFilePath: webpackConstants.envFilePathDev, ...webpackConstants.common };
        this.client = webpackConstants.client;
        this.server = webpackConstants.server;
    }

    setModeResolve() {
        return {
            mode: "development",
            devtool: "source-map",
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"],
                modules: [this.common.nodeModulesPath]
            },
        };
    }

    setTranspilationLoader() {
        return {
            test: /\.(ts|js)x?$/,
            exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
            loader: "babel-loader",
            options: {
                rootMode: "upward",
                configFile: this.common.babelConfigPath,
                cacheDirectory: true
            }
        };
    }

    setJavascriptSourceMapLoader() {
        return {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        };
    }

    setStyleLoader(forBuild = false) {
        const result = {
            test: /\.s?css$/,
            exclude: /node_modules/,
            use: [
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
                {
                    loader: "postcss-loader",
                    options: {
                        config: {
                            path: this.client.postcssConfigPath
                        }
                    },
                },
            ]
        };
        if (forBuild) {
            result.use = [MiniCssExtractPlugin.loader, ...result.use];
        }
        else { // watch-mode: want HMR for style: need style-loader
            result.use = ["style-loader", ...result.use];
        }
        return result;
    }

    setImageLoader() {
        return {
            test: webpackConstants.client.imagesExts,
            use: [
                {
                    loader: "image-webpack-loader",
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: [0.65, 0.90],
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        webp: {
                            quality: 75
                        }
                    }
                }
            ],
            enforce: "pre"
        };
    }

    setFileLoaderClient() {
        return {
            test: webpackConstants.client.assetsExts,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "assets"
                    }
                }
            ]
        };
    }

    setFileLoaderServer() {
        return {
            test: webpackConstants.server.assetsExts,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        emitFile: false
                    }
                }
            ]
        };
    }

    setOptMinimizerUglifyJs() {
        return new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        });
    }

    setCommonPlugins(tsconfigPath, forBuildServerOnceToWatch = false) {
        let base = [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new MomentLocalesPlugin({
                localesToKeep: ["en", "en-ca"],
            }),
            new webpack.HotModuleReplacementPlugin()
        ];

        if (fs.existsSync(this.common.envFilePath)) {
            const fromDotEnv = new webpack.DefinePlugin({
                "process.env": JSON.stringify(dotenv.config({ path: this.common.envFilePath }).parsed)
            });
            base = [...base, fromDotEnv];
        }
        else {
            console.error(`Development Environment: ${this.common.envFilePath} file is not provided! => Provide the file!`);
            process.exit(1);
        }

        if (forBuildServerOnceToWatch) {
            return base;
        }
        else {
            return [
                ...base,
                new ForkTsCheckerWebpackPlugin({
                    eslint: true,
                    tsconfig: tsconfigPath
                }),
                new ForkTsCheckerNotifierWebpackPlugin({
                    title: "TypeScript",
                    excludeWarnings: false
                }),
            ];
        }
    }

    setDevServer() {
        return {
            open: true,
            port: 8000,
            hot: true,
            // contentBase: this.client.srcPath,
            // watchContentBase: true, // watch the static shell html
            compress: true,
            historyApiFallback: true,
            clientLogLevel: "info", // debug, trace, silent, warn, error
            stats: "minimal", // errors-only, errors-warnings
            watchOptions: {
                ignored: ["node_modules/**"]
            },
            proxy: [
                {
                    context: ["/api/**"],
                    target: "http://localhost:3000"
                }
            ]
        };
    }

    setClientConfig(forBuild = false) {
        const manifest = require(this.client.manifestPwaPath);
        return {
            name: this.client.instanceName,
            target: "web",
            ...this.setModeResolve(),
            entry: [
                this.client.coreJsPath, this.client.regenetorRuntimePath,
                this.client.entryTsPath
            ].concat(glob.sync(this.client.allStylingPaths)),
            output: {
                filename: "[name].js",
                path: this.client.distPath,
                publicPath: "/" // (this + historyApiFallBack) fix client-side routing in dev mode
            },
            devServer: this.setDevServer(),
            module: {
                rules: [
                    this.setJavascriptSourceMapLoader(),
                    this.setTranspilationLoader(),
                    this.setStyleLoader(forBuild),
                    this.setFileLoaderClient(),
                    this.setImageLoader()
                ]
            },
            optimization: {
                minimizer: [
                    this.setOptMinimizerUglifyJs(),
                    new OptimizeCSSAssetsPlugin({})
                ]
            },
            plugins: [
                ...this.setCommonPlugins(this.client.tsconfigPath),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: this.client.entryHtmlPath,
                    title: this.client.htmlTitle,
                    meta: {
                        "viewport": "width=device-width, initial-scale=1",
                        "theme-color": manifest["theme_color"],
                        "description": manifest["description"],
                        // iOS
                        "mobile-web-app-capable": "yes",
                        "mobile-web-app-status-bar-style": "default", // or black
                        "mobile-web-app-title": this.client.htmlTitle
                    }
                }),
                new CopyWebpackPlugin({
                    patterns: [
                        this.client.manifestPwaPath,
                        this.client.serviceWorkerPath,
                        this.client.offlineHtmlPath,
                        {
                            from: this.client.iconsSrcPath,
                            to: this.client.iconsDistPath
                        }
                    ],
                }),
                new MiniCssExtractPlugin({
                    filename: "[name].css",
                    chunkfilename: "[id].css"
                }),
                new ImageminPlugin({}),
                new WatchExternalFilesPlugin(["./client"])
            ],
            // externals: {
            //     "react": "React",
            //     "react-dom": "ReactDOM",
            //     "react-dom/server": "ReactDOMServer",
            //     "lodash": "_"
            // },
        };
    }

    setServerConfig(forBuildServerOnceToWatch = false) {
        return {
            name: this.server.instanceName,
            target: "node",
            ...this.setModeResolve(),
            entry: ["webpack/hot/poll?1000", this.server.entryTsPath],
            output: {
                filename: this.server.toServerFile,
                path: this.server.distPath,
            },
            module: {
                rules: [
                    this.setJavascriptSourceMapLoader(),
                    this.setTranspilationLoader(),
                    this.setFileLoaderServer()
                ]
            },
            optimization: {
                minimizer: [this.setOptMinimizerUglifyJs()]
            },
            plugins: [
                ...this.setCommonPlugins(this.server.tsconfigPath, forBuildServerOnceToWatch),
                new WatchExternalFilesPlugin(["./server"])
            ],
            externals: [
                nodeExternals({
                    whitelist: ["webpack/hot/poll?1000"]
                })
            ],
            node: {
                // console: false,
                // globale: false,
                // process: false,
                // Buffer: false,
                __filename: false,
                __dirname: false
            }
        };
    }
}

module.exports = (env, argv) => {
    const webpackConfig = new WebpackConfig();

    switch (argv["stack"]) {
        case "client":
            return webpackConfig.setClientConfig(forBuild = false);
        case "server":
            return webpackConfig.setServerConfig(forBuildServerOnceToWatch = false);
        case "server-build-once":
            return webpackConfig.setServerConfig(forBuildServerOnceToWatch = true);
        default:
            const client = webpackConfig.setClientConfig(forBuild = true);
            const server = webpackConfig.setServerConfig(forBuildServerOnceToWatch = false);
            return [client, server];
    }
};
