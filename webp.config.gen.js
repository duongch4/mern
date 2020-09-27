const Imagemin = require("imagemin");
const ImageminWebp = require("imagemin-webp");
const webpackConstants = require("./webpack.config.const");

const getWebp = async () => {
    await Imagemin([webpackConstants.client.pngPath], {
        destination: webpackConstants.client.webpDestPath,
        plugins: [ImageminWebp({ lossless: true })],
    });

    await Imagemin([webpackConstants.client.jpgPath], {
        destination: webpackConstants.client.webpDestPath,
        plugins: [ImageminWebp({ quality: 65 })],
    });
};

getWebp();
