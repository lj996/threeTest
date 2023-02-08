import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
console.log(THREE);

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


// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

// 设置时钟
const clock = new THREE.Clock();

// 物体移动和旋转
function move(time) {
  console.log();
  // 这个是每帧移动相同距离，但每帧的时间不能保证一致
  // cube.position.x += 0.01;
  // cube.rotation.x += 0.01
  // if (cube.position.x >= 5) {
  //   cube.position.x = 0;
  // }

  // 匀速运动 time 是运行总时长ms
  // const t = (time / 1000) % 5;
  // cube.position.x = t * 1; // 时间 * 速度
  // cube.rotation.x = t * 1;

  // 使用three自带的时钟 原理是 performance.now
  const allTime = clock.getElapsedTime();
  console.log('时钟运行总时长s：', allTime);
  const deltaTime = clock.getDelta();
  console.log('两次获取时间的间隔时间s：', deltaTime);
  const t = allTime % 5;
  cube.position.x = t * 1; // 时间 * 速度
  cube.rotation.x = t * 1;
}

// 物体缩放
cube.scale.set(3, 2, 1)
// 物体旋转
cube.rotation.set(Math.PI / 4, 0, 0)




// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera) // 只会渲染一次
function render(time) {
  move(time)
  renderer.render(scene, camera)
  // 一桢调用一次
  requestAnimationFrame(render)
}
render()