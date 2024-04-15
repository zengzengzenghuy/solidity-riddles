
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import {Governance} from "../Viceroy.sol";

contract GovernanceAttacker {


    function attack(address governance,address viceroy) public {
        Governance(governance).appointViceroy(viceroy,1);
    }
}