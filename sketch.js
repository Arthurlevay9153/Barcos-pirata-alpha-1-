const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var balls = [];
var barcos = [];
var barcosprites
var barcosjson
var barcosanimation = [];
var barcosprites2
var barcosjson2 //2 = quebrado
var barcosanimation2 = [];
var somtiro // som quando atirar a bola de canhao
var tirodagua // tiro quando a bola cair na agua
var piratarindo // som quando voce perde
var somdefundo // trilha sonora
var risada = false

function preload() {
  backgroundImg = loadImage("assets/background.gif");
  towerImage = loadImage("assets/tower.png");
  barcosjson = loadJSON("assets/boat/boat.json");
  barcosprites = loadImage("assets/boat/boat.png"); //tem assets e boat porque o boat.png esta dentro destas 2 pastas
  barcosjson2 = loadJSON("assets/boat/broken_boat.json");
  barcosprites2 = loadImage("assets/boat/broken_boat.png");
  somtiro = loadSound("assets/cannon_explosion.mp3") // veja a linha 16,17,18 e 19 pra enterder esses soms abaixo linhas 28,29,30,31
  tirodagua = loadSound("assets/cannon_water.mp3");
  piratarindo = loadSound("assets/pirate_laugh.mp3");
  somdefundo = loadSound("assets/assets_piratasdocaribe.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600); // tamanho do jogo
  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);
  angle = 15;

  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  var barcoframes = barcosjson.frames

  for(var i=0;i<barcoframes.length; i++){
 
  var pos = barcoframes[i].position //pos = das json
  
  var imagem = barcosprites.get(pos.x,pos.y,pos.w,pos.h)

  barcosanimation.push(imagem)

  var barcoframes = barcosjson.frames
  
  }

  var barcoframes2 = barcosjson2.frames

  for(var i=0;i<barcoframes2.length; i++){
 
  var pos = barcoframes2[i].position //pos = das json
  
  var imagem = barcosprites2.get(pos.x,pos.y,pos.w,pos.h)

  barcosanimation2.push(imagem)

  var barcoframes2 = barcosjson2.frames
  
  }
}

function draw() {
  background("black");

  if(!somdefundo.isPlaying()){//comando para quando a trilha sonora parar, automaticamente volta
    
    somdefundo.play()

    somdefundo.setVolume(0.3)//volume da musica(porque a musica estara muita auta caso nao tenha esse codigo)
  }

  Engine.update(engine);

  rect(ground.position.x, ground.position.y, width * 2, 1);

  image(backgroundImg, 0, 0, width, height);
  

  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i],i);

    colisao(i); //comando real esta na linha 121
  }

  cannon.display();

  criarbarcos()
}

// trajetoria e criar a bola
function keyPressed() {
  if (keyCode === 32) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

//aparecer a bola do canhao no jogo
function showCannonBalls(ball,index) {
  if (ball) {
    ball.display();

    if (ball.body.position.x>width||ball.body.position.y>=height-10){
    
      //colocar codigo aqui
      World.remove(world,balls[index].body)
   delete balls[index]
   tirodagua.play()
    }
  }
}

// comando para a bola ser atirada
function keyReleased() {
  if (keyCode === 32) { // codigo do espaço(numero da tecla espaco)
    balls[balls.length - 1].shoot();
    somtiro.play()
  }
}

//comando para criar os barcos
function criarbarcos(){
  if(barcos.length>0){
  
  if(barcos.length<4&&barcos[barcos.length-1].body.position.x<width-300){
    
   var posicoes = [-40,-60,-80,-70] 

   var posicao = random(posicoes)

   var barco = new Barco(width,height-50,170,170,posicao,barcosanimation);
   
   barcos.push(barco);

   
  }  

  for(var i = 0;i<barcos.length;i++){

    Matter.Body.setVelocity(barcos[i].body,{x:-0.9,y:0})

    barcos[i].display()

    barcos[i].animar()

    var colisao = Matter.SAT.collides(tower,barcos[i].body) //colisao entre o barco e a torre

    if(colisao.collided){
    
    gameover()  
    }
  }

  }

  //comando pra quando nao tiver nenhum barco no jogo
  // irá criar mais 1 barcos
  else{

    var barco = new Barco(width,height-50,170,170,-60,barcosanimation);

    barcos.push(barco)
  }
}

//comado pra deletar a bola e os barcos
function colisao(index){

for(var i=0;i<barcos.length;i++){
  if(balls[index]!==undefined && barcos[i]!==undefined){

  var colision = Matter.SAT.collides(balls[index].body,barcos[i].body)  

  if(colision.collided){

   World.remove(world,balls[index].body)
   delete balls[index]
   barcos[i].remove(i);
  }
  }
}  
}

function gameover(){

swal({
title: "gameover", //texto que voce perdeu
text: "os piratas invadiram sua torre", //motivo pelo qual voce perdeu
imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png", // imagem do barco do jogo(statica)
imageSize:"150x150", //tamanho da imagem
confirmBottonText: "jogar novamente" //texto pra voce jogar de novo
},(isconfirme)=>{
if(isconfirme){
location.reload();
  
}  
})
if(!risada&&!piratarindo.isPlaying()){
  piratarindo.play() //musica de fim de jogo 
  risada = true
}
}