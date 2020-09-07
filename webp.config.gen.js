const Imagein = require("imagemin");
const ImageminWebp = require("imagemin-webp");
const webpackConstants = require("./webpack.config.const");

const getWebp = async () => {
    await Imagein([webpackConstants.client.pngPath.split("\\").join("/")], {
        destination: webpackConstants.client.webpDestPath,
        plugins: [ImageminWebp({ lossless: true })],
    });

    await Imagein([webpackConstants.client.jpgPath.split("\\").join("/")], {
        destination: webpackConstants.client.webpDestPath,
        plugins: [ImageminWebp({ quality: 65 })],
    });
};

getWebp();
