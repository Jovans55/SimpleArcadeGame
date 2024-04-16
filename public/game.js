console.log("Game spinning up");

const app = new PIXI.Application();

await app.init({ width: 700, height: 700 });
document.body.appendChild(app.canvas);

await PIXI.Assets.load("ship.png");
await PIXI.Assets.load("tempEnemy.png");
await PIXI.Assets.load("shipLaser.png");

let testEnemy = PIXI.Sprite.from("tempEnemy.png");

testEnemy.width = 55;
testEnemy.height = 55;

testEnemy.x = 300;
testEnemy.y = 50;

app.stage.addChild(testEnemy);

let player = PIXI.Sprite.from("ship.png");

player.width = 100;
player.height = 100;

player.x = 280;
player.y = 550;

app.stage.addChild(player);

let keys = {};

function deleteLaster(child) {
  app.stage.removeChild(child);
}

function fireLaser() {
  let laserBlast = PIXI.Sprite.from("shipLaser.png");

  laserBlast.width = 50;
  laserBlast.height = 50;

  laserBlast.x = player.x + 25;
  laserBlast.y = player.y - 10;

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
