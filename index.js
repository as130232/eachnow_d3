var http = require('http');


http.createServer(function (request, response){
    //httpStatus '200' is sucess.
    response.writeHead(200);
    response.write('My server worked');
    response.end(); //一定要end作為結束
    
}).listen(3000, function(){
    console.log('Server is running..');
});