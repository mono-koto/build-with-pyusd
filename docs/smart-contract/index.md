# Use PYUSD in smart contracts

This guide is an introduction to "onchain" development with PYUSD, meaning integration into smart contracts.

## The project

We will build a simple smart contract that accepts PYUSD as a fee to mint an ERC-721 NFT.

[Full project is available on GitHub](https://github.com/mono-koto/build-with-pyusd/)

## Technology we'll cover

### Foundry

Foundry is a toolkit for smart contract development. It provides a robust and flexible framework for building, testing, and deploying smart contracts. We will use the Foundry development toolkit to write, test, and deploy.

### Solidity

Solidity is a programming language designed for developing special programs called "smart contracts" that run on the Ethereum Virtual Machine (EVM). If coming from a typical imperative programming background with languages like Java or C++, Solidity's syntax will feel familiar.

### PYUSD

PYUSD is PayPal's stablecoin deployed on Ethereum as a smart contract that implements the ERC-20 standard. PYUSD represents a digital IOU for a US dollar, can be transferred among wallets, and can be used in smart contracts. PayPal users are able to mint and burn PYUSD tokens directly within the PayPal app.

## Assumptions

We're going to assume a few starting points:

- We have `git` set up locally
- We're running on a Linux flavor or a Mac
- We are comfortable with some command line stuff
- We like tests and test coverage!

We won't assume:

- Any knowledge of Ethereum, Solidity, or Solidity tooling
