var cpuNum = require('os').cpus().length;

module.exports = function(server, port){
    var cluster = require('cluster');

    if (cluster.isMaster) {
        for (var i = 0; i < cpuNum; i++) {
            cluster.fork();
        }

        cluster.on('exit', function(worker) {
            process.nextTick(function () {
                cluster.fork();
                console.log("A worker with #" + worker.id + " is now restart");
            });
        });
        cluster.on('listening', function(worker, address) {
            console.log("A worker with #" + worker.id + " is now connected to " + address.address + ":" + address.port);
        }); 

    } else {
        server.listen(port);
    }
};