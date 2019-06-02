let Visualization = require('./Game');
class Main
{
    constructor(){
        //console.log(Visualization);
        this.Visual = new Visualization("../assets/sounds/music/2.mp3",'#canvasContainer');
        this.Visual.play();
    }
}

module.exports = Main;
