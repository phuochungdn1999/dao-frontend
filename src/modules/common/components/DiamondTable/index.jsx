import React, { Fragment } from "react";
import cx from "classnames";
import style from "./DiamondTable.module.scss";
import PropTypes from "prop-types";
import { useCallback } from "react";
import DiamondDropdownSelect from "../DiamondDropdownSelect";
import DiamondPaginationBtn from "../DiamondPaginationBtn";

const DiamondTable = ({
  headers,
  data,
  showIndex,
  pagination,
  pagesLength,
  rowsPerPage,
  currentPage,
  handleChangePage,
  handleRowsPerPage,
  theme
}) => {
  const renderCells = useCallback((td) => {
    let a = [];

    for (const key of Object.keys(td)) {
      a.push(key);
    }

    return a.map((i, idx) => {
      return (
        <td key={td[i] + idx} className={cx(style.diamond__table__data)}>
          {td[i]}
        </td>
      );
    });
  }, []);

  return (
    <>
      <div className={cx(style.diamond__table__container)}>
        <table className={cx(style.diamond__table__parent, theme.isDarkmode && style.diamond__table__dark)}>
          <tr className={cx(style.diamond__table__header_row)}>
            {showIndex && (
              <th className={cx(style.diamond__table__indexCol)}>#</th>
            )}
            {headers.map((th, idx) => {
              return (
                <Fragment key={th.id || idx}>
                  <th className={cx(style.diamond__table__header)}>
                    {th.label}
                  </th>
                </Fragment>
              );
            })}
          </tr>

          {data.map((tr, idx) => {
            return (
              <Fragment key={tr.id || idx}>
                <tr className={cx(style.diamond__table__header_row)}>
                  {showIndex && (
                    <td className={cx(style.diamond__table__indexCol)}>
                      {currentPage * rowsPerPage + idx+1}
                    </td>
                  )}
                  {renderCells(tr.cells)}
                </tr>
              </Fragment>
            );
          })}
        </table>
      </div>
      {pagination && (
        <div className={cx(style.diamond__table_pagination)}>
          <DiamondPaginationBtn
            pagesLength={pagesLength}
            currentPage={currentPage}
            handleChangePage={(page) => handleChangePage(page)}
          />
          <DiamondDropdownSelect
            options={[5, 10, 15, 20, 50]}
            handleRowsPerPage={(rowsPerPage) => handleRowsPerPage(rowsPerPage)}
          />
        </div>
      )}
    </>
  );
};

DiamondTable.propTypes = {
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  showIndex: PropTypes.bool,
};

export default DiamondTable;
