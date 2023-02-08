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

// 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 将几何体添加到场景中
scene.add(cube)

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

// 物体缩放
cube.scale.set(3, 2, 1)
// 物体旋转
cube.rotation.set(Math.PI / 4, 0, 0)

// 添加变量UI控制器
const gui = new dat.GUI();
// 修改物体位置
gui.add(cube.position, 'x').min(0).max(5).step(0.01).name('横坐标')
// 修改物体颜色
gui.addColor({ color: '#ffff00' }, 'color').onChange((val) => {
  cube.material.color.set(val)
})
gui.add(cube, 'visible').name('是否显示')
const setFolderGui = gui.addFolder('设置');
setFolderGui.add(cube.material, 'wireframe')






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