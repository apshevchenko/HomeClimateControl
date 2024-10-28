const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.jsx', // Основной файл входа
    output: {
        path: path.resolve(__dirname, 'build'), // Папка для сборки
        filename: '[name].[contenthash].js', // Скомпилированный JS-файл Используем имя чанка и хеш контента для уникальных имен файлов
        clean: true, // Очищаем папку dist перед сборкой
    },
    devtool: "inline-source-map",
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
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
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all', // Разделяет код всех типов
        }
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: true,
        port: 3000,
        hot: true
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
};
