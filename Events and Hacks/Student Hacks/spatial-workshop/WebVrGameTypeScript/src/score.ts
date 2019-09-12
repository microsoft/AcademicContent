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

