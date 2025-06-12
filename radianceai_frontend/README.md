# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### Suppress Webpack Overlay Warnings

To show errors only (not warnings) in the Webpack dev overlay, this project uses a `craco.config.js` (or `config-overrides.js`) for overrides if needed. If you see overlay warnings blocking the UI, review your Webpack/CRA/CRACO configuration:

- For Create React App v5/react-scripts, warnings never block the UI but show in the console.
- To suppress overlay warnings in the dev server, ensure your `devServer.overlay` (if available) is set to `{ errors: true, warnings: false }` in your config overrides.
- If your UI is still blocked by warnings, check for custom overlays, strict mode, or upstream package issues (see escalation notes below).

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Escalation: Upstream Issues (react-router[-dom] / react-scripts)

If warnings (such as "react-router-dom unresolved exports" or overlay crashes) persist after config updates:

1. Check indirect dependencies: 
   - Run `npm ls react-router` and `npm ls react-router-dom` to verify that only one version of each exists in the tree.
   - Ensure no unused legacy Next.js or custom plugin is bringing in an old react-router version.

2. Examine `node_modules/react-router-dom/dist/index.js` for re-export errors.

3. If overlays still block the UI, a deep incompatibility may exist between react-scripts and react-router[-dom]. 
   - File an issue with reproducible steps at https://github.com/remix-run/react-router/issues or the relevant CRA/react-scripts repo.
   - Include your `package.json`, the error message, Node/npm versions, and your react-router-dom version.

4. As a last resort, consider patch-package or forking react-scripts until upstream is fixed.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
