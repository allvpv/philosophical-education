module.exports = (config, webpack) => {
  config.module.rules.push({
    test: /\.s[ac]ss$/i,
    use: [
      "style-loader", // Creates `style` nodes from JS strings
      "css-loader",  // Translates CSS into CommonJS
      "sass-loader", // Compiles Sass to CSS
    ],
  });

  config.optimization.minimize = false;
  config.stats = 'summary';

  return config;
};
