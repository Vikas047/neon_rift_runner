#[test_only]
module neon_rift_runner_nft::neon_rift_runner_nft_tests;

use neon_rift_runner_nft::background_nft::{Self, BackgroundNFT};
use neon_rift_runner_nft::skin_nft::{Self, SkinNFT};
use one::test_scenario::{Self as ts};
use one::clock::{Self, Clock};
use std::string;

const ADMIN: address = @0xAD;
const USER1: address = @0xCAFE;
const USER2: address = @0xBEEF;

// ========== Background NFT Tests ==========

#[test]
fun test_mint_background() {
    let mut scenario = ts::begin(ADMIN);
    
    // Setup clock
    let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
    clock::increment_for_testing(&mut clock, 1000); // Start at 1 second
    clock::share_for_testing(clock);
    
    // User1 mints a background
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        
        background_nft::mint_background(
            string::utf8(b"bg-desert"),
            string::utf8(b"Desert Mirage"),
            1u8, // Common
            string::utf8(b"#D4A574"),
            string::utf8(b"https://example.com/bg-desert.png"),
            string::utf8(b"https://example.com/metadata/bg-desert.json"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        
        ts::return_shared(clock_ref);
    };
    
    // Verify the background NFT
    scenario.next_tx(USER1);
    {
        let bg: BackgroundNFT = ts::take_from_sender(&mut scenario);
        
        // Verify all properties
        assert!(background_nft::background_id(&bg) == string::utf8(b"bg-desert"), 1);
        assert!(background_nft::name(&bg) == string::utf8(b"Desert Mirage"), 2);
        assert!(background_nft::rarity(&bg) == 1, 3);
        assert!(background_nft::palette_hint(&bg) == string::utf8(b"#D4A574"), 4);
        assert!(background_nft::image_url(&bg) == string::utf8(b"https://example.com/bg-desert.png"), 5);
        assert!(background_nft::metadata_url(&bg) == string::utf8(b"https://example.com/metadata/bg-desert.json"), 6);
        assert!(background_nft::minter(&bg) == USER1, 7);
        assert!(background_nft::minted_at(&bg) > 0, 8);
        
        ts::return_to_sender(&mut scenario, bg);
    };
    
    ts::end(scenario);
}

#[test]
fun test_mint_background_legendary() {
    let mut scenario = ts::begin(ADMIN);
    
    // Setup clock
    let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
    clock::increment_for_testing(&mut clock, 2000);
    clock::share_for_testing(clock);
    
    // User1 mints a legendary background
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        
        background_nft::mint_background(
            string::utf8(b"bg-volcano"),
            string::utf8(b"Volcano Eruption"),
            4u8, // Legendary
            string::utf8(b"#FF4500"),
            string::utf8(b"https://example.com/bg-volcano.png"),
            string::utf8(b"https://example.com/metadata/bg-volcano.json"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        
        ts::return_shared(clock_ref);
    };
    
    // Verify legendary rarity
    scenario.next_tx(USER1);
    {
        let bg: BackgroundNFT = ts::take_from_sender(&mut scenario);
        assert!(background_nft::rarity(&bg) == 4, 1);
        assert!(background_nft::name(&bg) == string::utf8(b"Volcano Eruption"), 2);
        ts::return_to_sender(&mut scenario, bg);
    };
    
    ts::end(scenario);
}

#[test]
fun test_multiple_backgrounds() {
    let mut scenario = ts::begin(ADMIN);
    
    // Setup clock
    let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
    clock::increment_for_testing(&mut clock, 1000);
    clock::share_for_testing(clock);
    
    // User1 mints first background
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        background_nft::mint_background(
            string::utf8(b"bg-day"),
            string::utf8(b"Sunny Day"),
            1u8,
            string::utf8(b"#87CEEB"),
            string::utf8(b"https://example.com/bg-day.png"),
            string::utf8(b"https://example.com/metadata/bg-day.json"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    
    // User1 mints second background
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        background_nft::mint_background(
            string::utf8(b"bg-night"),
            string::utf8(b"Midnight Sky"),
            2u8,
            string::utf8(b"#191970"),
            string::utf8(b"https://example.com/bg-night.png"),
            string::utf8(b"https://example.com/metadata/bg-night.json"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    
    // Verify both backgrounds
    scenario.next_tx(USER1);
    {
        let bg1: BackgroundNFT = ts::take_from_sender(&mut scenario);
        let bg2: BackgroundNFT = ts::take_from_sender(&mut scenario);
        
        assert!(background_nft::background_id(&bg1) == string::utf8(b"bg-day") || 
                background_nft::background_id(&bg1) == string::utf8(b"bg-night"), 1);
        assert!(background_nft::background_id(&bg2) == string::utf8(b"bg-day") || 
                background_nft::background_id(&bg2) == string::utf8(b"bg-night"), 2);
        assert!(background_nft::background_id(&bg1) != background_nft::background_id(&bg2), 3);
        
        ts::return_to_sender(&mut scenario, bg1);
        ts::return_to_sender(&mut scenario, bg2);
    };
    
    ts::end(scenario);
}

#[test]
fun test_background_different_users() {
    let mut scenario = ts::begin(ADMIN);
    
    // Setup clock
    let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
    clock::increment_for_testing(&mut clock, 1000);
    clock::share_for_testing(clock);
    
    // User1 mints a background
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        background_nft::mint_background(
            string::utf8(b"bg-city"),
            string::utf8(b"Neon City"),
            3u8,
            string::utf8(b"#FF1493"),
            string::utf8(b"https://example.com/bg-city.png"),
            string::utf8(b"https://example.com/metadata/bg-city.json"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    
    // User2 mints the same background
    scenario.next_tx(USER2);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        background_nft::mint_background(
            string::utf8(b"bg-city"),
            string::utf8(b"Neon City"),
            3u8,
            string::utf8(b"#FF1493"),
            string::utf8(b"https://example.com/bg-city.png"),
            string::utf8(b"https://example.com/metadata/bg-city.json"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    
    // Verify both users have their own NFTs
    scenario.next_tx(USER1);
    {
        let bg1: BackgroundNFT = ts::take_from_sender(&mut scenario);
        assert!(background_nft::minter(&bg1) == USER1, 1);
        ts::return_to_sender(&mut scenario, bg1);
    };
    
    scenario.next_tx(USER2);
    {
        let bg2: BackgroundNFT = ts::take_from_sender(&mut scenario);
        assert!(background_nft::minter(&bg2) == USER2, 2);
        ts::return_to_sender(&mut scenario, bg2);
    };
    
    ts::end(scenario);
}

// ========== Skin NFT Tests ==========

#[test]
fun test_mint_skin() {
    let mut scenario = ts::begin(ADMIN);
    
    // Setup clock
    let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
    clock::increment_for_testing(&mut clock, 1000);
    clock::share_for_testing(clock);
    
    // User1 mints a skin
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        
        skin_nft::mint_skin(
            string::utf8(b"dude-red"),
            string::utf8(b"Crimson Rage"),
            1u8, // Common
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/skins/dude-red.json"),
            string::utf8(b"A classic red runner outfit"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        
        ts::return_shared(clock_ref);
    };
    
    // Verify the skin NFT
    scenario.next_tx(USER1);
    {
        let skin: SkinNFT = ts::take_from_sender(&mut scenario);
        
        // Verify all properties
        assert!(skin_nft::skin_id(&skin) == string::utf8(b"dude-red"), 1);
        assert!(skin_nft::name(&skin) == string::utf8(b"Crimson Rage"), 2);
        assert!(skin_nft::rarity(&skin) == 1, 3);
        assert!(skin_nft::body_type(&skin) == string::utf8(b"dude"), 4);
        assert!(skin_nft::animation_url(&skin) == string::utf8(b"https://example.com/skins/dude-red.json"), 5);
        assert!(skin_nft::description(&skin) == string::utf8(b"A classic red runner outfit"), 6);
        assert!(skin_nft::minter(&skin) == USER1, 7);
        assert!(skin_nft::minted_at(&skin) > 0, 8);
        
        ts::return_to_sender(&mut scenario, skin);
    };
    
    ts::end(scenario);
}

#[test]
fun test_mint_skin_epic() {
    let mut scenario = ts::begin(ADMIN);
    
    // Setup clock
    let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
    clock::increment_for_testing(&mut clock, 2000);
    clock::share_for_testing(clock);
    
    // User1 mints an epic skin
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        
        skin_nft::mint_skin(
            string::utf8(b"dude-purple"),
            string::utf8(b"Void Walker"),
            3u8, // Epic
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/skins/dude-purple.json"),
            string::utf8(b"A mysterious purple runner"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        
        ts::return_shared(clock_ref);
    };
    
    // Verify epic rarity
    scenario.next_tx(USER1);
    {
        let skin: SkinNFT = ts::take_from_sender(&mut scenario);
        assert!(skin_nft::rarity(&skin) == 3, 1);
        assert!(skin_nft::name(&skin) == string::utf8(b"Void Walker"), 2);
        ts::return_to_sender(&mut scenario, skin);
    };
    
    ts::end(scenario);
}

#[test]
fun test_multiple_skins() {
    let mut scenario = ts::begin(ADMIN);
    
    // Setup clock
    let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
    clock::increment_for_testing(&mut clock, 1000);
    clock::share_for_testing(clock);
    
    // User1 mints first skin
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        skin_nft::mint_skin(
            string::utf8(b"dude-blue"),
            string::utf8(b"Neon Pulse"),
            2u8,
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/skins/dude-blue.json"),
            string::utf8(b"Electric blue runner"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    
    // User1 mints second skin
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        skin_nft::mint_skin(
            string::utf8(b"dude-green"),
            string::utf8(b"Forest Guardian"),
            2u8,
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/skins/dude-green.json"),
            string::utf8(b"Nature-inspired runner"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    
    // Verify both skins
    scenario.next_tx(USER1);
    {
        let skin1: SkinNFT = ts::take_from_sender(&mut scenario);
        let skin2: SkinNFT = ts::take_from_sender(&mut scenario);
        
        assert!(skin_nft::skin_id(&skin1) == string::utf8(b"dude-blue") || 
                skin_nft::skin_id(&skin1) == string::utf8(b"dude-green"), 1);
        assert!(skin_nft::skin_id(&skin2) == string::utf8(b"dude-blue") || 
                skin_nft::skin_id(&skin2) == string::utf8(b"dude-green"), 2);
        assert!(skin_nft::skin_id(&skin1) != skin_nft::skin_id(&skin2), 3);
        
        ts::return_to_sender(&mut scenario, skin1);
        ts::return_to_sender(&mut scenario, skin2);
    };
    
    ts::end(scenario);
}

#[test]
fun test_skin_different_users() {
    let mut scenario = ts::begin(ADMIN);
    
    // Setup clock
    let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
    clock::increment_for_testing(&mut clock, 1000);
    clock::share_for_testing(clock);
    
    // User1 mints a skin
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        skin_nft::mint_skin(
            string::utf8(b"dude-gold"),
            string::utf8(b"Golden Champion"),
            4u8,
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/skins/dude-gold.json"),
            string::utf8(b"Legendary golden runner"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    
    // User2 mints the same skin
    scenario.next_tx(USER2);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        skin_nft::mint_skin(
            string::utf8(b"dude-gold"),
            string::utf8(b"Golden Champion"),
            4u8,
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/skins/dude-gold.json"),
            string::utf8(b"Legendary golden runner"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    
    // Verify both users have their own NFTs
    scenario.next_tx(USER1);
    {
        let skin1: SkinNFT = ts::take_from_sender(&mut scenario);
        assert!(skin_nft::minter(&skin1) == USER1, 1);
        ts::return_to_sender(&mut scenario, skin1);
    };
    
    scenario.next_tx(USER2);
    {
        let skin2: SkinNFT = ts::take_from_sender(&mut scenario);
        assert!(skin_nft::minter(&skin2) == USER2, 2);
        ts::return_to_sender(&mut scenario, skin2);
    };
    
    ts::end(scenario);
}

#[test]
fun test_all_rarities() {
    let mut scenario = ts::begin(ADMIN);
    
    // Setup clock
    let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
    clock::increment_for_testing(&mut clock, 1000);
    clock::share_for_testing(clock);
    
    // Test all rarity levels (1-4: Common, Rare, Epic, Legendary)
    // Test rarity 1 (Common)
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        skin_nft::mint_skin(
            string::utf8(b"test-skin-1"),
            string::utf8(b"Test Skin Common"),
            1u8,
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/test1.json"),
            string::utf8(b"Test description"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    scenario.next_tx(USER1);
    {
        let skin: SkinNFT = ts::take_from_sender(&mut scenario);
        assert!(skin_nft::rarity(&skin) == 1, 1);
        ts::return_to_sender(&mut scenario, skin);
    };
    
    // Test rarity 2 (Rare)
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        skin_nft::mint_skin(
            string::utf8(b"test-skin-2"),
            string::utf8(b"Test Skin Rare"),
            2u8,
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/test2.json"),
            string::utf8(b"Test description"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    scenario.next_tx(USER1);
    {
        let skin: SkinNFT = ts::take_from_sender(&mut scenario);
        assert!(skin_nft::rarity(&skin) == 2, 2);
        ts::return_to_sender(&mut scenario, skin);
    };
    
    // Test rarity 3 (Epic)
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        skin_nft::mint_skin(
            string::utf8(b"test-skin-3"),
            string::utf8(b"Test Skin Epic"),
            3u8,
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/test3.json"),
            string::utf8(b"Test description"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    scenario.next_tx(USER1);
    {
        let skin: SkinNFT = ts::take_from_sender(&mut scenario);
        assert!(skin_nft::rarity(&skin) == 3, 3);
        ts::return_to_sender(&mut scenario, skin);
    };
    
    // Test rarity 4 (Legendary)
    scenario.next_tx(USER1);
    {
        let clock_ref = ts::take_shared<Clock>(&mut scenario);
        skin_nft::mint_skin(
            string::utf8(b"test-skin-4"),
            string::utf8(b"Test Skin Legendary"),
            4u8,
            string::utf8(b"dude"),
            string::utf8(b"https://example.com/test4.json"),
            string::utf8(b"Test description"),
            &clock_ref,
            ts::ctx(&mut scenario),
        );
        ts::return_shared(clock_ref);
    };
    scenario.next_tx(USER1);
    {
        let skin: SkinNFT = ts::take_from_sender(&mut scenario);
        assert!(skin_nft::rarity(&skin) == 4, 4);
        ts::return_to_sender(&mut scenario, skin);
    };
    
    ts::end(scenario);
}
