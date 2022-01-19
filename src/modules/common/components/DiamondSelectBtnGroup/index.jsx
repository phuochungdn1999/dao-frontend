import React, { Fragment, useCallback, useState } from "react";
import cx from "classnames";
import style from "./DiamondSelectBtnGroup.module.scss";
import PropTypes from "prop-types";

const DiamondSelectBtnGroup = ({
  buttonsArr,
  btnGroupStyle,
  classes,
  handleSelect,
}) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleChange = useCallback((button) => {
    setSelectedId(button.id);
    handleSelect(button.id);
  }, [handleSelect]);

  const renderOptions = useCallback(() => {
    return buttonsArr.map((button, idx) => {
      return (
        <Fragment key={button.id || idx}>
          <div
            className={cx(
              style.diamond__buttonGroup__item,
              button.className || ""
            )}
            onClick={() => {
              handleChange(button);
              button.handleClick && button.handleClick();
            }}
            disabled={button.disabled}
            style={{
              backgroundColor: selectedId === button.id ? "#8236ce" : "#E4CBFF",
              whiteSpace: "nowrap",
            }}
          >
            {button.label(selectedId === button.id)}
          </div>
        </Fragment>
      );
    });
  }, [buttonsArr, handleChange, selectedId]);

  return (
    <>
      <div
        className={cx(style.diamond__buttonGroup__container, classes)}
        style={btnGroupStyle}
      >
        {renderOptions()}
      </div>
    </>
  );
};

DiamondSelectBtnGroup.propTypes = {
  buttonsArr: PropTypes.array.isRequired,
  btnGroupStyle: PropTypes.object,
};

export default DiamondSelectBtnGroup;
