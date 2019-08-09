const VueLoaderPlugin = require('vue-loader/lib/plugin')
const fs = require('fs')
const path = require('path')

const appPath = path.join('src', 'apps')

const entries = fs.readdirSync(appPath)
  // .filter((file) => file.match(/.*\.js$/))
  .reduce((obj, dirName) => {
    // const entryKey = fileName.split('.').slice(0, -1).join('.')
    obj[dirName] = path.join('apps', dirName, 'index.js')
    return obj
  }, {})

module.exports = {
  mode: 'development',
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'static', 'components')
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.js', '.json', '.vue', '.css'],
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ]
      }

    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
          enforce: true
        }
      }
    }
  }
}
