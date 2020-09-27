const webpack = require("webpack"); // access built-in plugins
const glob = require("glob"); // sync all css files, no need to import css
const TerserPlugin = require("terser-webpack-plugin"); // minify js: ES6
const HtmlWebpackPlugin = require("html-webpack-plugin"); // to build from html template
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // to extract css into it own file
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const CompressionPlugin = require("compression-webpack-plugin");
const zopfli = require('@gfx/zopfli');
const zlib = require("zlib");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // to use with transpileOnly in ts-loader
const nodeExternals = require("webpack-node-externals"); // for backend
const envkeys = require("./envkeys.config");
const fs = require("fs");
const dotenv = require("dotenv");
const webpackConstants = require("./webpack.config.const");

class WebpackConfig {

    constructor() {
        this.common = { envFilePath: webpackConstants.envFilePathProd, ...webpackConstants.common };
        this.client = { ...webpackConstants.client, ...webpackConstants.clientPages };
        this.server = webpackConstants.server;
    }

    setModeResolve() {
        return {
            mode: "production",
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

    setStyleLoader() {
        return {
            test: /\.s?css$/,
            exclude: /node_modules/,
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
                        name: "[contenthash:8]/[name].[ext]",
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
            // sourceMap: true
        });
    }

    setCompressionPlugin() {
        return [
            // "Zopfli" output better .gz than "gzip"
            new CompressionPlugin({
                // The images are probably already compressed by image-webpack-loader and imagein-webpack-plugin
                test: webpackConstants.common.compressionExts,
                compressionOptions: {
                    numiterations: 15,
                },
                algorithm(input, compressionOptions, callback) {
                    return zopfli.gzip(input, compressionOptions, callback);
                },
                threshold: 1000,
                // Compress all assets, including files with `0` bytes size
                minRatio: Infinity
            }),
            new CompressionPlugin({
                filename: "[path][base].br",
                algorithm: "brotliCompress",
                test: webpackConstants.common.compressionExts,
                compressionOptions: {
                    level: 11, // zlib’s `level` option matches Brotli’s `BROTLI_PARAM_QUALITY` option.
                },
                threshold: 1000,
                // Compress all assets, including files with `0` bytes size
                minRatio: Infinity
            }),
        ];
    }

    setCommonPlugins(tsconfigPath) {
        const plugins = [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HashedModuleIdsPlugin(), // so that file hashes dont change unexpectedly
            new MomentLocalesPlugin({
                localesToKeep: ["en", "en-ca"],
            }),
            new ForkTsCheckerWebpackPlugin({
                eslint: true,
                tsconfig: tsconfigPath,
                async: false, // check type/lint first then build
                // workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE // recommended - leave two CPUs free (one for build, one for system)
            }),
            new webpack.EnvironmentPlugin(envkeys.ENV_KEYS), // For CI production process!!!
            ...this.setCompressionPlugin()
        ];
        if (fs.existsSync(this.common.envFilePath)) {
            const fromDotEnv = new webpack.DefinePlugin({
                "process.env": JSON.stringify(dotenv.config({ path: this.common.envFilePath }).parsed)
            });
            return [...plugins, fromDotEnv];
        }
        return plugins;
    }

    setClientConfig() {
        const manifest = require(this.client.manifestPwaPath);
        return {
            name: this.client.instanceName,
            target: "web",
            ...this.setModeResolve(),
            entry: {
                main: [
                    this.client.coreJsPath, this.client.regenetorRuntimePath,
                    this.client.entryTsPath
                ].concat(glob.sync(this.client.allStylingPaths)),
                homePage: this.client.homePagePath
            },
            output: {
                filename: "[name].[contenthash:8].js",
                path: this.client.distPath,
                publicPath: "/" // (this + app.get("/*", ...)) fix client-side routing in prod mode
            },
            module: {
                rules: [
                    this.setJavascriptSourceMapLoader(),
                    this.setTranspilationLoader(),
                    this.setStyleLoader(),
                    this.setFileLoaderClient(),
                    this.setImageLoader()
                ]
            },
            optimization: {
                minimizer: [
                    this.setOptMinimizerUglifyJs(),
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
                    },
                    hash: true,
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
                    filename: "[name].[contenthash:8].css",
                    chunkfilename: "[id].[contenthash:8].css"
                }),
                new ImageminPlugin({}),
            ],
            // externals: {
            //     "react": "React",
            //     "react-dom": "ReactDOM",
            //     "react-dom/server": "ReactDOMServer",
            //     "lodash": "_"
            // },
        };
    }

    setServerConfig() {
        return {
            name: this.server.instanceName,
            target: "node",
            ...this.setModeResolve(),
            entry: [this.server.entryTsPath],
            output: {
                filename: this.server.toServerFile,
                path: this.server.distPath
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
            plugins: this.setCommonPlugins(this.server.tsconfigPath),
            externals: [nodeExternals()],
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

module.exports = () => {
    const webpackConfig = new WebpackConfig();
    const client = webpackConfig.setClientConfig();
    const server = webpackConfig.setServerConfig()
    return [client, server];
};
