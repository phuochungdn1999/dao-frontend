import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { Button, Input, Modal, Form, message } from 'antd';

// configs:
import { pools as poolsList } from '../../../../configs';

// thunks:
import {
  getCreateProposeRequirements,
  createPropose,
  getProposals
} from '../../';

import style from './VoteCreate.module.scss';

const {
  success: successMessage,
  error: errorMessage,
  info: infoMessage
} = message;
const { useForm, Item } = Form;
const { TextArea } = Input;

const MAX_LENGTH = 2000;

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account
  };
};

const VoteCreate = ({ web3context, isDisabled, account }) => {
  const dispatch = useDispatch();

  const [proposeForm] = useForm();

  const [isProposalModalVisible, setIsProposalModalVisible] = useState(false);
  const [isCreateAllowed, setIsCreateAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onProposeCreate = ({ text }) => {
    setIsLoading(true);

    const result = poolsList.find(({ id }) => id === web3context?.chain);

    web3context?.instance && account?.address && result?.list && dispatch(
      createPropose({
        web3: web3context.instance,
        text,
        asset: result.list[0].tokens[0],
        account: account.address,
        onError: (error) => {
          if (error?.message) {
            console.error(error.message);

            errorMessage(error.message);
          }

          setIsLoading(false);
        },
        onConfirm: () => {
          successMessage('Proposal generated successfully.');

          dispatch(getProposals({
            web3: web3context.instance,
            asset: result.list[0].tokens[0],
            account: account.address
          }));
        },
        onSuccess: (result) => {
          successMessage(
            'The transaction to generate proposal was sent successfully.'
          );

          result && infoMessage(`Transaction hash: ${result}`);

          proposeForm?.resetFields();

          setIsProposalModalVisible(false);
          setIsLoading(false);
        }
      })
    );
  };

  const onGetCreateProposeRequirements = useCallback(
    (payload) => dispatch(getCreateProposeRequirements(payload)),
    [dispatch]
  );

  useEffect(() => {
    const result = poolsList.find(({ id }) => id === web3context?.chain);

    web3context?.instance &&
      account?.address &&
      result?.list &&
      onGetCreateProposeRequirements({
      web3: web3context.instance,
      asset: result.list[0].tokens[0],
      account: account.address,
      onError: (error) => {
        if (error?.message) {
          console.error(error.message);

          errorMessage(error.message);
        }
      },
      onSuccess: (result) => setIsCreateAllowed(result)
    });
  }, [onGetCreateProposeRequirements, account, web3context]);

  return (
    <>
      {isCreateAllowed && (
        <Button
          className={style.button}
          disabled={isDisabled}
          onClick={() => setIsProposalModalVisible(true)}
        >
          Generate a new proposal
        </Button>
      )}

      <Modal
        destroyOnClose
        className={style.modal}
        onCancel={() => setIsProposalModalVisible(false)}
        visible={isProposalModalVisible}
        footer={null}
        title="Generate a new proposal 📝"
      >
        <Form
          scrollToFirstError
          className={style.modal__form}
          onFinish={onProposeCreate}
          layout="vertical"
          name="propose"
          form={proposeForm}
        >
          <Item
            className={style.modal__form__item}
            rules={[
              {
                required: true,
                message: 'Please input the proposal text'
              },
              {
                max: MAX_LENGTH,
                message: `Text must be less than ${MAX_LENGTH} symbols`
              }
            ]}
            label="Please input a Proposal text for the act offering or suggesting something for acceptance, adoption, or performance."
            name="text"
          >
            <TextArea
              placeholder="Proposal text..."
              className={style.input}
              autoSize={{ minRows: 2, maxRows: 12 }}
            />
          </Item>

          <Button
            className={style.submit}
            htmlType="submit"
            disabled={isLoading}
            loading={isLoading}
            type="primary"
          >
            Generate proposal
          </Button>
        </Form>
      </Modal>
    </>
  );
};

VoteCreate.propTypes = {
  web3context: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  account: PropTypes.object.isRequired
};

export default connect(mapState)(VoteCreate);
