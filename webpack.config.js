module.exports = {
    entry: './index.ts',
    output: {
        filename: 'bundle.js',
        path: './'
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                loader: 'ts-loader',
                test: /\.ts$/,
            },
            {
                enforce: 'pre',
                loader: 'source-map-loader',
                test: /\.js$/,
            }
        ]
    },
    devtool: 'inline-source-map'
};