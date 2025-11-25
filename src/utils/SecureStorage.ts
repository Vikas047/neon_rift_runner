// Secure storage using IndexedDB with encryption for coins
// Uses Web Crypto API for AES-GCM encryption

const DB_NAME = "neon_rift_runner_secure";
const DB_VERSION = 1;
const STORE_NAME = "coins";
const COINS_KEY = "encrypted_coins";

// Generate a key from a string (deterministic)
async function getKey(): Promise<CryptoKey> {
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode("neon_rift_runner_secret_key_v1"),
		{ name: "PBKDF2" },
		false,
		["deriveBits", "deriveKey"]
	);

	return crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: new TextEncoder().encode("neon_rift_runner_salt"),
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	);
}

// Encrypt data
async function encrypt(data: string): Promise<ArrayBuffer> {
	const key = await getKey();
	const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
	const encoded = new TextEncoder().encode(data);

	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		encoded
	);

	// Prepend IV to encrypted data
	const result = new Uint8Array(iv.length + encrypted.byteLength);
	result.set(iv, 0);
	result.set(new Uint8Array(encrypted), iv.length);

	return result.buffer;
}

// Decrypt data
async function decrypt(encryptedData: ArrayBuffer): Promise<string> {
	const key = await getKey();
	const data = new Uint8Array(encryptedData);
	const iv = data.slice(0, 12);
	const encrypted = data.slice(12);

	const decrypted = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv },
		key,
		encrypted
	);

	return new TextDecoder().decode(decrypted);
}

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		};
	});
}

export class SecureStorage {
	// Get coins from IndexedDB (decrypted)
	static async getCoins(): Promise<number> {
		if (typeof window === "undefined" || !indexedDB) {
			return 0;
		}

		try {
			const db = await openDB();
			const transaction = db.transaction([STORE_NAME], "readonly");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.get(COINS_KEY);

			return new Promise((resolve, reject) => {
				request.onsuccess = async () => {
					const encryptedData = request.result;
					if (!encryptedData) {
						resolve(0);
						return;
					}

					try {
						const decrypted = await decrypt(encryptedData);
						const coins = parseInt(decrypted, 10);
						resolve(isNaN(coins) ? 0 : coins);
					} catch (error) {
						console.error("Decryption error:", error);
						resolve(0);
					}
					db.close();
				};

				request.onerror = () => {
					reject(request.error);
					db.close();
				};
			});
		} catch (error) {
			console.error("Error getting coins:", error);
			return 0;
		}
	}

	// Save coins to IndexedDB (encrypted)
	static async saveCoins(coins: number): Promise<void> {
		if (typeof window === "undefined" || !indexedDB) {
			return;
		}

		try {
			const encrypted = await encrypt(coins.toString());
			const db = await openDB();
			const transaction = db.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			store.put(encrypted, COINS_KEY);

			return new Promise((resolve, reject) => {
				transaction.oncomplete = () => {
					db.close();
					resolve();
				};
				transaction.onerror = () => {
					reject(transaction.error);
					db.close();
				};
			});
		} catch (error) {
			console.error("Error saving coins:", error);
			throw error;
		}
	}

	// Add coins (atomic operation)
	static async addCoins(amount: number): Promise<void> {
		const current = await this.getCoins();
		await this.saveCoins(current + amount);
	}

	// Remove coins (atomic operation, returns success)
	static async removeCoins(amount: number): Promise<boolean> {
		const current = await this.getCoins();
		if (current >= amount) {
			await this.saveCoins(current - amount);
			return true;
		}
		return false;
	}
}

