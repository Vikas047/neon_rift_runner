import { Scene } from "phaser";
import { WalletManager } from "./WalletManager";

export class WalletUI {
	private static walletButton: Phaser.GameObjects.Container | null = null;
	private static walletText: Phaser.GameObjects.Text | null = null;
	private static currentScene: Scene | null = null;
	private static connectionModalOpen: boolean = false;
	private static isConnecting: boolean = false;

	// Create wallet connect button in top right
	static createWalletButton(scene: Scene): Phaser.GameObjects.Container {
		this.currentScene = scene;

		// Remove old button if exists
		if (this.walletButton) {
			this.walletButton.destroy();
		}

		const container = scene.add.container(900, 35);
		
		// Background
		const bg = scene.add.rectangle(0, 0, 200, 50, 0x333333, 0.9);
		bg.setStrokeStyle(2, 0xffffff);
		
		// Text
		const text = scene.add.text(0, 0, WalletManager.isConnected() ? WalletManager.getFormattedAddress() : "Connect Wallet", {
			fontFamily: "Arial",
			fontSize: 16,
			color: "#ffffff",
		});
		text.setOrigin(0.5);

		container.add([bg, text]);
		container.setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains);
		container.setDepth(1000);

		container.on("pointerdown", async () => {
			// Prevent multiple simultaneous connection attempts
			if (this.isConnecting) {
				return;
			}
			
			if (WalletManager.isConnected()) {
				// Show disconnect option or wallet info
				this.showWalletInfoModal(scene);
			} else {
				await this.connectWallet(scene);
			}
		});

		this.walletButton = container;
		this.walletText = text;

		// Listen for wallet changes
		WalletManager.onWalletChange((info) => {
			this.updateWalletButton();
		});

		return container;
	}

	private static updateWalletButton(): void {
		if (this.walletText) {
			if (WalletManager.isConnected()) {
				this.walletText.setText(WalletManager.getFormattedAddress());
				this.walletText.setColor("#00ff00");
			} else {
				this.walletText.setText("Connect Wallet");
				this.walletText.setColor("#ffffff");
			}
		}
	}

	private static async connectWallet(scene: Scene): Promise<void> {
		// Prevent multiple simultaneous connection attempts
		if (this.isConnecting) {
			return;
		}
		
		this.isConnecting = true;
		
		try {
			const result = await WalletManager.connect();
			
			if (!result.success) {
				// Show specific error message (not the generic "please connect wallet before" message)
				const errorMsg = result.error || "Failed to connect wallet. Please make sure One Chain wallet is installed and try again.";
				this.showConnectionModal(scene, errorMsg);
			} else {
				// Successfully connected
				this.updateWalletButton();
				// Show success feedback briefly
				const successText = scene.add.text(950, 80, "Connected!", {
					fontFamily: "Arial",
					fontSize: 16,
					color: "#00ff00",
				});
				successText.setOrigin(0.5);
				successText.setDepth(1001);
				
				scene.tweens.add({
					targets: successText,
					alpha: 0,
					y: 60,
					duration: 2000,
					onComplete: () => successText.destroy()
				});
			}
		} finally {
			this.isConnecting = false;
		}
	}

	// Show modal asking user to connect wallet
	static showConnectionModal(scene: Scene, message?: string): void {
		// Prevent duplicate modals
		if (this.connectionModalOpen) {
			return;
		}
		
		this.connectionModalOpen = true;
		
		const modalBg = scene.add.rectangle(512, 384, 1024, 768, 0x000000, 0.8);
		modalBg.setDepth(2000);
		modalBg.setInteractive();

		const modalContainer = scene.add.container(512, 384);
		modalContainer.setDepth(2001);

		// Modal background
		const modal = scene.add.rectangle(0, 0, 500, 300, 0x222222, 1);
		modal.setStrokeStyle(3, 0xffffff);

		// Title
		const title = scene.add.text(0, -100, "Wallet Required", {
			fontFamily: "Arial Black",
			fontSize: 32,
			color: "#ffffff",
		});
		title.setOrigin(0.5);

		// Message
		const msg = scene.add.text(0, -20, message || "Please connect your One Chain wallet to play the game and mint NFTs.", {
			fontFamily: "Arial",
			fontSize: 20,
			color: "#ffffff",
			wordWrap: { width: 450 },
			align: "center",
		});
		msg.setOrigin(0.5);

		// Check if wallet is not installed
		const isWalletNotInstalled = message?.toLowerCase().includes("not found") || 
		                            message?.toLowerCase().includes("not installed") ||
		                            message?.toLowerCase().includes("extension not found") ||
		                            !WalletManager.isWalletInstalled();

		// Action button (Connect or Install)
		const actionBtn = scene.add.rectangle(0, 80, 200, 50, isWalletNotInstalled ? 0x2196F3 : 0x4CAF50, 1);
		actionBtn.setStrokeStyle(2, 0xffffff);
		actionBtn.setInteractive({ cursor: "pointer" });

		const actionText = scene.add.text(0, 80, isWalletNotInstalled ? "Install Wallet" : "Connect Wallet", {
			fontFamily: "Arial Black",
			fontSize: 20,
			color: "#ffffff",
		});
		actionText.setOrigin(0.5);

		// Close button
		const closeBtn = scene.add.rectangle(220, -120, 40, 40, 0xff0000, 1);
		closeBtn.setStrokeStyle(2, 0xffffff);
		closeBtn.setInteractive({ cursor: "pointer" });

		const closeText = scene.add.text(220, -120, "X", {
			fontFamily: "Arial Black",
			fontSize: 24,
			color: "#ffffff",
		});
		closeText.setOrigin(0.5);

		modalContainer.add([modal, title, msg, actionBtn, actionText, closeBtn, closeText]);

		const closeModal = () => {
			modalBg.destroy();
			modalContainer.destroy();
			this.connectionModalOpen = false;
		};

		actionBtn.on("pointerdown", async () => {
			if (isWalletNotInstalled) {
				// Open wallet installation page
				// You can replace this URL with the actual One Chain wallet installation page
				const installUrl = "https://onechain.xyz/wallet"; // Update with actual URL
				window.open(installUrl, "_blank");
				
				// Update message to show instructions
				msg.setText("Please install the One Chain wallet extension and refresh this page after installation.");
				actionText.setText("Refresh Page");
				
				// Change button behavior to refresh
				actionBtn.removeAllListeners("pointerdown");
				actionBtn.on("pointerdown", () => {
					window.location.reload();
				});
			} else {
				// Try to connect wallet
				const result = await WalletManager.connect();
				if (result.success) {
					closeModal();
					this.updateWalletButton();
					// Show success feedback
					const successText = scene.add.text(512, 450, "Connected!", {
						fontFamily: "Arial",
						fontSize: 20,
						color: "#00ff00",
					});
					successText.setOrigin(0.5);
					successText.setDepth(2002);
					
					scene.tweens.add({
						targets: successText,
						alpha: 0,
						duration: 2000,
						onComplete: () => successText.destroy()
					});
				} else {
					msg.setText(result.error || "Failed to connect. Please try again.");
					// If error indicates wallet not installed, update button
					if (result.error?.toLowerCase().includes("not found") || 
					    result.error?.toLowerCase().includes("not installed")) {
						actionText.setText("Install Wallet");
						actionBtn.setFillStyle(0x2196F3);
					}
				}
			}
		});

		closeBtn.on("pointerdown", closeModal);
		modalBg.on("pointerdown", closeModal);
	}

	// Show wallet info modal
	private static showWalletInfoModal(scene: Scene): void {
		const modalBg = scene.add.rectangle(512, 384, 1024, 768, 0x000000, 0.8);
		modalBg.setDepth(2000);
		modalBg.setInteractive();

		const modalContainer = scene.add.container(512, 384);
		modalContainer.setDepth(2001);

		// Make modal wider to accommodate full address
		const modal = scene.add.rectangle(0, 0, 600, 320, 0x222222, 1);
		modal.setStrokeStyle(3, 0xffffff);

		const title = scene.add.text(0, -120, "Wallet Info", {
			fontFamily: "Arial Black",
			fontSize: 32,
			color: "#ffffff",
		});
		title.setOrigin(0.5);

		// Address label
		const addressLabel = scene.add.text(0, -60, "Address:", {
			fontFamily: "Arial",
			fontSize: 18,
			color: "#ffffff",
		});
		addressLabel.setOrigin(0.5);

		// Address text - format it better
		const fullAddress = WalletManager.getAddress() || "Not connected";
		// Break address into chunks for better display
		const addressChunks: string[] = [];
		if (fullAddress.length > 40) {
			// Split long address into multiple lines
			for (let i = 0; i < fullAddress.length; i += 40) {
				addressChunks.push(fullAddress.slice(i, i + 40));
			}
		} else {
			addressChunks.push(fullAddress);
		}

		const address = scene.add.text(0, -30, addressChunks.join('\n'), {
			fontFamily: "Courier New",
			fontSize: 14,
			color: "#cccccc",
			align: "center",
			wordWrap: { width: 550 },
		});
		address.setOrigin(0.5);

		const chainName = WalletManager.getChain() || "Unknown";
		const isCorrect = WalletManager.isCorrectChain();
		
		// Chain label
		const chainLabel = scene.add.text(0, 30, "Chain:", {
			fontFamily: "Arial",
			fontSize: 18,
			color: "#ffffff",
		});
		chainLabel.setOrigin(0.5);
		
		const chain = scene.add.text(0, 55, chainName, {
			fontFamily: "Arial",
			fontSize: 18,
			color: isCorrect ? "#00ff00" : "#ff0000",
			fontStyle: "bold",
		});
		chain.setOrigin(0.5);
		
		// Add status text below chain if incorrect
		let statusText: Phaser.GameObjects.Text | null = null;
		if (!isCorrect && chainName !== "Unknown") {
			statusText = scene.add.text(0, 80, "(Switch to testnet)", {
				fontFamily: "Arial",
				fontSize: 14,
				color: "#ffaa00",
			});
			statusText.setOrigin(0.5);
		}

		const disconnectBtn = scene.add.rectangle(0, 130, 180, 45, 0xff0000, 1);
		disconnectBtn.setStrokeStyle(2, 0xffffff);
		disconnectBtn.setInteractive({ cursor: "pointer" });

		const disconnectText = scene.add.text(0, 130, "Disconnect", {
			fontFamily: "Arial Black",
			fontSize: 18,
			color: "#ffffff",
		});
		disconnectText.setOrigin(0.5);

		const closeBtn = scene.add.rectangle(280, -140, 35, 35, 0x666666, 1);
		closeBtn.setStrokeStyle(2, 0xffffff);
		closeBtn.setInteractive({ cursor: "pointer" });

		const closeText = scene.add.text(280, -140, "X", {
			fontFamily: "Arial Black",
			fontSize: 22,
			color: "#ffffff",
		});
		closeText.setOrigin(0.5);

		const modalElements: any[] = [modal, title, addressLabel, address, chainLabel, chain, disconnectBtn, disconnectText, closeBtn, closeText];
		if (statusText) {
			modalElements.push(statusText);
		}
		modalContainer.add(modalElements);

		const closeModal = () => {
			modalBg.destroy();
			modalContainer.destroy();
		};

		disconnectBtn.on("pointerdown", () => {
			WalletManager.disconnect();
			closeModal();
			this.updateWalletButton();
		});

		closeBtn.on("pointerdown", closeModal);
		modalBg.on("pointerdown", closeModal);
	}

	// Check wallet before action and show modal if needed
	static requireWallet(scene: Scene, action: () => void, actionName: string = "perform this action"): void {
		const verification = WalletManager.verifyWalletForAction();
		
		if (!verification.valid) {
			this.showConnectionModal(scene, `${verification.message}\n\nYou need to connect your wallet to ${actionName}.`);
			return;
		}

		action();
	}
}

