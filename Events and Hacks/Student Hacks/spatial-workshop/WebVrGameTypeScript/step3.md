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

[<- Prev Step](step2.md) |
[Next Step ->](step4.md)
