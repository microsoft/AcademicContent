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

[<- Prev Step](step4.md) |
[Next Step ->](step6.md)
