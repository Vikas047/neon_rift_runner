import { Scene } from "phaser";
import { GameData } from "../utils/GameData";

export class Boot extends Scene {
	constructor() {
		super("Boot");
	}

	preload(): void {
		// No need to load background image, using solid color
	}

	create(): void {
		// Use solid background color matching the equipped background theme
		// Default to desert mirage if GameData not initialized yet
		const bgKey = GameData.getEquippedBackground();
		const bgColor = GameData.getBackgroundColor(bgKey);
		this.cameras.main.setBackgroundColor(bgColor);
		
		this.scene.start("Preloader");
	}
}
