// const webpack = require("webpack"); // access built-in plugins
const glob = require("glob"); // sync all css files, no need to import css
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // to minize js file
const HtmlWebpackPlugin = require("html-webpack-plugin"); // to build from html template
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // to extract css into it own file
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default

let plugins = [
    new HtmlWebpackPlugin({
        template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
        chunkfilename: "[id].[hash].css"
    }),
    new ImageminPlugin({})
];

module.exports = {
    entry: ["./src/index.tsx"].concat(glob.sync("./src/**/*.scss")),
    output: {
        filename: "[name].[contenthash].js",
        path: `${__dirname}/dist`
    },
    
    devServer: {
        contentBase: "./dist",
        historyApiFallback: true
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
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
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },

    plugins: plugins
};