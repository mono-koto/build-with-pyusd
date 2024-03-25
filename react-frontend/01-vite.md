# Get started with Vite

We'll use the [Vite](https://vitejs.dev/) build tool to scaffold and build our application. For React + Typescript, we can use the `react-ts` template.

```shell
npx create-vite@latest hello-pyusd-app --template react-ts
cd hello-pyusd-app
npm install
npm run dev
```

Once the dependencies install and the `dev` script runs, you'll see a message like this:

```shell
  VITE v5.1.6  ready in 290 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Go ahead and open that URL in your browser (port may differ if you're using `5173` for something else). You should see a simple React app with a counter:

![alt text](./assets/first-vite-app.png)

This is our starting point! Remember to set up git and commit your changes:

```shell
git init
git add .
git commit -m "Initial commit"
```
