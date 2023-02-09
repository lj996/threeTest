import { GUI } from 'dat.gui';
import * as THREE from 'three'
import { Clock, MeshBasicMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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

const event = {
  onLoad: () => {
    console.log('图片加载完成');
  },
  onProgress: (url, loaded, total) => {
    console.log('图片加载进度', url, loaded, total);
  }
}

// 设置加载管理器
const loadingManager = new THREE.LoadingManager(
  event.onLoad, event.onProgress
)

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial({
});
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.castShadow = true
scene.add(sphere)

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = - Math.PI / 2;
plane.receiveShadow = true
scene.add(plane)

// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)
// 点光
const pointLight = new THREE.PointLight(0xff0000, 0.5);
// pointLight.position.set(5, 5, 5);
pointLight.castShadow = true;
// 设置阴影贴图模糊度
pointLight.shadow.radius = 20
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(2048, 2048)
// 添加小球
const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new MeshBasicMaterial({ color: 0xff0000 })
)
smallBall.position.set(2, 2, 2)
// 点光给小球，光源会跟随小球位置移动
smallBall.add(pointLight)

scene.add(smallBall)

// 用gui测试
const gui = new GUI();
gui.add(smallBall.position, 'x').min(-5).max(5).step(0.1)
gui.add(pointLight, 'distance').min(0.1).max(100).step(0.01) // 光源能达到的最大距离，越远光强度越衰减
gui.add(pointLight, 'decay').min(0).max(5).step(0.01) // 沿着光照距离的衰减量

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)


// 初始化渲染器
const renderer = new THREE.WebGL1Renderer()
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)


// 创建轨道控制器---可以通过鼠标改变相机视角
const controls = new OrbitControls(camera, renderer.domElement)

const clock = new Clock()
function move() {
  // 通过移动小球，看阴影变化
  const time = clock.getElapsedTime();
  smallBall.position.x = Math.sin(time) * 3;
  smallBall.position.z = Math.cos(time) * 3;
  smallBall.position.y = 4 + Math.sin(time * 4);
}



// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera) // 只会渲染一次
function render(time) {
  move()
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