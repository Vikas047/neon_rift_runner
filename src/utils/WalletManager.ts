// Wallet Manager for One Chain integration
// One Chain uses Sui wallet standards

interface WalletInfo {
	connected: boolean;
	address: string | null;
	chain: string | null;
}

// One Chain network IDs
const ONE_CHAIN_TESTNET = "testnet";
const ONE_CHAIN_MAINNET = "mainnet";

export class WalletManager {
	private static walletInfo: WalletInfo = {
		connected: false,
		address: null,
		chain: null,
	};

	private static listeners: Array<(info: WalletInfo) => void> = [];

	// Get wallet instance using the same logic as reference project
	static getWallet(): any {
		if (typeof window === "undefined") return null;
		
		const win = window as any;
		
		// Check Wallet Standard API first (window.navigator.wallets)
		if (win.navigator?.wallets) {
			const wallets = win.navigator.wallets;
			const oneWallet = wallets.find((w: any) => 
				w.name?.toLowerCase().includes('one') || 
				w.name?.toLowerCase().includes('onewallet') ||
				w.name?.toLowerCase().includes('sui')
			);
			if (oneWallet) return oneWallet;
			if (wallets.length > 0) return wallets[0];
		}
		
		// Check multiple wallet properties
		const checks = [
			win.onechain,
			win.onechainWallet,
			win.onewallet,
			win.oneWallet,
			win.OneWallet,
			win.suiWallet,
			win.wallet,
			win.__ONE_WALLET__,
			win.__oneWallet__,
		];
		
		for (const check of checks) {
			if (check) return check;
		}
		
		return null;
	}

	// Get Sui provider from wallet
	static getSuiProvider(wallet: any): any {
		if (!wallet) return null;
		if (wallet.sui) return wallet.sui;
		return wallet;
	}

	// Check if wallet extension is installed
	static isWalletInstalled(): boolean {
		return this.getWallet() !== null;
	}

	// Get current wallet connection status
	static isConnected(): boolean {
		return this.walletInfo.connected;
	}

	// Get current wallet address
	static getAddress(): string | null {
		return this.walletInfo.address;
	}

	// Get current chain
	static getChain(): string | null {
		return this.walletInfo.chain;
	}

	// Check if connected to correct chain (testnet)
	static isCorrectChain(): boolean {
		const chain = this.walletInfo.chain;
		if (!chain) return false;
		
		// Check if chain is "testnet" or contains "testnet" (case-insensitive)
		// This matches the reference project's logic
		const chainLower = chain.toLowerCase().trim();
		return chainLower === 'testnet' || chainLower.includes('testnet');
	}

	// Connect wallet
	static async connect(): Promise<{ success: boolean; error?: string }> {
		try {
			const wallet = this.getWallet();
			
			if (!wallet) {
				return {
					success: false,
					error: "One Chain wallet extension not found. Please install the One Chain wallet extension to continue."
				};
			}

			const suiProvider = this.getSuiProvider(wallet);
			if (!suiProvider) {
				return {
					success: false,
					error: "Sui provider not found in wallet."
				};
			}

			// Try to connect using suiProvider.connect()
			if (typeof suiProvider.connect === 'function') {
				await suiProvider.connect();
			}

			// Get accounts
			let accounts: any[] | null = null;
			
			if (typeof suiProvider.getAccounts === 'function') {
				accounts = await suiProvider.getAccounts();
			} else if (suiProvider.accounts) {
				accounts = suiProvider.accounts;
			} else if (wallet.accounts) {
				accounts = wallet.accounts;
			}

			if (accounts && accounts.length > 0) {
				// Extract address (handle both string and object formats)
				const account = accounts[0];
				const address = account.address || account;
				const addressStr = typeof address === 'string' ? address : String(address);
				
				this.walletInfo.connected = true;
				this.walletInfo.address = addressStr;
				
				// Get chain info
				try {
					let chainInfo: string | null = null;
					
					// Method 1: Try getChain() method
					if (typeof suiProvider.getChain === 'function') {
						chainInfo = await suiProvider.getChain();
					}
					
					// Method 2: Try chain property
					if (!chainInfo && suiProvider.chain) {
						chainInfo = suiProvider.chain;
					}
					
					// Method 3: Check RPC URL
					if (!chainInfo && suiProvider.rpcUrl) {
						const rpcUrl = suiProvider.rpcUrl;
						if (rpcUrl.includes('testnet.onelabs.cc') || rpcUrl.includes('onelabs.cc')) {
							chainInfo = 'testnet';
						}
					}
					
					// Normalize chain info - if it contains "testnet", use "testnet"
					if (chainInfo) {
						const chainLower = chainInfo.toLowerCase().trim();
						if (chainLower.includes('testnet')) {
							chainInfo = 'testnet';
						}
					}
					
					this.walletInfo.chain = chainInfo || ONE_CHAIN_TESTNET;
				} catch (e) {
					// Default to testnet if chain info not available
					this.walletInfo.chain = ONE_CHAIN_TESTNET;
				}

				this.notifyListeners();
				return { success: true };
			}

			return {
				success: false,
				error: "Connection was rejected or no accounts were returned. Please approve the connection request in your wallet."
			};
		} catch (error: any) {
			console.error("Wallet connection error:", error);
			return {
				success: false,
				error: error?.message || "Failed to connect wallet. Please try again."
			};
		}
	}

	// Disconnect wallet
	static disconnect(): void {
		this.walletInfo = {
			connected: false,
			address: null,
			chain: null,
		};
		this.notifyListeners();
	}

	// Check connection status on page load
	static async checkConnection(): Promise<void> {
		try {
			const wallet = this.getWallet();
			if (!wallet) {
				return;
			}

			const suiProvider = this.getSuiProvider(wallet);
			if (!suiProvider) {
				return;
			}

			// Check if already connected
			let accounts: any[] | null = null;
			
			if (typeof suiProvider.getAccounts === 'function') {
				try {
					accounts = await suiProvider.getAccounts();
				} catch (e) {
					// Try alternative
					accounts = suiProvider.accounts || wallet.accounts;
				}
			} else {
				accounts = suiProvider.accounts || wallet.accounts;
			}

			if (accounts && accounts.length > 0) {
				// Extract address
				const account = accounts[0];
				const address = account.address || account;
				const addressStr = typeof address === 'string' ? address : String(address);
				
				this.walletInfo.connected = true;
				this.walletInfo.address = addressStr;
				
				// Get chain info
				try {
					let chainInfo: string | null = null;
					
					if (typeof suiProvider.getChain === 'function') {
						chainInfo = await suiProvider.getChain();
					} else if (suiProvider.chain) {
						chainInfo = suiProvider.chain;
					} else if (suiProvider.rpcUrl) {
						const rpcUrl = suiProvider.rpcUrl;
						if (rpcUrl.includes('testnet.onelabs.cc') || rpcUrl.includes('onelabs.cc')) {
							chainInfo = 'testnet';
						}
					}
					
					// Normalize chain info - if it contains "testnet", use "testnet"
					if (chainInfo) {
						const chainLower = chainInfo.toLowerCase().trim();
						if (chainLower.includes('testnet')) {
							chainInfo = 'testnet';
						}
					}
					
					this.walletInfo.chain = chainInfo || ONE_CHAIN_TESTNET;
				} catch (e) {
					this.walletInfo.chain = ONE_CHAIN_TESTNET;
				}

				this.notifyListeners();
			}
		} catch (error) {
			console.error("Wallet check error:", error);
		}
	}

	// Listen for wallet changes
	static onWalletChange(callback: (info: WalletInfo) => void): () => void {
		this.listeners.push(callback);
		return () => {
			this.listeners = this.listeners.filter(l => l !== callback);
		};
	}

	private static notifyListeners(): void {
		this.listeners.forEach(listener => listener({ ...this.walletInfo }));
	}

	// Get formatted address (shortened)
	static getFormattedAddress(): string {
		if (!this.walletInfo.address) {
			return "Not Connected";
		}
		const addr = this.walletInfo.address;
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	// Verify wallet requirements before action
	static verifyWalletForAction(): { valid: boolean; message: string } {
		if (!this.isWalletInstalled()) {
			return {
				valid: false,
				message: "Please install One Chain wallet extension to continue."
			};
		}

		if (!this.isConnected()) {
			return {
				valid: false,
				message: "Please connect your wallet to continue."
			};
		}

		if (!this.isCorrectChain()) {
			return {
				valid: false,
				message: `Please switch to One Chain testnet network.`
			};
		}

		return { valid: true, message: "" };
	}
}

// Initialize wallet check on load
if (typeof window !== "undefined") {
	window.addEventListener("load", () => {
		WalletManager.checkConnection();
	});
}

