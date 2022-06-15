const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.tsx?$/,
                use: ["ts-loader", "source-map-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader", "css-loader"
                ],
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        library: {
            name: 'UbiiPEEvaluation',
            type: 'umd',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "src/index.html",
            inject: false
        }),
    ],
};
