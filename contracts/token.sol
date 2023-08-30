// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.15 ;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract bridgeToken is ERC20,Ownable {
    
    address private reserve;

    constructor(address _address) ERC20("Token","TKN") {
        if(_address == address(0)) revert();
        reserve = _address;
    }
    function mintToReserve(uint amount) external onlyOwner
    {
        if(amount ==0 )revert();
        _mint(reserve, amount *10**18);
    }
    function mintToAddress(address _address, uint amount) public {
        if(_address==address(0) || amount ==0) revert();
        _mint(_address,amount*10**18);
    }
}


