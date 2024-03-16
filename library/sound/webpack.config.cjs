const path = require('path');  //ruta que trae node de fabrica
const HtmlWebpackPlugin = require('html-webpack-plugin') //es para poder mostrar los html y hay que instalarlo npm i html-webpack-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //esto es para separar los css en otro bundle separado del principal

module.exports = (_, argv)=>({
    entry: './index.js',
    output: {
        filename: '[name].bundle.js', //donde extraer el archivo y se pone [] por si tenemos multiples nombres
        path: path.resolve(__dirname, 'dist'),  //decimos que el directorio dist es donde quiero que me mandes el output es decir los bundle.js
        
    },
    experiments:{ //para que lo exporte como si fuera un modulo
        outputModule:true
    },
    devServer:{  //configuracion de mostrado
        port: 3000,
        historyApiFallback: true
    },
    devtool: argv.mode === 'development' ? 'source-map' : false, //para generar el map si estas en modo development
    module: {
        rules: [
            {                               //esto siempre hay que ponerlo en las reglas de modulos
                test: /\.m?js$/,
                exclude: /node_modules/,
                type: 'javascript/auto',
                resolve: {
                    fullySpecified: false
                },
            },
            {
                test: /\.(ts|tsx|js|mjs|jsx)$/,     //empezamos reglas babel para cada archivo
                exclude: /node_modules/,
                use: ['babel-loader'] //todos los archivos con esa extension van a usar babel-loader que hay que instalarlo babel en npm @babel
            },
            {
                test: /\.css|s[ac]|ss$/i,     //empezamos reglas babel para cada css y sass
                exclude: /node_modules/,
                use: [argv.mode=== "development" ? 'style-loader' : MiniCssExtractPlugin.loader,'css-loader', 'sass-loader'] //todos los archivos con esa extension van a usar lo que hay en el array y hay que instalarlos
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|wav|mp4|webm|mp3)$/i,   //esto pone las fuentes audios videos en otro bundle
                exclude: /node_modules/, 
                type: 'asset/resource',
                generator:{                 //los genera en assets/nombre mas la extension que tenga
                    filename:'assets/[name][ext]'
                }
            },
            {
                test: /\.html$/i,           //para los html instalamos html louder
                exclude: /node_modules/,
                use:['html-loader'] 
            },
            {
                test: /\.(json)$/i, 
                exclude: /node_modules/, 
                type: 'asset/resource',
                generator:{                 //los genera en la raiz mas la extension que tenga
                    filename:'./[name][ext]'
                }
            },

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({  //creamos la configuracion de htmlwebpack
            template: './index.html',   //le decimos la plantilla que tiene que coger
            filename:'./index.html',
            scriptLoading: 'module',   //decimos que nos lo ejecute como modulo el html pone el type=module
        }),
        new MiniCssExtractPlugin({ //tenemos que ponerlo en el use de los css
            filename: '[name].css'
        })
    ]

})