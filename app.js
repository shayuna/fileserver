http = require("http");
req=require("querystring");
var server=http.createServer();
server.on("request",function(req,res){
    console.log("action");
    var sData="";
    req.on("error",function(err){
        console.log (err.stack);
    }).on("data",function(chunk){
        sData+=chunk;
    }).on("end",function(){
        res.end(sData);
    })
}).listen(8050);
