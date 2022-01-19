import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, connect } from "react-redux";
import {
  InputNumber,
  Typography,
  Button,
  Radio,
  Form,
  Row,
  Col,
  message,
} from "antd";
import { WarningOutlined } from "@ant-design/icons";
import cx from "classnames";

// thunks:
import { getGasPrices } from "../../../dashboard";
import {
  getVaultBalances,
  withdrawAllVault,
  depositAllVault,
  checkApproval,
  withdrawVault,
  depositVault,
} from "../../";

import style from "./VaultForm.module.scss";

const {
  success: successMessage,
  error: errorMessage,
  info: infoMessage,
} = message;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const { Title, Text } = Typography;
const { useForm, Item } = Form;

const amountParts = [
  {
    name: "25%",
    value: 25,
  },
  {
    name: "50%",
    value: 50,
  },
  {
    name: "75%",
    value: 75,
  },
  {
    name: "100%",
    value: 100,
  },
];

const MINIMAL_AMOUNT = 0.00001;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account,
    prices: state.prices,
    vaults: state.vaults,
  };
};

const VaultForm = ({ web3context, account, prices, vaults, list, id }) => {
  const dispatch = useDispatch();

  const [depositForm] = useForm();
  const [withdrawForm] = useForm();

  const [redeemAmountPart, setRedeemAmountPart] = useState(null);
  const [amountPart, setAmountPart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [asset, setAsset] = useState(null);

  const onDeposit = ({ amount }) => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        checkApproval({
          web3: web3context.instance,
          asset,
          price: prices.gas,
          amount,
          account: account.address,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onSuccess: () => {
            dispatch(
              depositVault({
                web3: web3context.instance,
                asset,
                price: prices.gas,
                amount,
                account: account.address,
                onError: (error) => {
                  if (error?.message) {
                    errorMessage(error.message);
                  }

                  setIsLoading(false);
                },
                onConfirm: () => {
                  successMessage("The deposit was successful.");

                  web3context.instance &&
                    account.address &&
                    list &&
                    dispatch(
                      getVaultBalances({
                        web3: web3context.instance,
                        list,
                        account: account.address,
                      })
                    );
                },
                onSuccess: (result) => {
                  successMessage(
                    "The transaction to deposit was sent successfully."
                  );

                  result && infoMessage(`Transaction hash: ${result}`);

                  setIsLoading(false);
                  setAmountPart(null);

                  depositForm.setFieldsValue({ amount: 0 });
                },
              })
            );
          },
        })
      );

    setIsLoading(true);
  };

  const handleDepositAll = () => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        checkApproval({
          web3: web3context.instance,
          asset,
          price: prices.gas,
          amount: asset.balance,
          account: account.address,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onSuccess: () => {
            dispatch(
              depositAllVault({
                web3: web3context.instance,
                asset,
                price: prices.gas,
                account: account.address,
                onError: (error) => {
                  if (error?.message) {
                    errorMessage(error.message);
                  }

                  setIsLoading(false);
                },
                onConfirm: () => {
                  successMessage("The deposit all was successful.");

                  web3context.instance &&
                    account.address &&
                    list &&
                    dispatch(
                      getVaultBalances({
                        web3: web3context.instance,
                        list,
                        account: account.address,
                      })
                    );
                },
                onSuccess: (result) => {
                  successMessage(
                    "The transaction to deposit all was sent successfully."
                  );

                  result && infoMessage(`Transaction hash: ${result}`);

                  setIsLoading(false);
                  setAmountPart(null);

                  depositForm.setFieldsValue({ amount: 0 });
                },
              })
            );
          },
        })
      );

    setIsLoading(true);
  };

  const onWithdraw = ({ redeemAmount }) => {
    const amount = (
      Math.floor((redeemAmount / asset.pricePerFullShare) * 10000) / 10000
    ).toFixed(4);

    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        withdrawVault({
          web3: web3context.instance,
          asset,
          account: account.address,
          amount,
          price: prices.gas,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onConfirm: () => {
            successMessage("The withdrawal was successful.");

            web3context.instance &&
              account.address &&
              list &&
              dispatch(
                getVaultBalances({
                  web3: web3context.instance,
                  list,
                  account: account.address,
                })
              );
          },
          onSuccess: (result) => {
            successMessage(
              "The transaction to withdraw was sent successfully."
            );

            result && infoMessage(`Transaction hash: ${result}`);

            setIsLoading(false);
            setRedeemAmountPart(null);

            withdrawForm.setFieldsValue({ redeemAmount: null });
          },
        })
      );

    setIsLoading(true);
  };

  const handleWithdrawAll = () => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        withdrawAllVault({
          web3: web3context.instance,
          asset,
          account: account.address,
          price: prices.gas,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onConfirm: () => {
            successMessage("The withdrawal all was successful.");

            web3context.instance &&
              account.address &&
              list &&
              dispatch(
                getVaultBalances({
                  web3: web3context.instance,
                  list,
                  account: account.address,
                })
              );
          },
          onSuccess: (result) => {
            successMessage(
              "The transaction to withdraw all was sent successfully."
            );

            result && infoMessage(`Transaction hash: ${result}`);

            setIsLoading(false);
            setRedeemAmountPart(null);

            withdrawForm.setFieldsValue({ redeemAmount: null });
          },
        })
      );

    setIsLoading(true);
  };

  const setAmount = (percent) => {
    const amount = Math.floor(asset.balance * percent * 100) / 10000;

    setAmountPart(percent);

    depositForm.setFieldsValue({ amount: amount });
  };

  const setRedeemAmount = (percent) => {
    const assetAmount = asset.vaultBalance * asset.pricePerFullShare;
    const amount = Math.floor(assetAmount * percent * 100) / 10000;

    setRedeemAmountPart(percent);

    withdrawForm.setFieldsValue({ redeemAmount: amount });
  };

  const onGetGasPrices = useCallback(
    (payload) => dispatch(getGasPrices(payload)),
    [dispatch]
  );

  useEffect(() => {
    web3context?.instance && onGetGasPrices({ web3: web3context.instance });
  }, [onGetGasPrices, web3context]);

  useEffect(() => {
    const currentAsset = vaults?.list?.find((asset) => asset?.id === id);

    setAsset(currentAsset);
  }, [vaults, id]);

  return (
    <Row className={style.forms}>
      <Col className={style.forms__item} span={12}>
        <Title className={style.title} onClick={() => setAmount(100)} level={5}>
          {"Your wallet: " +
            (asset?.balance
              ? (Math.floor(asset?.balance * 10000) / 10000).toFixed(4)
              : "0.0000")}{" "}
          {asset?.tokenSymbol ? asset.tokenSymbol : asset?.symbol}
        </Title>

        <Form
          scrollToFirstError
          onFieldsChange={(changedFields, allFields) => {
            const changedAmount = changedFields?.find(
              ({ name }) => name[0] === "amount"
            );

            changedAmount && setAmountPart(null);
          }}
          onFinish={onDeposit}
          layout="vertical"
          name="deposit"
          form={depositForm}
        >
          <Item
            rules={[
              {
                required: true,
                message: "Please input amount",
              },
              {
                type: "number",
                min: MINIMAL_AMOUNT,
                message: `Amount must be more than ${MINIMAL_AMOUNT}`,
              },
              {
                type: "number",
                max: asset?.balance,
                message: `Amount must be less than ${asset?.balance}`,
              },
            ]}
            name="amount"
          >
            <InputNumber
              step={MINIMAL_AMOUNT}
              type="number"
              pattern="[0-9]*"
              disabled={!asset?.balance}
              inputmode="numeric"
              className={style.input}
              placeholder="0"
            />
          </Item>

          <RadioGroup
            buttonStyle="solid"
            className={style.forms__item__percentages}
            onChange={(value) => setAmount(value?.target?.value)}
            value={amountPart}
          >
            {amountParts.map(({ name, value }) => (
              <RadioButton
                className={cx(style.button, {
                  [style.button_active]: amountPart === value,
                })}
                disabled={
                  isLoading ||
                  asset?.paused ||
                  !asset?.balance ||
                  asset?.depositDisabled ||
                  !prices?.gas
                }
                value={value}
                key={value}
              >
                {name}
              </RadioButton>
            ))}
          </RadioGroup>

          <Row
            className={style.forms__item__buttons}
            justify="space-between"
            align="middle"
          >
            {asset?.deposit && (
              <Button
                className={style.submit}
                htmlType="submit"
                disabled={
                  isLoading ||
                  asset?.paused ||
                  !asset?.balance ||
                  asset?.depositDisabled ||
                  !prices?.gas
                }
                loading={isLoading}
                type="primary"
              >
                Deposit
              </Button>
            )}

            {asset?.depositAll && (
              <Button
                className={style.button}
                disabled={
                  isLoading ||
                  asset?.paused ||
                  !asset?.balance ||
                  asset?.depositDisabled ||
                  !prices?.gas
                }
                loading={isLoading}
                onClick={handleDepositAll}
              >
                Deposit All
              </Button>
            )}
          </Row>
        </Form>

        {asset?.depositDisabled && (
          <Text>Deposits are currently disabled for this vault</Text>
        )}
      </Col>

      <Col className={style.forms__item} span={12}>
        <Title
          className={style.title}
          onClick={() => setRedeemAmount(100)}
          level={5}
        >
          {"Vault balance: " +
            (asset?.vaultBalance
              ? (
                  Math.floor(
                    asset.vaultBalance * asset?.pricePerFullShare * 10000
                  ) / 10000
                ).toFixed(4)
              : "0.0000")}{" "}
          {asset?.symbol} (
          {asset?.vaultBalance
            ? (Math.floor(asset.vaultBalance * 10000) / 10000).toFixed(4)
            : "0.0000"}{" "}
          {asset?.vaultSymbol})
        </Title>

        <Form
          scrollToFirstError
          onFieldsChange={(changedFields, allFields) => {
            const changedAmount = changedFields?.find(
              ({ name }) => name[0] === "redeemAmount"
            );

            changedAmount && setRedeemAmountPart(null);
          }}
          onFinish={onWithdraw}
          layout="vertical"
          name="withdraw"
          form={withdrawForm}
        >
          <Item
            rules={[
              {
                required: true,
                message: "Please input amount",
              },
              {
                type: "number",
                min: MINIMAL_AMOUNT,
                message: `Amount must be more than ${MINIMAL_AMOUNT}`,
              },
              {
                type: "number",
                max: asset?.vaultBalance,
                message: `Amount must be less than ${asset?.vaultBalance}`,
              },
            ]}
            name="redeemAmount"
          >
            <InputNumber
              step={MINIMAL_AMOUNT}
              type="number"
              pattern="[0-9]*"
              disabled={!asset?.vaultBalance}
              inputmode="numeric"
              className={style.input}
              placeholder="0"
            />
          </Item>

          <RadioGroup
            buttonStyle="solid"
            className={style.forms__item__percentages}
            onChange={(value) => setRedeemAmount(value?.target?.value)}
            value={redeemAmountPart}
          >
            {amountParts.map(({ name, value }) => (
              <RadioButton
                className={cx(style.button, {
                  [style.button_active]: redeemAmountPart === value,
                })}
                disabled={
                  isLoading ||
                  asset?.paused ||
                  !asset?.vaultBalance ||
                  !prices?.gas
                }
                value={value}
                key={value}
              >
                {name}
              </RadioButton>
            ))}
          </RadioGroup>

          <Row
            className={style.forms__item__buttons}
            justify="space-between"
            align="middle"
          >
            {asset?.withdraw && (
              <Button
                className={style.submit}
                htmlType="submit"
                disabled={
                  isLoading ||
                  asset?.paused ||
                  !asset?.vaultBalance ||
                  !prices?.gas
                }
                loading={isLoading}
                type="primary"
              >
                Withdraw
              </Button>
            )}

            {asset?.withdrawAll && (
              <Button
                className={style.button}
                disabled={
                  isLoading ||
                  asset?.paused ||
                  !asset?.vaultBalance ||
                  !prices?.gas
                }
                loading={isLoading}
                onClick={handleWithdrawAll}
              >
                Withdraw All
              </Button>
            )}
          </Row>
        </Form>

        {/* {asset?.symbol === 'DAI' && (
          <Row justify="end" align="middle">
            <WarningOutlined />
            <Text>
              Withdrawals might be subject to high slippage due to recent
              large
              {' '}
              <a
                href="https://etherscan.io/tx/0x7207d444430344d4d8384d4dd8c12a8a343c9c01ccdb17c8962b84f40955c59f"
                target="_blank"
                rel="noopener noreferrer"
              >
                withdrawal
              </a>
            </Text>
          </Row>
        )} */}
      </Col>
    </Row>
  );
};

VaultForm.propTypes = {
  web3context: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  vaults: PropTypes.object.isRequired,
  list: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
};

export default connect(mapState)(VaultForm);
