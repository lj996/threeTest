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


// 导入纹理
const textureLoader = new THREE.TextureLoader(loadingManager);
const myTexture = textureLoader.load('./texture/door.jpeg')
// 遮挡纹理
const aoTexture = textureLoader.load('./texture/aoMap2.jpeg')
// 高度纹理
const heightTexture = textureLoader.load('./texture/stripe.jpeg')
// 法线纹理
const normalTexture = textureLoader.load('./texture/fishScales.jpeg')

// 添加物体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2, 100, 100, 100);
// 材质
const material = new THREE.MeshStandardMaterial({
  color: '#ffff00',
  map: myTexture,
  aoMap: aoTexture,
  displacementMap: heightTexture,
  displacementScale: 0.1,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.9,
  normalMap: normalTexture
})
const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube)

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(2, 2, 200, 200);// 宽、高、宽度顶点数、高度顶点数
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(3, 0, 0)
scene.add(plane)
// 设置第二组uv
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2))
// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.8)
// scene.add(light)
// 平行光
const directLight = new THREE.DirectionalLight(0xffffff, 1);
directLight.position.set(10, 10, 10);
// scene.add(directLight)
// 点光
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

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