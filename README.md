# PYUSD Builder Guides

These docs are intended to help you get started with the PYUSD, PayPay's stablecoin.

## Building / contributing

### Docs

This project uses vitepress for documentation. To run a preview of docs, you need to have a recent version of node.js installed, then run:

```bash
npm install
npm run docs:dev --workspace=docs
```

### Frontend project

To run the frontend project, run:

```bash
npm run dev --workspace=frontend
```

### Smart contract project

To test and deploy the smart contract, you need to install Foundry. See the [README in the `contracts` directory](./contracts/README.md) for more information.

```bash
cd contracts
forge test
```
