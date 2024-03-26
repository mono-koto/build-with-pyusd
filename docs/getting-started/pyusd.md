# PYUSD

[PayPal's PYUSD](https://www.paypal.com/us/digital-wallet/manage-money/crypto/pyusd) is an ERC-20 token available on the Ethereum blockchain that is pegged to the value of the US dollar. PayPal users can buy, hold, and sell PYUSD via their PayPal accounts, and can transfer PYUSD to and from other Ethereum wallets.

## Addresses

| Network | Address                                                                                                               |
| ------- | --------------------------------------------------------------------------------------------------------------------- |
| Mainnet | [0x6c3ea9036406852006290770bedfcaba0e23a0e8](https://etherscan.io/address/0x6c3ea9036406852006290770bedfcaba0e23a0e8) |
| Sepolia | [0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9](https://etherscan.io/address/0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9) |

## Testnet Faucet

PYUSD is available on the Sepolia testnet. You can get PYUSD from the [Paxos Sepolia faucet](https://faucet.paxos.com/).

## Design

PYUSD is an upgradeable ERC-20 token managed by [Paxos](https://www.paxos.com/). The token contract is written in an older version of Solidity (0.4.24), with a design that is very similar to [USDP](https://etherscan.io/token/0x8e870d67f660d95d5be530380d0ec0bd388289e1), which is also managed by Paxos.

## Audits

In 2023, Trail of Bits conducted an audit of the PYUSD contract.

- [Trail of Bits Audit Report](https://github.com/paxosglobal/pyusd-contract/blob/master/audit-reports/Trail_of_Bits_Audit_Report.pdf)

In addition, past audits covered the USDP and PAX contracts on which the PYUSD contract is based:

- [Trail of Bits Audit Report](https://github.com/paxosglobal/usdp-contracts/blob/master/audit-reports/ChainSecurity_Audit_Report.pdf)
- [Nomic Labs Audit Report](https://github.com/paxosglobal/usdp-contracts/blob/master/audit-reports/Nomic_Labs_Audit_Report.pdf)
- [ChainSecurity Audit Report](https://github.com/paxosglobal/usdp-contracts/blob/master/audit-reports/ChainSecurity_Audit_Report.pdf)

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
