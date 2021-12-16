const serverUrl = "https://jssa74qum3dp.usemoralis.com:2053/server";
const appId = "Jgtx83pRi6Cklall43XpAcYN4397BbPxXC6Y55WG";

/* Initialize moralis  */
Moralis.start({ serverUrl, appId });

var game;
var gameOptions = {

    // bear gravity, will make bear fall if you don't flap
    bearGravity: 800,

    // horizontal bear speed
    bearSpeed: 125,

    // flap thrust
    bearFlapPower: 300,

    // minimum asteroid height, in pixels. Affects hole position
    minasteroidHeight: 50,

    // distance range from next asteroid, in pixels
    asteroidDistance: [220, 280],

    // hole range between asteroids, in pixels
    asteroidHole: [100, 130],

    // local storage object name
    localStorageName: 'bestFlappyScore'
}
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        //backgroundColor:0x87ceeb,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'thegame',
            width: 320,
            height: 480
        },
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
class playGame extends Phaser.Scene{
    constructor(){
        super('PlayGame');
    }
    preload(){
        this.load.image('background','background.jpg')
        this.load.image('bear', 'bear.png');
        this.load.image('asteroid', 'asteroid.png');
    }
    create(){
        this.add.image(400, 300,'background')
        this.asteroidGroup = this.physics.add.group();
        this.asteroidPool = [];
        for(let i = 0; i < 4; i++){
            this.asteroidPool.push(this.asteroidGroup.create(0, 0, 'asteroid'));
            this.asteroidPool.push(this.asteroidGroup.create(0, 0, 'asteroid'));
            this.placeasteroids(false);
        }
        this.asteroidGroup.setVelocityX(-gameOptions.bearSpeed);
        this.bear = this.physics.add.sprite(80, game.config.height / 2, 'bear');
        this.bear.body.gravity.y = gameOptions.bearGravity;
        this.input.on('pointerdown', this.flap, this);
        this.score = 0;
        this.topScore = localStorage.getItem(gameOptions.localStorageName) == null ? 0 : localStorage.getItem(gameOptions.localStorageName);
        this.scoreText = this.add.text(10, 10, '');

        const user = Moralis.User.current();

        if(user) 
            this.add.text(10, 45, `User: ${user.id}`);
            
        this.updateScore(this.score);
    }
    updateScore(inc){
        this.score += inc;
        this.scoreText.text = 'Score: ' + this.score + '\nBest: ' + this.topScore;
    }

    placeasteroids(addScore){
        let rightmost = this.getRightmostasteroid();
        let asteroidHoleHeight = Phaser.Math.Between(gameOptions.asteroidHole[0], gameOptions.asteroidHole[1]);
        let asteroidHolePosition = Phaser.Math.Between(gameOptions.minasteroidHeight + asteroidHoleHeight / 2, game.config.height - gameOptions.minasteroidHeight - asteroidHoleHeight / 2);
        this.asteroidPool[0].x = rightmost + this.asteroidPool[0].getBounds().width + Phaser.Math.Between(gameOptions.asteroidDistance[0], gameOptions.asteroidDistance[1]);
        this.asteroidPool[0].y = asteroidHolePosition - asteroidHoleHeight / 2;
        this.asteroidPool[0].setOrigin(0, 1);
        this.asteroidPool[1].x = this.asteroidPool[0].x;
        this.asteroidPool[1].y = asteroidHolePosition + asteroidHoleHeight / 2;
        this.asteroidPool[1].setOrigin(0, 0);
        this.asteroidPool = [];
        if(addScore){
            this.updateScore(1);
        }
    }
    flap(){
        this.bear.body.velocity.y = -gameOptions.bearFlapPower;
    }
    getRightmostasteroid(){
        let rightmostasteroid = 0;
        this.asteroidGroup.getChildren().forEach(function(asteroid){
            rightmostasteroid = Math.max(rightmostasteroid, asteroid.x);
        });
        return rightmostasteroid;
    }
    update(){
        this.physics.world.collide(this.bear, this.asteroidGroup, function(){
            this.die();
        }, null, this);
        if(this.bear.y > game.config.height || this.bear.y < 0){
            this.die();
        }
        this.asteroidGroup.getChildren().forEach(function(asteroid){
            if(asteroid.getBounds().right < 0){
                this.asteroidPool.push(asteroid);
                if(this.asteroidPool.length == 2){
                    this.placeasteroids(true);
                }
            }
        }, this)
    }
    die(){
        localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
        this.scene.start('PlayGame');
    }
}
