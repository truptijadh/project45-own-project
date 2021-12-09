var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bg;
var bgImage;

var player, player_running,player_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  player_running = 
loadAnimation("runner1.png","runner2.png","runner3.png","runner4.png","runner5.png","runner6.png","runner7.png","runner8.png")
  playercollided = loadImage("runner1.png");
  bgImage = loadImage("bg.png")
  groundImage = loadImage("race.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("h1.png");
  obstacle2 = loadImage("h2.png");
  obstacle3 = loadImage("h3.png");
  obstacle4 = loadImage("h4.png");
  obstacle5 = loadImage("h2.png");
  obstacle6 = loadImage("h3.png");
  
  restartImg = loadImage("restart.jpg")
  gameOverImg = loadImage("gameover.jpg")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  
 
  bg = createSprite(300,130,600,200);
  player = createSprite(50,160,20,50);
  player.addAnimation("running", player_running);
  bg.addImage("bg",bgImage)
  bg.scale = 0.7

  player.scale = 0.2;
  
  ground = createSprite(200,300,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.4;
  restart.scale = 0.08;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  player.setCollider("rectangle",0,0,100,300);
  
  score = 0;
  
}

function draw() {
  
  background("white");
  fill("red")
  text("Score: "+ score, 0,10);

  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -8 ;
    score = score + Math.round(frameRate()/30);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    player.depth = ground.depth+1
    
    if(keyDown("space")&& player.y >= 130) {
        player.velocityY = -8;
        jumpSound.play();
    }
    
    player.velocityY =player.velocityY + 0.8
  
    spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(player)){
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     
     
      ground.velocityX = 0;
      player.velocityY = 0
      
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    

     
   }
  
 
  player.collide(invisibleGround);
  
  if(mousePressedOver(restart)&&gameState === END) {
      gameState = PLAY
     obstaclesGroup.setLifetimeEach(0);
    cloudsGroup.setLifetimeEach(0);
    score = 0;
    player.x = 50;
    player.y = 160;
     player.changeAnimation("running", player_running);

    }


  drawSprites();
}

function reset(){
  

}


function spawnObstacles(){
 if (frameCount % 50 === 0){
   var obstacle = createSprite(600,170,10,40);
   obstacle.velocityX = -(6 + 3*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
   obstacle.setCollider("rectangle",0,0,200,400)
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;
    
    cloud.depth = player.depth;
    player.depth = player.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}

