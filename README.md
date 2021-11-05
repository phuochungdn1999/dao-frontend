# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Preparation to Run the Project

### Configure the Project

#### Setup .env File

There's .env.example file in the root of the project. Use it to create working .env and specify the following three parameters:
1. REACT_APP_INFURA_API_KEY_4 - id of the app from Infura. It's needed to update Infura with paid package taking into account theoretical traffic, as almost each transaction on a cross-chain page will call this id.
2. REACT_APP_PROPOSAL_SECRET_PHRASE - key phrase that's used for proposals text encryption.
3. REACT_APP_PROPOSAL_NETWORK - param that notes for which exact network the app is deployed. This param is used in app configs: src/configs/crosschain.js, src/configs/vaults.js и src/configs/pools.js.

#### Make Configs for Network Chains

What's the purpose of the configs? There are three main configs mentioned above, in which on the basis of REACT_APP_PROPOSAL_NETWORK param are set needed configs, created for certain chain. Note! Project has vault contracts deployed to Binance Smart Chain (test), 97th chain (for example). Consequently, it's needed to create a config with basic fields and name it vaults-97.js, that means these vaults are for the 97th chain. Then this config connects to src/configs/vaults.js in accordance with REACT_APP_PROPOSAL_NETWORK rules and the dApp knows that there are vaults on the 97th chain and can work with them without any additional code adjustments. There are fully working testing configs for chains #4 and #97 in the src/configs directory. They can be used as a basis for deployment of the contracts to new chains.

### `yarn`

Installs dependent project packages.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

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

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
