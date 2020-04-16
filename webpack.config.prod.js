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
const envkeys = require("./envkeys.config");
const fs = require("fs");
const dotenv = require("dotenv");

class WebpackConfig {

    constructor() {
        this.common = {
            envFilePath: path.resolve(__dirname, "./.env.dev"),
            babelConfigPath: path.resolve(__dirname, "babel.config.js"),
            nodeModulesPath: path.resolve(__dirname, "node_modules")
        };
    
        this.client = {
            instanceName: "client",
    
            htmlTitle: "MERN",
            faviconPath: path.resolve(__dirname, "./client/assets/png/titleImg.png"),
    
            entryTsPath: path.resolve(__dirname, "./client/index.tsx"),
            entryHtmlPath: path.resolve(__dirname, "./client/index.html"),
            allStylingPaths: path.resolve(__dirname, "./client/**/*.scss"),
            distPath: path.resolve(__dirname, "./dist/client"),
    
            coreJsPath: path.resolve(__dirname, "./node_modules", "core-js/stable"), // polyfill
            regenetorRuntimePath: path.resolve(__dirname, "./node_modules", "regenerator-runtime/runtime"), // polyfill
    
            tsconfigPath: path.resolve(__dirname, "./tsconfig.client.json"),
            postcssConfigPath: path.resolve(__dirname, "postcss.config.js"),
    
            homePagePath: path.resolve(__dirname, "./client/pages/home/HomePage.tsx")
        };

        this.server = {
            instanceName: "server",

            entryTsPath: path.resolve(__dirname, "./server/server.ts"),
            distPath: path.resolve(__dirname, "./dist"),

            tsconfigPath: path.resolve(__dirname, "./tsconfig.server.json"),

            toServerFile: "server.js"
        };
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
            test: /\.(jpe?g|png|gif|svg)$/,
            loader: "image-webpack-loader",
            enforce: "pre"
        };
    }

    setFileLoaderClient() {
        return {
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
        };
    }

    setFileLoaderServer() {
        return {
            test: /\.(jpe?g|png|gif|svg|pdf)$/,
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
            new webpack.EnvironmentPlugin(envkeys.ENV_KEYS) // For CI production process!!!
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
                    favicon: this.client.faviconPath,
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
