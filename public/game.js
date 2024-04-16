console.log("Game spinning up");

const app = new PIXI.Application();

await app.init({ width: 700, height: 700 });
document.body.appendChild(app.canvas);

await PIXI.Assets.load("ship.png", "tempEnemy.png");

let player = PIXI.Sprite.from("ship.png");

player.x = 100;
player.y = 100;

app.stage.addChild(player);
