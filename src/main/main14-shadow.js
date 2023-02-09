import { GUI } from 'dat.gui';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
/**
 * 灯光阴影
 * 1、材质要满足对光照有反应
 * 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true;
 * 3、设置光照投射阴影 directLight.castShadow = true;
 * 4、设置物体投射阴影 cube.castShadow = true
 * 5、设置物体接收阴影 plane.receiveShadow = true
 */


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
const cube = new THREE.Mesh(sphereGeometry, material);
cube.castShadow = true
scene.add(cube)

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = - Math.PI / 2;
plane.receiveShadow = true
scene.add(plane)

// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)
// 平行光
const directLight = new THREE.DirectionalLight(0xffffff, 0.5);
directLight.position.set(10, 10, 10);
directLight.castShadow = true;
// 设置阴影贴图模糊度
directLight.shadow.radius = 20
// 设置阴影贴图的分辨率
directLight.shadow.mapSize.set(2048, 2048)
// 设置平行光投射相机的属性 --- 设置计算投影的空间范围，超出范围不计算
directLight.shadow.camera.near = 0.5;
directLight.shadow.camera.far = 500;
directLight.shadow.camera.top = 5;
directLight.shadow.camera.bottom = -5;
directLight.shadow.camera.left = -5;
directLight.shadow.camera.right = 5;

scene.add(directLight)

// 用gui测试
const gui = new GUI();
gui.add(directLight.shadow.camera, 'near').min(0).max(20).step(0.1).onChange(() => {
  directLight.shadow.camera.updateProjectionMatrix()
})

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