// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArtworkRegistry {
    enum ItemType {
        PAINTING,
        RESEARCH_PAPER
    }

    struct Artwork {
        string metadataCID; // IPFS CID of metadata JSON
        ItemType itemType;
        address owner;
        address creator;
        uint256 createdAt;
        uint256 price;
    }

    address public Owner;
    uint256 public nextArtworkId;

    mapping(uint256 => Artwork) public artworks;
    mapping(address => uint256[]) public artworksByCreator;
    mapping(address => uint256[]) public artworksByOwner;

    // paperId => (viewer => expiry)
    mapping(uint256 => mapping(address => uint256)) public paperAccess;

    // EVENTS
    event ArtworkCreated(
        uint256 indexed artworkId, address indexed creator, ItemType itemType, uint256 price, string metadataCID
    );

    event OwnershipTransferred(uint256 indexed artworkId, address from, address to);

    event PaperLeased(uint256 indexed artworkId, address indexed viewer, uint256 expiry);

    constructor() {
        Owner = msg.sender;
    }

    // =========================
    // CREATE ARTWORK
    // =========================
    function createArtwork(string calldata metadataCID, ItemType itemType, uint256 price) external {
        require(bytes(metadataCID).length > 0, "Metadata CID required");
        require(price > 0, "Price must be > 0");
        require(msg.sender != address(0), "Invalid sender");

        artworks[nextArtworkId] = Artwork({
            metadataCID: metadataCID,
            itemType: itemType,
            creator: msg.sender,
            owner: msg.sender,
            createdAt: block.timestamp,
            price: price
        });

        artworksByCreator[msg.sender].push(nextArtworkId);
        artworksByOwner[msg.sender].push(nextArtworkId);

        emit ArtworkCreated(nextArtworkId, msg.sender, itemType, price, metadataCID);

        nextArtworkId++;
    }

    // =========================
    // BUY PAINTING
    // =========================
    function buyPainting(uint256 artworkId) external payable {
        Artwork storage art = artworks[artworkId];

        require(art.itemType == ItemType.PAINTING, "Not a painting");
        require(msg.value == art.price, "Incorrect price");
        require(msg.sender != art.owner, "Already owner");

        address previousOwner = art.owner;
        art.owner = msg.sender;

        (bool success,) = payable(previousOwner).call{value: msg.value}("");
        require(success, "ETH transfer failed");

        _removeArtworkFromOwner(previousOwner, artworkId);
        artworksByOwner[msg.sender].push(artworkId);

        emit OwnershipTransferred(artworkId, previousOwner, msg.sender);
    }

    // =========================
    // LEASE RESEARCH PAPER
    // =========================
    function leasePaper(uint256 artworkId) external payable {
        Artwork storage art = artworks[artworkId];

        require(art.itemType == ItemType.RESEARCH_PAPER, "Not a paper");
        require(msg.value == art.price, "Incorrect lease price");
        require(paperAccess[artworkId][msg.sender] < block.timestamp, "Already have access");

        uint256 expiry = block.timestamp + 30 days;
        paperAccess[artworkId][msg.sender] = expiry;

        (bool success,) = payable(art.creator).call{value: msg.value}("");
        require(success, "Payment failed");

        emit PaperLeased(artworkId, msg.sender, expiry);
    }

    // =========================
    // INTERNAL HELPERS
    // =========================
    function _removeArtworkFromOwner(address owner, uint256 artworkId) internal {
        uint256[] storage list = artworksByOwner[owner];
        uint256 length = list.length;

        for (uint256 i = 0; i < length; i++) {
            if (list[i] == artworkId) {
                if (i != length - 1) {
                    list[i] = list[length - 1];
                }
                list.pop();
                break;
            }
        }
    }

    // =========================
    // ADMIN
    // =========================
    function withdraw() external {
        require(msg.sender == Owner, "Not owner");
        (bool success,) = payable(Owner).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    function updatePrice(uint256 artworkId, uint256 newPrice) external {
        Artwork storage art = artworks[artworkId];
        require(msg.sender == art.creator, "Only creator can update price");
        require(newPrice > 0, "Price must be > 0");
        art.price = newPrice;
    }

    // =========================
    // READ FUNCTIONS
    // =========================
    function hasPaperAccess(uint256 artworkId, address user) external view returns (bool) {
        return paperAccess[artworkId][user] > block.timestamp;
    }

    function getArtworksByCreator(address creator) external view returns (uint256[] memory) {
        return artworksByCreator[creator];
    }

    function getArtworksByOwner(address ownerAddress) external view returns (uint256[] memory) {
        return artworksByOwner[ownerAddress];
    }

    function getArtworkDetails(uint256 artworkId)
        external
        view
        returns (
            string memory metadataCID,
            ItemType itemType,
            address owner,
            address creator,
            uint256 createdAt,
            uint256 price
        )
    {
        Artwork storage art = artworks[artworkId];
        return (art.metadataCID, art.itemType, art.owner, art.creator, art.createdAt, art.price);
    }
}

// pragma solidity ^0.8.20;

// contract ArtworkRegistry {
//     enum ItemType {
//         PAINTING,
//         RESEARCH_PAPER
//     }

//     // LOCAL VARIALBLES AND STRUCTURES

//     struct Artwork {
//         string title;
//         ItemType itemType;
//         string offChainId; // SUPABASE UINIQUE ID
//         address owner;
//         address creator;
//         uint256 createdAt;
//         uint256 price;
//     }

//     address public Owner;
//     uint256 public nextArtworkId;
//     mapping(uint256 => Artwork) public artworks;
//     mapping(address => uint256[]) public artworksByCreator;
//     mapping(address => uint256[]) public artworksByOwner;

//     // paperId => (viewer => expiry)
//     mapping(uint256 => mapping(address => uint256)) public paperAccess;

//     // EVENTS

//     event ArtworkCreated(uint256 artworkId, address indexed creator, ItemType itemType, uint256 price);

//     event OwnershipTransferred(uint256 indexed artworkId, address from, address to);

//     event PaperLeased(uint256 indexed artworkId, address indexed viewer, uint256 expiry);

//     constructor() {
//         Owner = msg.sender;
//     }

//     // FUNCTIONS

//     function createArtwork(string calldata title, string calldata offChainId, ItemType itemType, uint256 price) public {

//         require(bytes(title).length > 0, "Title required");
//         require(bytes(offChainId).length > 0, "Off-chain ID required");
//         require(price > 0, "Price must be > 0");
//         require(msg.sender != address(0), "Invalid sender");

//         artworks[nextArtworkId] = Artwork({
//             title: title,
//             offChainId: offChainId,
//             itemType: itemType,
//             creator: msg.sender,
//             owner: msg.sender,
//             createdAt: block.timestamp,
//             price: price
//         });

//         artworksByCreator[msg.sender].push(nextArtworkId);
//         artworksByOwner[msg.sender].push(nextArtworkId);

//         emit ArtworkCreated(nextArtworkId, msg.sender, itemType, price);

//         nextArtworkId++;
//     }

//     /*
//     LOGIC FOR PAINTING OWNERSHIP TRANSFER
//      */

//     function buyPainting(uint256 artworkId) external payable {
//         Artwork storage art = artworks[artworkId];

//         require(art.itemType == ItemType.PAINTING, "Not a painting");
//         require(msg.value == art.price, "Incorrect price");
//         require(msg.sender != art.owner, "Already owner");

//         address previousOwner = art.owner;
//         art.owner = msg.sender;

//         (bool success,) = payable(previousOwner).call{value: msg.value}("");
//         require(success, "ETH transfer failed");

//         // Update owner mappings
//         _removeArtworkFromOwner(previousOwner, artworkId);
//         artworksByOwner[msg.sender].push(artworkId);

//         emit OwnershipTransferred(artworkId, previousOwner, msg.sender);
//     }

//     /**
//      *  LOGIC FOR PAPER BEING LEASED
//      */

//     function leasePaper(uint256 artworkId) external payable {
//         Artwork storage art = artworks[artworkId];

//         require(art.itemType == ItemType.RESEARCH_PAPER, "Not a paper");
//         require(msg.value == art.price, "Incorrect lease price");
//         require(paperAccess[artworkId][msg.sender] < block.timestamp, "Already have access");

//         uint256 expiry = block.timestamp + 30 days;
//         paperAccess[artworkId][msg.sender] = expiry;

//         (bool success,) = payable(art.creator).call{value: msg.value}("");
//         require(success, "Payment failed");

//         emit PaperLeased(artworkId, msg.sender, expiry);
//     }

//     function _removeArtworkFromOwner(address owner, uint256 artworkId) internal {
//         uint256[] storage list = artworksByOwner[owner];
//         uint256 length = list.length;

//         for (uint256 i = 0; i < length; i++) {
//             if (list[i] == artworkId) {
//                 if (i != length - 1) {
//                     list[i] = list[length - 1];
//                 }
//                 list.pop();
//                 break;
//             }
//         }
//     }

//     function withdraw() external {
//         require(msg.sender == Owner, "Not owner");
//         (bool success,) = payable(Owner).call{value: address(this).balance}("");
//         require(success, "Withdraw failed");
//     }

//     function updatePrice(uint256 artworkId, uint256 newPrice) external {
//         Artwork storage art = artworks[artworkId];
//         require(msg.sender == art.creator, "Only creator can update price");
//         require(newPrice > 0, "Price must be > 0");
//         art.price = newPrice;
//     }

//     // HELPER FUNCTIONS FOR READING

//     function hasPaperAccess(uint256 artworkId, address user) external view returns (bool) {
//         return paperAccess[artworkId][user] > block.timestamp;
//     }

//     function getArtworksByCreator(address creator) external view returns (uint256[] memory) {
//         return artworksByCreator[creator];
//     }

//     function getArtworkDetails(uint256 artworkId)
//         external
//         view
//         returns (
//             string memory title,
//             ItemType itemType,
//             string memory offChainId,
//             address owner,
//             address creator,
//             uint256 createdAt,
//             uint256 price
//         )
//     {
//         Artwork storage art = artworks[artworkId];
//         return (art.title, art.itemType, art.offChainId, art.owner, art.creator, art.createdAt, art.price);
//     }

//     function getArtworksByOwner(address ownerAddress) external view returns (uint256[] memory) {
//         return artworksByOwner[ownerAddress];
//     }
// }
