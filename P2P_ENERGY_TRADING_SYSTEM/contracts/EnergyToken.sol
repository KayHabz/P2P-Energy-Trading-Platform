// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EnergyToken is ERC721 {
    address public owner;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    uint256 public totalSellRequests;
    uint256 public totalTrades;

    struct SellRequestDemand {
        uint256 id;
        address creator;
        uint256 price;
        uint256 amount;
        uint256 status; // 1 = Available, 0 = Completed
    }

    mapping(address => uint256) private pin;
    mapping(uint256 => SellRequestDemand) public sellRequests;

    modifier authorised() {
        require(pin[msg.sender] != 0, "Not authorised");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function setPin(address _user, uint256 pinId) public onlyOwner {
        pin[_user] = pinId;
    }

    function listSellRequest(
        uint256 _amount,
        uint256 _price
    ) public authorised {
        require(_amount > 0, "Amount must be > 0");
        require(_price > 0, "Price must be > 0");
        totalSellRequests++;

        uint256 priceInETH = _price * 1 ether;

        sellRequests[totalSellRequests] = SellRequestDemand(
            totalSellRequests,
            msg.sender,
            priceInETH,
            _amount,
            1
        );
    }

    function buyEnergy(uint256 _id) public payable authorised {
        require(_id != 0 && _id <= totalSellRequests, "Invalid request ID");
        SellRequestDemand storage request = sellRequests[_id];
        require(request.status == 1, "Request not available");
        require(msg.sender != request.creator, "Cannot buy own listing");
        require(msg.value >= request.price, "Insufficient payment");

        request.status = 0;
        totalTrades++;

        payable(request.creator).transfer(request.price);
        _safeMint(msg.sender, totalTrades);
    }

    function getSellRequest(uint256 _id) public view returns (SellRequestDemand memory) {
        return sellRequests[_id];
    }

    function getPin(address _adr) public view returns (uint256) {
        return pin[_adr];
    }
}
