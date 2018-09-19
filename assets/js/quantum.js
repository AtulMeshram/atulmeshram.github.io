var canvas = document.querySelector('#scene__quantum');
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
camera.position.set(0, 0, 200);

var light = new THREE.HemisphereLight(0x111111, 0x222222, 0.6);
scene.add(light);

var light = new THREE.DirectionalLight(0xFDD835, 0.5);
light.position.set(200, 300, 300); 
scene.add(light);
var light2 = light.clone();
light2.position.set(-200, 300, 300); 
scene.add(light2);

var geometry = new THREE.IcosahedronGeometry(75, 4);
for(var i = 0; i < geometry.vertices.length; i++) {
    var vector = geometry.vertices[i];
    vector._o = vector.clone();  
}
var material = new THREE.MeshPhongMaterial({
    emissive: 0xFFAB00, 
    emissiveIntensity: 0.4,
    shininess: 0
});
var shape = new THREE.Mesh(geometry, material);
scene.add(shape);

function updateVertices (a) {
    for(var i = 0; i < geometry.vertices.length; i++) {
        var vector = geometry.vertices[i];
        vector.copy(vector._o);
        var perlin = noise.simplex3(
            (vector.x * 0.006) + (a * 0.0002),
            (vector.y * 0.006) + (a * 0.0003),
            (vector.z * 0.006)
        );
        var ratio = ((perlin*0.4 * (mouse.y+0.1)) + 0.8);
        vector.multiplyScalar(ratio);
    }
    geometry.verticesNeedUpdate = true;
}

function render(a) {
    requestAnimationFrame(render);
    updateVertices(a);
    renderer.render(scene, camera);
}

function onResize() {
    canvas.style.width = '';
    canvas.style.height = '';
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();  
    renderer.setSize(width, height);
}

var mouse = new THREE.Vector2(0.5, 0.5);
function onMouseMove(e) {
    TweenMax.to(mouse, 0.5, {
        y: (e.clientY / height),
        x : (e.clientX / width),
        ease: Power1.easeOut
    });
}

requestAnimationFrame(render);
window.addEventListener("mousemove", onMouseMove);
var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});