import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import galleryVertexShader from "/shaders/gallery/gallery_vertex.glsl";
import galleryVertexFragment from "/shaders/gallery/gallery_fragment.glsl";
// import simplexNoise4d from "/shaders/includes/simplexNoise4d.glsl";

export default class Gallery extends THREE.Group {
	res = { w: 1024, h: 100 };
	// images = [
	// 	"2vNC1J_TafQ",
	// 	"bA32w6lebJg",
	// 	"QIgWfSX4kRc",
	// 	"2Eewt6DoSRI",
	// 	"vbPIxR__rL8",
	// 	"iihTIq813gU",
	// 	"WiiSfTe_kTw",
	// 	"UISVV0eCt2c",
	// 	"4UTfq2C-9Dk",
	// 	"ITeZugvrDS4",
	// ];
	images = [
		"./images/01.jfif",
		"./images/02.jfif",
		"./images/03.jfif",
		"./images/04.jfif",
		"./images/05.jfif",
		"./images/06.jfif",
		"./images/07.jfif",
		"./images/08.jfif",
		"./images/09.jfif",
		"./images/10.jfif",
	];

	uniforms = {
		time: { value: 0 },
	};

	constructor() {
		super();

		this.loadImagesAndBuild();
	}

	loadImagesAndBuild() {
		const loader = new THREE.ImageLoader();

		let loadedImages = 0;
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		canvas.width = this.res.w;
		canvas.height = this.res.h * this.images.length;

		this.images.forEach((url, index) => {
			// const url = `https://source.unsplash.com/${id}/${this.res.w}x${this.res.h}`;
			// console.log(url);
			loader.load(url, (image) => {
				const x = 0;
				const y = index * this.res.h; // Move each image down by its height
				ctx.drawImage(image, x, y, this.res.w, this.res.h);
				loadedImages++;
				if (loadedImages === this.images.length) {
					this.onAllImagesLoaded(canvas);
				}
			});
		});
	}

	onAllImagesLoaded(canvas) {
		const texture = new THREE.Texture(canvas);
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.needsUpdate = true;

		let geometry = new THREE.PlaneGeometry(
			this.res.w / 100,
			this.res.h / 10,
			100,
			100
		);

		geometry = mergeVertices(geometry);
		geometry.computeTangents();

		console.log(geometry.attributes);

		this.material = new CustomShaderMaterial({
			// csm
			baseMaterial: THREE.MeshPhysicalMaterial,
			vertexShader: galleryVertexShader,
			fragmentShader: galleryVertexFragment,
			silent: true,
			uniforms: this.uniforms,

			// material props
			color: 0xffffff,
			map: texture,
			side: THREE.DoubleSide,
		});
		this.depthMaterial = new CustomShaderMaterial({
			// csm
			baseMaterial: THREE.MeshDepthMaterial,
			vertexShader: galleryVertexShader,
			fragmentShader: galleryVertexFragment,
			silent: true,
			uniforms: this.uniforms,

			// material props
			depthPacking: THREE.RGBADepthPacking,
		});

		this.mesh = new THREE.Mesh(geometry, this.material);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.mesh.customDepthMaterial = this.depthMaterial;
		this.add(this.mesh);
	}

	update(time) {
		this.uniforms.time.value = time;
	}
}
