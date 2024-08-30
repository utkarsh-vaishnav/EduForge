// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint8 private _decimals;
    struct ContractSettings {
        bool canBurn;
        bool canMint;
        bool setTotalSupplyCap;
        bool maxTokensPerAddressLimited;
        bool chargeTransactionFee;
        uint256 burnFee;
        uint256 totalSupplyCap;
        uint256 maxTokensPerAddress;
        uint256 transactionFee;
    }

    ContractSettings public settings;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals_,
        ContractSettings memory _settings
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        _decimals = decimals_;
        settings = _settings;
    }

    function transfer(address recipient, uint256 amount)
        public
        override
        returns (bool)
    {
        uint256 transferedAmount = amount - (settings.burnFee + settings.transactionFee);
        if (settings.canBurn || settings.chargeTransactionFee) {
            require(
                settings.burnFee + settings.transactionFee <= amount,
                "Amount is less than burn Fee and transaction fee"
            );
            if (settings.canBurn) {
                burn(settings.burnFee);
            }
            if (settings.chargeTransactionFee) {
                super.transfer(owner(), settings.transactionFee);
            }
        }
        if (settings.maxTokensPerAddressLimited) {
            require(
                balanceOf(recipient) + transferedAmount <= settings.maxTokensPerAddress,
                "Transfer amount exceeds the maximum allowed tokens per address"
            );
        }
        return super.transfer(recipient, transferedAmount);
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        uint256 transferedAmount = amount - (settings.burnFee + settings.transactionFee);
        if (settings.canBurn || settings.chargeTransactionFee) {
            require(
                settings.burnFee + settings.transactionFee <= amount,
                "Amount is less than burn Fee and transaction fee"
            );
            if (settings.canBurn) {
                burn(settings.burnFee);
            }
            if (settings.chargeTransactionFee) {
                super.transferFrom(sender, owner(), settings.transactionFee);
            }
        }
        if (settings.maxTokensPerAddressLimited) {
            require(
                balanceOf(recipient) + transferedAmount <= settings.maxTokensPerAddress,
                "Transfer amount exceeds the maximum allowed tokens per address"
            );
        }
        return super.transferFrom(sender, recipient, transferedAmount);
    }

    function burn(uint256 amount) public onlyOwner {
        require(settings.canBurn, "Burning not allowed");
        _burn(msg.sender, amount);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(settings.canMint, "Minting not allowed");
        if (settings.setTotalSupplyCap) {
            require(
                totalSupply() + amount <= settings.totalSupplyCap,
                "Minting not allowed"
            );
        }
        _mint(to, amount);
    }

    function setMaxTokensPerAddress(uint256 _maxTokensPerAddress)
        public
        onlyOwner
    {
        settings.maxTokensPerAddress = _maxTokensPerAddress;
    }

    function setMaxTokensPerAddressLimited(bool _limited) public onlyOwner {
        settings.maxTokensPerAddressLimited = _limited;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
