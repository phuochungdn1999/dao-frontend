import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Typography, Select, Row } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import cx from 'classnames';

// thunks:
import { setBasedOn } from '../../';

import style from './VaultBasedOn.module.scss';

const { Text } = Typography;
const { Option } = Select;

const basedOn = [
  {
    value: 0,
    name: 'DASHBOARD_BASEDON_WEEK'
  },
  {
    value: 1,
    name: 'DASHBOARD_BASEDON_MONTH'
  },
  {
    value: 2,
    name: 'DASHBOARD_BASEDON_INCEPTION'
  }
];

const VaultBasedOn = ({ className, isLoading, t }) => {
  const dispatch = useDispatch();

  const [vaultsBasedOn, setVaultsBasedOn] = useState(
    Number(localStorage.getItem('vaults-basedon')) || basedOn[0].value
  ); // 0 = apyThreeDaySample / 1 = apyOneWeekSample / 2 = apyInceptionSample

  const handleBasedOnChange = (value) => {
    setVaultsBasedOn(value);

    localStorage.setItem('vaults-basedon', value);
  };

  const onSetBasedOn = useCallback(
    (payload) => dispatch(setBasedOn(payload)),
    [dispatch]
  );

  useEffect(
    () => onSetBasedOn({ value: vaultsBasedOn }),
    [vaultsBasedOn, onSetBasedOn]
  );

  return (
    <Row
      className={cx(className, style.container)}
      justify="end"
      align="middle"
    >

      <Text className={style.container__text}>
      <InfoCircleOutlined className={style.container__icon} />

        Growth is based on the vault's performance
        {' '}
        {vaultsBasedOn === 2 ?
          t('DASHBOARD_BASEDON_PROMPT_SINCE') :
          t('DASHBOARD_BASEDON_PROMPT_PAST')}
      </Text>

      <Select
        dropdownClassName={style.select__dropdown}
        defaultValue={basedOn[0].value}
        className={style.select}
        onChange={handleBasedOnChange}
        disabled={isLoading}
      >
        {basedOn.map(({ value, name }) => (
          <Option
            className={cx(style.select__dropdown__option, {
              [style.select__dropdown__option_selected]: vaultsBasedOn === value
            })}
            value={value}
            key={value}
          >
            {t(name)}
          </Option>
        ))}
      </Select>
    </Row>
  );
};

VaultBasedOn.propTypes = {
  className: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(VaultBasedOn);
