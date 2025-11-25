import { WalletManager } from "./WalletManager";
import { SuiClient } from "@onelabs/sui/client";
import { Transaction } from "@onelabs/sui/transactions";
import { bcs } from "@onelabs/sui/bcs";

// Package ID - Hardcoded after deployment
// Deployed to One Chain Testnet
const PACKAGE_ID = "0x9da588e412e32337eeadd07d62e40e0256adfaf5dadbbc13ea37e67fe3e9d608";

// Sui Client for testnet
const RPC_URL = "https://rpc-testnet.onelabs.cc:443";
const suiClient = new SuiClient({ url: RPC_URL });

// Object IDs for shared objects (Clock, etc.)
const CLOCK_ID = "0x6"; // Standard Clock object ID on Sui/One Chain

// NFT Type identifiers
const SKIN_NFT_TYPE = (pkgId: string) => `${pkgId}::skin_nft::SkinNFT`;
const BACKGROUND_NFT_TYPE = (pkgId: string) => `${pkgId}::background_nft::BackgroundNFT`;

export class NFTService {
	static getPackageId(): string {
		return PACKAGE_ID;
	}

	// Get Sui client
	private static getClient(): SuiClient {
		return suiClient;
	}

	// Get wallet and provider
	private static async getWalletAndProvider(): Promise<{ wallet: any; provider: any }> {
		const wallet = WalletManager.getWallet();
		if (!wallet) {
			throw new Error("Wallet not connected");
		}

		const provider = WalletManager.getSuiProvider(wallet);
		if (!provider) {
			throw new Error("Sui provider not found");
		}

		return { wallet, provider };
	}

	// Convert string to bytes for Move (same as reference project)
	private static stringToBytes(str: string): number[] {
		return Array.from(new TextEncoder().encode(str));
	}

	// Mint a skin NFT
	static async mintSkin(
		skinId: string,
		name: string,
		rarity: number,
		bodyType: string,
		animationUrl: string,
		description: string
	): Promise<{ success: boolean; nftId?: string; error?: string }> {
		try {

			const { provider } = await this.getWalletAndProvider();
			const tx = new Transaction();

			// Prepare arguments
			const skinIdBytes = this.stringToBytes(skinId);
			const nameBytes = this.stringToBytes(name);
			const bodyTypeBytes = this.stringToBytes(bodyType);
			const animationUrlBytes = this.stringToBytes(animationUrl);
			const descriptionBytes = this.stringToBytes(description);

			// Call mint_skin function
			tx.moveCall({
				target: `${PACKAGE_ID}::skin_nft::mint_skin`,
				arguments: [
					tx.pure(bcs.vector(bcs.u8()).serialize(skinIdBytes)),
					tx.pure(bcs.vector(bcs.u8()).serialize(nameBytes)),
					tx.pure.u8(rarity),
					tx.pure(bcs.vector(bcs.u8()).serialize(bodyTypeBytes)),
					tx.pure(bcs.vector(bcs.u8()).serialize(animationUrlBytes)),
					tx.pure(bcs.vector(bcs.u8()).serialize(descriptionBytes)),
					tx.object(CLOCK_ID),
				],
			});

			// Execute transaction
			const result = await provider.signAndExecuteTransactionBlock({
				transactionBlock: tx,
				options: {
					showEffects: true,
					showEvents: true,
				},
			});

			// Extract NFT ID from created objects
			let nftId: string | null = null;
			if (result.effects?.created) {
				for (const created of result.effects.created) {
					if (created.reference?.objectId) {
						nftId = created.reference.objectId;
						break;
					}
				}
			}

			return { success: true, nftId: nftId || undefined };
		} catch (error: any) {
			console.error("Mint skin error:", error);
			return {
				success: false,
				error: error?.message || "Failed to mint skin NFT"
			};
		}
	}

	// Mint a background NFT
	static async mintBackground(
		backgroundId: string,
		name: string,
		rarity: number,
		paletteHint: string,
		imageUrl: string,
		metadataUrl: string
	): Promise<{ success: boolean; nftId?: string; error?: string }> {
		try {

			const { provider } = await this.getWalletAndProvider();
			const tx = new Transaction();

			// Prepare arguments
			const backgroundIdBytes = this.stringToBytes(backgroundId);
			const nameBytes = this.stringToBytes(name);
			const paletteHintBytes = this.stringToBytes(paletteHint);
			const imageUrlBytes = this.stringToBytes(imageUrl);
			const metadataUrlBytes = this.stringToBytes(metadataUrl);

			// Call mint_background function
			tx.moveCall({
				target: `${PACKAGE_ID}::background_nft::mint_background`,
				arguments: [
					tx.pure(bcs.vector(bcs.u8()).serialize(backgroundIdBytes)),
					tx.pure(bcs.vector(bcs.u8()).serialize(nameBytes)),
					tx.pure.u8(rarity),
					tx.pure(bcs.vector(bcs.u8()).serialize(paletteHintBytes)),
					tx.pure(bcs.vector(bcs.u8()).serialize(imageUrlBytes)),
					tx.pure(bcs.vector(bcs.u8()).serialize(metadataUrlBytes)),
					tx.object(CLOCK_ID),
				],
			});

			// Execute transaction
			const result = await provider.signAndExecuteTransactionBlock({
				transactionBlock: tx,
				options: {
					showEffects: true,
					showEvents: true,
				},
			});

			// Extract NFT ID from created objects
			let nftId: string | null = null;
			if (result.effects?.created) {
				for (const created of result.effects.created) {
					if (created.reference?.objectId) {
						nftId = created.reference.objectId;
						break;
					}
				}
			}

			return { success: true, nftId: nftId || undefined };
		} catch (error: any) {
			console.error("Mint background error:", error);
			return {
				success: false,
				error: error?.message || "Failed to mint background NFT"
			};
		}
	}

	// Fetch owned skin NFTs
	static async fetchOwnedSkins(): Promise<Array<{ nftId: string; skinId: string; name: string; rarity: number }>> {
		try {
			if (!WalletManager.isConnected()) {
				return [];
			}

			const address = WalletManager.getAddress();
			if (!address) return [];

			const client = this.getClient();
			const allObjectIds: string[] = [];
			let hasNextPage = true;
			let nextCursor = null;

			// Fetch all owned skin NFTs
			while (hasNextPage) {
				const response: any = await client.getOwnedObjects({
					owner: address,
					filter: { StructType: SKIN_NFT_TYPE(PACKAGE_ID) },
					options: { showType: true },
					cursor: nextCursor,
				});

				const ids = response.data.map((obj: any) => obj.data?.objectId).filter(Boolean);
				allObjectIds.push(...ids);

				hasNextPage = response.hasNextPage;
				nextCursor = response.nextCursor;
			}

			if (allObjectIds.length === 0) return [];

			// Fetch object details
			const objectsResponse = await client.multiGetObjects({
				ids: allObjectIds,
				options: { showContent: true },
			});

			// Parse NFTs
			const skins = objectsResponse.map((objResponse: any) => {
				const content = objResponse.data?.content;
				if (!content || content.dataType !== 'moveObject') return null;

				const fields = content.fields;
				return {
					nftId: objResponse.data?.objectId,
					skinId: fields.skin_id,
					name: fields.name,
					rarity: Number(fields.rarity),
				};
			}).filter((s: any) => s !== null);

			return skins;
		} catch (error) {
			console.error("Error fetching owned skins:", error);
			return [];
		}
	}

	// Fetch owned background NFTs
	static async fetchOwnedBackgrounds(): Promise<Array<{ nftId: string; backgroundId: string; name: string; rarity: number }>> {
		try {
			if (!WalletManager.isConnected()) {
				return [];
			}

			const address = WalletManager.getAddress();
			if (!address) return [];

			const client = this.getClient();
			const allObjectIds: string[] = [];
			let hasNextPage = true;
			let nextCursor = null;

			// Fetch all owned background NFTs
			while (hasNextPage) {
				const response: any = await client.getOwnedObjects({
					owner: address,
					filter: { StructType: BACKGROUND_NFT_TYPE(PACKAGE_ID) },
					options: { showType: true },
					cursor: nextCursor,
				});

				const ids = response.data.map((obj: any) => obj.data?.objectId).filter(Boolean);
				allObjectIds.push(...ids);

				hasNextPage = response.hasNextPage;
				nextCursor = response.nextCursor;
			}

			if (allObjectIds.length === 0) return [];

			// Fetch object details
			const objectsResponse = await client.multiGetObjects({
				ids: allObjectIds,
				options: { showContent: true },
			});

			// Parse NFTs
			const backgrounds = objectsResponse.map((objResponse: any) => {
				const content = objResponse.data?.content;
				if (!content || content.dataType !== 'moveObject') return null;

				const fields = content.fields;
				return {
					nftId: objResponse.data?.objectId,
					backgroundId: fields.background_id,
					name: fields.name,
					rarity: Number(fields.rarity),
				};
			}).filter((b: any) => b !== null);

			return backgrounds;
		} catch (error) {
			console.error("Error fetching owned backgrounds:", error);
			return [];
		}
	}
}

// Export convenience functions for Shop
export async function mintSkinNFT(item: any): Promise<{ success: boolean; nftId?: string; error?: string }> {
	const rarityMap: Record<string, number> = {
		common: 1,
		rare: 2,
		epic: 3,
		legendary: 4,
	};

	return await NFTService.mintSkin(
		item.id,
		item.name,
		rarityMap[item.rarity] || 1,
		item.assetKey || "dude",
		`https://example.com/skins/${item.id}.json`,
		item.lore || ""
	);
}

export async function mintBackgroundNFT(item: any): Promise<{ success: boolean; nftId?: string; error?: string }> {
	const rarityMap: Record<string, number> = {
		common: 1,
		rare: 2,
		epic: 3,
		legendary: 4,
	};

	return await NFTService.mintBackground(
		item.id,
		item.name,
		rarityMap[item.rarity] || 1,
		item.paletteHint || "#000000",
		`https://example.com/backgrounds/${item.id}.png`,
		`https://example.com/metadata/${item.id}.json`
	);
}

export async function fetchOwnedNFTs(): Promise<{
	skins: Array<{ nftId: string; skinId: string; name: string; rarity: number }>;
	backgrounds: Array<{ nftId: string; backgroundId: string; name: string; rarity: number }>;
}> {
	const [skins, backgrounds] = await Promise.all([
		NFTService.fetchOwnedSkins(),
		NFTService.fetchOwnedBackgrounds()
	]);

	return { skins, backgrounds };
}

export function getPackageId(): string {
	return NFTService.getPackageId();
}
