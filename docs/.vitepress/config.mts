import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Build with PYUSD",

  description:
    "Guides and walkthroughs to help builders use PYUSD in their smart contracts and web3 apps",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Smart Contract", link: "/smart-contract/" },
      { text: "Frontend", link: "/react-frontend/" },
    ],

    sidebar: [
      {
        text: "PYUSD in smart contracts",
        collapsed: true,
        items: [
          { text: "Introduction", link: "/smart-contract/" },
          { text: "Getting set up", link: "/smart-contract/01-setup" },
          {
            text: "First Solidity",
            link: "/smart-contract/02-first-contract",
          },
          {
            text: "First test",
            link: "/smart-contract/03-first-test",
          },
          {
            text: "Write the NFT",
            link: "/smart-contract/04-write-erc721",
          },
          {
            text: "Accept PYUSD",
            link: "/smart-contract/05-accept-pyusd",
          },
          {
            text: "Rendering Onchain",
            link: "/smart-contract/06-onchain-rendering",
          },
          {
            text: "Deploy to Sepolia",
            link: "/smart-contract/07-deploy",
          },
          {
            text: "Mint our NFT on Sepolia",
            link: "/smart-contract/08-mint-nft",
          },
        ],
      },
      {
        text: "PYUSD on the frontend",
        collapsed: true,

        items: [
          { text: "Introduction", link: "/react-frontend/" },
          { text: "Tailwind", link: "/react-frontend/02-tailwind" },
          { text: "Web3 Stack", link: "/react-frontend/03-web3-stack" },
          { text: "Config", link: "/react-frontend/04-config" },
          { text: "Hooks", link: "/react-frontend/05-hooks" },
          { text: "Layout", link: "/react-frontend/06-layout" },
          { text: "Mint Preview", link: "/react-frontend/07-mint-preview" },
          { text: "Mint Info", link: "/react-frontend/08-mint-info" },
          { text: "Mint Button", link: "/react-frontend/09-mint-button" },
          { text: "Owner Withdraw", link: "/react-frontend/10-owner-withdraw" },
          { text: "Wrapping Up", link: "/react-frontend/11-wrapping-up" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/mono-koto" }],
  },
  sitemap: {
    hostname: "https://build.pyusd.to",
  },
  lastUpdated: true,
});
