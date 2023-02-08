import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

// 创建场景
const scene = new THREE.Scene();

// 创建相机 --参数含义依次为视野角度、长宽比、近截面和远截面
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// 设置相机位置
camera.position.set(0, 0, 10)

// 相机添加到场景中
scene.add(camera)


// 导入纹理
const textureLoader = new THREE.TextureLoader();
const myTexture = textureLoader.load('./texture/door.jpeg')
// 透明纹理
const alphaTexture = textureLoader.load('./texture/alphaTexture.png')
console.log('myTexture', myTexture);
// 纹理属性
// myTexture.offset.set(1, 1);
// myTexture.rotation = Math.PI / 4;
myTexture.center.set(1, 1);
// myTexture.repeat.set(2, 4);
myTexture.wrapS = THREE.RepeatWrapping;
myTexture.wrapT = THREE.RepeatWrapping;
// 纹理显示设置
myTexture.minFilter = THREE.NearestFilter;
myTexture.magFilter = THREE.NearestFilter;
myTexture.magFilter = THREE.LinearFilter;
myTexture.magFilter = THREE.LinearFilter;


// 添加物体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
// 材质
const basicMaterial = new THREE.MeshBasicMaterial({
  color: '#ffff00',
  map: myTexture,
  alphaMap: alphaTexture,
  transparent: true,
  side: THREE.DoubleSide,
  opacity: 0.5
})
const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
scene.add(cube)

// 添加平面
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  basicMaterial
)
plane.position.set(3, 0, 0)
scene.add(plane)

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

// 初始化渲染器
const renderer = new THREE.WebGL1Renderer()
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)


// 创建轨道控制器---可以通过鼠标改变相机视角
const controls = new OrbitControls(camera, renderer.domElement)






// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera) // 只会渲染一次
function render(time) {
  renderer.render(scene, camera)
  // 一桢调用一次
  requestAnimationFrame(render)
}
render()






// 自动根据页面尺寸自适应页面
window.addEventListener('resize', () => {
  console.log('resize');
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight; // 宽高比
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio)
})

// 双击全屏
window.addEventListener('dblclick', () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    // 让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen()
  }
})