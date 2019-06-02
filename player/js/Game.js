let THREE = require('./libs/three.js');
let $ = require('./libs/jquery-3.1.1.js');
class Visualization
{
    constructor(source,container)
    {
        this.audio = new Audio();
        this.audio.loop = true;
        audioSetup(this.audio,container,THREE,$);
        this.audio.src= source;
        //this.play();
    }
    play()
    {
          this.audio.play();
          this.audio.pause();
    }
}


function computeRects (plane,freqData,options)
{
    if(options != null)
    {
        let positions = plane.geometry.getAttribute( 'position');
        //let color = plane.material.getAttribute( 'color');
        let collumn = 0;

        const offset = 8*options.Count;
        const divider = 100;
        const baseline = 10/divider;
        for(let i = options.LowLimit; i<= options.HighLimit ;i++)
        {
            //let freq = Math.log(1+freqData[i]/divider);
            let freq = Math.exp(freqData[i]/divider)-1;
            positions.setY(collumn,   baseline);

            positions.setY(collumn+1, freq || baseline);
            positions.setY(collumn+2, freq || baseline);

            positions.setY(collumn+3, baseline);

            if(collumn +1 < offset/2)   positions.setX(collumn, positions.getX(collumn-1));
            if(collumn -4 > 0)          positions.setX(collumn +3, positions.getX(collumn+4));
            positions.setX(collumn+1, positions.getX(collumn));
            positions.setX(collumn+2, positions.getX(collumn+3));

            collumn+=4;
        }
        positions.needsUpdate = true;
        plane.geometry.addAttribute( 'position', positions );
    }
}

function audioSetup(audio,container,THREE,$)
{
    let audioCtx = new AudioContext();
    let analizer = audioCtx.createAnalyser();
    let audioSource = audioCtx.createMediaElementSource(audio);
    audioSource.connect(analizer);
    analizer.connect(audioCtx.destination);
    let options = {
        _LowLimit:0,
        _HighLimit:0.62,
        _count:analizer.frequencyBinCount,
        get Count(){return Math.round((this._HighLimit -  this._LowLimit) *  this._count)},
        get LowLimit (){return Math.round(this._LowLimit*  this._count);},
        get HighLimit (){return Math.round(this._HighLimit*  this._count);}
    }
    let graficalContext = videoSetup(options,container,THREE,$);
    let cancelatioToken = -1;
    let freqData = new Uint8Array(options.Count);
    audio.onplay  = () => {cancelatioToken = process(analizer,graficalContext,freqData,options);}
    audio.onpause = () => cancelAnimationFrame(cancelatioToken);
    var progressBar = $( "#progressbar" );
    audio.onloadedmetadata = ()=>{ progressBar.progressbar({
      value: 0,
      max:audio.duration
    });}

    audio.ontimeupdate = () => progressBar.progressbar( "option", "value", audio.currentTime);
    console.log(graficalContext,progressBar);

    return {
        graficalContext:graficalContext
    }



}

function process(analizer,graficalContext,freqData,options)
    {
        analizer.getByteFrequencyData(freqData);
        computeRects(graficalContext.plane, freqData,options);
        graficalContext.spotLight.color = {r:freqData[60]/255,
                                           g:freqData[60]/255,
                                           b:freqData[60]/255,}
        graficalContext.render();
        return window.requestAnimationFrame(()=>process(analizer,graficalContext,freqData,options));
    }
function videoSetup(options,container,THREE,$)
{
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 90 , window.innerWidth / window.innerHeight, 0.1, 1000 );

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight*0.95 );
    //window.onresize = ()=>renderer.setSize( window.innerWidth, document.body.clientHeight );
    if(!container)
        document.body.appendChild( renderer.domElement );
    else
        $(container).append(renderer.domElement);
        console.log(options.Count, options.LowLimit, options.HighLimit);
    let planegeometry = new THREE.PlaneBufferGeometry(20, 0.1, options.Count*4, 1 );
    let planematerial = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    let plane = new THREE.Mesh( planegeometry, planematerial );
    plane.position.y = -1;
    plane.castShadow = true;
    scene.add( plane );
    //
    var light = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( light );
    //
    var geometry1 = new THREE.PlaneGeometry( 40, 20, 1 );
    var material1 = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    var plane1 = new THREE.Mesh( geometry1, material1 );
    var texture = new THREE.TextureLoader().load( "../assets/sounds/images/1.jpg" );
    material1.map = texture;
    //planematerial.map = new THREE.TextureLoader().load( "assets/sounds/images/colors.png" );;
    console.log(plane1)
    scene.add( plane1 );
    plane1.position.z = -5;
    plane1.receiveShadow = true;
    //
    var spotLight = new THREE.SpotLight( 0xaaaaaa );
    spotLight.position.set( 0, 0.5, 2 );
    spotLight.decay = 2;
    window.onkeypress = (event)=>{
        switch(event.key)
        {
            case '+':
            spotLight.position.z +=.1;
            break;
            case '-':
            spotLight.position.z -=.1;
            break;
        }
        console.log(spotLight.position.z)
    }
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    //scene.add( spotLight );
    //
    console.log(plane);

    camera.position.z = 3;
    camera.position.y = 0;
    camera.position.z = 5;//2.3;
    render =  function () {
        renderer.render( scene, camera );
    }
    return {
        render  : render,
        plane   : plane,
        scene   : scene,
        camera  : camera,
        spotLight:spotLight
    };
}

module.exports = Visualization;
