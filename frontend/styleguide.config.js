module.exports = {
  components: 'src/pages/**/*.js',
  sections: [
    {
      name: 'Components',
      components: 'src/pages/**/*.js',
      // Filtrare i componenti che non contengono "Autocomplete" nel nome
      ignore: ['**/Autocomplete.js']
    }
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
              },
            },
          ],
        }
      ]
    }
  }
};
