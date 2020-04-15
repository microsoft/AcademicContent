import { Scene, Vector3, MeshBuilder, Mesh, ShadowGenerator, DirectionalLight, ActionManager, ExecuteCodeAction } from "babylonjs";
import {StandardMaterial, Texture, Color3} from "babylonjs-materials";
import { addParticlesToMesh, removeParticlesFromMesh } from "./particles";
import { incrementScore } from "./score";

export function addSpheres(scene: Scene) {
    for (let index = 0; index < 10; index++) {
        addSphere(scene);
    }
}

var addSphere = function (scene: Scene) {

    // Create sphere
    var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    sphere.position = new Vector3(Math.random() * 20 - 10, 10, Math.random() * 10 - 5);
    sphere.material = new BABYLON.StandardMaterial("sphere material", scene)
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);
  
    // Material
    var materialAmiga = new StandardMaterial("amiga", scene);
    materialAmiga.diffuseTexture = new Texture("textures/amiga.jpg", scene);
    materialAmiga.emissiveColor = new Color3(0.5, 0.5, 0.5);
    sphere.material = materialAmiga;

    sphere.actionManager = new ActionManager(scene);
    //add click event to sphere
    sphere.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
        var particleSystem = addParticlesToMesh(sphere, scene);
        scene.removeMesh(sphere);
        sleep(250).then(() => {
            removeParticlesFromMesh(particleSystem);
            incrementScore();
        })

    }));

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
}