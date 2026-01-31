// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArtworkRegistry {
    // enum Category {
    //     PAINTING,
    //     RESEARCH_PAPER
    // }
    // LOCAL VARIALBLES AND STRUCTURES

    struct Artwork {
        string title;
        string category;
        string offChainId; // SUPABASE UINIQUE ID
        address owner;
        uint256 createdAt;
        uint256 price;
    }

    mapping(address => Artwork[]) private artworksByCreator;

    // EVENTS

    event ArtworkCreated(address indexed owner, string title, string createdAt);

    // FUNCTIONS

    function createArtwork(string calldata title, string calldata category, string calldata offChainId, uint256 price)
        public
    {
        artworksByCreator[msg.sender]
        .push(
            Artwork({
                title: title,
                category: category,
                offChainId: offChainId,
                owner: msg.sender,
                createdAt: block.timestamp,
                price: price
            })
        );

        emit ArtworkCreated(msg.sender, title, offChainId);
    }
}
