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

[<- Prev Step](step6.md) |
[Next Step ->](step8.md)
