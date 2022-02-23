var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2, height-20, width, 2);
  ground.addImage("ground",groundImage);
  ground.x = width /2;
  
   gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2, height/2-50);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2, height, width, 10);
  invisibleGround.visible = false;
  
  //create grupos de onstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  trex.setCollider("circle",0,0,50);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background("papayawhip");
  //mostrar puntuación
  textSize(20);
  text("Puntuación: "+ score, width/2,50);
  
  
  
   
  
  if(gameState === PLAY){
    //hacemos nuestro gameOver y restart invisible
    gameOver.visible = false;
    restart.visible = false;  
    //mover el suelo
    ground.velocityX = -(4 + 3 * score / 1000);
    //puntuación
    score = score + Math.round(getFrameRate()/60);
    if(score > 0 && score%1000 === 0){
      checkPointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = width/2;
    }
    
    //hacer que el Trex salte al presionar la barra espaciadora
    if((touches.length>0||keyDown("space"))&& trex.y >= height-120) {
      jumpSound.play();   
        trex.velocityY = -12;
        touches=[];
    }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play(); 
        //activar bot
        //trex.velocityY = -12;
        //jumpSound.play();
    }
  }
   else if (gameState === END) {

      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //cambiar la animación del Trex
      trex.changeAnimation("collided", trex_collided);
     
      //establecer Lifetime (ciclo de vida) de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //evitar que el Trex caiga
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    console.log("reiniciar juego");
    reset();
  }
  
  drawSprites();
}

function reset(){
  gameState =PLAY;
  score = 0,
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width-15,height-25,10,40);
   obstacle.velocityX = -(6 + score/1000);
   
   
    //generar obstáculos al azar
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
   
    //asignar escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+30,height+600,40,10);
    cloud.y = Math.round(random(10,250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.8;
    cloud.velocityX = -3;
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 134;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar nube al grupo
   cloudsGroup.add(cloud);
    }
}