import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Building with PYUSD",
  description:
    "Guides and walkthroughs to help builders use PYUSD in their smart contracts and web3 apps",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: "Home", link: "/" },
      // { text: "React", link: "/react-app-guide/README" },
      // { text: "React", link: "/react-app-guide/README" },
    ],

    sidebar: [
      {
        text: "Use PYUSD Onchain",
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
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/mono-koto" }],
  },
});
