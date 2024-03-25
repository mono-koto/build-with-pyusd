# Add Tailwind CSS

We'll use [Tailwind CSS](https://tailwindcss.com/) to style our app. Following the [Tailwind Vite Guide](https://tailwindcss.com/docs/guides/vite), we can add it to our project with the following command:

```shell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update your `tailwind.config.js` file so it knows where to look for tailwind classes:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

And finally replace your `src/index.css` with the following:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Now let's trash the existing Vite defaults and replace them with a simple Tailwind layout. Replace `src/App.tsx` with the following:

```tsx
import HelloPyusd from "./components/HelloPyusd";

export default function App() {
  return (
    <>
      <HelloPyusd />
    </>
  );
}
```

And add a new file, `src/components/HelloPyusd.tsx`:

```tsx
export default function HelloPyusd() {
  return (
    <div className='flex flex-col gap-4 items-center justify-center min-h-screen'>
      <h1 className='text-xl'>Hello PYUSD!</h1>
    </div>
  );
}
```

Optionally, you can remove `src/App.css` and `src/assets` since we don't need those files anymore.

If you want to skip ahead and just put in all the styles we'll be using:

https://github.com/mono-koto/HelloPYUSD-frontend/blob/e031d7db74eca4a8691fef08858e0ebedfbad036/src/index.css

Let's commit our changes:

```shell
git add .
git commit -m "Add tailwind, remove default styles, add HelloPyusd component"
```
