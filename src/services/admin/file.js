import multer from 'multer';

const fileService = (filename,filelimit) => {
    if(filelimit === 1) {
        console.log(filename);
        var upload = multer({
            limits: { fileSize: 1 * 1024 * 1024 }
        }).single(filename);
    } else {
        upload = multer({
            limits: { fileSize: 1000000 }
        }).array(filename, filelimit);
    }
    return (req, res) =>{
        upload(req, res,(err) => {
            if(err.message == 'File too large') {
                console.log(`Multer: ${err.message}`);
                return { status: 401 , msgText: "File too Large" ,success: false }
                // return res.status(401).send({msgText: "File too Large" ,success: false })
            } else if(err.message == "Unexpected field") {
                console.log(`Multer : ${err.message}`);
                return { status: 401 , msgText: "Max one File upload" ,success: false }
            } else if (err) {
                console.log(`U.E : ${err.message}`);
                return res.status(401).send({error: `U.E: ${err.message}` ,success: false }) // Unknown  error while uploading
            }
            return req.file;
        });
    }  
};

export default fileService; 

// var multer = require('multer')({
//     dest: App.uploadsDir,
//     limits: { fileSize: App.maxMediaFileSize },
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype !== 'image/jpeg') {
//         return cb(new Error('Only jpeg images allowed'))
//       }
  
//       cb(null, true)
//     }
// })