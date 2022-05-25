var restart, gameover, restartSprite, gameoverSprite
var trex, trex_running, trexIsDead;
var groundImage, ground;
var falseGround;
var cloud, cloudImg;
var cactuSprite, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;
var cactusGroup;
var cloudGroup;
var jogoEst = "play";
var cactuSound, checkSound, jumpSound
var score = 0
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexIsDead = loadImage("trex_collided.png")
  groundImage = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  restart = loadImage("restart.png")
  gameover = loadImage("gameOver.png")
  cactuSound = loadSound("die.mp3")
  checkSound = loadSound("checkpoint.mp3")
  jumpSound = loadSound("jump.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //criando o trex
  restartSprite = createSprite(width/2, height/2)
  restartSprite.addImage("restart.png", restart)
  restartSprite.scale = 0.5
  restartSprite.visible = false
  gameoverSprite = createSprite(width/2, height/2 - 35)
  gameoverSprite.addImage("gameOver.png", gameover)
  gameoverSprite.scale = 0.8
  gameoverSprite.visible = false
  trex = createSprite(50, height -40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addImage("trex_collided", trexIsDead)
  trex.scale = 0.5;
  trex.x = 50;
  cactusGroup = new Group()
  cloudGroup = new Group()
  ground = createSprite(width/2, height -20);
  ground.addImage("chao", groundImage);
  falseGround = createSprite(width/2, height -19, width, 1);
  falseGround.visible = false;
  trex.debug = false
  trex.setCollider ("circle", 0, -0, 40)
 //trex.setCollider("rectangle", 60, 0, 100, 200, 90)
}

function draw() {
  //definir a cor do plano de fundo
  background("white");
  text("points:"+score, 535, 10)
  if(score > 0 && score%100 === 0) {
   checkSound.play()
  }
  if(jogoEst === "play") {
    //score = score + Math.round(frameCount/120)
    score = score + Math.round(getFrameRate()/60);
      if (touches.length>0||keyDown("space") && trex.y > height - 60) {
    trex.velocityY = -10;
    jumpSound.play()
    touches = []
  }
  trex.velocityY = trex.velocityY + 0.5;
  ground.velocityX = -10;
  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }
  cloudSet();
  cactus();
  if(trex.isTouching(cactusGroup)) {
    jogoEst = "gameOver"
    cactuSound.play()
  }
  } 
  else if(jogoEst === "gameOver") {
    trex.changeAnimation("trex_collided", trexIsDead)
    ground.velocityX = 0
    cactusGroup.setVelocityXEach(0)
    cloudGroup.setVelocityXEach(0)
    cactusGroup.setLifetimeEach(-1)
    cloudGroup.setLifetimeEach(-1)
    gameoverSprite.visible = true
    restartSprite.visible = true
    trex.velocityY = 0
    if(touches.length>0||mousePressedOver(restartSprite)) {
    reset()
    touches = []
    }
  }

  //impedir que o trex caia
  trex.collide(falseGround);
  drawSprites();
}
function reset() {
  jogoEst = "play"
  trex.changeAnimation("running", trex_running)
  cactusGroup.destroyEach()
  cloudGroup.destroyEach()
  gameoverSprite.visible = false
  restartSprite.visible = false
  score = 0
}
function cloudSet() {
  if (frameCount % 50 === 0) {
    console.log("cloud")
    cloud = createSprite(width, 100);
    cloud.addImage(cloudImg);
    cloud.velocityX = -7;
    cloud.y = Math.round(random(0, height - 60));
    cloud.scale = Math.round(random(0.5, 0.7));
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = 1000;
    cloudGroup.add(cloud)
  }
}

function cactus() {
  if (frameCount % 40 === 0) {
    cactuSprite = createSprite(width, height - 40, 30, 30);
    cactuSprite.scale = 0.7;
    cactuSprite.velocityX = -(8+score/100);
    cactuSprite.lifetime = 1000;
    cactusGroup.add(cactuSprite)
    randomic = Math.round(random(1, 6));
    switch (randomic) {
      case 1:
        cactuSprite.addImage(cactus1);
        break;

      case 2:
        cactuSprite.addImage(cactus2);
        break;
      case 3:
        cactuSprite.addImage(cactus3);
        break;
      case 4:
        cactuSprite.addImage(cactus4);
        break;
      case 5:
        cactuSprite.addImage(cactus5);
        break;
      case 6:
        cactuSprite.addImage(cactus6);
        break;

      default:
        break;
    }
  }
}
