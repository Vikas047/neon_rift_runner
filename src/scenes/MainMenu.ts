import { Scene } from "phaser";
import { GameData } from "../utils/GameData";

export class MainMenu extends Scene {
	constructor() {
		super("MainMenu");
	}

	create(): void {
		// Use solid background color matching the equipped background theme
		const bgKey = GameData.getEquippedBackground();
		const bgColor = GameData.getBackgroundColor(bgKey);
		this.cameras.main.setBackgroundColor(bgColor);
		
		// Create gradient overlay (dark on top, light below)
		this.createGradient(bgColor);
		
		// Title logo - always use original color
		this.add.image(512, 330, "logo").setScale(0.65);
		
		// Play Button Text
		this.add
			.text(512, 560, "PLAY", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		// Shop Button
		const shopBtn = this.add
			.text(512, 640, "SHOP", {
				fontFamily: "Arial Black",
				fontSize: 32,
				color: "#ffb600",
				stroke: "#000000",
				strokeThickness: 6,
				align: "center",
			})
			.setOrigin(0.5)
			.setInteractive({ cursor: "pointer" });

		shopBtn.on("pointerdown", () => {
			this.scene.start("Shop");
		});

		// Navigation
		this.setupNavigation();
	}

	private createGradient(baseColor: number): void {
		// Extract RGB components from the color
		const r = (baseColor >> 16) & 0xff;
		const g = (baseColor >> 8) & 0xff;
		const b = baseColor & 0xff;
		
		// Create darker version for top (much darker - 30% brightness)
		const darkR = Math.max(0, Math.floor(r * 0.3));
		const darkG = Math.max(0, Math.floor(g * 0.3));
		const darkB = Math.max(0, Math.floor(b * 0.3));
		const darkColor = (darkR << 16) | (darkG << 8) | darkB;
		
		// Create lighter version for bottom (much lighter - 180% brightness)
		const lightR = Math.min(255, Math.floor(r * 1.8));
		const lightG = Math.min(255, Math.floor(g * 1.8));
		const lightB = Math.min(255, Math.floor(b * 1.8));
		const lightColor = (lightR << 16) | (lightG << 8) | lightB;
		
		// Create gradient using Graphics
		const gradient = this.add.graphics();
		const height = 768;
		const width = 1024;
		const steps = 50; // Number of gradient steps for smooth transition
		
		for (let i = 0; i < steps; i++) {
			const y = (i / steps) * height;
			const progress = i / (steps - 1);
			
			// Interpolate between dark and light colors
			const currentR = Math.floor(darkR + (lightR - darkR) * progress);
			const currentG = Math.floor(darkG + (lightG - darkG) * progress);
			const currentB = Math.floor(darkB + (lightB - darkB) * progress);
			const currentColor = (currentR << 16) | (currentG << 8) | currentB;
			
			gradient.fillStyle(currentColor, 1);
			gradient.fillRect(0, y, width, height / steps + 1);
		}
		
		gradient.setDepth(-1); // Place behind everything
	}

	private setupNavigation(): void {
		const isMobile = this.sys.game.device.input.touch;

		// Start Game Area (invisible on top of text)
		const startArea = this.add
			.rectangle(512, 560, 300, 80, 0x000000, 0)
			.setInteractive({ cursor: "pointer" });

		startArea.on("pointerdown", () => {
			this.scene.start("Game");
		});
	}
}
