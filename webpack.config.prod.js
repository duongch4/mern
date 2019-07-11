const webpack = require("webpack"); // access built-in plugins
const glob = require("glob"); // sync all css files, no need to import css
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // to minize js file
const HtmlWebpackPlugin = require("html-webpack-plugin"); // to build from html template
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // to extract css into it own file
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // to use with transpileOnly in ts-loader
const nodeExternals = require("webpack-node-externals"); // for backend


const common = {
    mode: "production",
    // devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
};

const commonModuleRules = [
    {
        test: /\.tsx?$/,
        use: [
            {
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                }
            }
        ]
    },
    {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
    }
];

const commonOptMinimizer = () => {
    return [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        })
    ];
};

const commonPlugins = () => {
    return [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ForkTsCheckerWebpackPlugin({
            async: false, // check Typing first then build
            useTypescriptIncrementalApi: true,
            memoryLimit: 4096
        }),
    ];
};

const frontend = {
    entry: ["./frontend/index.tsx"].concat(glob.sync("./frontend/**/*.scss")),
    output: {
        filename: "[name].[contenthash].js",
        path: `${__dirname}/dist/frontend`
    },
    devServer: {
        clientLogLevel: "warning",
        open: true,
        contentBase: "./dist/frontend",
        historyApiFallback: true,
        stats: "errors-only"
    },
    module: {
        rules: [
            ...commonModuleRules,
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
                test: /\.(png|jpg|gif|pdf|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[hash]/[name].[ext]",
                            outputPath: "assets"
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            ...commonOptMinimizer(),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./frontend/index.html",
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
        ...commonPlugins()
    ],
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};

const backend = {
    entry: ["./src/server.ts"],
    output: {
        filename: "server.js",
        path: `${__dirname}/dist`
    },
    module: {
        rules: commonModuleRules
    },
    optimization: {
        minimizer: commonOptMinimizer()
    },
    plugins: commonPlugins(),
    target: "node",
    externals: [nodeExternals()],
    node: {
        __dirname: false
    }
};

module.exports = (env, argv) => {
    if (argv["stack"] === "frontend") {
        return Object.assign({}, common, frontend);
    }
    else if (argv["stack"] === "backend") {
        return Object.assign({}, common, backend);
    }
    else {
        return [
            Object.assign({}, common, frontend),
            Object.assign({}, common, backend),
        ];
    }
};