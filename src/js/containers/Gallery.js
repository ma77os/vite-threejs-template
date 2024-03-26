import * as THREE from "three";
// import simplexNoise4d from "/src/shaders/includes/simplexNoise4d.glsl";

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
			console.log(url);
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

		const geometry = new THREE.PlaneGeometry(
			this.res.w / 100,
			this.res.h / 10,
			100,
			100
		);
		this.material = new THREE.MeshPhysicalMaterial({
			color: 0xffffff,
			map: texture,
			side: THREE.DoubleSide,
		});
		this.depthMaterial = new THREE.MeshDepthMaterial({
			depthPacking: THREE.RGBADepthPacking,
		});

		this.setupShader(this.material);
		this.setupDepthShader(this.depthMaterial);

		this.mesh = new THREE.Mesh(geometry, this.material);
		this.mesh.customDepthMaterial = this.depthMaterial;
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.add(this.mesh);
	}

	setupShader(material) {
		material.onBeforeCompile = (shader) => {
			console.log(shader.vertexShader);
			shader.uniforms.time = { value: 0 };
			shader.vertexShader = shader.vertexShader.replace(
				"#include <common>",
				`
                #include <common>
                
                uniform float time;
                `
			);

			shader.vertexShader = shader.vertexShader.replace(
				"#include <beginnormal_vertex>",
				`
                #include <beginnormal_vertex>

                vec3 posOffset = vec3(0.0);
                posOffset.x = sin(position.y * 0.5 + time*2.) * 0.5;
                posOffset.z = cos(position.x * 1.1 * sin(time*0.4)*1.5) * 0.3;

                `
			);

			shader.vertexShader = shader.vertexShader.replace(
				"#include <begin_vertex>",
				`
                #include <begin_vertex>

                transformed.x += posOffset.x;
                transformed.z += posOffset.z;
                
                // fix normals https://observablehq.com/@k9/calculating-normals-for-distorted-vertices


                `
			);
			material.userData.shader = shader;
		};
	}

	setupDepthShader(depthMaterial) {
		depthMaterial.onBeforeCompile = (shader) => {
			shader.uniforms.time = { value: 0 };
			shader.vertexShader = shader.vertexShader.replace(
				"#include <common>",
				`
                #include <common>
                
                uniform float time;
                `
			);

			shader.vertexShader = shader.vertexShader.replace(
				"#include <begin_vertex>",
				`
                #include <begin_vertex>

                vec3 posOffset = vec3(0.0);
                posOffset.x = sin(position.y * 0.5 + time*2.) * 0.5;
                posOffset.z = cos(position.x * 1.1 * sin(time*0.4)*1.5) * 0.3;

                transformed.x += posOffset.x;
                transformed.z += posOffset.z;
                `
			);
			depthMaterial.userData.shader = shader;
		};
	}

	update(time) {
		if (this.material?.userData?.shader)
			this.material.userData.shader.uniforms.time.value = time;

		if (this.depthMaterial?.userData?.shader)
			this.depthMaterial.userData.shader.uniforms.time.value = time;
	}
}
