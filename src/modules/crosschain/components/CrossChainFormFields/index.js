import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { InputNumber, Typography, Button, Input, Form, message } from 'antd';
import cx from 'classnames';

// configs:
import { crosschain as crosschainList } from '../../../../configs';

// thunks:
import { getCrossChainBalances, checkTransaction, sendTokens } from '../../';

import style from './CrossChainFormFields.module.scss';

const {
  success: successMessage,
  error: errorMessage,
  info: infoMessage
} = message;
const { Title } = Typography;
const { useForm, Item } = Form;

const MINIMAL_AMOUNT = 0.1;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    crosschain: state.crosschain,
    account: state.account,
    prices: state.prices,
    chains: state.chains
  };
};

const CrossChainFormFields = ({
  availableChain,
  web3context,
  crosschain,
  className,
  account,
  prices,
  chains,
  t
}) => {
  const dispatch = useDispatch();

  const [crosschainForm] = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const handleCrossChainAmount = (value) => {
    crosschainForm.setFieldsValue({ amount: value });
  };

  const checkTransactions = (asset, nonce, chains, chainId, account) => {
    dispatch(checkTransaction({
      asset,
      nonce,
      chains,
      chainId,
      account,
      onError: (error) => {
        console.log(error.message);

        errorMessage(error.message);
      },
      onSuccess: (result) => {
        if (result) {
          successMessage('The cross-chain transaction was completed.');
        } else {
          setTimeout(
            () => checkTransactions(asset, nonce, chains, chainId, account),
            1000
          );
        }
      }
    }));
  };

  const onFinish = ({ address, amount }) => {
    setIsLoading(true);

    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(sendTokens({
        web3: web3context.instance,
        asset: crosschain.chain,
        price: prices.gas,
        amount,
        address,
        account: account.address,
        onError: (error) => {
          if (error?.message) {
            console.log(error.message);

            errorMessage(error.message);
          }

          setIsLoading(false);
        },
        onConfirm: ({ nonce, hash }) => {
          successMessage('The cross-chain sending was successful.');

          web3context.instance && account.address && availableChain && dispatch(
            getCrossChainBalances({
              web3: web3context.instance,
              asset: availableChain,
              account: account.address
            })
          );

          const asset = crosschainList.find(({ id }) => {
            return id !== web3context.chain;
          });

          checkTransactions(
            asset.list,
            nonce,
            chains.list,
            asset.id,
            account.address
          );
        },
        onSuccess: (result) => {
          successMessage(
            'The transaction to cross-chain sending was sent successfully.'
          );

          result && infoMessage(`Transaction hash: ${result}`);

          setIsLoading(false);

          crosschainForm.setFieldsValue({ stakeAmount: 0 });
        }
      }));
  };

  return (
    <Form
      scrollToFirstError
      className={cx(className, style.container)}
      onFinish={onFinish}
      layout="vertical"
      name="crosschain"
      form={crosschainForm}
    >
      <Title
        className={style.subtitle}
        onClick={() => {
          handleCrossChainAmount(crosschain?.chain?.balance || 0);
        }}
        level={5}
      >
        Balance:
        {' '}
        {(
          Math.floor(crosschain?.chain?.balance * 10000) / 10000
        )?.toFixed(4) || '0.0000'}
        {' '}
        {crosschain?.chain?.symbol || ''}
      </Title>

      <Item
        className={style.container__item}
        rules={[
          {
            required: true,
            requiredMark: false,
            message: 'Please input address'
          }
        ]}
        label="Send to:"
        name="address"
      >
        <Input
          placeholder="Input address..."
          className={style.input}
        />
      </Item>

      <Item
        className={style.container__item}
        rules={[
          {
            required: true,
            message: 'Please input amount',
          },
          {
            type: 'number',
            min: MINIMAL_AMOUNT,
            message: `Amount must be more than ${MINIMAL_AMOUNT}`,
          },
          {
            type: 'number',
            max: crosschain?.chain?.balance,
            message:
              `Amount must be less than ${crosschain?.chain?.balance}`,
          }
        ]}
        label="Send amount:"
        name="amount"
      >
        <InputNumber
          min={MINIMAL_AMOUNT}
          step={MINIMAL_AMOUNT}
          type="number"
          pattern="[0-9]*"
          disabled={!crosschain?.chain?.balance}
          inputmode="numeric"
          className={cx(style.input, style.input_number)}
          placeholder="0"
        />
      </Item>

      <Button
        className={style.submit}
        htmlType="submit"
        disabled={isLoading || !crosschain?.chain?.balance}
        loading={isLoading}
        type="primary"
      >
        {t('CROSS_CHAIN_FORM_FIELDS_SEND')}
      </Button>
    </Form>
  );
};

CrossChainFormFields.propTypes = {
  availableChain: PropTypes.object.isRequired,
  web3context: PropTypes.object.isRequired,
  crosschain: PropTypes.object.isRequired,
  className: PropTypes.string,
  prices: PropTypes.object.isRequired,
  chains: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(connect(mapState)(CrossChainFormFields));
