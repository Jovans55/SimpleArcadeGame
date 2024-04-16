console.log("Game spinning up");

const app = new PIXI.Application();

await app.init({ width: 700, height: 700 });
document.body.appendChild(app.canvas);

await PIXI.Assets.load("ship.png");
await PIXI.Assets.load("tempEnemy.png");

let player = PIXI.Sprite.from("ship.png");

player.width = 100;
player.height = 100;

player.x = 300;
player.y = 550;

app.stage.addChild(player);

let keys = {};

function updateMovment(keys) {
  if (keys["w"]) {
    console.log("shoot");
  }
  if (keys["a"]) {
    if (player.x < 10) {
      player.x -= 0;
    } else {
      player.x -= 7;
    }
  }
  if (keys["d"]) {
    console.log("HIT D", player.x);
    if (player.x >= 600) {
      player.x += 0;
    } else {
      player.x += 7;
    }
  }
}

window.onkeypress = function (e) {
  keys[e.key] = true;
};

window.onkeyup = function (e) {
  if (keys[e.key]) {
    keys[e.key] = false;
  }
};

app.ticker.add(() => {
  updateMovment(keys);
});
