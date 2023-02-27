//SPDX-License-Identifier:MIT

pragma solidity >= 0.5.0 < 0.9.0;

contract DDOS{
    //address payable[] public AIPool;
    address[] public AIPool;
    address payable helper_node;
    address supernode;
    address[] rewardedNodes;
    address[] victimNodes;
    address public victim_node;
    //address public ;
    uint public bsize;
    uint public minimumCollateral;
    //uint public amount;
    uint public noOfNodes;
    mapping(address=>uint) public networkNodes;
    
    event bandwidth_help(address from_account,address for_account,string message,uint bsize);
    function helped(address helper,address victim,uint _bsize) public{
        bsize=_bsize;
        emit bandwidth_help(helper,victim,"helped for bandwidth",bsize);
        helper_node=payable(helper);
        victim_node=victim;
        //AIPool.push(payable(msg.sender));
        victimNodes.push(victim_node);
    }

    constructor(){
        supernode=msg.sender;
        minimumCollateral=2 ether;
    }

    receive() external payable{
        require(msg.value>=minimumCollateral,"Please pay minimum 2 ether");
        if(networkNodes[msg.sender]==0){
            noOfNodes++;
            AIPool.push(msg.sender);
        }
        networkNodes[msg.sender]+=msg.value;
        
    }

    function getBalance() view public returns(uint){
        require(msg.sender==supernode,"You are not supernode");
        return address(this).balance;
    }
    function victimAddress() public view returns(address){
        return victim_node;
    }

    function helperAddress() public view returns(address payable){
        return helper_node;
    }

    function retrieve_bsize() public view returns(uint ){
        return bsize;
    }
    function reward() public{
        require(msg.sender==supernode,"You are not supernode");
        require(AIPool.length>=1,"Nodes less than 1");
        
        require(networkNodes[victim_node]>0,"Victim node don't have funds for protection.");
        uint amount=retrieve_bsize() *1 ether ;
        helper_node=helperAddress();
        helper_node.transfer(amount);
        networkNodes[victim_node]-=amount;
        if(networkNodes[victim_node]==0){
            noOfNodes--;
        }
        rewardedNodes.push(helper_node);
        helper_node=payable(address(0));
        bsize=0;
    }
    function nodeAssets(address nodeAddress) public view returns(uint){
        return networkNodes[nodeAddress];
    }


    function getRewardedNodes() view public returns(address[] memory){
        return rewardedNodes;

    }
    function getVictimNodes() public view returns(address[] memory){
        return victimNodes;
    }
    function numberOfNodes() public view returns(uint){
        return noOfNodes;
    }

    function allnodes() public view returns(address[] memory){
        return AIPool;
    }

}

//ganache 0x5ae964d40e53cfbFC352278091D0Cd2Ae44DF9b1
//0x61268d96dcC4Dc4c0a606826e50778c59350d4dc