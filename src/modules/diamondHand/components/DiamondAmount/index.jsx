import React, { useState, useMemo, useCallback, useEffect } from "react";
import cx from "classnames";
import style from "./DiamondAmount.module.scss";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import StakeInput from "../../../common/components/DiamondInput";
import { ReactComponent as YFIAGIcon } from "../../assets/icons/YFIAG.svg";
import DiamondCard from "../../../common/components/DiamondCard";
import DiamondButton from "../../../common/components/DiamondButton";
import DiamondSelectBtnGroup from "../../../common/components/DiamondSelectBtnGroup";
import { useStakeDiamondHand } from "../../pages/Diamond/hooks/useStakeDiamondHand";
import { listDiamond } from "../../../../enum/enums";
import { useConfirmModalHandler } from "../../pages/Diamond/hooks/useConfirmationModalHandler";
import { ConfirmationModal } from "../../../common/components/ConfirmationModal";
import { getSixDigitsAfterComma } from "../../../../utils/getSixDigitsAfterComma";

const mapState = (state) => {
  return {
    account: state.account,
    diamond: state.diamond,
  };
};

const DiamondAmount = ({ account, diamond, t, walletBalance }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [buttons, setButtons] = useState([]);

  const [resultModal, setResultModal] = useState({
    open: false,
    message: "",
    heading: "Unstake Result",
    loading: false,
  });

  let planList = listDiamond;

  const { isConfirmModalVisible, closeConfirmModal, openConfirmModal } =
    useConfirmModalHandler();

  const { inputValue, handleInput, handleStakeSubmit, isStakingInProgress } =
    useStakeDiamondHand(
      (success) => {
        closeConfirmModal();
        if (success)
          setResultModal({
            ...resultModal,
            open: true,
            message: (
              <p>
                Stake <span style={{ color: "#8736cb" }}>successful</span>! You
                can check the transaction on BSCScan.
              </p>
            ),
          });

        if (!success)
          setResultModal({
            ...resultModal,
            open: true,
            message: (
              <p>
                Stake <span style={{ color: "#f37878" }}>unsuccessful</span>,
                please try again!
              </p>
            ),
          });
      },
      selectedPlan,
      account.address
    );

  useEffect(() => {
    if (selectedPlan) {
      let a = planList.findIndex(
        (i) => i.id.toString() === selectedPlan.toString()
      );
      if (a !== -1) {
        for (let i = 0; i < planList.length; i++) {
          planList[i].value = false;
        }
        planList[a].value = true;
      }
    }
  }, [planList, selectedPlan]);

  const maxStake = () => {
    if (isNaN(walletBalance)) return handleInput(0);
    return handleInput(walletBalance);
  };

  const onSelectedPlan = (id) => {
    console.log(id);
    setSelectedPlan(id);
  };

  const renderDiamondHand = () => {
    let listRender = listDiamond.map((item) => {
      return {
        id: item.id,
        label: (selected) => (
          <>
            <span
              className={cx(style.diamond__plan__title)}
              style={{ color: selected ? "#fff" : "#8236ce" }}
            >
              {item.months < 10 ? "0" + item.months : item.months}{" "}
              {item.months !== 1 ? "Months" : "Month"}:&nbsp;
            </span>
            <span
              className={cx(style.diamond__plan__subTitle)}
              style={{ color: selected ? "#fff" : "#8236ce" }}
            >
              {item.percent < 10 ? "0" + item.percent : item.percent}%
            </span>
          </>
        ),
      };
    });
    return listRender;
  };

  const getPlan = useCallback(() => {
    const current = listDiamond.find((i) => i.id === selectedPlan);
    if (current) {
      return { label: current.months, percentage: current.percent };
    }

    return { label: "", percentage: "" };
  }, [selectedPlan]);

  const disableStakeBtn = useMemo(() => {
    if (
      inputValue.toString() === "" ||
      inputValue.toString() === "0" ||
      selectedPlan === null
    )
      return true;

    return false;
  }, [inputValue, selectedPlan]);

  useEffect(() => {
    setButtons(renderDiamondHand);
  }, [diamond]);

  const getInputValue = useCallback(() => {
    return getSixDigitsAfterComma(inputValue);
  }, [inputValue]);

  return (
    <>
      <div className={cx(style.diamond__amount__container)}>
        <div className={cx(style.diamond__amount__item)}>
          <DiamondCard label="Amount">
            <StakeInput
              label="Stake"
              icon={<YFIAGIcon width="24px" height="24px" />}
              type="number"
              step="1"
              min="0"
              key="stake-diamond"
              subLabel="YFIAG"
              value={inputValue}
              maxBtn
              handleChange={(e) => handleInput(e.target.value)}
              handleMax={(e) => maxStake(e)}
            />
          </DiamondCard>
        </div>
      </div>
      <div className={cx(style.diamond__amount__planing)}>
        <div
          className={cx(
            style.diamond__amount__item,
            style.diamond__amount__plan
          )}
        >
          <DiamondCard label="Plan">
            <DiamondSelectBtnGroup
              buttonsArr={buttons}
              classes={cx(style.diamond__amount__customSelectBtnGroup)}
              handleSelect={onSelectedPlan}
            />
          </DiamondCard>
        </div>
        <div className={cx(style.diamond__amount__item)}>
          <DiamondCard label="Action">
            <DiamondButton
              label={"Stake"}
              handleClick={openConfirmModal}
              disabled={disableStakeBtn}
            />
          </DiamondCard>
        </div>

        <ConfirmationModal
          isOpen={resultModal.open}
          onClose={() => setResultModal({ ...resultModal, open: false })}
          heading={resultModal.heading}
          message={resultModal.message}
          loading={resultModal.loading}
          onConfirm={() => setResultModal({ ...resultModal, open: false })}
        />

        <ConfirmationModal
          isOpen={isConfirmModalVisible}
          onClose={closeConfirmModal}
          heading="Confirm Stake"
          message={`Do you want to confirm staking ${getInputValue()} YFIAG for ${
            getPlan().label < 10 ? "0" + getPlan().label : getPlan().label
          } month(s)?`}
          loading={isStakingInProgress}
          onConfirm={() => handleStakeSubmit(window.ethereum)}
        />
      </div>
    </>
  );
};

export default withTranslation()(connect(mapState)(DiamondAmount));
