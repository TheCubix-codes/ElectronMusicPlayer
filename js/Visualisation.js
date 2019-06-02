
function getPrimitives()
{

}

function computeRects (plane, freqData,count)
{
    let positions= plane.geometry.getAttribute( 'position');
    //console.log(plane);
    for(let i = 1; i<= count ;i++)
    {
        positions.setY(i, freqData[i]/100 || 0);
    }
    positions.needsUpdate = true;
     plane.geometry.addAttribute( 'position', positions );
}

function audioSetup(audio,container)
{
    let audioCtx = new AudioContext();
    let analizer = audioCtx.createAnalyser();
    let audioSource = audioCtx.createMediaElementSource(audio);
    audioSource.connect(analizer);
    analizer.connect(audioCtx.destination);

    let graficalContext = videoSetup(analizer.frequencyBinCount,container);
    let cancelatioToken = -1;
    let freqData = new Uint8Array(analizer.frequencyBinCount);
    runFuntions = function ()
    {
        //console.log("Playing" + new Date());
        analizer.getByteFrequencyData(freqData);
        computeRects(graficalContext.plane, freqData,analizer.frequencyBinCount);
        //graficalContext.cube.scale.y = 1+ freqData[230]/100;
        //graficalContext.cube.scale.x = 1+ freqData[230]/100;
        //console.log(graficalContext.cube.scale.x);
        graficalContext.render();
        cancelatioToken =  window.requestAnimationFrame(runFuntions);
    }

    console.log(analizer);
    audio.onplay  = () => runFuntions();
    audio.onpause = () => cancelAnimationFrame(cancelatioToken);
    console.log(graficalContext.plane);

}


function videoSetup( widthCount,container)
{
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    if(!container)
      document.body.appendChild( renderer.domElement );
    else {
      document.getElementById(container).appendChild(renderer.domElement);
    }
    let planegeometry = new THREE.PlaneBufferGeometry( 10, 0.1, widthCount, 1 );
    let planematerial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    let plane = new THREE.Mesh( planegeometry, planematerial );
    plane.position.y = 0;
    scene.add( plane );


    camera.position.z = 5;

    render =  function () {
        //requestAnimationFrame( render );
        renderer.render( scene, camera );
    }
    return {
        render  : render,
        plane   : plane
    };
}
