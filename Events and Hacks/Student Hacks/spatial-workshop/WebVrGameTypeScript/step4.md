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

[<- Prev Step](step3.md) |
[Next Step ->](step5.md)
