import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { message } from "antd";
import "./i18n";
import "./App.css";

// Darkmode

import * as ReactDOM from "react-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";

import "antd/dist/antd.css";

import { Layout } from "./modules/layout";

import { pages } from "./modules";

import { getWeb3Instacne, getChains } from "./modules/connections/";
import { injected } from "./connectors";
import store from "./store";

const { error: errorMessage } = message;

const setChainId = (chainId) => {
  if (chainId) {
    store.dispatch({ type: "UPDATE_CHAIN", payload: Number(chainId) });
  } else {
    setTimeout(() => setChainId(window.ethereum.chainId), 200);
  }
};

const updateAccount = () => {
  setChainId(window.ethereum.chainId);

  store.dispatch(getChains());

  window.ethereum.on("accountsChanged", (accounts) => {
    store.dispatch({ type: "UPDATE_ADDRESS", payload: accounts[0] });

    const { web3context } = store.getState();

    if (web3context?.provider) {
      store.dispatch({ type: "UPDATE_CONNECTION", payload: true });
      store.dispatch(getWeb3Instacne(web3context.provider));
    } else {
      store.dispatch({ type: "UPDATE_PROVIDER", payload: window.ethereum });
      store.dispatch({ type: "UPDATE_CONNECTION", payload: true });
      store.dispatch(getWeb3Instacne(window.ethereum));
      store.dispatch()
    }
  });

  window.ethereum.on("chainChanged", (chain) => {
    store.dispatch({ type: "UPDATE_CHAIN", payload: Number(chain) });
  });
};

function App() {
  const [darkMode, setDarkMode] = React.useState(true);

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        injected
          .activate()
          .then((value) => {
            store.dispatch({ type: "UPDATE_ADDRESS", payload: value.account });
            store.dispatch({
              type: "UPDATE_PROVIDER",
              payload: value.provider,
            });
            store.dispatch({ type: "UPDATE_CONNECTION", payload: true });

            store.dispatch(getWeb3Instacne(value.provider));
          })
          .catch((error) => {
            errorMessage(error?.message, [5]);
            console.error(error?.message);
          });
      }
    });

    if (window.ethereum) {
      updateAccount();
    } else {
      window.addEventListener("ethereum#initialized", updateAccount, {
        once: true,
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Switch>
            {pages.map(({ path, title, component }) => (
              <Route exact key={title} path={path} component={component} />
            ))}
          </Switch>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
