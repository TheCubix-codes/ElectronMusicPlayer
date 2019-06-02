// requirejs.config({
//     baseUrl: '/js',
//     paths: {
//        // app: '../app',
//         game: 'Game',
//         main: 'Main',
//         jquery: '../bower_components/jquery/dist/jquery.min',
//         threejs: 'libs/three',
//         jqueryUI: 'libs/jqueryUI/jquery-ui'
//     },
//     shim: {
//         main: {
//             deps: ["game"]
//         },
//         game:{
//             deps: ["threejs",'jquery','jqueryUI']
//         }
//     }
// });

let Main = require('./js/Main.js');
console.log(new Main());
