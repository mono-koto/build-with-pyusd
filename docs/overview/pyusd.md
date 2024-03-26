# PYUSD

[PayPal's PYUSD](https://www.paypal.com/us/digital-wallet/manage-money/crypto/pyusd) is an ERC-20 token available on the Ethereum blockchain that is pegged to the value of the US dollar. PayPal users can buy, hold, and sell PYUSD via their PayPal accounts, and can transfer PYUSD to and from other Ethereum wallets.

## Design

PYUSD is an upgradeable ERC-20 token managed by [Paxos](https://www.paxos.com/). The token contract is written in an older version of Solidity (0.4.24), with a design that is very similar to [USDP](https://etherscan.io/token/0x8e870d67f660d95d5be530380d0ec0bd388289e1), which is also managed by Paxos.

## Roles

PYUSD's administration is centralized. It's worth noting the following:

### Upgrades

The contract is behind a proxy and is upgradeable, which means that the contract's logic can be updated without changing the contract's address.

### Owner

The contract has an `owner` address that can reclaim any PYUSD balance held by the actual PYUSD contract. The owner can also `pause` and `unpause` the contract, which disables all transfers and approvals.

### Asset protection

The contract has "freeze" functions – `freeze`, `unfreeze`, `wipeFrozenAddress`, and `isFrozen` – available to a designated `assetProtectionRole` address. These functions allow the `assetProtectionRole` to freeze and unfreeze any address, and to wipe the balance of any frozen address. Currently the owner and asset protection roles are the same address.

### Supply control

The contract has `increaseSupply` and `decreaseSupply` functions available to a designated `supplyController` address. These functions allow the `supplyController` to mint and burn PYUSD to itself.

### Beta delegation

A `betaDelegateWhitelister` role is able to add and remove beta delegates, who can then transfer PYUSD on behalf of other addresses. This role is currently unassigned.
