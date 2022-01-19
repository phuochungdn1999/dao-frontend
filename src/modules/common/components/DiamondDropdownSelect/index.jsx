import React, {
  Fragment,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import cx from "classnames";
import { ReactComponent as ArrowDownIcon } from "../../../diamondHand/assets/icons/arrowDown.svg";
import style from "./DiamondDropdownSelect.module.scss";

const DiamondDropdownMenu = ({
  options,
  showMenu,
  setShowMenu,
  handleChange,
}) => {
  let ref = useRef(null);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (showMenu && ref.current && !ref.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [setShowMenu, showMenu]);

  return (
    <div
      ref={ref}
      className={cx(style.diamond__dropdown_menu)}
      style={{ display: showMenu ? "block" : "none" }}
    >
      {options.map((option, idx) => {
        return (
          <div
            key={option?.id || idx}
            className={cx(style.diamond__dropdown_item)}
            onClick={() => handleChange(option)}
            value={option}
          >
            <span className={cx(style.diamond__dropdown_item_text)}>
              {option}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const DiamondDropdownSelect = ({ options, handleRowsPerPage }) => {
  const [localSelected, setLocalSelected] = useState([options[0] || ""]);

  const handleChange = useCallback(
    (option) => {
      setLocalSelected(option);
      handleRowsPerPage(option);
    },
    [handleRowsPerPage]
  );

  const handleShowMenu = (val) => {
    setShowMenu(val);
  };

  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div
        className={cx(style.diamond__dropdown_container)}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className={cx(style.diamond__dropdown_value)}>
          {localSelected}
        </span>
        <ArrowDownIcon width="12px" height="12px" />
      </div>
      {showMenu && (
        <DiamondDropdownMenu
          options={options}
          showMenu={showMenu}
          setShowMenu={(val) => handleShowMenu(val)}
          handleChange={(val) => handleChange(val)}
        />
      )}
    </>
  );
};

export default DiamondDropdownSelect;
