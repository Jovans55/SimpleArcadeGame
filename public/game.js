console.log("Game spinning up");

const app = new PIXI.Application();

await app.init({ width: 700, height: 700 });
document.body.appendChild(app.canvas);

await PIXI.Assets.load("ship.png");
await PIXI.Assets.load("tempEnemy.png");
await PIXI.Assets.load("shipLaser.png");

let player = PIXI.Sprite.from("ship.png");

player.width = 150;
player.height = 150;

player.x = 280;
player.y = 500;

app.stage.addChild(player);

let keys = {};

function deleteLaster(child) {
  app.stage.removeChild(child);
}

function fireLaser() {
  let laserBlast = PIXI.Sprite.from("shipLaser.png");

  laserBlast.width = 100;
  laserBlast.height = 100;

  laserBlast.x = player.x + 25;
  laserBlast.y = player.y - 80;

  app.stage.addChild(laserBlast);

  app.ticker.add(() => {
    laserBlast.y -= 10;
  });

  let laserInterval = setInterval(() => deleteLaster(laserBlast), 1000);
}

let lasterCooldown = 0;

function updateMovment(keys) {
  if (keys["w"]) {
    if (lasterCooldown > 0) {
      console.log("cooldown");
    } else {
      console.log("shot");
      lasterCooldown = 10;
      fireLaser();
    }
  }
  if (keys["a"]) {
    if (player.x < 10) {
      player.x -= 0;
    } else {
      player.x -= 7;
    }
  }
  if (keys["d"]) {
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
  if (lasterCooldown > 0) {
    lasterCooldown -= 1;
  }
});
