const path =require("path")
module.exports = [
	{
		url: '/upload',
		method: 'post',
		description: '上传单个文件,支持在路径中指定要上传的路径,?path=/a/b',
		handler: (req, res) => {
            console.log('upload file:',req.param("path"));
            let rootUploadPath = path.join(__dirname,"../../public")
            let outpath = path.join(rootUploadPath,req.param("path","/"))

            let savedFiles=[]
			if (!req.files || Object.keys(req.files).length === 0) {
				return [400,'No files were uploaded.']
			}
			for (let name in req.files) {
                let file=req.files[name]
                savedFiles.push(path.join(outpath,file.name))
                file.mv(path.join(outpath,file.name))
            }
            return {
                status:"success",
                url:path.relative(rootUploadPath,savedFiles[0])
            } 
		}
	}
];
