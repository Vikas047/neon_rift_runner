import { Scene } from "phaser";
import { GameData, SKINS, BACKGROUNDS, ShopItem } from "../utils/GameData";

export class Shop extends Scene {
	private balanceText: Phaser.GameObjects.Text;
	private itemsContainer: Phaser.GameObjects.Container;
	private currentTab: "skins" | "backgrounds" = "skins";

	constructor() {
		super("Shop");
	}

	create(): void {
		// Background
		this.add.image(512, 384, "bg-day").setTint(0x666666); // Darken bg for shop

		// Title
		this.add
			.text(512, 50, "SHOP", {
				fontFamily: "Arial Black",
				fontSize: 48,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
			})
			.setOrigin(0.5);

		// Balance
		this.balanceText = this.add
			.text(512, 100, `Coins: ${GameData.getCoins()}`, {
				fontFamily: "Arial",
				fontSize: 32,
				color: "#ffb600",
				stroke: "#000000",
				strokeThickness: 4,
			})
			.setOrigin(0.5);

		// Tabs
		this.createTabs();

		// Back Button
		const backButton = this.add
			.text(100, 50, "<- BACK", {
				fontFamily: "Arial Black",
				fontSize: 24,
				color: "#ffffff",
				backgroundColor: "#333333",
				padding: { x: 10, y: 5 },
			})
			.setOrigin(0.5)
			.setInteractive({ cursor: "pointer" });

		backButton.on("pointerdown", () => {
			this.scene.start("MainMenu");
		});

		// Initial Content
		this.showItems("skins");
	}

	private createTabs(): void {
		const y = 150;
		
		const skinsTab = this.add
			.text(300, y, "SKINS", {
				fontFamily: "Arial Black",
				fontSize: 28,
				color: this.currentTab === "skins" ? "#ffffff" : "#888888",
			})
			.setOrigin(0.5)
			.setInteractive({ cursor: "pointer" });

		const bgTab = this.add
			.text(724, y, "BACKGROUNDS", {
				fontFamily: "Arial Black",
				fontSize: 28,
				color: this.currentTab === "backgrounds" ? "#ffffff" : "#888888",
			})
			.setOrigin(0.5)
			.setInteractive({ cursor: "pointer" });

		skinsTab.on("pointerdown", () => {
			this.currentTab = "skins";
			skinsTab.setColor("#ffffff");
			bgTab.setColor("#888888");
			this.showItems("skins");
		});

		bgTab.on("pointerdown", () => {
			this.currentTab = "backgrounds";
			bgTab.setColor("#ffffff");
			skinsTab.setColor("#888888");
			this.showItems("backgrounds");
		});
	}

	private showItems(type: "skins" | "backgrounds"): void {
		if (this.itemsContainer) {
			this.itemsContainer.destroy();
		}

		this.itemsContainer = this.add.container(0, 0);
		const items = type === "skins" ? SKINS : BACKGROUNDS;

		let x = 250;
		let y = 300;
		const cols = 3;
		const paddingX = 250;
		const paddingY = 200;

		items.forEach((item, index) => {
			const col = index % cols;
			const row = Math.floor(index / cols);
			
			const itemX = x + col * paddingX;
			const itemY = y + row * paddingY;

			this.createItemCard(itemX, itemY, item);
		});
	}

	private createItemCard(x: number, y: number, item: ShopItem): void {
		const isOwned = GameData.hasItem(item.id);
		const isEquipped =
			item.type === "skin"
				? GameData.getEquippedSkin() === item.assetKey // Logic check: ID vs AssetKey mapping in GameData
				: GameData.getEquippedBackground() === item.assetKey;

		// Re-check this: GameData stores IDs for owned/equipped, but getters return AssetKey? 
		// GameData.getEquippedSkin() returns assetKey. 
		// To compare properly, I should check the stored ID directly or match assetKey.
		// GameData.ts: 
		// equippedSkin = id (e.g. "skin-red")
		// getEquippedSkin() returns assetKey (e.g. "dude-red")
		
		// Wait, let's check GameData implementation again.
		// static getEquippedSkin(): string { const id = this.data.equippedSkin; ... return skin.assetKey; }
		
		// So the comparison above `GameData.getEquippedSkin() === item.assetKey` is correct.

		const bg = this.add.rectangle(0, 0, 220, 180, 0x333333).setStrokeStyle(2, 0xffffff);
		
		let preview: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
		
		if (item.type === "skin") {
			// For skins, show the first frame of spritesheet
			preview = this.add.sprite(0, -20, item.assetKey, 4).setScale(1.5);
		} else {
			preview = this.add.image(0, -20, item.assetKey).setDisplaySize(150, 100);
		}

		const nameText = this.add.text(0, 40, item.name, {
			fontSize: "16px",
			color: "#ffffff",
		}).setOrigin(0.5);

		let actionBtn: Phaser.GameObjects.Container;

		if (isEquipped) {
			actionBtn = this.createButton(0, 80, "EQUIPPED", 0x00ff00, null);
		} else if (isOwned) {
			actionBtn = this.createButton(0, 80, "EQUIP", 0x4a90e2, () => {
				GameData.equipItem(item.id, item.type);
				this.showItems(this.currentTab); // Refresh
			});
		} else {
			actionBtn = this.createButton(0, 80, `BUY ${item.price}`, 0xffb600, () => {
				if (GameData.buyItem(item.id)) {
					this.balanceText.setText(`Coins: ${GameData.getCoins()}`);
					this.showItems(this.currentTab); // Refresh
				} else {
					// Maybe flash red or something
					this.cameras.main.shake(100, 0.01);
				}
			});
		}

		const card = this.add.container(x, y, [bg, preview, nameText, actionBtn]);
		this.itemsContainer.add(card);
	}

	private createButton(x: number, y: number, text: string, color: number, callback: (() => void) | null): Phaser.GameObjects.Container {
		const bg = this.add.rectangle(0, 0, 120, 30, color);
		const txt = this.add.text(0, 0, text, {
			fontSize: "14px",
			color: "#000000",
			fontStyle: "bold",
		}).setOrigin(0.5);

		const container = this.add.container(x, y, [bg, txt]);

		if (callback) {
			bg.setInteractive({ cursor: "pointer" });
			bg.on("pointerdown", callback);
		}

		return container;
	}
}

