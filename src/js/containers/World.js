import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Gallery from "./Gallery";

export default function World() {
	const clock = new THREE.Clock();

	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		100
	);
	camera.position.z = 20;

	// Renderer
	const renderer = new THREE.WebGLRenderer({
		powerPreference: "high-performance",
		antialias: true,
	});
	// renderer.setPixelRatio( Math.min(Math.max(window.devicePixelRatio, 1), 2) )
	renderer.setPixelRatio(window.devicePixelRatio);
	// renderer.outputEncoding = THREE.sRGBEncoding;
	// renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.physicallyCorrectLights = true;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// OrbitControls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.screenSpacePanning = false;

	// SCENE
	// Ambient light
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	// Directional light
	const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
	directionalLight.position.set(10, 10, 20);
	directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.width = 4096;
	directionalLight.shadow.mapSize.height = 4096;
	directionalLight.shadow.camera.near = 0.1;
	directionalLight.shadow.camera.far = 100;
	directionalLight.shadow.camera.top = 20;
	directionalLight.shadow.camera.bottom = -20;
	directionalLight.shadow.camera.left = -20;
	directionalLight.shadow.camera.right = 20;
	// directionalLight.shadow.radius = 10;
	// directionalLight.shadow.blurSamples = 16;
	scene.add(directionalLight);

	// light shadow helper
	const directionalLightCameraHelper = new THREE.CameraHelper(
		directionalLight.shadow.camera
	);
	directionalLightCameraHelper.visible = false;
	scene.add(directionalLightCameraHelper);

	// Gallery
	const gallery = new Gallery();
	scene.add(gallery);

	// floor plane
	const floor = new THREE.Mesh(
		new THREE.PlaneGeometry(100, 100),
		new THREE.MeshPhysicalMaterial({ color: 0xffffff })
	);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = -5;
	floor.receiveShadow = true;
	scene.add(floor);

	// sphere
	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry(1, 32, 32),
		new THREE.MeshPhysicalMaterial({ color: 0xffffff })
	);
	sphere.position.x = 7;
	sphere.position.y = -2;
	sphere.position.z = 5;
	sphere.castShadow = true;
	scene.add(sphere);

	function render() {
		requestAnimationFrame(render);

		const time = clock.getElapsedTime();
		gallery.update(time);

		controls.update();

		renderer.render(scene, camera);
	}

	function resize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	window.addEventListener("resize", resize);

	render();
}
