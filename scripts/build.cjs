const fs=require('node:fs');
const babel=require('@babel/core');
const result=babel.transformFileSync('src/App.jsx',{presets:[require.resolve('@babel/preset-react')],comments:false});
fs.writeFileSync('public/app.js',result.code+'\n');
