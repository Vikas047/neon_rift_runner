module neon_rift_runner_nft::background_nft;

use one::object::{UID, ID};
use one::transfer;
use one::tx_context::TxContext;
use one::clock::Clock;
use one::event;
use std::string::String;

/// Background NFT carries metadata that the Neon Rift Runner frontend can render
public struct BackgroundNFT has key, store {
    id: UID,
    background_id: String,
    name: String,
    rarity: u8,
    palette_hint: String,
    image_url: String,
    metadata_url: String,
    minted_at: u64,
    minter: address,
}

/// Event emitted every time a background NFT is minted
public struct BackgroundMinted has copy, drop {
    background_id: String,
    nft_id: ID,
    recipient: address,
    rarity: u8,
    palette_hint: String,
    image_url: String,
    metadata_url: String,
    timestamp: u64,
}

/// Simple minter. The frontend sends fully formed metadata and receivers get the NFT immediately.
public entry fun mint_background(
    background_id: String,
    name: String,
    rarity: u8,
    palette_hint: String,
    image_url: String,
    metadata_url: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let sender = one::tx_context::sender(ctx);
    let minted_at = one::clock::timestamp_ms(clock);

    let nft = BackgroundNFT {
        id: one::object::new(ctx),
        background_id,
        name,
        rarity,
        palette_hint,
        image_url,
        metadata_url,
        minted_at,
        minter: sender,
    };

    one::event::emit(BackgroundMinted {
        background_id: nft.background_id,
        nft_id: one::object::id(&nft),
        recipient: sender,
        rarity: nft.rarity,
        palette_hint: nft.palette_hint,
        image_url: nft.image_url,
        metadata_url: nft.metadata_url,
        timestamp: minted_at,
    });

    one::transfer::public_transfer(nft, sender);
}

/// Accessors
public fun background_id(nft: &BackgroundNFT): String { nft.background_id }
public fun name(nft: &BackgroundNFT): String { nft.name }
public fun rarity(nft: &BackgroundNFT): u8 { nft.rarity }
public fun palette_hint(nft: &BackgroundNFT): String { nft.palette_hint }
public fun image_url(nft: &BackgroundNFT): String { nft.image_url }
public fun metadata_url(nft: &BackgroundNFT): String { nft.metadata_url }
public fun minted_at(nft: &BackgroundNFT): u64 { nft.minted_at }
public fun minter(nft: &BackgroundNFT): address { nft.minter }

