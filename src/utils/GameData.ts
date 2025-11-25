export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface ShopItem {
	id: string;
	name: string;
	price: number;
	type: "skin" | "background";
	assetKey: string;
	lore: string;
	nftId: string;
	rarity: Rarity;
}

export const RARITY_WEIGHTS: Record<Rarity, number> = {
	common: 50,      // 50% chance
	rare: 30,        // 30% chance
	epic: 15,        // 15% chance
	legendary: 5,    // 5% chance
};

export const RARITY_COLORS: Record<Rarity, number> = {
	common: 0x9d9d9d,    // Gray
	rare: 0x0070dd,      // Blue
	epic: 0xa335ee,      // Purple
	legendary: 0xff8000, // Orange
};

export const SKINS: ShopItem[] = [
	{
		id: "skin-blue",
		name: "Neon Pulse",
		price: 100,
		type: "skin",
		assetKey: "dude",
		lore: "A blazing trail of cobalt energy. He vibrates with synth beats and outruns the darkness.",
		nftId: "GENESIS-001",
		rarity: "rare",
	},
	{
		id: "skin-red",
		name: "Crimson Rage",
		price: 0,
		type: "skin",
		assetKey: "dude-red",
		lore: "Fueled by the anger of a thousand fallen runs. He jumps faster, harder, and with zero remorse.",
		nftId: "GENESIS-002",
		rarity: "common",
	},
	{
		id: "skin-green",
		name: "Forest Guardian",
		price: 100,
		type: "skin",
		assetKey: "dude-green",
		lore: "A silent protector of the digital glade. Rumored to have once out-jumped a glitch.",
		nftId: "GENESIS-003",
		rarity: "rare",
	},
	{
		id: "skin-yellow",
		name: "Solar Flare",
		price: 150,
		type: "skin",
		assetKey: "dude-yellow",
		lore: "Harnessing the power of a thousand suns. Blindingly fast and dangerously bright.",
		nftId: "GENESIS-004",
		rarity: "epic",
	},
	{
		id: "skin-purple",
		name: "Void Walker",
		price: 200,
		type: "skin",
		assetKey: "dude-purple",
		lore: "He has seen the code behind the curtain. He doesn't jump; he displaces reality.",
		nftId: "GENESIS-005",
		rarity: "legendary",
	},
	{
		id: "skin-orange",
		name: "Molten Core",
		price: 200,
		type: "skin",
		assetKey: "dude-orange",
		lore: "Born from the lava pits of Level 8. His boots leave scorch marks on the cloud servers.",
		nftId: "GENESIS-006",
		rarity: "legendary",
	},
	{
		id: "skin-cyan",
		name: "Neon Phantom",
		price: 250,
		type: "skin",
		assetKey: "dude",
		lore: "A glitch in the matrix. He exists between frames, leaving trails of digital energy.",
		nftId: "GENESIS-007",
		rarity: "epic",
	},
	{
		id: "skin-pink",
		name: "Cherry Blossom",
		price: 200,
		type: "skin",
		assetKey: "dude-red",
		lore: "Petals fall with each jump. A warrior of spring, graceful yet deadly.",
		nftId: "GENESIS-008",
		rarity: "rare",
	},
	{
		id: "skin-emerald",
		name: "Jade Warrior",
		price: 300,
		type: "skin",
		assetKey: "dude-green",
		lore: "Carved from ancient jade. His jumps echo through the digital mountains.",
		nftId: "GENESIS-009",
		rarity: "epic",
	},
	{
		id: "skin-gold",
		name: "Golden God",
		price: 400,
		type: "skin",
		assetKey: "dude-yellow",
		lore: "The ultimate form. He doesn't jump—gravity begs for his permission.",
		nftId: "GENESIS-010",
		rarity: "legendary",
	},
	{
		id: "skin-shadow",
		name: "Shadow Assassin",
		price: 350,
		type: "skin",
		assetKey: "dude-purple",
		lore: "Born from the void between pixels. He is the absence of light, the master of stealth.",
		nftId: "GENESIS-011",
		rarity: "legendary",
	},
	{
		id: "skin-lava",
		name: "Volcano Eruption",
		price: 450,
		type: "skin",
		assetKey: "dude-orange",
		lore: "The earth's fury made manifest. Each jump triggers a seismic event.",
		nftId: "GENESIS-012",
		rarity: "legendary",
	},
];

export const BACKGROUNDS: ShopItem[] = [
	{
		id: "bg-day",
		name: "Sunny Day",
		price: 0,
		type: "background",
		assetKey: "bg-day",
		lore: "A perfect day for jumping. The clouds are fluffy, the sky is blue, and hope is high.",
		nftId: "LAND-001",
		rarity: "common",
	},
	{
		id: "bg-sunset",
		name: "Golden Hour",
		price: 250,
		type: "background",
		assetKey: "bg-sunset",
		lore: "The sun sets on another run. A melancholy backdrop for those who seek improved high scores.",
		nftId: "LAND-002",
		rarity: "rare",
	},
	{
		id: "bg-night",
		name: "Midnight Run",
		price: 300,
		type: "background",
		assetKey: "bg-night",
		lore: "Where the true gamers play. The stars witness your triumphs and your falls.",
		nftId: "LAND-003",
		rarity: "epic",
	},
	{
		id: "bg-forest",
		name: "Ancient Woods",
		price: 350,
		type: "background",
		assetKey: "bg-forest",
		lore: "Trees that have stood since the alpha build. They whisper cheat codes to those who listen.",
		nftId: "LAND-004",
		rarity: "epic",
	},
	{
		id: "bg-volcano",
		name: "Volcano Eruption",
		price: 500,
		type: "background",
		assetKey: "bg-volcano",
		lore: "The sky burns with the fury of a thousand eruptions. Lava flows like code through the veins of the earth.",
		nftId: "LAND-005",
		rarity: "legendary",
	},
	{
		id: "bg-ocean",
		name: "Ocean Depths",
		price: 450,
		type: "background",
		assetKey: "bg-ocean",
		lore: "Beneath the waves, the pressure is immense. Only the bravest runners dare these depths.",
		nftId: "LAND-006",
		rarity: "epic",
	},
	{
		id: "bg-space",
		name: "Cosmic Void",
		price: 600,
		type: "background",
		assetKey: "bg-space",
		lore: "Among the stars, gravity is a suggestion. Here, runners become legends written in stardust.",
		nftId: "LAND-007",
		rarity: "legendary",
	},
	{
		id: "bg-city",
		name: "Neon City",
		price: 500,
		type: "background",
		assetKey: "bg-city",
		lore: "The city never sleeps. Neon signs flicker with the heartbeat of a thousand players.",
		nftId: "LAND-008",
		rarity: "epic",
	},
	{
		id: "bg-winter",
		name: "Frosty Peaks",
		price: 400,
		type: "background",
		assetKey: "bg-winter",
		lore: "Cold, unforgiving, and beautiful. Only the warmest CPUs survive here.",
		nftId: "LAND-009",
		rarity: "rare",
	},
	{
		id: "bg-storm",
		name: "Thunderstorm",
		price: 350,
		type: "background",
		assetKey: "bg-storm",
		lore: "Lightning cracks the digital sky. The storm rages eternal, powered by the rage of fallen players.",
		nftId: "LAND-010",
		rarity: "rare",
	},
	{
		id: "bg-desert",
		name: "Desert Mirage",
		price: 0,
		type: "background",
		assetKey: "bg-desert",
		lore: "The sands shift with each frame. What you see may not be real, but the jumps are always true.",
		nftId: "LAND-011",
		rarity: "common",
	},
];

export class GameData {
	// Only store coins and equipped preferences in localStorage
	// Owned items come from blockchain (wallet NFTs)
	private static STORAGE_KEY = "neon_rift_runner_data_v2";

	private static get data() {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
		// Default values - only coins and equipped preferences
		return {
			coins: 0,
			equippedSkin: "skin-red",    // Default skin
			equippedBg: "bg-desert",      // Default background
		};
	}

	private static save(data: any) {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
	}

	static getCoins(): number {
		return this.data.coins;
	}

	static addCoins(amount: number) {
		const data = this.data;
		data.coins += amount;
		this.save(data);
	}

	static removeCoins(amount: number): boolean {
		const data = this.data;
		if (data.coins >= amount) {
			data.coins -= amount;
			this.save(data);
			return true;
		}
		return false;
	}

	static hasItem(id: string): boolean {
		// Only check for default items - other ownership comes from blockchain
		return id === "skin-red" || id === "bg-desert";
	}

	static equipItem(id: string, type: "skin" | "background") {
		// No ownership check needed - ownership verified by blockchain
		const data = this.data;
		if (type === "skin") {
			data.equippedSkin = id;
		} else {
			data.equippedBg = id;
		}
		this.save(data);
	}

	static getEquippedSkin(): string {
		const id = this.data.equippedSkin;
		const skin = SKINS.find((s) => s.id === id);
		return skin ? skin.assetKey : "dude-red";
	}

	static getEquippedBackground(): string {
		const id = this.data.equippedBg;
		const bg = BACKGROUNDS.find((b) => b.id === id);
		return bg ? bg.assetKey : "bg-desert";
	}

	static getBackgroundColor(bgKey: string): number {
		// Map background asset keys to appropriate background colors for contrast
		const colorMap: Record<string, number> = {
			"bg-day": 0x87ceeb,        // Sky blue
			"bg-sunset": 0xff6347,      // Tomato red-orange
			"bg-night": 0x191970,       // Midnight blue
			"bg-forest": 0x2d5016,     // Dark green
			"bg-winter": 0xb0c4de,      // Light steel blue
			"bg-volcano": 0x8b0000,     // Dark red
			"bg-ocean": 0x001f3f,       // Deep ocean blue
			"bg-space": 0x000000,       // Pure black
			"bg-city": 0x1a1a2e,        // Dark blue-gray
			"bg-storm": 0x2c2c54,       // Dark purple-gray
			"bg-desert": 0xd4a574,      // Sandy beige
		};
		return colorMap[bgKey] || 0x028af8; // Default blue if not found
	}

	static getPlatformColor(bgKey: string): number {
		// Map background asset keys to platform colors that contrast with backgrounds
		const colorMap: Record<string, number> = {
			"bg-day": 0x8b4513,        // Saddle brown (contrasts with sky blue)
			"bg-sunset": 0x2f4f4f,     // Dark slate gray (contrasts with red-orange)
			"bg-night": 0xd4af37,      // Gold (contrasts with midnight blue)
			"bg-forest": 0x8b7355,     // Khaki brown (contrasts with dark green)
			"bg-winter": 0x654321,     // Dark brown (contrasts with light blue)
			"bg-volcano": 0xffd700,    // Gold (contrasts with dark red)
			"bg-ocean": 0xffa500,      // Orange (contrasts with deep blue)
			"bg-space": 0xffffff,      // White (contrasts with black)
			"bg-city": 0xff6347,       // Tomato red (contrasts with dark blue-gray)
			"bg-storm": 0xf0e68c,      // Khaki yellow (contrasts with dark purple-gray)
			"bg-desert": 0x556b2f,     // Dark olive green (contrasts with sandy beige)
		};
		return colorMap[bgKey] || 0x8b4513; // Default brown if not found
	}

	static getTitleColor(bgKey: string): number {
		// Map background asset keys to title colors that match the background theme
		const colorMap: Record<string, number> = {
			"bg-day": 0x87ceeb,        // Sky blue (matches sunny day)
			"bg-sunset": 0xff6347,      // Tomato red-orange (matches sunset)
			"bg-night": 0x191970,       // Midnight blue (matches night)
			"bg-forest": 0x2d5016,      // Dark green (matches forest)
			"bg-winter": 0xb0c4de,      // Light steel blue (matches winter)
			"bg-volcano": 0xff4500,     // Orange red (matches volcano/lava)
			"bg-ocean": 0x001f3f,       // Deep ocean blue (matches ocean)
			"bg-space": 0x4b0082,       // Indigo purple (matches space/nebula)
			"bg-city": 0x00bfff,        // Deep sky blue (matches neon city)
			"bg-storm": 0x2c2c54,       // Dark purple-gray (matches storm)
			"bg-desert": 0xd4a574,      // Sandy beige (matches desert)
		};
		return colorMap[bgKey] || 0x87ceeb; // Default sky blue if not found
	}

	static getWeightedRandomItem(items: ShopItem[]): ShopItem {
		// Create weighted pool
		const pool: ShopItem[] = [];
		items.forEach(item => {
			const weight = RARITY_WEIGHTS[item.rarity];
			for (let i = 0; i < weight; i++) {
				pool.push(item);
			}
		});
		
		// Pick random from pool
		return pool[Math.floor(Math.random() * pool.length)];
	}
}
