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
		
		// Title logo with dynamic tint based on background (original color for sunny day)
		const titleLogo = this.add.image(512, 350, "logo").setScale(0.3);
		if (bgKey !== "bg-day") {
			const titleColor = GameData.getTitleColor(bgKey);
			titleLogo.setTint(titleColor);
		}
		
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
