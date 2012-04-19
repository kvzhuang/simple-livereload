var fs = require('fs'),
    spawn = require('child_process').spawn,
    ws = require('websock'),
    socket,
    config = {
        ready: false,
        LiveReload: '1.6',
        applyJSLive: false,
        applyCSSLive: true,
        applyIMGLive: true,
        port: 50072,
        socket: {},
        fileType : [
            '*.php',
            '*.js',
            '*.scss',
            '*.css',
            '*.php',
            '*.html',
            '*.jpg'
        ]
    },
    cli = require('./cli')(config.fileType),
    HOMEPATH = process.env.PWD;

config.port = process.argv[2] || config.port;
config.port = parseInt(config.port, 10);

cli.getFileList('data', function (files) {
    files.forEach(function (file) {
        fs.watchFile(file, function (curr, prev) {
            if (file.indexOf(".scss") > -1) {
                spawn('compass_lite', [file, file.replace(".scss", ".css")]);
                return;
            }
            if (config.ready) {
                onChange(file, curr, prev);
            }
        });
    });
});
cli.run();

var connect = function (port) {
    console.log("connect server...");
    ws.listen(config.port, function (socket) {
        config.socket = socket;
        console.log( 'Browser: Connected socket (' + socket.version + ')' );

        socket.send( "!!ver:" + config.LiveReload );

        socket.on('message', function ( msg ) {
          console.log( 'Browser: ' + msg );
        });
        socket.on('close', function () {
          console.log( 'Browser: Disconnected');
        });
        config.ready = true;
    });
};

var onChange = function (path, current, previous) {
  if (current.mtime > previous.mtime) {
      console.log("Changed : " + path);
      sendRefresh(HOMEPATH);
  };
};

var sendRefresh = function (path) {
  var message = JSON.stringify(['refresh', {
    path: path,
    apply_js_live: config.applyJSLive,
    apply_css_live: config.applyCSSLive,
    apply_images_live: config.applyIMGLive
  }]);

  config.socket.send(message);
};

console.log('Simple-livereload is starting...');
console.log('server port :' + config.port);

//initial websocket server
connect(config.port);
