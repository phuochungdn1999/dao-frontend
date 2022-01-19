import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, connect } from "react-redux";
import {
  InputNumber,
  Typography,
  Button,
  Input,
  Form,
  Row,
  Col,
  message,
} from "antd";
import cx from "classnames";

// thunks:
import { getGasPrices } from "../../../dashboard";
import {
  setGovernance,
  setController,
  unpauseVault,
  pauseVault,
  earnVault,
  setMin,
} from "../../";

import style from "./VaultAdmin.module.scss";

const {
  success: successMessage,
  error: errorMessage,
  info: infoMessage,
} = message;
const { Title } = Typography;
const { useForm, Item } = Form;

const MINIMAL_AMOUNT = 0.1;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account,
    prices: state.prices,
  };
};

const VaultAdmin = ({ web3context, account, prices, asset }) => {
  const dispatch = useDispatch();

  const [governanceForm] = useForm();
  const [controllerForm] = useForm();
  const [migrateForm] = useForm();
  const [minForm] = useForm();

  const [isStrategiest, setIsStrategiest] = useState(false);
  const [isGovernance, setIsGovernance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onGovernance = ({ address }) => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        setGovernance({
          web3: web3context.instance,
          asset,
          price: prices.gas,
          account: account.address,
          address,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onSuccess: (result) => {
            successMessage("The governance was setted.");

            result && infoMessage(result);

            setIsLoading(false);
          },
        })
      );

    setIsLoading(true);
  };

  const onController = ({ address }) => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        setController({
          web3: web3context.instance,
          asset,
          price: prices.gas,
          account: account.address,
          address,
          onError: (error) => {
            if (error?.message) {
              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onSuccess: (result) => {
            successMessage("The controller was setted.");

            result && infoMessage(result);

            setIsLoading(false);
          },
        })
      );

    setIsLoading(true);
  };

  const onMigrate = ({ address }) => {
    setIsLoading(true);
  };

  const onMin = ({ amount }) => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        setMin({
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
          onSuccess: (result) => {
            successMessage("The min was setted.");

            result && infoMessage(result);

            setIsLoading(false);
          },
        })
      );

    setIsLoading(true);
  };

  const handleEarn = () => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        earnVault({
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
          onSuccess: (result) => {
            successMessage("The earn was successful.");

            result && infoMessage(result);

            setIsLoading(false);
          },
        })
      );

    setIsLoading(true);
  };

  const handleUnpause = () => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        unpauseVault({
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
          onSuccess: (result) => {
            successMessage("The unpasue was successful.");

            result && infoMessage(result);

            setIsLoading(false);
          },
        })
      );

    setIsLoading(true);
  };

  const handlePause = () => {
    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        pauseVault({
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
          onSuccess: (result) => {
            successMessage("The pasue was successful.");

            result && infoMessage(result);

            setIsLoading(false);
          },
        })
      );

    setIsLoading(true);
  };

  const onGetGasPrices = useCallback(
    (payload) => dispatch(getGasPrices(payload)),
    [dispatch]
  );

  useEffect(() => {
    web3context?.instance && onGetGasPrices({ web3: web3context.instance });
  }, [onGetGasPrices, web3context]);

  useEffect(() => {
    account?.address?.toLowerCase() === asset?.strategiest?.toLowerCase() &&
      setIsStrategiest(true);
    account?.address?.toLowerCase() === asset?.governance?.toLowerCase() &&
      setIsGovernance(true);
  }, [account, asset]);

  return (
    <>
      <Row className={style.forms}>
        <Col className={style.forms__item} span={12}>
          <Title className={style.title} level={5}>
            Set governance to the vault
          </Title>

          <Form
            scrollToFirstError
            onFinish={onGovernance}
            layout="vertical"
            name="governance"
            form={governanceForm}
          >
            <Item
              rules={[
                {
                  required: true,
                  message: "Please input new address",
                },
              ]}
              name="address"
            >
              <Input
                placeholder="Input new address..."
                className={style.input}
              />
            </Item>

            <Button
              className={style.submit}
              htmlType="submit"
              disabled={isLoading || !isGovernance}
              loading={isLoading}
              type="primary"
            >
              Set governance
            </Button>
          </Form>
        </Col>

        <Col className={style.forms__item} span={12}>
          <Title className={style.title} level={5}>
            Set controller to the vault
          </Title>

          <Form
            scrollToFirstError
            onFinish={onController}
            layout="vertical"
            name="controller"
            form={controllerForm}
          >
            <Item
              rules={[
                {
                  required: true,
                  message: "Please input new address",
                },
              ]}
              name="address"
            >
              <Input
                placeholder="Input new address..."
                className={style.input}
              />
            </Item>

            <Button
              className={style.submit}
              htmlType="submit"
              disabled={isLoading || !isGovernance}
              loading={isLoading}
              type="primary"
            >
              Set controller
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className={style.forms}>
        <Col className={style.forms__item} span={12}>
          <Title className={style.title} level={5}>
            Set min to the vault
          </Title>

          <Form
            scrollToFirstError
            onFinish={onMin}
            layout="vertical"
            name="min"
            form={minForm}
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
                  message: `Amount must be more than ${MINIMAL_AMOUNT}%`,
                },
                {
                  type: "number",
                  max: 100,
                  message: `Amount must be less than 100%`,
                },
              ]}
              name="amount"
            >
              <InputNumber
                min={MINIMAL_AMOUNT}
                step={MINIMAL_AMOUNT}
                type="number"
                pattern="[0-9]*"
                disabled={!asset.balance}
                inputmode="numeric"
                className={cx(style.input, style.input_number)}
                placeholder="0"
              />
            </Item>

            <Button
              className={style.submit}
              htmlType="submit"
              disabled={isLoading || !isGovernance}
              loading={isLoading}
              type="primary"
            >
              Set min
            </Button>
          </Form>
        </Col>

        <Col className={style.forms__item} span={12}>
          <Title className={style.title} level={5}>
            Migrate to a new address
          </Title>

          <Form
            scrollToFirstError
            onFinish={onMigrate}
            layout="vertical"
            name="migrate"
            form={migrateForm}
          >
            <Item
              rules={[
                {
                  required: true,
                  message: "Please input new address",
                },
              ]}
              name="address"
            >
              <Input
                placeholder="Input new address..."
                className={style.input}
              />
            </Item>

            <Button
              className={style.submit}
              htmlType="submit"
              disabled={isLoading || !isStrategiest}
              loading={isLoading}
              type="primary"
            >
              Migrate
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className={style.actions} justify="space-between" align="middle">
        <Button
          className={style.button}
          disabled={
            isLoading || asset?.paused || (!isStrategiest && !isGovernance)
          }
          loading={isLoading}
          onClick={handleEarn}
        >
          Earn
        </Button>

        <Button
          className={style.submit}
          disabled={isLoading || (!isStrategiest && !isGovernance)}
          loading={isLoading}
          onClick={asset?.paused ? handleUnpause : handlePause}
          type="primary"
        >
          {asset?.paused ? "Unpause" : "Pause"}
        </Button>
      </Row>
    </>
  );
};

VaultAdmin.propTypes = {
  web3context: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  asset: PropTypes.object.isRequired,
};

export default connect(mapState)(VaultAdmin);
