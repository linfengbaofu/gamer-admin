"use strict";
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const CompressionPlugin = require("compression-webpack-plugin");

const name = process.env.VUE_APP_TITLE || "Game ADMIN 后台管理系统"; // 网页标题

const port = process.env.port || process.env.npm_config_port || 80; // 端口
const timeStamp = new Date().getTime();

// vue.config.js 配置说明
// 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  // 部署生产环境和开发环境下的URL。
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  // 打包输出目录
  outputDir: "dist",
  // 用于放置生成的静态资源 (js、css、img、fonts) 的文件夹
  assetsDir: "static",
  // 是否开启eslint保存检测
  lintOnSave: process.env.NODE_ENV === "development",
  // 如果不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  transpileDependencies: ["quill"],

  // webpack-dev-server 配置
  devServer: {
    hot: true, // 确保启用热重载
    host: "0.0.0.0",
    port: port,
    open: true,
    // proxy: {
    //   [process.env.VUE_APP_BASE_API]: {
    //     // target: 'http://192.168.31.53:8577',
    //     // target: 'https://t52u49l.nat.ipyingshe.com',
    //     target: 'https://qiuqiutestaesda.xyz/prod-api',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ["^" + process.env.VUE_APP_BASE_API]: "",
    //     },
    //   },
    // },
    disableHostCheck: true,
  },

  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: "expanded" },
      },
    },
  },

  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"), // 设置路径别名
      },
    },
    output: {
      filename: `js/[name].${timeStamp}.js`, // 保持主文件使用 contenthash
      chunkFilename: `js/[name].${timeStamp}.js`, // chunk 文件使用 hash
    },
    plugins: [
      process.env.NODE_ENV === "production" &&
        new CompressionPlugin({
          cache: false, // 禁用缓存
          test: /\.(js|css|html|jpe?g|png|gif|svg)?$/i,
          filename: `js/[name].${timeStamp}.js`, // 保留此配置项
          algorithm: "gzip", // 使用gzip算法
          minRatio: 0.8,
          deleteOriginalAssets: false, // 保留原始文件
        }),
    ].filter(Boolean), // 过滤掉 false 值，避免插件报错
  },

  chainWebpack(config) {
    config.plugins.delete("preload"); // 删除 preload 插件
    config.plugins.delete("prefetch"); // 删除 prefetch 插件

    // 设置 svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/assets/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // 针对生产环境的配置
    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            inline: /runtime\..*\.js$/, // 将 runtime 文件内联
          },
        ])
        .end();

      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // 仅打包初始依赖的第三方库
          },
          elementUI: {
            name: "chunk-elementUI",
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // 针对 element-ui 库进行单独打包
            priority: 20,
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // 针对 common 组件打包
            minChunks: 3, // 3次及以上引用的组件会被打包到这个 chunk 中
            priority: 5,
            reuseExistingChunk: true, // 重用已有的 chunk
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
  },
};
