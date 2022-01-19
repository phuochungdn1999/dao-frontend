import React from "react";
import cx from "classnames";
import style from "./DiamondButton.module.scss";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const DiamondButton = ({ label, disabled, handleClick, btnStyle }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={cx(style.diamond__button__container)}>
        <button
          className={cx(style.diamond__button)}
          type="button"
          onClick={handleClick}
          disabled={disabled}
          style={btnStyle}
        >
          {label}
        </button>
      </div>
    </>
  );
};

DiamondButton.propTypes = {
  label: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  btnStyle: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
};

export default DiamondButton;
