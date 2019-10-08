# Introducing BabylonJS with TypeScript

In this workshop you will learn how to build a Web VR game with BabylonJS and [TypeScript](https://typescriptlang.org).

![game img](https://imgur.com/bvJslJf.jpg)

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/download?WT.mc_id=devto-blog-casiljan)

### What is BabylonJS and CannonJS?

[BabylonJS](https://www.babylonjs.com/) is a complete JavaScript framework for building 3D games and experiences with HTML5, [WebGL](https://en.wikipedia.org/wiki/WebGL), WebVR and Web Audio.

[CannonJS](http://www.cannonjs.org/) is a physics engine, written in JavaScript. And what is a physics engine you might ask? Well its "software that provides an approximate simulation of certain physical systems, such as rigid body dynamics (including collision detection), soft body dynamics, and fluid dynamics, of use in the domains of computer graphics, video games and film."

### What is TypeScript?

[TypeScript](https://www.typescriptlang.org/) is a typed superset of JavaScript the compiles to plain JavaScript. TypeScript starts from the same syntax and semantics that millions of JavaScript developers know today. Use existing JavaScript code, incorporate popular JavaScript libraries, and call TypeScript code from JavaScript.

TypeScript compiles to clean, simple JavaScript code which runs on any browser, in Node.js, or in any JavaScript engine that supports [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript) 3 (or newer).

## Getting started

First we need to get the base starter project using BabylonJS, [Webpack](https://webpack.js.org/concepts/), and TypeScript

Steps to Run Starter Project and [Git Repo Link](https://github.com/cassieview/babylonjs-webpack-typescript-starter-project)

1. Clone the repo and change directories  
   `git clone https://github.com/cassieview/babylonjs-webpack-typescript-starter-project.git`  
   `cd babylonjs-webpack-typescript-starter-project`
2. Install packages  
   `npm install`
3. Build Project  
   `npm run build`
4. Run the script to test the project  
   `npm start`
5. Open in VS Code  
   `code .`

## Starter project

Let's talk about the starter project

### Simple index.html template

The template includes a canvas which will act as the container for our application.

``` html
<!DOCTYPE html>
<html>

    <head>
        <style>
            html,
            body {
                overflow: hidden;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                text-align: center;
            }

            #renderCanvas {
                width: 100%;
                height: 100%;
                touch-action: none;
            }
        </style>
    </head>

    <body>
        <canvas id="renderCanvas"></canvas>
        <script src="dist/index.js"></script>
    </body>

</html>
```

### The index.ts TypeScript file

The `index.ts` file is the TypeScript file that creates the main scene. When you run `npm run build` it is to compiled to vanilla JavaScript in the dist folder. This is then called with the `script` tag in the `index.html`.

The script source for the game is found in the dist folder. Webpack is an open-source JavaScript module bundler it generates static assets representing those modules. This is what is loaded from the dist folder. WebPack compiles the script down to one source and that is used to serve the game script.

The below script shows how we import the packages needed from BabylonJS to create our game scene. Create the canvas variable and use vanilla JavaScript to grab the renderCanvas canvas tag from the html body section. Then we create the engine variable and pass in the new BabylonJS Engine.

``` javascript
import { Engine, Scene, HemisphericLight, Vector3, MeshBuilder, Mesh } from "babylonjs";
var canvas: any = document.getElementById("renderCanvas");
var engine: Engine = new Engine(canvas, true);
```

Below we have the create scene function. Here we define the `scene`, pass in the `engine`. Then we create a camera. The camera is the point of view of the game player. We are using the [free camera]("https://doc.babylonjs.com/babylon101/cameras#free-camera").

Next we add a simple sphere `mesh` to our scene and set the basic properties such as size, name and the scene we created.

The VR helper adds the VR button to the bottom right of the screen so that a user can enter the game in vr for a web browser.

TIP: You can easily test changes as you make them by running `npm run build` then open the path to the `index.html` file in the browser `../babylonjs-webpack-typescript-starter-project/index.html`. This is a static site so you don't actually have to run it with `npm start`. Simply run the build and refresh the browser path to the `index.html`.

```javascript
function createScene(): Scene {
    // Create scene
    var scene: Scene = new Scene(engine);

    // Create camera
     var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, -10), scene);

    // Create sphere
    var sphere1: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    sphere1.position.y = 5;
    sphere1.material = new BABYLON.StandardMaterial("sphere material", scene)

    // Enable VR
    var helper = scene.createDefaultVRExperience({createDeviceOrientationCamera: false});
    helper.enableInteractions();

    return scene;
}

var scene: Scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});
```

## Time to start building out the game!

Now you should have a basic understanding of whats in the starter project and what BabylonJS is doing for us. Next we want to add gravity so we need the CannonJS physics library mentioned above. 

We need to import the `CannonJSPlugin` after the `Mesh` in the package imports at the top of the script. When you add the plugin the import should look like it does below.

``` typescript
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh, CannonJSPlugin } from "babylonjs";
```

Add this line of code at the top where we create the scene variable:

``` typescript
var gravityVector = new BABYLON.Vector3(0, -.03, 0);
scene.enablePhysics(gravityVector, new CannonJSPlugin);
```

Copy and paste the below code block under the `ground` variable. Here we are updating the `ground mesh` and giving it a `physicsImpostor` so that the sphere will fall and land on the ground.

``` typescript
    var light = new HemisphericLight("light",Vector3.Zero(),scene);

    camera.checkCollisions = true;
    camera.applyGravity = true;
    // Targets the camera to a particular position. In this case the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);

    // Add ground features and physics
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.backFaceCulling = false;
    ground.receiveShadows = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1, restitution: 0 }, scene);
```

Add physics, shadow and light to sphere by importing the `ShadowGenerator` and `DirectionalLight` packages at the top of the script.

```javascript
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh, CannonJSPlugin, ShadowGenerator, DirectioalLight } from "babylonjs";
```

Then update the `create sphere` logic to the below:

``` typescript
// Create sphere
    var sphereLight = new DirectionalLight("dir02", new Vector3(0.2, -1, 0), scene);
    sphereLight.position = new Vector3(0, 80, 0);

    var sphere1: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    sphere1.position.y = 5;
    sphere1.material = new BABYLON.StandardMaterial("sphere material", scene)
    sphere1.physicsImpostor = new BABYLON.PhysicsImpostor(sphere1, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);
    var shadowGenerator = new ShadowGenerator(2048, sphereLight);
    shadowGenerator.addShadowCaster(sphere1);
```

Now we have a sphere falling onto the ground panel we created. How exciting. To change the speed in which the sphere falls change the `gravityVector` numbers!

## Project Architecture

We have a lot to add to this game still and although we could add it all in one giant function. That is not best practice for a variety of reasons. Lets add a `sphere.ts` file in the `src` folder and move our sphere logic to it.

``` typescript
import { Scene, Vector3, MeshBuilder, Mesh, ShadowGenerator, DirectionalLight } from "babylonjs";

export function addSphere(scene: Scene) {
    // Create sphere
    var sphereLight = new DirectionalLight("dir02", new Vector3(0.2, -1, 0), scene);
    sphereLight.position = new Vector3(0, 80, 0);

    var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    sphere.position.y = 5;
    sphere.material = new BABYLON.StandardMaterial("sphere material", scene)
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);
    var shadowGenerator = new ShadowGenerator(2048, sphereLight);
    shadowGenerator.addShadowCaster(sphere);
}
```

Then go back to `index.ts` and import the file we created and call the `addSphere` function where the `//Create Sphere` logic is.

``` javascript
line 2: import { addSphere } from "./sphere";

//Create Sphere
addSphere(scene);
```

Now would be a good time to `npm run build` and refresh your browser to see that you completed the logic move successfully.

## Add the start button

Ok like any good game you need a start button, to ya know, start the game.

Import the gui library so that we can use the 3D button and panel.  

``` typescript
import * as GUI from  "babylonjs-gui";
```

Add the `startGameButton` function below the `createScene` function. Move the `addSphere` function call to the `button.onPointerUpObservable` event. This event is used to trigger events on click. 

``` typescript
var startGameButton = function (panel) {
    var button = new GUI.Button3D();
    panel.addControl(button);
    button.onPointerUpObservable.add(function () {
        addSphere(scene);
    });
    var text1 = new GUI.TextBlock();
    text1.text = "Start Game";
    text1.color = "white";
    text1.fontSize = 24;
    button.content = text1;
}
```

Update the `createScene` function to add the button to the scene. This will go where `addSphere` previously was.

``` typescript
    // Create the 3D UI manager
    var manager = new GUI.GUI3DManager(scene);
    // Create a horizontal stack panel
    var panel = new GUI.StackPanel3D();
    panel.margin = 0.02;
    manager.addControl(panel);
    startGameButton(panel);
```

This would be a good time to `npm run build` and test the changes you made. When you click the button the sphere should drop from the sky onto the ground.

## Make sphere disappear on click

To do this we are going to update the `sphere.ts` file and add the `ActionManager` event to the `sphere` so when we click on the sphere it disappears. Add the below logic at the bottom of the `addSphere` function. Additionally you will need to update the import at the top of the file to include `ActionManager` and `ExecuteCodeAction`.

``` typescript
import { Scene, Vector3, MeshBuilder, Mesh, ShadowGenerator, DirectionalLight, ActionManager, ExecuteCodeAction } from "babylonjs";
```

``` typescript
    sphere.actionManager = new ActionManager(scene);

    //add click event to sphere
    sphere.actionManager.registerAction(new 
    ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
         scene.removeMesh(sphere);
    }));
```

## Add loop to add multiple spheres when you click start

Add the below code in the `sphere.ts` above the `addSphere` function. This will add 10 spheres when we click the button instead of one. Update the `addSphere` function to `var addSphere = function (scene: Scene) {` since we will no longer call it from the `index.ts` file directly.

``` typescript
export function addSpheres(scene: Scene) {
    for (let index = 0; index < 10; index++) {
        addSphere(scene);
    }
}
```

Update the `index.ts` file to import the `addSpheres` function and call that instead of `addSphere`.

``` typescript
import { addSpheres } from "./sphere";
addSpheres(scene);
```

Then update the sphere position in the `sphere.ts` file so it doesn't create 10 spheres all in the same spot. Delete `sphere.position.y = 5;` and add

``` typescript
    sphere.position = new Vector3(Math.random() * 20 - 10, 10, Math.random() * 10 - 5);
```

## Add particle animation to sphere to mimic an explosion

The sphere disappearing is cool but lets make it more dramatic by adding a [`particleSystem`]("https://doc.babylonjs.com/how_to/solid_particle_system") that will spray particles in a cartoon looking explosion type of way.

Add a new file called `particles.ts` and paste in the following code:

``` typescript
import { AbstractMesh, Texture, ParticleSystem, Scene, Vector3, Color4, Animation } from "babylonjs";
import { AdvancedDynamicTexture } from "babylonjs-gui";

let advancedTexture: AdvancedDynamicTexture;

export function addParticlesToMesh(mesh: AbstractMesh, scene: Scene): ParticleSystem {
    // Fountain object
    //var fountain = Mesh.CreateBox("fountain", 1.0, scene);

    var particleSystem = new ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new Texture("textures/flare.png", scene);

    // Where the particles come from
    particleSystem.emitter = mesh; // the starting object, the emitter
    particleSystem.minEmitBox = new Vector3(-1, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new Vector3(1, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    // Emission rate
    particleSystem.emitRate = 1500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new Vector3(-7, 8, 3);
    particleSystem.direction2 = new Vector3(7, 8, -3);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();

    // Fountain's animation
    var keys = [];
    var animation = new Animation("animation", "rotation.x", 30, Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE);
    // At the animation key 0, the value of scaling is "1"
    keys.push({
        frame: 0,
        value: 0
    });

    // At the animation key 50, the value of scaling is "0.2"
    keys.push({
        frame: 50,
        value: Math.PI
    });

    // At the animation key 100, the value of scaling is "1"
    keys.push({
        frame: 100,
        value: 0
    });

    // Launch animation
    animation.setKeys(keys);
    mesh.animations.push(animation);
    scene.beginAnimation(mesh, 0, 100, true);

    return particleSystem;
}

export function removeParticlesFromMesh(particleSystem: ParticleSystem): any {
    particleSystem.stop();
}
```

Import the `particles.ts` script into the `spheres.ts` script. 

``` typescript
import { addParticlesToMesh, removeParticlesFromMesh } from "./particles";
```

Update the sphere on click event to add the particle system and add the sleep function. This will add the particles to the sphere when it its clicked, wait 250 milliseconds and then stop adding particles to the scene. If you didn't stop the particles there would just be particles everywhere long after the sphere was removed from the scene and the explosion effect wouldnt happen correctly.

``` typescript
    sphere.actionManager.registerAction(new 
        ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
        var particleSystem = addParticlesToMesh(sphere, scene);
        scene.removeMesh(sphere);
        sleep(250).then(() => {
            removeParticlesFromMesh(particleSystem);
        })

    }));

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
```

## Add score.ts because every game needs a way to keep score

Create the `score.ts` script and paste in the code below.

``` typescript
import { AdvancedDynamicTexture, Rectangle, Control, TextBlock } from 'babylonjs-gui';

let advancedTexture: AdvancedDynamicTexture;
let scoreText: TextBlock = new TextBlock();
let score = 0;
function init(): void {
    if (!advancedTexture) {
        advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("ui1");
    }
}

export function addLabelToScene(): void {

    if (!advancedTexture) {
        init();
    }
    let label = new Rectangle("score");
    label.background = "black";
    label.height = "30px";
    label.alpha = 0.5;
    label.width = "100px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = 30;
    label.top = "10%";
    label.zIndex = 5;
    label.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(label);

    scoreText.text = "score: 0"
    scoreText.color = "white";
    label.addControl(scoreText);
}
export function incrementScore(): void{
    score++;
    scoreText.text = "score: " + score.toString();

}


export function updateScore(newScore: number): void{
    score = newScore;
    scoreText.text = "score: " + score.toString();

}
```

Then import the script in the `index.ts` script.

``` typescript
import { addLabelToScene, updateScore } from "./score";
```

In the `index.ts` file  and `createScene` function we want to add the function call `addLabelToScene()` after the call to add the button `startGameButton(panel);`

Update the `startGameButton` function to `updateScore` to 0 to reset the score when the game is started.

``` typescript
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
```

In the `sphere.ts` we need to `import { incrementScore } from "./score";` script and then add the `incrementScore();` after `removeParticlesFromMesh(particleSystem);` to increase the score when a sphere is clicked.

## Remove `PhysicsImpostor` from ground mesh so balls fall through the ground instead of sitting on top

We don't want people to be able to shoot the balls on the ground so we need to delete the `PhysicsImpostor` from the ground mesh.

``` javascript
ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 0 }, scene);
```

## Adding material

Now we will add some [material]("https://doc.babylonjs.com/babylon101/materials") to our spheres and ground

Import the `babylonjs-materials` to the `sphere.ts` script.

``` typescript
import {StandardMaterial, Texture, Color3} from "babylonjs-materials";
```

Then add the material to the sphere mesh with the following code

``` typescript
    // Material
    var materialAmiga = new StandardMaterial("amiga", scene);
    materialAmiga.diffuseTexture = new Texture("textures/amiga.jpg", scene);
    materialAmiga.emissiveColor = new Color3(0.5, 0.5, 0.5);
    sphere.material = materialAmiga;
```

Import the `babylonjs-procedural-textures` to the `index.ts` script.

``` typescript
import {GrassProceduralTexture} from "babylonjs-procedural-textures";
```

Then update the ground to add the grass texture to it.

``` typescript
    var grassMaterial = new BABYLON.StandardMaterial("grass", scene);
    var grassTexture = new GrassProceduralTexture("textgrass", 256, scene);
    grassMaterial.ambientTexture = grassTexture;
    grassMaterial.diffuseTexture= grassTexture;

    // Create Ground
    var ground = BABYLON.Mesh.CreatePlane("ground", 25.0, scene);
    ground.position = new BABYLON.Vector3(0, -5, 0);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    ground.material = grassMaterial;
```

## Lastly lets turn the sky to night black

Add this line below the scene creation variable

``` typescript
scene.clearColor = BABYLON.Color4.FromColor3(BABYLON.Color3.Black());
```

Ok lets `npm run build` and see if it works!

## More cool things you could add

- texture
- backgrounds
- custom meshes
- sound effects

## Deployment

Let's deploy site to azure storage as a static site so all your friends can play too
[Check out the docs on how to host this site for cheap on Azure](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website).

## More resources

[Full git repo of end of project](https://github.com/cassieview/WebVR-ExploadingSpheres-Babylonjs)

Shout out to the awesome docs and [playground](https://doc.babylonjs.com/examples/) on [Babylonjs](https://babylonjs.com) and the awesome developers that did the hard work to create a sweet library to enable us to build games!

Happy game building!
