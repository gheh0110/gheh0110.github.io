export default class Asteroid extends Phaser.Group {
    constructor(game, parent) {
        super(game, parent);
        let world = game.world;

        this.enableBody = true;
        
        this.topAsteroid = this.create(world.width, 0, 'asteroid');
        this.topAsteroid.y = (Math.floor(Math.random() * 3) + 2) * world.height / 8 - this.topAsteroid.height;

        this.bottomAsteroid = this.create(world.width, 0, 'asteroid');
        this.bottomAsteroid.y = this.topAsteroid.y + this.topAsteroid.height + world.height / 8 * 2;

        this.pass = false;

        this.setAll('body.allowGravity', false);
        this.setAll('body.immovable', true);
        this.setAll('body.velocity.x', -60);
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
    }

    stop() {
        this.setAll('body.velocity.x', 0);
    }
}