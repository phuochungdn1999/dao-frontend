import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Typography, Collapse, Alert, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import cx from 'classnames';

// configs:
import { vaults as vaultsList } from '../../../../configs';

// components:
import { AvailableChains } from '../../../common';
import {
  VaultDescription,
  VaultStrategy,
  VaultBasedOn,
  VaultFilter,
  VaultHeader,
  VaultStats,
  VaultAdmin,
  VaultForm
} from '../../';

// helpers:
import { getAvailableChain } from '../../../common';

// thunks:
import { getVaultBalances } from '../../';

import style from './Vaults.module.scss';

const { Title } = Typography;
const { Panel } = Collapse;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account,
    vaults: state.vaults
  };
};

const Vaults = ({ web3context, account, vaults, t }) => {
  const dispatch = useDispatch();

  const [availableChain, setAvailableChain] = useState(null);
  const [filteredVaults, setFilteredVaults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onGetVaultBalances = useCallback(
    (payload) => dispatch(getVaultBalances(payload)),
    [dispatch]
  );

  useEffect(() => {
    if (vaults?.loading || account?.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [account, vaults]);

  useEffect(() => {
    web3context?.instance &&
      account?.address &&
      availableChain &&
      onGetVaultBalances({
        web3: web3context.instance,
        list: availableChain,
        account: account.address
      });
  }, [onGetVaultBalances, account, web3context, availableChain]);

  useEffect(() => {
    const result = vaults?.list?.filter((asset) => {
      if (
        vaults?.hideZero && (asset.balance === 0 && asset.vaultBalance === 0)
      ) {
        return false;
      }

      if (vaults?.search) {
        const searchValue = vaults.search.toLowerCase();

        return asset.id.toLowerCase().includes(searchValue) ||
          asset.name.toLowerCase().includes(searchValue) ||
          asset.symbol.toLowerCase().includes(searchValue) ||
          asset.description.toLowerCase().includes(searchValue) ||
          asset.vaultSymbol.toLowerCase().includes(searchValue);
      } else {
        return true;
      }
    }) || null;

    result && setFilteredVaults(result);
  }, [vaults]);

  useEffect(() => {
    web3context?.chain && setAvailableChain(
      getAvailableChain(web3context.chain, vaultsList)
    );
  }, [web3context]);

  return (
    <Typography className={cx(style.container, {
      [style.container_loading]: isLoading
    })}>
      <Title className={style.title}>
        <span>{t('VAULTS_TITLE')}</span>
        <Alert
        className={style.container__info}
        message={t('DASHBOARD_INFO')}
        type="info"
      />
      </Title>
      

      

      {account?.address ? (
        <>
          {availableChain ? (
            <>
              <VaultFilter
                className={style.container__filter}
                isLoading={isLoading}
              />

              <VaultBasedOn
                className={style.container__prompt}
                isLoading={isLoading}
              />

              {filteredVaults?.length ? (
                <Collapse className={style.list} motion={null} accordion bordered={false}>
                  {filteredVaults?.map((asset) => (
                    <Panel
                      header={
                        <VaultHeader basedOn={vaults?.basedOn || 0} asset={asset} />
                      }
                      key={asset.id}
                    >
                      <VaultStrategy basedOn={vaults?.basedOn || 0} asset={asset} />

                      <VaultStats asset={asset} />

                      <VaultForm list={availableChain} id={asset.id} />

                      {asset.governance.toLowerCase() ===
                        account.address.toLowerCase() &&
                        (
                          <VaultAdmin asset={asset} />
                        )}
                    </Panel>

                    
                  ))}
                </Collapse>
              ) : (
                <Empty
                  description="No vaults"
                  className={style.container__empty}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}

              <VaultDescription />
            </>
          ) : (
            <Alert
              className={style.container__warning}
              message="Vaults features are not available in this chain."
              type="warning"
            />
          )}

          {/* <AvailableChains configChains={vaultsList} /> */}
        </>
      ) : (
        <Alert
          className={style.container__warning}
          message="Please, connect your wallet to continue."
          type="warning"
        />
      )}


      {isLoading && (
        <div className={style.container__loading}>
          <LoadingOutlined className={style.container__loading__icon} />
        </div>
      )}
    </Typography>
  );
};

Vaults.propTypes = {
  web3context: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  vaults: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(connect(mapState)(Vaults));
