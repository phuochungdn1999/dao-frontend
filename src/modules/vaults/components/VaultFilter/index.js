import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Checkbox, Tooltip, Input, Row } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import cx from 'classnames';

// thunks:
import { setHideZeroValue, setSearchValue } from '../../';

import style from './VaultFilter.module.scss';

const { Search } = Input;

const VaultFilter = ({ className, isLoading }) => {
  const dispatch = useDispatch();

  const [isZeroBalanceHide, setIsZeroBalanceHide] = useState(
    Number(localStorage.getItem('vaults-zero-balance-hide')) ? true : false
  );

  const handleZeroBalanceHide = (event) => {
    setIsZeroBalanceHide(event.target.checked);

    localStorage.setItem(
      'vaults-zero-balance-hide',
      event.target.checked ? 1: 0
    );
  };

  const handleSearchValue = (value) => dispatch(setSearchValue({ value }));

  const onSetHideZeroValue = useCallback(
    (payload) => dispatch(setHideZeroValue(payload)),
    [dispatch]
  );

  useEffect(
    () => onSetHideZeroValue({ value: isZeroBalanceHide} ),
    [isZeroBalanceHide, onSetHideZeroValue]
  );

  return (
    <Row
      className={cx(className, style.container)}
      justify="end"
      align="middle"
    >
      <Checkbox
        className={style.container__checkbox}
        onChange={handleZeroBalanceHide}
        disabled={isLoading}
        checked={isZeroBalanceHide}
      >
        Hide zero balances
      </Checkbox>

      <Tooltip
        title={
          <p>
            There is a 0.5% withdrawal fee on all vaults.
            <br />
            <br />
            There is a 5% performance fee on subsidized gas.
          </p>
        }
      >
        <InfoCircleOutlined className={style.container__prompt} />
      </Tooltip>

      <Search
        defaultValue=""
        placeholder="ETH, CRV, ..."
        enterButton="Search"
        allowClear
        className={style.container__search}
        onSearch={handleSearchValue}
        disabled={isLoading}
        bordered={false}
        size="large"
      />
    </Row>
  );
};

VaultFilter.propTypes = {
  className: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default VaultFilter;
