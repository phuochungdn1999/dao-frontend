import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Layout as LayoutContainer } from "antd";
import cx from "classnames";
import logoMedium from "./medium.svg";
import logoTelegram from "./telegram.svg";
import logoTwitter from "./twitter.svg";
import logoGithub from "./github.svg";

import { Header } from "../../";

import style from "./Layout.module.scss";

const { Content } = LayoutContainer;

const Layout = ({ location, children, theme }) => {


  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <LayoutContainer
      className={cx(darkMode ? style.darkContainer : style.container)}
    >
      {location.pathname !== "" && (
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      <Content
        className={cx(style.container__content, {
          [style.container__content_inner]: location.pathname !== "",
        })}
      >
        {children}
      </Content>

      <footer>
        <a className="button" href="https://yearnagnostic.medium.com/">
          {" "}
          <img className="img" src={logoMedium} alt="footer-logos" />
        </a>

        <a className="button" href="https://t.me/yearnagnostic">
          {" "}
          <img className="img" src={logoTelegram} alt="footer-logos" />
        </a>

        <a className="button" href="https://twitter.com/yearnagnostic">
          {" "}
          <img className="img" src={logoTwitter} alt="footer-logos" />
        </a>

        <a className="button" href="https://github.com/Yearn-Agnostic">
          {" "}
          <img className="img" src={logoGithub} alt="footer-logos" />{" "}
        </a>
      </footer>
      <h2 className="template"> yAgnostic </h2>
    </LayoutContainer>
  );
};

Layout.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default withRouter(Layout);
