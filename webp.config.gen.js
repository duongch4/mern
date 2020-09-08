const Imagein = require("imagemin");
const ImageminWebp = require("imagemin-webp");
const webpackConstants = require("./webpack.config.const");

const getWebp = async () => {
    await Imagein([webpackConstants.client.pngPath], {
        destination: webpackConstants.client.webpDestPath,
        plugins: [ImageminWebp({ lossless: true })],
    });

    await Imagein([webpackConstants.client.jpgPath], {
        destination: webpackConstants.client.webpDestPath,
        plugins: [ImageminWebp({ quality: 65 })],
    });
};

getWebp();
