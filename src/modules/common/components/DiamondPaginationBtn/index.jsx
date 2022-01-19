import React, { Fragment } from "react";
import cx from "classnames";
import style from "./DiamondPaginationBtn.module.scss";
import { ReactComponent as BackIcon } from "../../../diamondHand/assets/icons/arrowLeft.svg";
import { ReactComponent as NextIcon } from "../../../diamondHand/assets/icons/arrowRight.svg";

const DiamondPaginationBtn = ({ pagesLength, handleChangePage, currentPage }) => {
  return (
    <>
      <div className={cx(style.diamond__pagination_container)}>
        <BackIcon width="12px" height="12px" />
        {Array.from(Array(pagesLength).keys()).map((page, idx) => {
          return (
            <Fragment key={page?.id || idx}>
              <button
                className={cx(style.diamond__pagination_btn)}
                type="button"
                onClick={() => handleChangePage(page)}
                style={{
                  backgroundColor: currentPage === page ? "#8736CB" : "#E4CBFF",
                  color: currentPage === page ? "#fff" : "#8736CB",
                }}
              >
                {page+1}
              </button>
            </Fragment>
          );
        })}
        <NextIcon width="12px" height="12px" />
      </div>
    </>
  );
};

export default DiamondPaginationBtn;
