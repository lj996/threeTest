import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap';

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

// 初始化渲染器
const renderer = new THREE.WebGL1Renderer()
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)


// 创建轨道控制器---可以通过鼠标改变相机视角
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼，更真实
controls.enableDamping = true

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

// -----------------设置动画--------------------
const animate1 = gsap.to(cube.position, {
  x: 5, duration: 3,
  ease: 'bounce.out',
  repeat: -1, // -1 表示一直重复下去
  yoyo: true, // 往返运动
  onStart: () => {
    console.log('动画开始');
  },
  onComplete: () => {
    alert('动画完成');
  }
})
// 双击控制动画暂停和继续
window.addEventListener('dblclick', () => {
  console.log(animate1);
  if (animate1.isActive()) {
    animate1.pause()
  } else {
    animate1.resume()
  }
})
// -----------------设置动画--------------------


// 物体缩放
cube.scale.set(3, 2, 1)
// 物体旋转
cube.rotation.set(Math.PI / 4, 0, 0)




// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera) // 只会渲染一次
function render() {
  controls.update()
  renderer.render(scene, camera)
  // 一桢调用一次
  requestAnimationFrame(render)
}
render()