/**
 * 服务主程序
 */
 
var argv = process.argv;
if(argv.length === 2){
    require("./server_server")();
    console.log("server");
}else if(argv.length === 3){
    var projectName = argv[2];
    require("./client_server")(projectName);
    console.log("client");
}