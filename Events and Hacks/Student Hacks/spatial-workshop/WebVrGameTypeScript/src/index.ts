import { Engine, Scene, HemisphericLight, Vector3, CannonJSPlugin, StandardMaterial, DirectionalLight, Color4 } from "babylonjs";
import * as GUI from  "babylonjs-gui";
import {CloudProceduralTexture, GrassProceduralTexture} from "babylonjs-procedural-textures";
import { addSpheres } from "./sphere";
import { addLabelToScene, updateScore } from "./score";
var canvas: any = document.getElementById("renderCanvas");
var engine: Engine = new Engine(canvas, true);

function createScene(): Scene {
    // Create scene
    var scene: Scene = new Scene(engine);
    var sphereLight = new DirectionalLight("dir02", new Vector3(0.2, -1, 0), scene);
    sphereLight.position = new Vector3(0, 80, 0);
    var gravityVector = new BABYLON.Vector3(0, -1, 0);
    scene.enablePhysics(gravityVector, new CannonJSPlugin);

    scene.clearColor = BABYLON.Color4.FromColor3(BABYLON.Color3.Black());

    var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, -10), scene);
    //var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    // Targets the camera to a particular position. In this case the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);

    var grassMaterial = new BABYLON.StandardMaterial("grass", scene);
    var grassTexture = new GrassProceduralTexture("textgrass", 256, scene);
    grassMaterial.ambientTexture = grassTexture;
    grassMaterial.diffuseTexture= grassTexture;

    // Create Ground
    var ground = BABYLON.Mesh.CreatePlane("ground", 25.0, scene);
    ground.position = new BABYLON.Vector3(0, -5, 0);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    ground.material = grassMaterial;
 
    // Create the 3D UI manager
    var manager = new GUI.GUI3DManager(scene);
    // Create a horizontal stack panel
    var panel = new GUI.StackPanel3D();
    panel.margin = 0.02;
    manager.addControl(panel);
    startGameButton(panel);
    addLabelToScene();
    // Enable VR
    var helper = scene.createDefaultVRExperience({createDeviceOrientationCamera: false});
	helper.enableInteractions();

    return scene;
}

var startGameButton = function (panel) {
    var button = new GUI.Button3D();
    panel.addControl(button);
    button.onPointerUpObservable.add(function () {
        //reset score
        updateScore(0);
        addSpheres(scene);
        button.isVisible = false;
    });
    var text1 = new GUI.TextBlock();
    text1.text = "Start Game";
    text1.color = "white";
    text1.fontSize = 24;
    button.content = text1;
}
var scene: Scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});
