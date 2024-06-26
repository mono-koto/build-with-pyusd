import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Build with PYUSD",

  description:
    "Guides and walkthroughs to help builders use PYUSD in their smart contracts and web3 apps",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/hipyusd-sm.svg",
    nav: [
      { text: "Home", link: "/" },
      { text: "Overview", link: "/overview/" },
      { text: "Smart contracts", link: "/smart-contract/" },
      { text: "Frontend", link: "/react-frontend/" },
      {
        text: "Links",
        items: [
          {
            text: "PayPal PYUSD Docs",
            link: "https://www.paypal.com/us/cshelp/article/paypal-usd-pyusd-developer-documentation-ts2280",
          },
          {
            text: "Paxos PYUSD Docs",
            link: "https://docs.paxos.com/stablecoin/pyusd",
          },
          { text: "Mono Koto", link: "https://mono-koto.com/" },
          { text: "Garden Labs", link: "https://gardenlabs.xyz" },
        ],
      },
    ],

    sidebar: [
      {
        text: "Overview",
        collapsed: true,
        items: [
          { text: "Introduction", link: "/overview/" },
          { text: "PYUSD", link: "/overview/pyusd" },
          { text: "Audits", link: "/overview/audits" },
          { text: "Contracts", link: "/overview/contracts" },
        ],
      },
      {
        text: "Guides",
        collapsed: true,
        items: [
          {
            text: "Smart contracts",
            collapsed: true,
            items: [
              { text: "Introduction", link: "/smart-contract/" },
              { text: "Getting set up", link: "/smart-contract/01-setup" },
              {
                text: "First solidity",
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
                text: "Onchain rendering",
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
            text: "Frontend",
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
              {
                text: "Owner Withdraw",
                link: "/react-frontend/10-owner-withdraw",
              },
              { text: "Wrapping Up", link: "/react-frontend/11-wrapping-up" },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/mono-koto/build-with-pyusd" },
    ],
    search: {
      provider: "local",
    },
  },
  sitemap: {
    hostname: "https://build.pyusd.to",
  },
  lastUpdated: true,
  head: [["link", { rel: "icon", href: "/hipyusd-sm.svg" }]],
});
