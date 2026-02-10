// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ArtworkRegistry.sol";

contract ArtworkRegistryTest is Test {
    ArtworkRegistry public registry;

    address public owner = address(0x1);
    address public creator1 = address(0x2);
    address public creator2 = address(0x3);
    address public buyer1 = address(0x4);
    address public buyer2 = address(0x5);

    function setUp() public {
        vm.startPrank(owner);
        registry = new ArtworkRegistry();
        vm.stopPrank();
    }

    // =========================
    // Test 1: Deployment
    // =========================
    function testDeployment() public {
        assertEq(registry.Owner(), owner);
        assertEq(registry.nextArtworkId(), 0);
    }

    // =========================
    // Test 2: Create Painting
    // =========================
    function testCreatePainting() public {
        vm.startPrank(creator1);

        registry.createArtwork("QmMetaCID_Painting_123", ArtworkRegistry.ItemType.PAINTING, 1 ether);

        vm.stopPrank();

        (
            string memory metadataCID,
            ArtworkRegistry.ItemType itemType,
            address artworkOwner,
            address artworkCreator,
            uint256 createdAt,
            uint256 price
        ) = registry.getArtworkDetails(0);

        assertEq(metadataCID, "QmMetaCID_Painting_123");
        assertEq(uint256(itemType), uint256(ArtworkRegistry.ItemType.PAINTING));
        assertEq(artworkOwner, creator1);
        assertEq(artworkCreator, creator1);
        assertEq(price, 1 ether);
        assertTrue(createdAt > 0);

        uint256[] memory creatorArtworks = registry.getArtworksByCreator(creator1);
        assertEq(creatorArtworks.length, 1);
        assertEq(creatorArtworks[0], 0);

        uint256[] memory ownerArtworks = registry.getArtworksByOwner(creator1);
        assertEq(ownerArtworks.length, 1);

        assertEq(registry.nextArtworkId(), 1);
    }

    // =========================
    // Test 3: Create Research Paper
    // =========================
    function testCreateResearchPaper() public {
        vm.startPrank(creator2);

        registry.createArtwork("QmMetaCID_Paper_456", ArtworkRegistry.ItemType.RESEARCH_PAPER, 0.1 ether);

        vm.stopPrank();

        (, ArtworkRegistry.ItemType itemType,,,,) = registry.getArtworkDetails(0);
        assertEq(uint256(itemType), uint256(ArtworkRegistry.ItemType.RESEARCH_PAPER));
    }

    // =========================
    // Test 4: Buy Painting
    // =========================
    function testBuyPainting() public {
        vm.startPrank(creator1);
        registry.createArtwork("QmMetaCID_Painting_789", ArtworkRegistry.ItemType.PAINTING, 2 ether);
        vm.stopPrank();

        vm.deal(buyer1, 10 ether);
        vm.startPrank(buyer1);
        registry.buyPainting{value: 2 ether}(0);
        vm.stopPrank();

        (,, address newOwner,,,) = registry.getArtworkDetails(0);
        assertEq(newOwner, buyer1);

        uint256[] memory oldOwnerArtworks = registry.getArtworksByOwner(creator1);
        assertEq(oldOwnerArtworks.length, 0);

        uint256[] memory newOwnerArtworks = registry.getArtworksByOwner(buyer1);
        assertEq(newOwnerArtworks.length, 1);
        assertEq(newOwnerArtworks[0], 0);

        uint256[] memory creatorArtworks = registry.getArtworksByCreator(creator1);
        assertEq(creatorArtworks.length, 1);
    }

    // =========================
    // Test 5: Lease Research Paper
    // =========================
    function testLeasePaper() public {
        vm.startPrank(creator1);
        registry.createArtwork("QmMetaCID_Paper_999", ArtworkRegistry.ItemType.RESEARCH_PAPER, 0.5 ether);
        vm.stopPrank();

        vm.deal(buyer1, 10 ether);
        vm.startPrank(buyer1);
        registry.leasePaper{value: 0.5 ether}(0);
        vm.stopPrank();

        bool hasAccess = registry.hasPaperAccess(0, buyer1);
        assertTrue(hasAccess);

        assertEq(creator1.balance, 0.5 ether);
    }

    // =========================
    // Test 6: Cannot Buy Own Painting
    // =========================
    function testCannotBuyOwnPainting() public {
        vm.startPrank(creator1);
        registry.createArtwork("QmMetaCID_SelfBuy", ArtworkRegistry.ItemType.PAINTING, 1 ether);

        vm.deal(creator1, 10 ether);

        vm.expectRevert("Already owner");
        registry.buyPainting{value: 1 ether}(0);

        vm.stopPrank();
    }
}
// pragma solidity ^0.8.20;

// import "forge-std/Test.sol";
// import "../src/ArtworkRegistry.sol";

// contract ArtworkRegistryTest is Test {
//     ArtworkRegistry public registry;

//     address public owner = address(0x1);
//     address public creator1 = address(0x2);
//     address public creator2 = address(0x3);
//     address public buyer1 = address(0x4);
//     address public buyer2 = address(0x5);

//     function setUp() public {
//         vm.startPrank(owner);
//         registry = new ArtworkRegistry();
//         vm.stopPrank();
//     }

//     // Test 1: Contract Deployment
//     function testDeployment() public {
//         assertEq(registry.Owner(), owner, "Owner should be set correctly");
//         assertEq(registry.nextArtworkId(), 0, "Initial artwork ID should be 0");
//     }

//     // Test 2: Create Painting
//     function testCreatePainting() public {
//         vm.startPrank(creator1);

//         registry.createArtwork(
//             "Mona Lisa",
//             "supabase_123",
//             ArtworkRegistry.ItemType.PAINTING,
//             1 ether
//         );

//         vm.stopPrank();

//         // Check artwork details
//         (
//             string memory title,
//             ArtworkRegistry.ItemType itemType,
//             string memory offChainId,
//             address artworkOwner,
//             address artworkCreator,
//             uint256 createdAt,
//             uint256 price
//         ) = registry.getArtworkDetails(0);

//         assertEq(title, "Mona Lisa", "Title should match");
//         assertEq(uint(itemType), uint(ArtworkRegistry.ItemType.PAINTING), "Should be painting");
//         assertEq(offChainId, "supabase_123", "Off-chain ID should match");
//         assertEq(artworkOwner, creator1, "Creator should be initial owner");
//         assertEq(artworkCreator, creator1, "Creator should be set");
//         assertEq(price, 1 ether, "Price should match");
//         assertTrue(createdAt > 0, "Created at should be set");

//         // Check mappings
//         uint256[] memory creatorArtworks = registry.getArtworksByCreator(creator1);
//         assertEq(creatorArtworks.length, 1, "Creator should have 1 artwork");
//         assertEq(creatorArtworks[0], 0, "Artwork ID should be 0");

//         uint256[] memory ownerArtworks = registry.getArtworksByOwner(creator1);
//         assertEq(ownerArtworks.length, 1, "Owner should have 1 artwork");

//         assertEq(registry.nextArtworkId(), 1, "Next artwork ID should be 1");
//     }

//     // Test 3: Create Research Paper
//     function testCreateResearchPaper() public {
//         vm.startPrank(creator2);

//         registry.createArtwork(
//             "Quantum Physics Paper",
//             "supabase_456",
//             ArtworkRegistry.ItemType.RESEARCH_PAPER,
//             0.1 ether
//         );

//         vm.stopPrank();

//         (, ArtworkRegistry.ItemType itemType, , , , , ) = registry.getArtworkDetails(0);
//         assertEq(uint(itemType), uint(ArtworkRegistry.ItemType.RESEARCH_PAPER), "Should be research paper");
//     }

//     // Test 4: Buy Painting
//     function testBuyPainting() public {
//         // Create painting
//         vm.startPrank(creator1);
//         registry.createArtwork("Painting 1", "supa_1", ArtworkRegistry.ItemType.PAINTING, 2 ether);
//         vm.stopPrank();

//         // Buyer buys painting
//         vm.deal(buyer1, 10 ether);
//         vm.startPrank(buyer1);
//         registry.buyPainting{value: 2 ether}(0);
//         vm.stopPrank();

//         // Check new owner
//         (, , , address newOwner, , , ) = registry.getArtworkDetails(0);
//         assertEq(newOwner, buyer1, "Ownership should transfer to buyer");

//         // Check old owner no longer has artwork
//         uint256[] memory oldOwnerArtworks = registry.getArtworksByOwner(creator1);
//         assertEq(oldOwnerArtworks.length, 0, "Old owner should have no artworks");

//         // Check new owner has artwork
//         uint256[] memory newOwnerArtworks = registry.getArtworksByOwner(buyer1);
//         assertEq(newOwnerArtworks.length, 1, "New owner should have 1 artwork");
//         assertEq(newOwnerArtworks[0], 0, "Artwork ID should be 0");

//         // Check creator still has it in creator list
//         uint256[] memory creatorArtworks = registry.getArtworksByCreator(creator1);
//         assertEq(creatorArtworks.length, 1, "Creator should still have artwork in creator list");
//     }

//     // Test 5: Lease Research Paper
//     function testLeasePaper() public {
//         // Create research paper
//         vm.startPrank(creator1);
//         registry.createArtwork("Paper 1", "supa_2", ArtworkRegistry.ItemType.RESEARCH_PAPER, 0.5 ether);
//         vm.stopPrank();

//         // Buyer leases paper
//         vm.deal(buyer1, 10 ether);
//         vm.startPrank(buyer1);
//         registry.leasePaper{value: 0.5 ether}(0);
//         vm.stopPrank();

//         // Check access
//         bool hasAccess = registry.hasPaperAccess(0, buyer1);
//         assertTrue(hasAccess, "Buyer should have access to paper");

//         // Check creator balance increased
//         assertEq(creator1.balance, 0.5 ether, "Creator should receive payment");
//     }

//     // Test 6: Cannot Buy Own Painting
//     function testCannotBuyOwnPainting() public {
//         vm.startPrank(creator1);
//         registry.createArtwork("My Painting", "supa_3", ArtworkRegistry.ItemType.PAINTING, 1 ether);

//         vm.deal(creator1, 10 ether);

//         // Try to buy own painting
//         vm.expectRevert("Already owner");
//         registry.buyPainting{value: 1 ether}(0);

//         vm.stopPrank();
//     }

// }
