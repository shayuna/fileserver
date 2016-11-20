var express = require('express');    //Express Web Server 
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation

var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

/* ========================================================== 
Create a Route (/upload) to handle the Form submission 
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
app.route('/upload')
    .post(function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            var sFileNm=filename.replace(/[.].+/ig,"");
            var sFolderNm=getFolderNm(sFileNm);
           dirExists(__dirname + "\\"+sFolderNm+"\\");
            fstream = fs.createWriteStream(__dirname + "\\"+sFolderNm+"\\" + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
//                res.redirect('back');           //where to go next
            });
        });
    });

var server = app.listen(3030, function() {
    console.log('Listening on port %d', server.address().port);
});
app.route("/download").get(function (req, res, next) {

    var sFileNm=req.query.flNm;
    var sFolderNm=__dirname + "\\"+getFolderNm(sFileNm);
    var sPath=sFolderNm+"\\"+sFileNm+".txt";
    var readStream = fs.createReadStream(sPath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
    res.on("close",function(){
        console.log("finished downloading - "+sFileNm);
    })
})


function dirExists(sPath){
    if (!fs.existsSync(sPath))fs.mkdirSync(sPath);
}

function getFolderNm(sFileNm){
    var sFolderNm="remainder";
    if (!isNaN(sFileNm)){
        sFolderNm=Math.floor(parseFloat(sFileNm)/1000+1);
    }
    return sFolderNm;
}