import { Scene } from "phaser";
import { GameData, SKINS, BACKGROUNDS, ShopItem, RARITY_COLORS, Rarity } from "../utils/GameData";

export class Shop extends Scene {
	private balanceText: Phaser.GameObjects.Text;
	private itemsContainer: Phaser.GameObjects.Container;
	private currentTab: "skins" | "backgrounds" = "skins";
	private gachaPriceSkin = 200;
	private gachaPriceBg = 500;
	
	// Scroll properties
	private scrollY = 0;
	private minScrollY = 0;
	private maxScrollY = 0;
	private dragStartY = 0;
	private isDragging = false;
	private maskGraphics: Phaser.GameObjects.Graphics;
	private scrollBar: Phaser.GameObjects.Rectangle;
	private scrollTrack: Phaser.GameObjects.Rectangle;
	private gradientGraphics: Phaser.GameObjects.Graphics;
	private transferModal: Phaser.GameObjects.Container | null = null;
	private recipientAddress: string = "";
	private inputText: Phaser.GameObjects.Text | null = null;
	private isInputFocused: boolean = false;

	constructor() {
		super("Shop");
	}

	create(): void {
		// Use solid background color matching the equipped background theme
		this.updateBackground();

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
		
		// Scroll Setup
		this.input.on("wheel", (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
			this.handleScroll(deltaY);
		});

		this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
			if (pointer.y > 200) { // Only drag in item area
				this.isDragging = true;
				this.dragStartY = pointer.y;
			}
		});

		this.input.on("pointerup", () => {
			this.isDragging = false;
		});

		this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
			if (this.isDragging) {
				const delta = this.dragStartY - pointer.y;
				this.handleScroll(delta);
				this.dragStartY = pointer.y;
			}
		});

		// Create Mask for scrolling
		this.maskGraphics = this.make.graphics({});
		this.maskGraphics.fillStyle(0xffffff);
		this.maskGraphics.fillRect(0, 220, 1024, 548); // Visible area below tabs
		
		// Create Scrollbar
		this.scrollTrack = this.add.rectangle(1010, 494, 8, 548, 0x333333).setOrigin(0.5); // Center of track
		this.scrollBar = this.add.rectangle(1010, 230, 8, 100, 0xaaaaaa).setOrigin(0.5, 0); // Top-aligned thumb

		// Initial Content
		this.showItems("skins");
	}

	private handleScroll(delta: number): void {
		this.scrollY += delta;
		
		// Clamp scroll
		if (this.scrollY < 0) this.scrollY = 0;
		if (this.scrollY > this.maxScrollY) this.scrollY = this.maxScrollY;
		
		if (this.itemsContainer) {
			this.itemsContainer.y = -this.scrollY;
		}
		
		// Update Scrollbar
		this.updateScrollBar();
	}

	private updateScrollBar(): void {
		if (this.maxScrollY <= 0) {
			this.scrollBar.setVisible(false);
			this.scrollTrack.setVisible(false);
			return;
		}
		
		this.scrollBar.setVisible(true);
		this.scrollTrack.setVisible(true);

		const visibleHeight = 548;
		const contentHeight = visibleHeight + this.maxScrollY;
		const scrollRatio = this.scrollY / this.maxScrollY;
		
		// Calculate thumb size
		let thumbHeight = (visibleHeight / contentHeight) * visibleHeight;
		thumbHeight = Phaser.Math.Clamp(thumbHeight, 30, visibleHeight);
		this.scrollBar.height = thumbHeight;

		// Calculate thumb position
		const trackTop = 220;
		const availableTrack = visibleHeight - thumbHeight;
		const thumbY = trackTop + (scrollRatio * availableTrack);
		
		this.scrollBar.y = thumbY;
	}

	private createTabs(): void {
		const y = 190;
		
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

	private getDynamicPrice(type: "skins" | "backgrounds"): number {
		// Count all owned items (including duplicates)
		const itemType = type === "skins" ? "skin" : "background";
		const ownedItems = GameData.getOwnedItemsByType(itemType);
		const ownedCount = ownedItems.length;
		
		// Aggressive Scaling
		// Skins: Base 500 + (Owned - 1) * 750
		// Bgs: Base 1000 + (Owned - 1) * 1500
		if (type === "skins") {
			return 500 + ((ownedCount - 1) * 750);
		} else {
			return 1000 + ((ownedCount - 1) * 1500);
		}
	}

	private showItems(type: "skins" | "backgrounds"): void {
		if (this.itemsContainer) {
			this.itemsContainer.destroy();
		}
		
		// Reset scroll
		this.scrollY = 0;

		this.itemsContainer = this.add.container(0, 0);
		// Apply mask
		const mask = this.maskGraphics.createGeometryMask();
		this.itemsContainer.setMask(mask);

		const allItems = type === "skins" ? SKINS : BACKGROUNDS;
		// Get all owned items (including duplicates) with their NFT IDs
		const itemType = type === "skins" ? "skin" : "background";
		const ownedItems = GameData.getOwnedItemsByType(itemType);
		
		// Create cards for each owned item instance
		const itemCards: { item: ShopItem; nftId: string }[] = ownedItems.map(owned => {
			const item = allItems.find(i => i.id === owned.itemId);
			return item ? { item, nftId: owned.nftId } : null;
		}).filter(card => card !== null) as { item: ShopItem; nftId: string }[];

		let x = 250;
		let y = 400; // Base Y for grid
		const cols = 3;
		const paddingX = 250;
		const paddingY = 320; // Increased vertical padding for taller cards

		itemCards.forEach((cardData, index) => {
			const col = index % cols;
			const row = Math.floor(index / cols);
			
			const itemX = x + col * paddingX;
			const itemY = y + row * paddingY;

			this.createItemCard(itemX, itemY, cardData.item, cardData.nftId);
		});
		
		// Always show "Mystery Card" (unlimited unlocks allowed)
		const price = this.getDynamicPrice(type);
		
		// Calculate position for the next card in the grid
		const index = itemCards.length; // Next available index
		const col = index % cols;
		const row = Math.floor(index / cols);
		
		const mysteryX = x + col * paddingX;
		const mysteryY = y + row * paddingY;
		
		this.createMysteryCard(mysteryX, mysteryY, price, type);
		
		// Calculate Max Scroll based on content height including mystery card
		const totalItems = itemCards.length + 1;
		const rows = Math.ceil(totalItems / cols);
		let contentHeight = (rows * paddingY) + 400; // 400 is start Y

		// Calculate max scroll
		const visibleHeight = 548;
		// The content starts at y=400. The mask starts at y=220.
		// So there is a 180px gap.
		// Content Bottom = contentHeight.
		// We need to scroll until Content Bottom aligns with Mask Bottom (220 + 548 = 768).
		
		this.maxScrollY = Math.max(0, contentHeight - visibleHeight - 180);
		this.updateScrollBar();
	}

	private createMysteryCard(x: number, y: number, price: number, type: "skins" | "backgrounds"): void {
		const bg = this.add.rectangle(0, 0, 220, 300, 0x222222).setStrokeStyle(2, 0xffb600);
		
		// Silhouette
		let preview: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
		if (type === "skins") {
			preview = this.add.sprite(0, -40, "dude", 4).setScale(1.5).setTint(0x000000);
		} else {
			preview = this.add.image(0, -40, "bg-day").setDisplaySize(150, 100).setTint(0x000000);
		}

		const titleText = this.add.text(0, 30, "MYSTERY ITEM", {
			fontSize: "16px",
			color: "#ffb600",
			fontStyle: "bold",
		}).setOrigin(0.5);

		const priceText = this.add.text(0, 60, `${price} COINS`, {
			fontSize: "14px",
			color: "#ffffff",
		}).setOrigin(0.5);

		// Unlock Button
		const unlockBtn = this.createButton(0, 100, "UNLOCK", 0xffb600, () => {
			this.buyRandomItem(type);
		});

		const card = this.add.container(x, y, [bg, preview, titleText, priceText, unlockBtn]);
		this.itemsContainer.add(card);
	}

	private createItemCard(x: number, y: number, item: ShopItem, nftId?: string): void {
		const isOwned = GameData.hasItem(item.id);
		const isEquipped =
			item.type === "skin"
				? GameData.getEquippedSkin() === item.assetKey
				: GameData.getEquippedBackground() === item.assetKey;
		
		// Use provided NFT ID or fall back to item's base NFT ID
		const displayNftId = nftId || item.nftId;

		const bg = this.add.rectangle(0, 0, 220, 180, 0x333333).setStrokeStyle(2, 0xffffff);
		
		let preview: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
		
		if (item.type === "skin") {
			preview = this.add.sprite(0, -20, item.assetKey, 4).setScale(1.5);
		} else {
			preview = this.add.image(0, -20, item.assetKey).setDisplaySize(150, 100);
		}
		
		// If not owned, hide it
		if (!isOwned) {
			preview.setTint(0x000000); // Silhouette
		}

		// Name
		const nameText = this.add.text(0, 30, isOwned ? item.name : "???", {
			fontSize: "16px",
			color: "#ffffff",
			fontStyle: "bold",
		}).setOrigin(0.5);

		const cardComponents: Phaser.GameObjects.GameObject[] = [bg, preview, nameText];

		if (isOwned) {
			// Transfer Button - Top Right (only for non-default items)
			if (item.price > 0) {
				const transferY = item.type === "background" ? -115 : -75;
				const transferBtn = this.add.rectangle(90, transferY, 30, 30, 0x4a90e2)
					.setStrokeStyle(2, 0xffffff)
					.setInteractive({ cursor: "pointer" });
				
			// Transfer icon (using Unicode transfer symbol)
			const transferIcon = this.add.text(90, transferY, "⇄", {
				fontSize: "20px",
				color: "#ffffff",
				fontStyle: "bold"
			}).setOrigin(0.5);
				
				transferBtn.on("pointerdown", () => {
					this.openTransferModal(item, displayNftId);
				});
				
				cardComponents.push(transferBtn, transferIcon);
			}

			// NFT ID - Top Center (higher for backgrounds)
			const nftY = item.type === "background" ? -115 : -75;
			const nftText = this.add.text(0, nftY, item.price === 0 ? "DEFAULT" : `NFT: ${displayNftId}`, {
				fontSize: "10px",
				color: item.price === 0 ? "#888888" : "#00ffff",
				fontStyle: "bold"
			}).setOrigin(0.5);
			cardComponents.push(nftText);

			// Rarity Badge - Top Left (adjusted for backgrounds)
			const rarityY = item.type === "background" ? -95 : -55;
			const rarityColor = RARITY_COLORS[item.rarity];
			const rarityBg = this.add.rectangle(-90, rarityY, 70, 20, rarityColor);
			const rarityText = this.add.text(-90, rarityY, item.rarity.toUpperCase(), {
				fontSize: "9px",
				color: "#ffffff",
				fontStyle: "bold",
			}).setOrigin(0.5);
			cardComponents.push(rarityBg, rarityText);

			// Lore
			const loreText = this.add.text(0, 60, item.lore, {
				fontSize: "10px",
				color: "#aaaaaa",
				align: "center",
				wordWrap: { width: 200 }
			}).setOrigin(0.5, 0);
			cardComponents.push(loreText);

			let actionBtn: Phaser.GameObjects.Container;
			const btnY = 140; // Move button down to make room for lore

			if (isEquipped) {
				actionBtn = this.createButton(0, btnY, "EQUIPPED", 0x00ff00, null);
			} else {
				actionBtn = this.createButton(0, btnY, "EQUIP", 0x4a90e2, () => {
					GameData.equipItem(item.id, item.type);
					// Update background immediately if a background was equipped
					if (item.type === "background") {
						this.updateBackground();
					}
					this.showItems(this.currentTab); // Refresh
				});
			}
			cardComponents.push(actionBtn);
			
			// Resize Background to fit new content
			bg.setSize(220, 300);
			// Shift preview up slightly
			preview.y = -40;
			nameText.y = 40;

		} else {
			// Locked Label
			const lockedText = this.add.text(0, 80, "LOCKED", {
				fontSize: "14px",
				color: "#888888", 
				fontStyle: "italic"
			}).setOrigin(0.5);
			cardComponents.push(lockedText);
		}

		const card = this.add.container(x, y, cardComponents);
		this.itemsContainer.add(card);
	}

	private buyRandomItem(type: "skins" | "backgrounds"): void {
		const price = this.getDynamicPrice(type);
		
		if (GameData.getCoins() < price) {
			this.cameras.main.shake(100, 0.01); // Not enough money
			return;
		}

		const items = type === "skins" ? SKINS : BACKGROUNDS;
		
		// Use weighted random selection from ALL items (can get duplicates)
		const randomItem = GameData.getWeightedRandomItem(items);
		
		if (GameData.removeCoins(price)) {
			const wasAlreadyOwned = GameData.hasItem(randomItem.id);
			
			// Unlock item (will skip if already owned, but still allows unlimited unlocks)
			GameData.unlockItem(randomItem.id);
			
			// Refresh UI
			this.balanceText.setText(`Coins: ${GameData.getCoins()}`);
			this.showItems(this.currentTab);
			
			// Show feedback with item name
			const message = wasAlreadyOwned 
				? `Already own: ${randomItem.name}` 
				: `Unlocked: ${randomItem.name}!`;
			
			const feedbackText = this.add.text(512, 384, message, {
				fontSize: "32px",
				color: wasAlreadyOwned ? "#ffaa00" : "#00ff00",
				fontStyle: "bold",
				stroke: "#000000",
				strokeThickness: 6,
			}).setOrigin(0.5).setScrollFactor(0);
			
			// Animate and remove
			this.tweens.add({
				targets: feedbackText,
				alpha: 0,
				y: 300,
				duration: 2000,
				onComplete: () => feedbackText.destroy()
			});
			
			// Flash effect
			this.cameras.main.flash(200, 255, 255, 255);
		}
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
			// Make both the background and container interactive
			bg.setInteractive({ cursor: "pointer", useHandCursor: true });
			container.setInteractive(new Phaser.Geom.Rectangle(-60, -15, 120, 30), Phaser.Geom.Rectangle.Contains);
			
			bg.on("pointerdown", callback);
			container.on("pointerdown", callback);
		}

		return container;
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
		
		// Destroy old gradient if it exists
		if (this.gradientGraphics) {
			this.gradientGraphics.destroy();
		}
		
		// Create gradient using Graphics
		this.gradientGraphics = this.add.graphics();
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
			
			this.gradientGraphics.fillStyle(currentColor, 1);
			this.gradientGraphics.fillRect(0, y, width, height / steps + 1);
		}
		
		this.gradientGraphics.setDepth(-1); // Place behind everything
	}

	private updateBackground(): void {
		const bgKey = GameData.getEquippedBackground();
		const bgColor = GameData.getBackgroundColor(bgKey);
		this.cameras.main.setBackgroundColor(bgColor);
		this.createGradient(bgColor);
	}

	private openTransferModal(item: ShopItem, nftId: string): void {
		// Close existing modal if open
		if (this.transferModal) {
			this.transferModal.destroy();
		}

		// Create modal background (semi-transparent overlay)
		const overlay = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.7)
			.setInteractive();
		
		// Close modal when clicking overlay (but not when clicking inside modal)
		overlay.on("pointerdown", () => {
			this.closeTransferModal();
		});

		// Modal container
		const modalBg = this.add.rectangle(512, 384, 500, 350, 0x1a1a1a)
			.setStrokeStyle(3, 0x4a90e2)
			.setInteractive()
			.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
				pointer.event.stopPropagation(); // Prevent overlay click
				// Unfocus input if clicking on modal background
				if (this.isInputFocused) {
					this.isInputFocused = false;
					inputBg.setStrokeStyle(2, 0x4a90e2);
					if (this.recipientAddress === "") {
						this.inputText!.setText("Enter address...");
						this.inputText!.setColor("#888888");
					}
				}
			});

		// Title
		const title = this.add.text(512, 250, "Transfer NFT", {
			fontSize: "32px",
			color: "#ffffff",
			fontStyle: "bold"
		}).setOrigin(0.5);

		// Item info
		const itemInfo = this.add.text(512, 300, `${item.name}\n${nftId}`, {
			fontSize: "18px",
			color: "#aaaaaa",
			align: "center"
		}).setOrigin(0.5);

		// Recipient label
		const recipientLabel = this.add.text(512, 360, "Recipient Address:", {
			fontSize: "16px",
			color: "#ffffff"
		}).setOrigin(0.5);

		// Input field background
		const inputBg = this.add.rectangle(512, 400, 400, 40, 0x2a2a2a)
			.setStrokeStyle(2, 0x4a90e2);

		// Reset input state
		this.recipientAddress = "";
		this.isInputFocused = false;

		// Input text
		this.inputText = this.add.text(512, 400, "Enter address...", {
			fontSize: "14px",
			color: "#888888"
		}).setOrigin(0.5, 0.5);

		// Make input interactive
		inputBg.setInteractive({ cursor: "text" });
		inputBg.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
			pointer.event.stopPropagation(); // Prevent overlay click
			this.isInputFocused = true;
			inputBg.setStrokeStyle(2, 0x00ff00); // Green border when focused
			if (this.recipientAddress === "") {
				this.inputText!.setText("");
				this.inputText!.setColor("#ffffff");
			}
		});


		// Keyboard input handler
		const keyHandler = (event: KeyboardEvent) => {
			if (!this.isInputFocused) return;

			if (event.key === "Backspace") {
				this.recipientAddress = this.recipientAddress.slice(0, -1);
			} else if (event.key === "Enter") {
				// Submit on Enter
				if (this.recipientAddress.trim()) {
					this.executeTransfer(item, nftId, this.recipientAddress);
				}
				return;
			} else if (event.key.length === 1) {
				// Only add printable characters
				this.recipientAddress += event.key;
			}

			// Update display text
			if (this.recipientAddress === "") {
				this.inputText!.setText("Enter address...");
				this.inputText!.setColor("#888888");
			} else {
				// Show full text or truncated with ellipsis
				const displayText = this.recipientAddress.length > 35 
					? this.recipientAddress.substring(0, 35) + "..." 
					: this.recipientAddress;
				this.inputText!.setText(displayText);
				this.inputText!.setColor("#ffffff");
			}
		};

		// Add keyboard listener
		window.addEventListener("keydown", keyHandler);

		// Store cleanup function
		const cleanup = () => {
			window.removeEventListener("keydown", keyHandler);
		};

		// Transfer button
		const transferBtn = this.add.rectangle(512, 470, 200, 50, 0x4a90e2)
			.setStrokeStyle(2, 0xffffff)
			.setInteractive({ cursor: "pointer" });

		const transferBtnText = this.add.text(512, 470, "TRANSFER", {
			fontSize: "20px",
			color: "#ffffff",
			fontStyle: "bold"
		}).setOrigin(0.5);

		transferBtn.on("pointerdown", () => {
			if (this.recipientAddress.trim()) {
				this.executeTransfer(item, nftId, this.recipientAddress);
			} else {
				alert("Please enter a recipient address");
			}
		});

		// Close button
		const closeBtn = this.add.rectangle(750, 250, 40, 40, 0xff0000)
			.setStrokeStyle(2, 0xffffff)
			.setInteractive({ cursor: "pointer" });

		const closeBtnText = this.add.text(750, 250, "×", {
			fontSize: "30px",
			color: "#ffffff",
			fontStyle: "bold"
		}).setOrigin(0.5);

		closeBtn.on("pointerdown", () => this.closeTransferModal());
		closeBtnText.on("pointerdown", () => this.closeTransferModal());

		// Add all elements to modal container
		this.transferModal = this.add.container(0, 0, [
			overlay,
			modalBg,
			title,
			itemInfo,
			recipientLabel,
			inputBg,
			this.inputText!,
			transferBtn,
			transferBtnText,
			closeBtn,
			closeBtnText
		]).setDepth(1000); // Ensure modal is on top

		// Store cleanup function in modal data
		(this.transferModal as any).cleanup = cleanup;
	}

	private executeTransfer(item: ShopItem, nftId: string, address: string): void {
		// Here you would implement the actual transfer logic
		alert(`Transferring ${item.name} (${nftId}) to ${address}`);
		// TODO: Implement actual transfer logic
		// This would typically:
		// 1. Remove the NFT from the current owner's inventory
		// 2. Add it to the recipient's inventory
		// 3. Update blockchain/NFT registry if applicable
		this.closeTransferModal();
	}

	private closeTransferModal(): void {
		if (this.transferModal) {
			// Cleanup keyboard listener
			if ((this.transferModal as any).cleanup) {
				(this.transferModal as any).cleanup();
			}
			this.transferModal.destroy();
			this.transferModal = null;
			this.inputText = null;
			this.recipientAddress = "";
			this.isInputFocused = false;
		}
	}
}
