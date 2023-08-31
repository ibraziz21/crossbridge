// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract BridgeA is Ownable {
    /*
    This contract facilitates the transfer from Sender to the Token Reserve wallet
            Owner
                Determines fee rate
                Determines address that receives fees
               
            User 
                Inputs amount of tokens to send
                Smart Contract calculates total amount to be received after bridge

            
     */
    event BridgeInitiated(address indexed _initiator, address _recepient, uint _amountsent, uint _feePaid);
    event BridgeComplete(address sender, address receiver, uint amount);
    uint256 feeRate;

    address private feeCollector;
    address private reserveA;

    IERC20 private token;

    constructor(address _reserve, address _tokenAddress, uint _fee) {
        if(_reserve == address(0)||_tokenAddress == address(0) || _fee==0) revert();

   
        feeRate = feeRate; 
        reserveA = _reserve;

        token = IERC20(_tokenAddress);
    }

    function setFee(uint _fee)external onlyOwner{
        if(_fee == 0 || _fee == feeRate) revert();
        feeRate = _fee;
    }
    function setCollector(address _address)external onlyOwner{
        if(_address == address(0) || _address == feeCollector) revert();
        feeCollector = _address;
    }

//bridgeToSelf
    function bridgeTokens (uint _amount) external {
        if(token.allowance(_msgSender(),address(this))==0) revert();
        if(_amount == 0) revert();

        token.transferFrom(msg.sender, address(this), _amount);
        uint fee = _calculateFee(_amount);
        uint amountTransferred = _amount-fee;
        token.transferFrom(address(this), reserveA, amountTransferred);

        emit  BridgeInitiated(_msgSender(), _msgSender(), amountTransferred, fee);
    }
    //bridgeToRecepient
    function bridgeToRecepient (address _address, uint _amount) external {
        if(_address == address(0)|| _address == _msgSender()) revert();
        if(token.allowance(_msgSender(),address(this))==0) revert();
        if(_amount == 0) revert();

        token.transferFrom(msg.sender, address(this), _amount);
        uint fee = _calculateFee(_amount);
        uint amountTransferred = _amount-fee;
        token.transferFrom(address(this),reserveA, amountTransferred);
        emit  BridgeInitiated(_msgSender(), _address , amountTransferred, fee);
    }

    function CompleteBridge(address sender, address recepient, uint amount) public {
        if(token.balanceOf(reserveA)< amount) revert ();

        token.transferFrom(reserveA,recepient,amount);

        emit BridgeComplete(sender, recepient, amount);
    }


    function _calculateFee(uint amount) internal view returns(uint){
        if(amount == 0) revert();
        return amount * feeRate/100;
    }

}