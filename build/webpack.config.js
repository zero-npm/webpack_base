//引入核心内置模块path,用户获取文件路径等
const path = require("path")
//清除上次打包文件插件
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
//自动引入js到相应html文件插件
const HtmlWebpackPlugin = require("html-webpack-plugin")
//从js抽离出css问单独文件插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


//导出配置信息
module.exports = {
    /**
     * 设置模式：
     * development开发环境
     * production生产模式 
     * 默认值为production 
     * 也可以设置为none
     * */
    mode:'development',
    /**
     * 设置入口文件路径
     * path.resolve()由相对路径计算出绝对路径
     * __dirname是当前模块的目录名
     * */
    // entry:path.resolve(__dirname,'../src/main.js'),
    entry:{
        main:["@babel/polyfill",path.resolve(__dirname,'../src/main.js')],
        other:["@babel/polyfill",path.resolve(__dirname,'../src/other.js')]
    },
    /**
     * 设置输出信息
     */
    output:{
        //输出文件名
        filename:"[name].[hash:8].js",
        //输出文件路径
        path:path.resolve(__dirname,"../dist")
    },
    plugins:[
      
        new HtmlWebpackPlugin({
            //设置模板
            template:path.resolve(__dirname,'../public/index.html'),
            filename:'index.html',
            chunks:['main']
        }),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,"../public/other.html"),
            filename:'other.html',
            chunks:['other']
        }),
        new CleanWebpackPlugin(),
        //从js中分离出css
        new MiniCssExtractPlugin({
            filename:'[name].[hash:8].css',
            chunkFilename: "[id].css",
        }),
        
    ],
    module:{
        //配置模块规则
        rules:[
            {
                //正则匹配所有.css结尾的文件
                test:/\.css$/i,
                //匹配到之后使用的loader,从有向左解析
                use:[MiniCssExtractPlugin.loader,'css-loader','postcss-loader']
            },
            {
                test:/\.less$/i,
                use:[MiniCssExtractPlugin.loader,'css-loader','postcss-loader','less-loader']
            },
            //处理图片
            {
                //正则匹配图片格式
                test:/\.(jpe?g|png|gif)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            //限制文件大小
                            limit:10240,
                            //超出上面限制之后使用的loader
                            name:'image/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            //处理媒体文件
            {
                test:/\.(mp4|webm|ogg|mp3|wav|flac|acc)(\?.*)?$/i,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:10240,
                            fallback:{
                                loader:'file-loader',
                                options:{
                                    name:'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            //处理字体文件
            {
                test:/\.(woff2|eot|ttf|otf)(\?.*)?$/i,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:10240,
                            fallback:{
                                loader:'file-loader',
                                options:{
                                    name:'midia/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            //处理js语法浏览器兼容问题
            {
                test:'/\.js$/',
                use:{
                    loader:'bable-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                },
                //排除依赖下的js
                exclude:/node_modules/
            }
            
        ]
        }
   
}