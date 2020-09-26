const path = require("path");

module.exports = Object.freeze({
    envFilePathDev: path.resolve(__dirname, "./.env.dev"),

    envFilePathProd: path.resolve(__dirname, "./.env"),

    common: {
        babelConfigPath: path.resolve(__dirname, "babel.config.js"),
        nodeModulesPath: path.resolve(__dirname, "node_modules")
    },

    client: {
        instanceName: "client",

        htmlTitle: "MERN-PWA",

        iconsSrcPath: path.resolve(__dirname, "./client/assets/icons"),
        iconsDistPath: path.resolve(__dirname, "./dist/client/assets/icons"),

        assetsPath: path.resolve(__dirname, "./clients/assets"),
        pngPath: path.posix.join(path.resolve(__dirname, "./client/assets/png").replace(/\\/g, "/"), "*.png"), // "*.png" is a glob pattern => should use forward-slashes "/"
        jpgPath: path.posix.join(path.resolve(__dirname, "./client/assets/jpg").replace(/\\/g, "/"), "*.jpg"),
        webpDestPath: path.resolve(__dirname, "./client/assets/webp"),

        entryTsPath: path.resolve(__dirname, "./client/index.tsx"),
        entryHtmlPath: path.resolve(__dirname, "./client/index.html"),
        manifestPwaPath: path.resolve(__dirname, "./client/manifest.json"),
        serviceWorkerPath: path.resolve(__dirname, "./client/sw.js"),
        offlineHtmlPath: path.resolve(__dirname, "./client/offline.html"),
        allStylingPaths: path.resolve(__dirname, "./client/**/*.scss"),
        distPath: path.resolve(__dirname, "./dist/client"),

        coreJsPath: path.resolve(__dirname, "./node_modules", "core-js/stable"), // polyfill
        regenetorRuntimePath: path.resolve(__dirname, "./node_modules", "regenerator-runtime/runtime"), // polyfill

        tsconfigPath: path.resolve(__dirname, "./tsconfig.client.json"),
        postcssConfigPath: path.resolve(__dirname, "postcss.config.js")
    },

    clientPages: {
        homePagePath: path.resolve(__dirname, "./client/pages/home/HomePage.tsx")
    },

    server: {
        instanceName: "server",

        entryTsPath: path.resolve(__dirname, "./server/server.ts"),
        distPath: path.resolve(__dirname, "./dist"),

        tsconfigPath: path.resolve(__dirname, "./tsconfig.server.json"),

        toServerFile: "server.js"
    }
});
