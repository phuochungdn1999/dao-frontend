import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Typography, Card } from "antd";

import style from "./AvailableChains.module.scss";

const { Paragraph, Link } = Typography;

const mapState = (state) => {
  return {
    chains: state.chains,
  };
};

const AvailableChains = ({ configChains, chains }) => {
  const [availableChains, setAvailableChains] = useState(null);

  useEffect(() => {
    if (configChains && chains?.list) {
      const findedChains = configChains.map(({ id }) => {
        return chains.list?.find((item) => item?.chainId === id);
      });

      setAvailableChains(findedChains || null);
    }
  }, [chains, configChains]);

  return (
    <Card className={style.container} title="Available Chains">
      <ul className={style.list}>
        {availableChains?.map(({ infoURL, chainId, name }) => (
          <li className={style.list__item} key={chainId}>
            <Link
              className={style.list__item__link}
              target="_blank"
              href={infoURL}
              rel="noreferrer"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};

AvailableChains.propTypes = {
  configChains: PropTypes.array.isRequired,
  chains: PropTypes.object.isRequired,
};

export default connect(mapState)(AvailableChains);
