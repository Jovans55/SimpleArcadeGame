console.log("Game spinning up");

const app = new PIXI.Application();

await app.init({ width: 700, height: 700 });
document.body.appendChild(app.canvas);

await PIXI.Assets.load("ship.png");
await PIXI.Assets.load("tempEnemy.png");
await PIXI.Assets.load("shipLaser.png");
await PIXI.Assets.load("enemyLaser.png");

// let testEnemy = PIXI.Sprite.from("tempEnemy.png");

// testEnemy.width = 55;
// testEnemy.height = 55;

// testEnemy.x = 300;
// testEnemy.y = 50;

// app.stage.addChild(testEnemy);

let player = PIXI.Sprite.from("ship.png");

player.width = 100;
player.height = 100;

player.x = 280;
player.y = 550;

app.stage.addChild(player);

let keys = {};

let enemis = {};

function createEnemy() {
  let enemy = PIXI.Sprite.from("tempEnemy.png");

  enemy.width = 55;
  enemy.height = 55;
  const randomNum = Math.floor(Math.random() * 600);
  enemy.x = randomNum;
  enemy.y = 50;

  app.stage.addChild(enemy);
  enemis[randomNum] = enemy;
}

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
          if (enemis[enemy]) {
            enemis[enemy].y += 0.1;
          }
          laserBlast.y += 10;
        });

        let laserInterval = setInterval(() => deleteLaster(laserBlast), 1000);
      }
    }
    laserCooldownEnemis = 50;
  }
}

let laserCooldown = 0;

let enemySpawnerCooldown = 0;

let howManyEnemies = 4;

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

  if (enemySpawnerCooldown <= 0) {
    howManyEnemies += 1;
    let chanceOfEnemies = Math.floor(Math.random() * 10);
    if (chanceOfEnemies >= 6) {
      for (let i = 0; i < Math.floor(Math.random() * howManyEnemies); i++) {
        createEnemy();
      }
      enemySpawnerCooldown = 200;
    }
  } else {
    enemySpawnerCooldown -= 1;
  }
});
