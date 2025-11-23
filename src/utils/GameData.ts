export interface ShopItem {
	id: string;
	name: string;
	price: number;
	type: "skin" | "background";
	assetKey: string;
}

export const SKINS: ShopItem[] = [
	{ id: "skin-blue", name: "Classic Blue", price: 0, type: "skin", assetKey: "dude" },
	{ id: "skin-red", name: "Red Ranger", price: 100, type: "skin", assetKey: "dude-red" },
	{ id: "skin-green", name: "Green Goblin", price: 100, type: "skin", assetKey: "dude-green" },
	{ id: "skin-yellow", name: "Yellow Flash", price: 150, type: "skin", assetKey: "dude-yellow" },
	{ id: "skin-purple", name: "Purple Haze", price: 200, type: "skin", assetKey: "dude-purple" },
	{ id: "skin-orange", name: "Orange Crush", price: 200, type: "skin", assetKey: "dude-orange" },
];

export const BACKGROUNDS: ShopItem[] = [
	{ id: "bg-day", name: "Sunny Day", price: 0, type: "background", assetKey: "bg-day" },
	{ id: "bg-sunset", name: "Sunset", price: 250, type: "background", assetKey: "bg-sunset" },
	{ id: "bg-night", name: "Midnight", price: 300, type: "background", assetKey: "bg-night" },
	{ id: "bg-forest", name: "Forest", price: 350, type: "background", assetKey: "bg-forest" },
	{ id: "bg-winter", name: "Winter", price: 400, type: "background", assetKey: "bg-winter" },
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
		const skin = SKINS.find(s => s.id === id);
		return skin ? skin.assetKey : "dude";
	}

	static getEquippedBackground(): string {
		const id = this.data.equippedBg;
		const bg = BACKGROUNDS.find(b => b.id === id);
		return bg ? bg.assetKey : "bg-day";
	}
}

