import { GUI } from 'dat.gui';
import * as THREE from 'three'
import { Clock, MeshBasicMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Water } from 'three/examples/jsm/objects/Water2'
/** -----------------------------通用配置start-------------------- */
// 创建场景
const scene = new THREE.Scene();

// 创建相机 --参数含义依次为视野角度、长宽比、近截面和远截面
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
)

// 设置相机位置
camera.position.set(-50, 50, 130)

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

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
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

/** -----------------------------通用配置end-------------------- */

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper)
// 添加平面
// const planeGeometry = new THREE.PlaneGeometry(100, 100)
// const planeMaterial = new THREE.MeshBasicMaterial({
//   color: 0xffffff
// })
// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// scene.add(plane);

// 创建巨大的天空球
const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);
const texture = new THREE.TextureLoader().load('./texture/sky.jpg');
const skyMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide, // 默认是单面
})
// skyGeometry.scale(1, 1, -1) // 展示内侧面
const sky = new THREE.Mesh(skyGeometry, skyMaterial)
sky.position.set(0, 0, 0)
scene.add(sky)

// 创建水面
const waterGeometry = new THREE.CircleGeometry(300, 64)
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(10, 10),
  scale: 1
})
water.position.set(0, 0, 0)
water.rotation.x = -Math.PI / 2
scene.add(water)