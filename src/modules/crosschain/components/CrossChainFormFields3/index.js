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
import approveMember from "../../thunks/approveMember";
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

const CrossChainFormFields2 = ({
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
        approveMember({
          web3: web3context.instance,
          asset: crosschain.chain,
          price: prices.gas,
          amount,
          address,
          account: account.address,
          vote,
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
  const disableApprove = (data)=>{
    console.log("!data?.isAdmin && data?.pendingMembersArr.length !== 0",!(!data?.isAdmin[0] && data?.pendingMembersArr[0].length === 0));
    if (data?.isAdmin[0]){
      if (data?.pendingMembersArr[0].length !== 0){
        return false;
      }
    }
    return true;
  }

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
        List pending members
      </Title>
      {console.log(
        "list pending members: ",
        crosschain?.chain?.pendingMembersArr
      )}
      {crosschain?.chain?.pendingMembersArr[0].map((member) => {
        console.log("MMMMM",member)
        return (
          <Title className={style.subtitle} level={5}>
            {member}
          </Title>
        );
      })}

      <Button
        className={style.submit}
        htmlType="submit"
        disabled={isLoading || disableApprove(crosschain?.chain)}
        loading={isLoading}
        type="primary"
      >
        Approve
      </Button>
    </Form>
  );
};

CrossChainFormFields2.propTypes = {
  availableChain: PropTypes.object.isRequired,
  web3context: PropTypes.object.isRequired,
  crosschain: PropTypes.object.isRequired,
  className: PropTypes.string,
  prices: PropTypes.object.isRequired,
  chains: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(connect(mapState)(CrossChainFormFields2));
