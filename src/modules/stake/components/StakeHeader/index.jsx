import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Typography, Row } from "antd";

import yfiagLogo from "./yfiag.svg";

import { makeShortAddress } from "../../../common";

import style from "./StakeHeader.module.scss";

const { Paragraph, Link } = Typography;

const mapState = (state) => {
  return {
    pools: state.pools,
  };
};

const StakeHeader = ({ pools, id }) => {
  const [pool, setPool] = useState(null);

  useEffect(() => {
    const currentPool = pools?.list?.find((pool) => pool?.id === id);

    setPool(currentPool);
  }, [pools, id]);

  return (
    <Row className={style.container} justify="space-between" align="top">
      <div className={style.container__name}>
        <img src={yfiagLogo} alt="" />
        <Paragraph className={style.title}> {pool?.name}</Paragraph>
        <Link
          className={style.value}
          target="_blank"
          href={pool?.link}
          rel="noreferrer"
        >
          ({pool?.website})
        </Link>
      </div>

      <div className={style.container__address}>
        <Paragraph className={style.title}>Contract Address:</Paragraph>
        {pool?.tokens[0]?.rewardsAddress && (
          <Link
            className={style.value}
            target="_blank"
            href={`https://etherscan.io/address/${pool.tokens[0].rewardsAddress}`}
            rel="noreferrer"
          >
            {makeShortAddress(pool.tokens[0].rewardsAddress)}
          </Link>
        )}
      </div>
    </Row>
  );
};

StakeHeader.propTypes = {
  pools: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default connect(mapState)(StakeHeader);
