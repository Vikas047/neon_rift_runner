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
		rarity: "legendary",
	},
	{
		id: "bg-winter",
		name: "Frosty Peaks",
		price: 400,
		type: "background",
		assetKey: "bg-winter",
		lore: "Cold, unforgiving, and beautiful. Only the warmest CPUs survive here.",
		nftId: "LAND-005",
		rarity: "legendary",
	},
];

export class GameData {
	private static STORAGE_KEY = "jumper_game_data_v1";

	private static get data() {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
		return {
			coins: 0,
			ownedItems: ["skin-blue", "bg-day"],
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
		return this.data.ownedItems.includes(id);
	}

	static unlockItem(id: string): void {
		if (this.hasItem(id)) return;
		const data = this.data;
		data.ownedItems.push(id);
		this.save(data);
	}

	static buyItem(id: string): boolean {
		const item = [...SKINS, ...BACKGROUNDS].find((i) => i.id === id);
		if (!item) return false;

		if (this.hasItem(id)) return true;

		if (this.removeCoins(item.price)) {
			const data = this.data;
			data.ownedItems.push(id);
			this.save(data);
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
