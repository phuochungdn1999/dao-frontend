import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, connect } from "react-redux";
import moment from "moment";
import { Typography, InputNumber, Button, Form, Row, Col, message } from "antd";

// components:
import { StakeInfo } from "../../";

// thunks:
import { getGasPrices } from "../../../dashboard";
import {
  getVoteRequirements,
  getPoolsBalances,
  unstakePool,
  stakePool,
  claimPool,
  exitPool,
} from "../../";

import style from "./StakeContent.module.scss";

const {
  success: successMessage,
  error: errorMessage,
  info: infoMessage,
} = message;
const { Paragraph, Title, Text } = Typography;
const { useForm, Item } = Form;

const MINIMAL_AMOUNT = 0.01;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account,
    prices: state.prices,
    pools: state.pools,
  };
};

const StakeContent = ({ web3context, account, prices, pools, list, id }) => {
  const dispatch = useDispatch();

  const [unstakeForm] = useForm();
  const [stakeForm] = useForm();

  const [isVoteLockValid, setIsVoteLockValid] = useState(false);
  const [isBalanceValid, setIsBalanceValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voteLock, setVoteLock] = useState(null);
  const [pool, setPool] = useState(null);

  const handleUnstakeAmount = (value) => {
    unstakeForm.setFieldsValue({ stakeAmount: value });
  };

  const handleStakeAmount = (value) => {
    stakeForm.setFieldsValue({ unstakeAmount: value });
  };

  const onStake = ({ stakeAmount }) => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        stakePool({
          web3: web3context.instance,
          asset: pool.tokens[0],
          price: prices.gas,
          amount: stakeAmount,
          account: account.address,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onConfirm: () => {
            successMessage("The stake was successful.");

            web3context.instance &&
              account.address &&
              list &&
              dispatch(
                getPoolsBalances({
                  web3: web3context.instance,
                  list,
                  account: account.address,
                })
              );
          },
          onSuccess: (result) => {
            successMessage("The transaction to stake was sent successfully.");

            result && infoMessage(`Transaction hash: ${result}`);

            setIsLoading(false);

            stakeForm.setFieldsValue({ stakeAmount: 0 });
          },
        })
      );

    setIsLoading(true);
  };

  const onUnstake = ({ unstakeAmount }) => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        unstakePool({
          web3: web3context.instance,
          asset: pool.tokens[0],
          price: prices.gas,
          amount: unstakeAmount,
          account: account.address,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onConfirm: () => {
            successMessage("The stake was successful.");

            web3context.instance &&
              account.address &&
              list &&
              dispatch(
                getPoolsBalances({
                  web3: web3context.instance,
                  list,
                  account: account.address,
                })
              );
          },
          onSuccess: (result) => {
            successMessage("The transaction to unstake was sent successfully.");

            result && infoMessage(`Transaction hash: ${result}`);

            setIsLoading(false);

            unstakeForm.setFieldsValue({ unstakeAmount: 0 });
          },
        })
      );

    setIsLoading(true);
  };

  const handleClaim = () => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        claimPool({
          web3: web3context.instance,
          asset: pool.tokens[0],
          price: prices.gas,
          account: account.address,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onSuccess: (result) => {
            successMessage("Claim was successful.");

            result && infoMessage(result);

            setIsLoading(false);
          },
        })
      );

    setIsLoading(true);
  };

  const handleExit = () => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        exitPool({
          web3: web3context.instance,
          asset: pool.tokens[0],
          price: prices.gas,
          account: account.address,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onSuccess: (result) => {
            successMessage("Claim was successful.");

            result && infoMessage(result);

            setIsLoading(false);
          },
        })
      );

    setIsLoading(true);
  };

  const onGetVoteRequirements = useCallback(
    (payload) => dispatch(getVoteRequirements(payload)),
    [dispatch]
  );

  const onGetGasPrices = useCallback(
    (payload) => dispatch(getGasPrices(payload)),
    [dispatch]
  );

  useEffect(() => {
    web3context?.instance && onGetGasPrices({ web3: web3context.instance });
  }, [onGetGasPrices, web3context]);

  useEffect(() => {
    web3context?.instance &&
      account?.address &&
      pool?.tokens &&
      onGetVoteRequirements({
        web3: web3context.instance,
        asset: pool.tokens[0],
        account: account.address,
        onError: (error) => {
          if (error?.message) {
            errorMessage(error.message);
          }
        },
        onSuccess: ({ voteLockValid, balanceValid, voteLock }) => {
          setIsVoteLockValid(voteLockValid);
          setIsBalanceValid(balanceValid);
          setVoteLock(voteLock);
        },
      });
  }, [onGetVoteRequirements, web3context, account, pool]);

  useEffect(() => {
    const currentPool = pools?.list?.find((pool) => pool?.id === id);

    setPool(currentPool);
  }, [pools, id]);

  return (
    <>
      {pool && <StakeInfo isVoteLockValid={isVoteLockValid} pool={pool} />}

      <Row className={style.forms}>
        <Col className={style.forms__item} span={12}>
          <Title className={style.title} level={4}>
            Stake your tokens
          </Title>

          <Title
            className={style.subtitle}
            onClick={() => handleStakeAmount(pool?.tokens[0]?.balance || 0)}
            level={5}
          >
            Balance:{" "}
            {(Math.floor(pool?.tokens[0]?.balance * 10000) / 10000)?.toFixed(
              4
            ) || "0.0000"}{" "}
            {pool?.tokens[0]?.symbol || ""}
          </Title>

          <Form
            scrollToFirstError
            onFinish={onStake}
            layout="vertical"
            name="stake"
            form={stakeForm}
          >
            <Row className={style.forms__item__field}>
              <img
                className={style.forms__item__field__icon}
                src="assets/icons/yfiag.svg"
                alt={pool?.tokens[0]?.symbol}
              />

              <Item
                className={style.forms__item__field__input}
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
                    max: pool?.tokens[0]?.balance,
                    message: `Amount must be less than ${pool?.tokens[0]?.balance}`,
                  },
                ]}
                name="stakeAmount"
              >
                <InputNumber
                  step={MINIMAL_AMOUNT}
                  type="number"
                  pattern="[0-9]*"
                  disabled={!pool?.tokens[0]?.balance}
                  inputmode="numeric"
                  className={style.input}
                  placeholder="0"
                />
              </Item>

              <Text className={style.forms__item__field__symbol}>
                {pool?.tokens[0]?.symbol}
              </Text>

              <Button
                className={style.submit}
                htmlType="submit"
                disabled={isLoading || !pool?.tokens[0]?.balance}
                loading={isLoading}
                type="primary"
              >
                Stake
              </Button>
            </Row>
          </Form>
        </Col>

        <Col className={style.forms__item} span={12}>
          <Title className={style.title} level={4}>
            Unstake your tokens
          </Title>

          <Title
            className={style.subtitle}
            onClick={() => {
              handleUnstakeAmount(pool?.tokens[0]?.stakedBalance || 0);
            }}
            level={5}
          >
            Balance:{" "}
            {pool?.tokens[0]?.stakedBalance
              ? (
                  Math.floor(pool?.tokens[0].stakedBalance * 10000) / 10000
                ).toFixed(4)
              : "0.0000"}{" "}
            {pool?.tokens[0]?.symbol || ""}
          </Title>

          <Form
            scrollToFirstError
            onFinish={onUnstake}
            layout="vertical"
            name="unstake"
            form={unstakeForm}
          >
            <Row className={style.forms__item__field}>
              <img
                className={style.forms__item__field__icon}
                src="assets/icons/yfiag.svg"
                alt={pool?.tokens[0]?.symbol}
              />

              <Item
                className={style.forms__item__field__input}
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
                    max: pool?.tokens[0]?.stakedBalance,
                    message: `Amount must be less than ${pool?.tokens[0]?.stakedBalance}`,
                  },
                ]}
                name="unstakeAmount"
              >
                <InputNumber
                  step={MINIMAL_AMOUNT}
                  type="number"
                  pattern="[0-9]*"
                  disabled={!pool?.tokens[0]?.stakedBalance}
                  inputmode="numeric"
                  className={style.input}
                  placeholder="0"
                />
              </Item>

              <Text className={style.forms__item__field__symbol}>
                {pool?.tokens[0]?.symbol}
              </Text>
            </Row>

            <Button
              className={style.submit}
              htmlType="submit"
              disabled={
                isLoading || isVoteLockValid || !pool?.tokens[0]?.stakedBalance
              }
              loading={isLoading}
              type="primary"
            >
              Unstake
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className={style.actions} justify="space-between">
        <Button
          className={style.button}
          disabled={isLoading || !isVoteLockValid}
          loading={isLoading}
          onClick={handleClaim}
        >
          Claim Rewards
        </Button>

        <Button
          className={style.button}
          disabled={isLoading || isVoteLockValid}
          loading={isLoading}
          onClick={handleExit}
        >
          Exit: Claim and Unstake
        </Button>
      </Row>

      {isVoteLockValid && (
        <Paragraph className={style.prompt}>
          Unstaking tokens only allowed once all your pending votes have closed
          at: {moment(voteLock * 1000).format("YYYY/MM/DD kk:mm")}
        </Paragraph>
      )}

      {!isVoteLockValid && (
        <Paragraph className={style.prompt}>
          You need to have voted recently in order to claim rewards
        </Paragraph>
      )}
    </>
  );
};

StakeContent.propTypes = {
  web3context: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  pools: PropTypes.object.isRequired,
  list: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
};

export default connect(mapState)(StakeContent);
