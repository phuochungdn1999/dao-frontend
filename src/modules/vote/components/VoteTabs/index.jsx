import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Radio } from 'antd';
import cx from 'classnames';

// thunks:
import { setTabValue } from '../../';

import style from './VoteTabs.module.scss';

const { Group: RadioGroup, Button: RadioButton } = Radio;

const proposalTabs = [
  {
    name: 'Done',
    value: 0
  },
  {
    name: 'Open',
    value: 1
  }
];

const VoteTabs = ({ isDisabled }) => {
  const dispatch = useDispatch();

  const [currentTabValue, setCurrentTabValue] =  useState(
    Number(localStorage.getItem('vote-tab')) || 0
  );

  const handleTabValue = (event) => {
    setCurrentTabValue(event.target.value);

    localStorage.setItem('vote-tab', event.target.value);
  };

  const onSetTabValue = useCallback(
    (payload) => dispatch(setTabValue(payload)),
    [dispatch]
  );

  useEffect(
    () => onSetTabValue({ value: currentTabValue }),
    [currentTabValue, onSetTabValue]
  );

  return (
    <RadioGroup
      buttonStyle="solid"
      className={style.container}
      onChange={handleTabValue}
      value={currentTabValue}
    >
      {proposalTabs.map(({ name, value }) => (
        <RadioButton
          className={cx(style.button, {
            [style.button_active]: currentTabValue === value
          })}
          disabled={isDisabled}
          value={value}
          key={value}
        >
          {name}
        </RadioButton>
      ))}
    </RadioGroup>
  );
};

VoteTabs.propTypes = {
  isDisabled: PropTypes.bool.isRequired
};

export default VoteTabs;
