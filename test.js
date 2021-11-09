const fs = require('fs-extra');
const path = require('path');
// fs.copy('./template','./test1',err=>{
//     console.log(err);
// })
fs.readdir('./template',(err,files)=>{
    const prefixPath=path.join(process.cwd(),'./template')
    const dirs=files.filter(dir=>{
        let stat=fs.lstatSync(path.join(prefixPath,dir));
        if(stat.isDirectory()){
            return true;
        }
    })

    console.log(dirs)
})