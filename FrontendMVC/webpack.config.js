const path = require('path');
//let opt = {
//        minimize: true,
//        minimizer: [
//            new TerserPlugin({
//                terserOptions: {
//                    keep_classnames: true,
//                    keep_fnames: true
//                }
//            })
//        ]
//    };

module.exports = [
    {
        entry: './TypeScripts/js/index.js',
        output: {
            path: path.resolve(__dirname, 'Scripts/cust'),
            filename: 'index.js',
            library: 'oIndex',
        },
        mode: 'production',
        //optimization: opti,
    },
    {
        entry: './TypeScripts/js/DesignerInit.js',
        output: {
            path: path.resolve(__dirname, 'Scripts/cust'),
            filename: 'designer.js',
            library: 'oDesigner',
        },
        mode: 'production',
        optimization: {
            minimize: false,
            mangleExports: false,
        },
    }
];