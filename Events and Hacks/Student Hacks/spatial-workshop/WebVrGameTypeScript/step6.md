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

[<- Prev Step](step5.md) |
[Next Step ->](step7.md)
