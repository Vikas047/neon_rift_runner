module neon_rift_runner_nft::skin_nft;

use one::object::{UID, ID};
use one::transfer;
use one::tx_context::TxContext;
use one::clock::Clock;
use one::event;
use std::string::String;

/// Skin NFT used for avatars/outfits inside Neon Rift Runner
public struct SkinNFT has key, store {
    id: UID,
    skin_id: String,
    name: String,
    rarity: u8,
    body_type: String,
    animation_url: String,
    description: String,
    minted_at: u64,
    minter: address,
}

/// Event for minting skins
public struct SkinMinted has copy, drop {
    skin_id: String,
    nft_id: ID,
    recipient: address,
    rarity: u8,
    body_type: String,
    animation_url: String,
    timestamp: u64,
}

/// Mint a skin NFT with arbitrary metadata supplied by the app backend
public entry fun mint_skin(
    skin_id: String,
    name: String,
    rarity: u8,
    body_type: String,
    animation_url: String,
    description: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let sender = one::tx_context::sender(ctx);
    let minted_at = one::clock::timestamp_ms(clock);

    let nft = SkinNFT {
        id: one::object::new(ctx),
        skin_id,
        name,
        rarity,
        body_type,
        animation_url,
        description,
        minted_at,
        minter: sender,
    };

    one::event::emit(SkinMinted {
        skin_id: nft.skin_id,
        nft_id: one::object::id(&nft),
        recipient: sender,
        rarity: nft.rarity,
        body_type: nft.body_type,
        animation_url: nft.animation_url,
        timestamp: minted_at,
    });

    one::transfer::public_transfer(nft, sender);
}

/// Accessors
public fun skin_id(nft: &SkinNFT): String { nft.skin_id }
public fun name(nft: &SkinNFT): String { nft.name }
public fun rarity(nft: &SkinNFT): u8 { nft.rarity }
public fun body_type(nft: &SkinNFT): String { nft.body_type }
public fun animation_url(nft: &SkinNFT): String { nft.animation_url }
public fun description(nft: &SkinNFT): String { nft.description }
public fun minted_at(nft: &SkinNFT): u64 { nft.minted_at }
public fun minter(nft: &SkinNFT): address { nft.minter }

