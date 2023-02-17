import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  InputNumber,
  Typography,
  Radio,
  Button,
  Input,
  Form,
  message,
} from "antd";
import cx from "classnames";

// configs:
import { crosschain as crosschainList } from "../../../../configs";

// thunks:
import { getCrossChainBalances, checkTransaction, sendTokens } from "../../";

import style from "./CrossChainFormFields.module.scss";
import sendVotes from "../../thunks/sendVote";
import joinDAO from "../../thunks/joinDao";
const { Group: RadioGroup, Button: RadioButton } = Radio;

const voteParts = [
  {
    name: "Yes",
    value: "true",
  },
  {
    name: "No",
    value: "false",
  },
];

const {
  success: successMessage,
  error: errorMessage,
  info: infoMessage,
} = message;
const { Title } = Typography;
const { useForm, Item } = Form;

const mapState = (state) => {
  console.log("state", state);
  return {
    web3context: state.web3context,
    crosschain: state.crosschain,
    account: state.account,
    prices: state.prices,
    chains: state.chains,
  };
};

const CrossChainFormFields4 = ({
  availableChain,
  web3context,
  crosschain,
  className,
  account,
  prices,
  chains,
  t,
  proposal,
}) => {
  const dispatch = useDispatch();

  const [crosschainForm] = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const [vote, setVote] = useState({});

  const handleCrossChainAmount = (value, vote) => {
    crosschainForm.setFieldsValue({ amount: value });
    crosschainForm.setFieldsValue({ vote: vote });
    console.log("handleCrossChainAmount", vote);
  };

  console.log("crosschain: ", crosschain);

  const checkTransactions = (asset, nonce, chains, chainId, account) => {
    dispatch(
      checkTransaction({
        asset,
        nonce,
        chains,
        chainId,
        account,
        onError: (error) => {
          errorMessage(error.message);
        },
        onSuccess: (result) => {
          if (result) {
            successMessage("The cross-chain transaction was completed.");
          } else {
            setTimeout(
              () => checkTransactions(asset, nonce, chains, chainId, account),
              1000
            );
          }
        },
      })
    );
  };

  const onFinish = ({ address, amount }) => {
    console.log("RUNNNNN", vote, address, amount);
    setIsLoading(true);

    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        joinDAO({
          web3: web3context.instance,
          asset: crosschain.chain,
          price: prices.gas,
          amount,
          address,
          account: account.address,
          onError: (error) => {
            if (error?.message) {
              console.log("error", error.message);

              errorMessage(error.message);
            }

            setIsLoading(false);
          },
          onConfirm: ({ nonce, hash }) => {
            successMessage("The cross-chain sending was successful.");

            web3context.instance &&
              account.address &&
              availableChain &&
              dispatch(
                getCrossChainBalances({
                  web3: web3context.instance,
                  asset: availableChain,
                  account: account.address,
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
              "The transaction to cross-chain sending was sent successfully."
            );

            result && infoMessage(`Transaction hash: ${result}`);

            setIsLoading(false);

            crosschainForm.setFieldsValue({ stakeAmount: 0 });
          },
        })
      );
  };

  const disableJoinDao = (data,account) => {
    console.log(
      "!data?.isAdmin && data?.pendingMembersArr.length !== 0",
      !(!data?.isAdmin[0] && data?.pendingMembersArr[0].length === 0)
    );
    if (!data?.isAdmin[0]) {
      // data?.pendingMembersArr[0].forEach((element) => {
        for(let i=0; i< data?.pendingMembersArr[0].length;i++){
          if (
            String(data?.pendingMembersArr[0][i]).toLocaleLowerCase() ===
            String(account.address).toLocaleLowerCase()
          ) {
            return true;
          }
        }
    }
    return false;
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
      <Title className={style.subtitle} level={5}>
        Join DAO
      </Title>
{console.log("disableJoinDao(crosschain?.chain,account)",disableJoinDao(crosschain?.chain,account))}
      <Button
        className={style.submit}
        htmlType="submit"
        disabled={isLoading || disableJoinDao(crosschain?.chain,account)}
        loading={isLoading}
        type="primary"
      >
        Join
      </Button>
    </Form>
  );
};

CrossChainFormFields4.propTypes = {
  availableChain: PropTypes.object.isRequired,
  web3context: PropTypes.object.isRequired,
  crosschain: PropTypes.object.isRequired,
  className: PropTypes.string,
  prices: PropTypes.object.isRequired,
  chains: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(connect(mapState)(CrossChainFormFields4));
