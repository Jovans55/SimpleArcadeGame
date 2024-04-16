console.log("Game spinning up");

const app = new PIXI.Application();

await app.init({ width: 700, height: 700 });
document.body.appendChild(app.canvas);

await PIXI.Assets.load("ship.png");
await PIXI.Assets.load("tempEnemy.png");
await PIXI.Assets.load("shipLaser.png");
await PIXI.Assets.load("enemyLaser.png");

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

let enemis = {};

enemis[1] = testEnemy;

function deleteLaster(child) {
  app.stage.removeChild(child);
}

function isColliding(a, b) {
  let ab = a.getBounds();
  let bb = b.getBounds();
  return (
    ab.x + ab.width > bb.x &&
    ab.x < bb.x + bb.width &&
    ab.y + ab.height > bb.y &&
    ab.y < bb.y + bb.height
  );
}

function fireLaserPlayer() {
  let laserBlast = PIXI.Sprite.from("shipLaser.png");

  laserBlast.width = 50;
  laserBlast.height = 50;

  laserBlast.x = player.x + 25;
  laserBlast.y = player.y - 10;

  app.stage.addChild(laserBlast);

  app.ticker.add(() => {
    for (const enemy in enemis) {
      if (isColliding(laserBlast, enemis[enemy])) {
        app.stage.removeChild(enemis[enemy]);
        delete enemis[enemy];
      }
    }

    laserBlast.y -= 10;
  });

  let laserInterval = setInterval(() => deleteLaster(laserBlast), 1000);
}

let laserCooldownEnemis = 0;

function fireLaserEnemy() {
  if (laserCooldownEnemis <= 0) {
    for (const enemy in enemis) {
      const roll = Math.floor(Math.random() * 10);
      if (roll >= 6) {
        let laserBlast = PIXI.Sprite.from("enemyLaser.png");

        laserBlast.width = 50;
        laserBlast.height = 50;

        laserBlast.x = enemis[enemy].x + 5;
        laserBlast.y = enemis[enemy].y + 25;

        app.stage.addChild(laserBlast);

        app.ticker.add(() => {
          if (isColliding(laserBlast, player)) {
            app.stage.removeChild(player);
          }

          laserBlast.y += 10;
        });

        let laserInterval = setInterval(() => deleteLaster(laserBlast), 1000);
      }
    }
    laserCooldownEnemis = 30;
  }
}

let laserCooldown = 0;

function updateMovment(keys) {
  if (keys["w"]) {
    if (laserCooldown > 0) {
    } else {
      laserCooldown = 10;
      fireLaserPlayer();
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
  fireLaserEnemy();
  if (laserCooldown > 0) {
    laserCooldown -= 1;
  }
  if (laserCooldownEnemis > 0) {
    laserCooldownEnemis -= 1;
  }
});
