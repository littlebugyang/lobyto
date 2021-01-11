const webpack = require("webpack")

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    runtimeCompiler: true,
    devServer: {
        proxy: {
            "^/api/": {
                target: "http://localhost:4000",
                pathRewrite: {"^/api/": "/"},
                changeOrigin: true,
                logLevel: "debug"
            }
        }
    },
    configureWebpack: {
        // Set up all the aliases we use in our app.
        plugins: [
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 6
            })
        ]
    },
    pwa: {
        name: "Vue Argon Design",
        themeColor: "#172b4d",
        msTileColor: "#172b4d",
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "#172b4d"
    },
    css: {
        // Enable CSS source maps.
        sourceMap: process.env.NODE_ENV !== "production"
    }
}
