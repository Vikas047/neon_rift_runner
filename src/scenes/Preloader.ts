import { Scene } from "phaser";

export class Preloader extends Scene {
	constructor() {
		super("Preloader");
	}

	init(): void {
		this.add.image(512, 384, "background");
		this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
	}

	preload(): void {
		this.load.setPath("assets");

		this.load.image("logo", "images/ui/jumper-title.png");
		// Backgrounds
		this.load.image("bg-day", "images/background/bg.png");
		this.load.image("bg-sunset", "images/background/bg-sunset.png");
		this.load.image("bg-night", "images/background/bg-night.png");
		this.load.image("bg-forest", "images/background/bg-forest.png");
		this.load.image("bg-winter", "images/background/bg-winter.png");
		this.load.image("bg-volcano", "images/background/bg-volcano.png");
		this.load.image("bg-ocean", "images/background/bg-ocean.png");
		this.load.image("bg-space", "images/background/bg-space.png");
		this.load.image("bg-city", "images/background/bg-city.png");
		this.load.image("bg-storm", "images/background/bg-storm.png");
		this.load.image("bg-desert", "images/background/bg-desert.png");
		
		this.load.image("sky", "images/background/sky.png");
		this.load.image("platform-sm", "images/platforms/platform-sm-i.png");
		this.load.image("platform-lg", "images/platforms/platform-lg-i.png");
		this.load.image("left-button", "images/controls/icons8-left-arrow.png");
		this.load.image("right-button", "images/controls/icons8-right-arrow.png");
		this.load.image("jump-button", "images/controls/icons8-up-arrow.png");
		this.load.image("floor", "images/platforms/floor.png");
		this.load.image("bomb", "images/items/bomb-i.png");
		this.load.spritesheet("coin", "images/items/coin.png", {
			frameWidth: 18,
			frameHeight: 18,
		});
		this.load.spritesheet("dude", "images/characters/jumper-hero.png", {
			frameWidth: 32,
			frameHeight: 48,
		});
		this.load.spritesheet("dude-red", "images/characters/jumper-hero-red.png", { frameWidth: 32, frameHeight: 48 });
		this.load.spritesheet("dude-green", "images/characters/jumper-hero-green.png", { frameWidth: 32, frameHeight: 48 });
		this.load.spritesheet("dude-yellow", "images/characters/jumper-hero-yellow.png", { frameWidth: 32, frameHeight: 48 });
		this.load.spritesheet("dude-purple", "images/characters/jumper-hero-purple.png", { frameWidth: 32, frameHeight: 48 });
		this.load.spritesheet("dude-orange", "images/characters/jumper-hero-orange.png", { frameWidth: 32, frameHeight: 48 });

		this.load.audio("collectSound", "audio/collect.mp3");
		this.load.audio("explosionSound", "audio/bmb-ex-ii.mp3");
	}

	create(): void {
		this.scene.start("MainMenu");
	}
}
