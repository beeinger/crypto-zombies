// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ZombieAttack.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title A contract that manages transfering zombie ownership
/// @author beeinger
/// @dev Compliant with OpenZeppelin's implementation of the ERC721 spec draft
contract ZombieOwnership is ZombieAttack, ERC721 {
    constructor() ERC721("Zombie", "ZMB") {}

    mapping(uint256 => address) zombieApprovals;

    function balanceOf(address _owner)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return ownerZombieCount[_owner];
    }

    function ownerOf(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        return zombieToOwner[_tokenId];
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal virtual override {
        ownerZombieCount[_to]++;
        ownerZombieCount[_from]++;
        zombieToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public virtual override {
        require(
            zombieToOwner[_tokenId] == msg.sender ||
                zombieApprovals[_tokenId] == msg.sender
        );
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId)
        public
        virtual
        override
        onlyOwnerOf(_tokenId)
    {
        zombieApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
}
