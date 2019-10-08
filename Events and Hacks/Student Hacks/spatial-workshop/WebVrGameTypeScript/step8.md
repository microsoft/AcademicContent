## Remove physics imposter, add material and deploy with Azure

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

[<- Prev Step](step7.md)
