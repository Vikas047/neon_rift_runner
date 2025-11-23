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
		name: "Classic Blue",
		price: 0,
		type: "skin",
		assetKey: "dude",
		lore: "The original jumper. Forged in the pixel fires of 1985, he seeks only the highest platforms.",
		nftId: "GENESIS-001",
		rarity: "common",
	},
	{
		id: "skin-red",
		name: "Crimson Rage",
		price: 100,
		type: "skin",
		assetKey: "dude-red",
		lore: "Fueled by the anger of a thousand fallen runs. He jumps faster, harder, and with zero remorse.",
		nftId: "GENESIS-002",
		rarity: "rare",
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
		id: "bg-volcano",
		name: "Volcano Eruption",
		price: 500,
		type: "background",
		assetKey: "bg-sunset",
		lore: "The sky burns with the fury of a thousand eruptions. Lava flows like code through the veins of the earth.",
		nftId: "LAND-002",
		rarity: "legendary",
	},
	{
		id: "bg-ocean",
		name: "Ocean Depths",
		price: 450,
		type: "background",
		assetKey: "bg-night",
		lore: "Beneath the waves, the pressure is immense. Only the bravest jumpers dare these depths.",
		nftId: "LAND-003",
		rarity: "legendary",
	},
	{
		id: "bg-space",
		name: "Cosmic Void",
		price: 600,
		type: "background",
		assetKey: "bg-night",
		lore: "Among the stars, gravity is a suggestion. Here, jumpers become legends written in stardust.",
		nftId: "LAND-004",
		rarity: "legendary",
	},
	{
		id: "bg-city",
		name: "Neon City",
		price: 500,
		type: "background",
		assetKey: "bg-night",
		lore: "The city never sleeps. Neon signs flicker with the heartbeat of a thousand players.",
		nftId: "LAND-005",
		rarity: "legendary",
	},
];

interface OwnedItem {
	itemId: string;
	nftId: string;
}

export class GameData {
	private static STORAGE_KEY = "jumper_game_data_v2"; // Bump version for data migration

	private static get data() {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		if (stored) {
			const data = JSON.parse(stored);
			// Migrate old data format
			if (data.ownedItems && data.ownedItems.length > 0 && typeof data.ownedItems[0] === "string") {
				const migrated: OwnedItem[] = data.ownedItems.map((id: string) => {
					const item = [...SKINS, ...BACKGROUNDS].find(i => i.id === id);
					return { itemId: id, nftId: item ? item.nftId : `${id}-001` };
				});
				data.ownedItems = migrated;
				this.save(data);
			}
			return data;
		}
		return {
			coins: 0,
			ownedItems: [
				{ itemId: "skin-blue", nftId: "GENESIS-001" },
				{ itemId: "bg-day", nftId: "LAND-001" }
			] as OwnedItem[],
			equippedSkin: "skin-blue",
			equippedBg: "bg-day",
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
		return this.data.ownedItems.some((item: OwnedItem) => item.itemId === id);
	}

	static generateUniqueNftId(baseNftId: string, itemId: string): string {
		const data = this.data;
		const existing = data.ownedItems.filter((item: OwnedItem) => item.itemId === itemId);
		
		if (existing.length === 0) {
			return baseNftId; // First instance uses base NFT ID
		}
		
		// Extract number from base NFT ID (e.g., "GENESIS-001" -> 1)
		const match = baseNftId.match(/(\d+)$/);
		const baseNum = match ? parseInt(match[1]) : 1;
		
		// Find highest existing number for this item
		let maxNum = baseNum;
		existing.forEach((item: OwnedItem) => {
			const itemMatch = item.nftId.match(/(\d+)$/);
			if (itemMatch) {
				const num = parseInt(itemMatch[1]);
				if (num > maxNum) maxNum = num;
			}
		});
		
		// Generate new NFT ID with incremented number
		const prefix = baseNftId.replace(/\d+$/, "");
		return `${prefix}${String(maxNum + 1).padStart(3, "0")}`;
	}

	static unlockItem(id: string): void {
		const item = [...SKINS, ...BACKGROUNDS].find((i) => i.id === id);
		if (!item) return;
		
		const data = this.data;
		const uniqueNftId = this.generateUniqueNftId(item.nftId, id);
		
		data.ownedItems.push({ itemId: id, nftId: uniqueNftId });
		this.save(data);
	}

	static buyItem(id: string): boolean {
		const item = [...SKINS, ...BACKGROUNDS].find((i) => i.id === id);
		if (!item) return false;

		if (this.removeCoins(item.price)) {
			this.unlockItem(id);
			return true;
		}
		return false;
	}

	static equipItem(id: string, type: "skin" | "background") {
		if (!this.hasItem(id)) return;

		const data = this.data;
		if (type === "skin") {
			data.equippedSkin = id;
		} else {
			data.equippedBg = id;
		}
		this.save(data);
	}

	static getAllOwnedItems(): OwnedItem[] {
		return this.data.ownedItems;
	}

	static getOwnedItemsByType(type: "skin" | "background"): OwnedItem[] {
		const allItems = type === "skin" ? SKINS : BACKGROUNDS;
		const itemIds = allItems.map(i => i.id);
		return this.data.ownedItems.filter((item: OwnedItem) => itemIds.includes(item.itemId));
	}

	static getEquippedSkin(): string {
		const id = this.data.equippedSkin;
		const skin = SKINS.find((s) => s.id === id);
		return skin ? skin.assetKey : "dude";
	}

	static getEquippedBackground(): string {
		const id = this.data.equippedBg;
		const bg = BACKGROUNDS.find((b) => b.id === id);
		return bg ? bg.assetKey : "bg-day";
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
