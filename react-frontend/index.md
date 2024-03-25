# Build a React app that uses PYUSD to mint NFTs

Let's build a simple Typescript React-based frontend that lets a user connect their wallet and interact with a smart contract that accepts PYUSD.

## What are we building?

Here are the basic use cases we're going to cover in this walkthrough:

As a user, I want to:

1. Connect wallet to the app
2. Approve the contract to spend PYUSD
3. Mint one NFT
4. View the newly minted NFT

As the contract owner, I want to also:

1. View the total PYUSD balance
2. Withdraw PYUSD

## Before we start

You'll need a few things before we get going:

- An editor. We recommend [VS Code](https://code.visualstudio.com/).
- Node.js, which you can install in a few ways. We recommend [NVM](https://github.com/nvm-sh/nvm) to manage Node.js versions. We recommend using the latest LTS version of Node.js.
- The Node.js package manager of your choice. In this guide we'll use [npm](https://www.npmjs.com/), though [pnpm](https://pnpm.io/), [yarn](https://yarnpkg.com/), and [bun](https://bunpkg.com/) are all fine.
