var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);



var createScene = function () {
	// This creates a basic Babylon Scene object (non-mesh)
	var scene = new BABYLON.Scene(engine);
	
	// Create camera and lighting
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, -25), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 1.0), scene);
	light.position = new BABYLON.Vector3(0, 15, -6);
	
	// Create default environment
	var environment = scene.createDefaultEnvironment({
		skyboxSize: 300,
		groundSize: 200
	});
	environment.setMainColor(new BABYLON.Color3(0.1, 0.3, 0.5));
	
	//Create a sphere for the scene
	var sphere = BABYLON.Mesh.CreateIcoSphere("sphere", {radius:0.8, flat:true, subdivisions: 16}, scene);
	sphere.material = new BABYLON.StandardMaterial("material", scene);
	sphere.material.diffuseColor = new BABYLON.Color3(0.588, 0.805, 0.896);
	
	// Add vr
	var helper = scene.createDefaultVRExperience({createDeviceOrientationCamera: false})
	helper.enableInteractions()
	

return scene;
};


var scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});