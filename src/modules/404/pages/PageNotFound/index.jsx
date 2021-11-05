import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Typography, Alert } from "antd";
import cx from "classnames";

import style from "./PageNotFound.module.scss";

const { Title } = Typography;

const mapState = (state) => {
  return {
    account: state.account,
  };
};

const PageNotFound = ({ history, account, t }) => {
  return (
    <Typography className={style.container}>
      <Title className={style.title}>
        <span>{t("404_TITLE")}</span>
      </Title>

      <Alert
        className={style.container__info}
        message={t("DASHBOARD_INFO")}
        type="info"
      />

      {!account.address && (
        <Alert
          className={style.container__warning}
          message={t("DASHBOARD_WARNING")}
          type="warning"
        />
      )}

      <Title className={cx(style.title, style.title_second)} level={2}>
        {t("404_DESCRIPTION")}
      </Title>

      <NavLink className={style.link} exact to="/">
        {t("404_RETURN_TO_HOME")}
      </NavLink>
    </Typography>
  );
};

PageNotFound.propTypes = {
  history: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(connect(mapState)(PageNotFound));
