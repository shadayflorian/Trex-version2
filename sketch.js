
var trex ,trex_running;
var ground, groundImage, invisibleGround;
var cloud, cloudImg;
var obstacle, obstacle1, obstacle2, obstacle3;
var obstacle4, obstacle5, obstacle6;
var rand;
var score;
var play = 1;
var end = 0;
var gameState = play;
var cloudsGroup, obstaclesGroup;
var gameOver, gameOverImg;
var restart, restartImg;
var trex_collide;
var jumpSound, dieSound, checkPointSound;
var saludo;

function preload(){
  trex_running  = loadAnimation("trex1.png", "trex3.png", "trex4.png");
 
  //cargar imagen del suelo
  groundImage = loadImage("ground2.png");

  cloudImg = loadImage("cloud.png");

  //cargar imagenes obstaculos
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")

  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")

  trex_collide = loadImage("trex_collided.png")

  jumpSound = loadSound("jump.mp3")

  dieSound = loadSound("die.mp3")

  checkPointSound = loadSound("checkPoint (1).mp3")  
}

function setup(){
  createCanvas(windowWidth, windowHeight);
 
   saludo = "Hola Mundo 000"
  
  //crear sprite de Trex
  trex = createSprite(50, height-70, 20, 50);
  trex.addAnimation("running", trex_running)
  trex.addAnimation("collided", trex_collide)
  trex.debug = true
  trex.setCollider("circle", 0, 0, 30)
  trex.scale = 0.5;
  

  gameOver = createSprite(300, 100)
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(300, 150)
  restart.addImage(restartImg)
  restart.scale = 0.5;
  restart.visible = false;

  //suelo
  ground = createSprite(width/2, height-10, width, 20);
  //agregar imagen y reiniciar el suelo
  ground.addImage("ground", groundImage);
  //crear suelo invisible
  invisibleGround = createSprite(width/2, height-10, width, 125);
  invisibleGround.visible = false;

  console.log("hola " + "chicos");

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  score = 0;
}

function draw(){
  background("white")

  console.log(saludo);

  text("Puntuacion: " + score, 500, 50);

  
  
  if(gameState == play){

   score = score + Math.round(frameCount/60);

    //mover el suelo
   ground.velocityX = -2;

   if(touches.length > 0 || keyDown("space") && trex.y >= 100){
    trex.velocityY = -10;
    jumpSound.play();
    touches = []
   }

   //reestablecer el suelo
   if(ground.x < 0){
    ground.x  = ground.width/2;
   }

   if(score > 0 && score % 500 == 0){
    checkPointSound.play()
   }

   

   spawnCloud();
   spawnObstacles();

   if(obstaclesGroup.isTouching(trex)){
    gameState = end;
    dieSound.play();
   }

  }else if(gameState == end){
   ground.velocityX = 0;
   restart.visible = true;
   gameOver.visible = true;
   obstaclesGroup.setVelocityXEach(0);
   cloudsGroup.setVelocityXEach(0);
   trex.changeAnimation("collided", trex_collide)
   obstaclesGroup.setLifetimeEach(-1)
   cloudsGroup.setLifetimeEach(-1)

}
  
  //console.log("velocidad del suelo" + ground.x)

  if(mousePressedOver(restart)){
    //nombre funcion
    reset();
  }

  //console.log(trex.y)
  trex.velocityY = trex.velocityY + 0.8;

  //cambiar a suelo invisible
  trex.collide(invisibleGround)

 

 drawSprites();
}

function spawnCloud(){
  if(frameCount % 60 == 0 ){
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.y = Math.round(random(10, 100))

    console.log("profundidad del trex" + trex.depth);
    console.log("profundidad de las nubes" + cloud.depth);

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloud.lifeTime = 300;

    cloudsGroup.add(cloud)
  }
 
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    obstacle = createSprite(600, height-20, 10, 40);
    obstacle.velocityX = -3;
   
    rand = Math.round(random(1, 6))
    obstacle.scale = 0.5;
    obstacle.lifeTime = 300;

    if(score > 0 && score % 100 == 0){
      obstacle.velocityX = -(6 + score/100)
     }

    switch(rand){
      case 1:
        obstacle.addImage(obstacle1)
        break;
      case 2: 
       obstacle.addImage(obstacle2)
       break;
      case 3: 
       obstacle.addImage(obstacle3)
       break;
      case 4:
        obstacle.addImage(obstacle4)
        break;
      case 5:
        obstacle.addImage(obstacle5)
        break;
      case 6:
        obstacle.addImage(obstacle6)
        break;
      default: break;

    }

    obstaclesGroup.add(obstacle)
  }
  
}

function reset(){
  gameState = play;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running)
  score = 0;
}