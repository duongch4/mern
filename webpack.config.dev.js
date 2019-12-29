const webpack = require("webpack"); // access built-in plugins
const glob = require("glob"); // sync all css files, no need to import css
const TerserPlugin = require("terser-webpack-plugin"); // minify js: ES6
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
                extensions: [".ts", ".tsx", ".js", ".json"],
                modules: [path.resolve(__dirname, "node_modules")]
            },
        };
    }

    setTranspilationLoader() {
        return {
            test: /\.(ts|js)x?$/,
            loader: "babel-loader",
            options: {
                babelrc: true,
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
        let result = {
            test: /\.s?css$/,
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
                        name: "[name].[ext]",
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
            sourceMap: true
        });
    }

    setCommonPlugins(tsconfigPath, tslintPath) {
        return [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new MomentLocalesPlugin({
                localesToKeep: ["en", "en-ca"],
            }),
            // new ForkTsCheckerWebpackPlugin({
            //     tsconfig: tsconfigPath,
            //     tslint: tslintPath,
            //     // eslint: true,
            //     // eslintOptions: {
            //     //     configFile: eslintrcPath
            //     // },
            //     useTypescriptIncrementalApi: true
            // }),
            new ForkTsCheckerWebpackPlugin(),
            new ForkTsCheckerNotifierWebpackPlugin({
                title: "TypeScript",
                excludeWarnings: false
            }),
            new webpack.HotModuleReplacementPlugin()
        ];
    }

    setDevServer(outPath) {
        return {
            open: true,
            port: 8000,
            hot: true,
            contentBase: outPath,
            // watchContentBase: true, // watch the static shell html
            compress: true,
            historyApiFallback: true,
            clientLogLevel: "info", // debug, trace, silent, warn, error
            stats: "minimal", // errors-only, errors-warnings
            proxy: [
                {
                    context: ["/api/*"],
                    target: "http://localhost:3000"
                }
            ]
        };
    }

    setClientConfig(
        fromDir = "./client", entryTs = "index.tsx", entryHtml = "index.html", toDir = "./dist/client",
        instanceName = "client", tsconfigDir = "./client", tsconfigFile = "tsconfig.client.json",
        tslintDir = ".", tslintFile = "tslint.json", forBuild = false,
        htmlTitle = "MERN", faviconPath = "./client/assets/png/titleImg.png"
    ) {
        const entryTsPath = path.resolve(__dirname, fromDir, entryTs);
        const entryHtmlPath = path.resolve(__dirname, fromDir, entryHtml);
        const allStyles = path.resolve(__dirname, fromDir, "**", "*.scss");
        const outPath = path.resolve(__dirname, toDir);
        const tsconfigPath = path.resolve(__dirname, tsconfigDir, tsconfigFile);
        const tslintPath = path.resolve(__dirname, tslintDir, tslintFile);

        return {
            name: instanceName,
            target: "web",
            ...this.setModeResolve(),
            entry: [entryTsPath].concat(glob.sync(allStyles)),
            output: {
                filename: "[name].js",
                path: outPath,
                publicPath: "/" // (this + historyApiFallBack) fix client-side routing in dev mode
            },
            devServer: this.setDevServer(outPath),
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
                ...this.setCommonPlugins(tsconfigPath, tslintPath),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: entryHtmlPath,
                    title: htmlTitle,
                    favicon: faviconPath
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
        instanceName = "server", tsconfigDir = "./server", tsconfigFile = "tsconfig.server.json",
        tslintDir = "./server", tslintFile = ".eslintrc.js"
    ) {
        const entryTsPath = path.resolve(__dirname, fromDir, entryTs);
        const outPath = path.resolve(__dirname, toDir);
        const tsconfigPath = path.resolve(__dirname, tsconfigDir, tsconfigFile);
        const tslintPath = path.resolve(__dirname, tslintDir, tslintFile);

        return {
            name: instanceName,
            target: "node",
            ...this.setModeResolve(),
            entry: ["webpack/hot/poll?1000", entryTsPath],
            output: {
                filename: toServerFile,
                path: outPath,
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
            plugins: this.setCommonPlugins(tsconfigPath, tslintPath),
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

    if (argv["stack"] === "client") {
        const client = webpackConfig.setClientConfig(
            fromDir = "./client", entryTsx = "index.tsx", entryHtml = "index.html", toDir = "./dist/client",
            instanceName = "client", tsconfigDir = "./client", tsconfigFile = "tsconfig.json",
            tslintDir = ".", tslintFile = "tslint.json", forBuild = false, htmlTitle = "MERN", faviconPath = "./client/assets/png/titleImg.png"
        );
        return client;
    }
    else if (argv["stack"] === "server") {
        const server = webpackConfig.setServerConfig(
            fromDir = "./server", entryTs = "server.ts", toDir = "./dist", toFile = "server.js",
            instanceName = "server", tsconfigDir = "./server", tsconfigFile = "tsconfig.json",
            tslintDir = ".", tslintFile = "tslint.json"
        );
        return server;
    }
    else { // for build
        const client = webpackConfig.setClientConfig(
            fromDir = "./client", entryTsx = "index.tsx", entryHtml = "index.html", toDir = "./dist/client",
            instanceName = "client", tsconfigDir = "./client", tsconfigFile = "tsconfig.json",
            tslintDir = ".", tslintFile = "tslint.json", forBuild = true, htmlTitle = "MERN", faviconPath = "./client/assets/png/titleImg.png"
        );
        const server = webpackConfig.setServerConfig(
            fromDir = "./server", entryTs = "server.ts", toDir = "./dist", toFile = "server.js",
            instanceName = "server", tsconfigDir = "./server", tsconfigFile = "tsconfig.json",
            tslintDir = ".", tslintFile = "tslint.json"
        );
        return [client, server];
    }
};