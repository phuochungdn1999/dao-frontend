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
import closeVote from "../../thunks/closeVote";
const { Group: RadioGroup, Button: RadioButton } = Radio;

const voteParts = [
  {
    name: "Yes",
    value: true,
  },
  {
    name: "No",
    value: false,
  },
];

const {
  success: successMessage,
  error: errorMessage,
  info: infoMessage,
} = message;
const { Title } = Typography;
const { useForm, Item } = Form;

const MINIMAL_AMOUNT = 0.1;

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

// const

const CrossChainFormFields1 = ({
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
        sendVotes({
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

  const onClose = ({ address, amount }) => {
    console.log("RUNNNNN", vote, address, amount);
    setIsLoading(true);

    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        closeVote({
          web3: web3context.instance,
          asset: crosschain.chain,
          price: prices.gas,
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

  const disabledSubmit = (proposal) => {
    if (proposal.proposalId === vote?.proposalId) {
      const date = new Date(proposal.endAt);
      if (proposal.endAt * 1000 > new Date().getTime()) {
        return false;
      }
      return true;
    }
    return true;
  };

  const disabledClose = (proposal) => {
    if (crosschain?.chain?.isAdmin[0]) {
      return proposal?.isEnded || proposal.isClosedByAdmin;
    }
    return true;
  };

  const result = (proposal) => {
    return proposal.isEnded || proposal.isClosedByAdmin
      ? proposal.isAccepted
        ? "Approved"
        : "Rejected"
      : "InProgress";
  };

  return (
    <>
      {crosschain?.chain?.proposalData.map((proposal) => {
        return (
          <>
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
                Proposal ID: {proposal?.proposalId || ""}
              </Title>

              <Title className={style.subtitle} level={5}>
                Name: {proposal?.name || ""}
              </Title>

              <Title className={style.subtitle} level={5}>
                Description: {proposal?.description || ""}
              </Title>

              <Title className={style.subtitle} level={5}>
                Number of votes: {proposal?.numberOfVoters || ""}
              </Title>

              <Title className={style.subtitle} level={5}>
                Accept votes: {proposal?.acceptedVotes || ""}
              </Title>

              <Title className={style.subtitle} level={5}>
                Reject votes:{" "}
                {parseInt(proposal?.numberOfVoters) -
                  parseInt(proposal?.acceptedVotes) || 0}
              </Title>

              <Title className={style.subtitle} level={5}>
                Result: {result(proposal)}
              </Title>
              {console.log("proposal?.endAt", proposal?.endAt)}

              <Title className={style.subtitle} level={5}>
                Closed at:{" "}
                {new Date(parseInt(proposal?.endAt) * 1000).toString()}
              </Title>

              <RadioGroup
                onChange={(value) => {
                  setVote({
                    value: value?.target?.value,
                    proposalId: proposal?.proposalId,
                  });
                }}
                value={voteParts}
              >
                {console.log("vote: ", vote)}
                {voteParts.map(({ name, value }) => (
                  <RadioButton
                    className={style.submit}
                    disabled={isLoading || !prices?.gas}
                    value={value}
                    key={value}
                  >
                    {name}
                  </RadioButton>
                ))}
              </RadioGroup>

              <Button
                className={style.submit}
                htmlType="submit"
                disabled={isLoading || disabledSubmit(proposal)}
                loading={isLoading}
                type="primary"
              >
                Vote
              </Button>
              <Button
                className={style.submit}
                // htmlType="submit"
                onClick={onClose}
                disabled={isLoading || disabledClose(proposal)}
                loading={isLoading}
                type="primary"
              >
                Close
              </Button>
            </Form>
          </>
        );
      })}
    </>
  );
};

CrossChainFormFields1.propTypes = {
  availableChain: PropTypes.object.isRequired,
  web3context: PropTypes.object.isRequired,
  crosschain: PropTypes.object.isRequired,
  className: PropTypes.string,
  prices: PropTypes.object.isRequired,
  chains: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(connect(mapState)(CrossChainFormFields1));
