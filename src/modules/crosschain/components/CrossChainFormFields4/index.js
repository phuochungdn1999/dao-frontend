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
  DatePicker
} from "antd";
import cx from "classnames";

// configs:
import { crosschain as crosschainList } from "../../../../configs";

// thunks:
import { getCrossChainBalances, checkTransaction, sendTokens } from "../../";

import style from "./CrossChainFormFields.module.scss";
import createProposal from "../../thunks/createProposal";

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

const CrossChainFormFields3 = ({
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

  const [date, setDate] = useState("");

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");



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

  const onFinish = ({ name, description }) => {
    console.log("RUNNNNN", name, description, new Date(date).getTime() / 1000);
    const endAt =  Math.floor(new Date(date).getTime() / 1000)
    setIsLoading(true);

    web3context?.instance &&
      account?.address &&
      prices?.gas &&
      dispatch(
        createProposal({
          web3: web3context.instance,
          asset: crosschain.chain,
          price: prices.gas,
          name,
          description,
          endAt,
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

  const disabledSubmit = (proposalId) => {
    return !(proposalId === vote?.proposalId);
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

  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    setDate(dateString);
  };

  const setCreateProposal = () => {
    console.log("!(date.length !== 0) && !(name.length !== 0) && !(description.length !== 0)",!(date.length !== 0) && !(name.length !== 0) && !(description.length !== 0))
    return !(date.length !== 0) && !(name.length !== 0) && !(description.length !== 0)
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
        level={5}
      >
        Crete new proposal        
      </Title>

      <Item
        className={style.container__item}
        rules={[
          {
            required: true,
            requiredMark: false,
            message: "Please input name",
          },
        ]}
        label="Name:"
        name="name"
      >
        <Input placeholder="Input name..." className={style.input} />
      </Item>

      <Item
        className={style.container__item}
        rules={[
          {
            required: true,
            requiredMark: false,
            message: "Please input description",
          },
        ]}
        label="Description:"
        name="description"
      >
        <Input placeholder="Input description..." className={style.input} />
      </Item>

      {/* <Item
        className={style.container__item}
        rules={[
          {
            required: true,
            requiredMark: false,
            message: "Please input date",
          },
        ]}
        label="Date:"
        name="date"
      > */}
        <DatePicker showTime onChange={onChange} className={style.input}/>
      {/* </Item> */}

      <Button
        className={style.submit}
        htmlType="submit"
        disabled={isLoading || setCreateProposal()}
        loading={isLoading}
        type="primary"
      >
        Create
      </Button>
    </Form>
  );
};

CrossChainFormFields3.propTypes = {
  availableChain: PropTypes.object.isRequired,
  web3context: PropTypes.object.isRequired,
  crosschain: PropTypes.object.isRequired,
  className: PropTypes.string,
  prices: PropTypes.object.isRequired,
  chains: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(connect(mapState)(CrossChainFormFields3));
