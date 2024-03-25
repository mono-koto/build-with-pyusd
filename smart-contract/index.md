# Using PYUSD in smart contracts

This guide is a quick introduction to "onchain" development with PYUSD, meaning integration in smart contracts.

## Technology we'll cover

We will use the Foundry development toolkit to write, test, and deploy an onchain-rendered NFT smart contract written in Solidity that accepts PYUSD.

### Foundry

Foundry is a toolkit for smart contract development. It provides a robust and flexible framework for building, testing, and deploying smart contracts.

### Solidity

Solidity is a programming language designed for developing special programs called "smart contracts" that run on the Ethereum Virtual Machine (EVM). If you're coming from a typical imperative programming background with languages like Java or C++, Solidity's syntax will feel familiar.

### PYUSD

PYUSD is PayPal's stablecoin deployed on Ethereum as a smart contract that implements the ERC-20 standard. It is a digital representation the US dollar, and can be used in smart contracts to pay for services or goods. PayPal users are able to mint and burn PYUSD tokens directly within the PayPal app.

## Assumptions

In this guide we are going to use Solidity and Foundry to write a simple smart contract that accepts PYUSD as fee to mint an NFT.

We're going to assume a few starting points:

- We have `git` set up locally
- We're running on a Linux flavor or a Mac
- We are comfortable with some command line stuff
- We like tests and test coverage!

We won't assume:

- Any knowledge of Ethereum, Solidity, or Solidity tooling
