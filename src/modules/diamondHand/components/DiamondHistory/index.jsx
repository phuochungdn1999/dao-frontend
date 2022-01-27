import React, { useEffect, useState, useMemo, useCallback } from "react";
import cx from "classnames";
import style from "./DiamondHistory.module.scss";

import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import DiamondCard from "../../../common/components/DiamondCard";
import DiamondTable from "../../../common/components/DiamondTable";
import { ReactComponent as YFIAGIcon } from "../../assets/icons/YFIAG.svg";
import DiamondButton from "../../../common/components/DiamondButton";
import moment from "moment";
import { useConfirmModalHandler } from "../../pages/Diamond/hooks/useConfirmationModalHandler";
import { useUnstakeDiamondHand } from "../../pages/Diamond/hooks/useUnstakeDiamondHand";
import { ConfirmationModal } from "../../../common/components/ConfirmationModal";
import { DiamondHandService } from "../../../../api/diamondHand.service";
import { Spinner } from "../../../common/components/Spinner";
import styled from "styled-components";

import { dev } from "../../../../configs/config";

const mapState = (state) => {
  return {
    web3context: state.web3context,
    account: state.account,
    pools: state.pools,
  };
};

const Header = [
  {
    id: 1,
    label: (
      <span>
        Amount <YFIAGIcon width="20px" height="20px" />{" "}
      </span>
    ),
  },
  { id: 2, label: "Plan - %" },
  { id: 3, label: "Due Date" },
  { id: 4, label: "Earn" },
  { id: 5, label: "Action" },
];

const DiamondHistory = ({ account, poolData, refetch, theme }) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [unstakingButton, setUnstakingButton] = useState(null);
  const [loadingEarning, setLoadingEarning] = useState(true);
  const [userPool, setUserPool] = useState([]);
  const [resultModal, setResultModal] = useState({
    open: false,
    message: (
      <p>
        Claim <span style={{ color: "#8736cb" }}>successful</span>! Check your
        Wallet balance.
      </p>
    ),
    heading: "Unstake Result",
    loading: false,
  });

  const { isConfirmModalVisible, closeConfirmModal, openConfirmModal } =
    useConfirmModalHandler();

  const { handleUnstakeSubmit, isUnstakingInProgress } = useUnstakeDiamondHand(
    () => {
      setResultModal({
        ...resultModal,
        open: true,
      });
      setTimeout(() => {
        refetch();
        setLoadingEarning(true)
      }, 5000);
    },
    (unstakeSuccess) => {
      if (unstakeSuccess) {
        setResultModal({
          ...resultModal,
          open: true,
          message: (
            <p>
              Claim <span style={{ color: "#f37878" }}>unsuccessful</span>,
              please try again!
            </p>
          ),
        });
      }

      closeConfirmModal();
    },
    unstakingButton
  );

  useEffect(() => {
    setInterval(() => {
      refetch();
      setLoadingEarning(true)
    }, 180000);
  }, [refetch]);

  const getPlan = (apy) => {
    let plan = "";
    switch (apy) {
      case "2":
        plan = "01 Months - 02%";
        break;
      case "10":
        plan = "03 Months - 10%";
        break;
      case "30":
        plan = "06 Months - 30%";
        break;
      case "60":
        plan = "12 Months - 60%";
        break;
      default:
        plan = "";
    }
    return plan;
  };

  const handleUnstake = useCallback(
    (poolId) => {
      setUnstakingButton(poolId);
      openConfirmModal();
    },
    [openConfirmModal]
  );

  const getDueDate = (momentUnixTimeStakeAt, duration) => {
    let dueDate = moment.unix(momentUnixTimeStakeAt).add(duration, "s");
    return dueDate;
  };

  const disableClaimBtn = (dueDate, claimed, id) => {
    const today = moment();

    if (today.isAfter(dueDate) && !claimed && unstakingButton !== id) {
      return false;
    }

    return true;
  };

  const fetchEarnedTokenById = async (id) => {
    try {
      const response = await DiamondHandService.toClaimV2(id, window.ethereum);

      return response.toFixed(4) || 0;
    } catch (e) {
      console.error(e);
    }
  };

  const fetchToken = async (id) => {
    let earned = await fetchEarnedTokenById(parseInt(id));
    return earned;
  };

  useEffect(() => {
    const generatePool = async () => {
      let tempPool = [];
      if (poolData?.users.length > 0) {
        let pools = [...poolData.users[0].userPools];
        pools.sort((a, b) => moment.unix(b.id) - moment.unix(a.id));

        for (let i = 0; i < pools.length; i++) {
          let current = pools[i];
          const currentDueDate = getDueDate(
            current.depositedAt,
            current.duration
          );

          const earned = await fetchToken(current.id);

          tempPool[i] = {
            id: current.id,
            cells: {
              amount: current.amount / 10 ** 18,
              plan: getPlan(pools[i].apy),
              dueDate: getDueDate(current.depositedAt, current.duration).format(
                "Do MMM, YYYY hh:mm:ss"
              ),
              earn: earned,
              action: (
                <DiamondButton
                  label={current.claimed ? "Claimed" : "Claim"}
                  disabled={disableClaimBtn(
                    currentDueDate,
                    current.claimed,
                    current.id
                  )}
                  handleClick={() => {
                    handleUnstake(current.id);
                  }}
                  btnStyle={{ height: 40 }}
                />
              ),
            },
          };
        }
      }
      setUserPool(tempPool);
      setLoadingEarning(false);
    };

    setLoadingEarning(true);
    generatePool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolData]);

  useEffect(() => {
    if (poolData?.users.length > 0) {
      let pools = [...poolData.users[0].userPools];

      console.log("before: ", pools);
      pools.sort((a, b) => moment.unix(a.id) - moment.unix(b.id));

      console.log("after: ", pools);
    }
  }, [poolData]);

  const getPagesLength = useMemo(() => {
    return userPool.length % rowsPerPage === 0
      ? userPool.length / rowsPerPage
      : parseInt(userPool.length / rowsPerPage) + 1;
  }, [rowsPerPage, userPool]);

  const getDataPagination = useMemo(() => {
    if (userPool.length > 0)
      return userPool.slice(
        currentPage * rowsPerPage,
        rowsPerPage + currentPage * rowsPerPage
      );

    return [];
  }, [currentPage, rowsPerPage, userPool]);

  const renderTable = useCallback(() => {
    if (getDataPagination.length > 0 && !loadingEarning)
      return (
        <DiamondTable
          headers={Header}
          data={getDataPagination}
          showIndex
          pagination
          rowsPerPage={rowsPerPage}
          pagesLength={getPagesLength}
          currentPage={currentPage}
          handleChangePage={(page) => setCurrentPage(page)}
          handleRowsPerPage={(rpp) => setRowsPerPage(rpp)}
          theme={theme}
        />
      );

    if (loadingEarning)
      return (
        <>
          <Spinner />
        </>
      );

    if (!loadingEarning && getDataPagination.length === 0) {
      return (
        <h5
          style={{
            textAlign: "center",
            color: theme?.isDarkmode ? "#fff" : "#8763cb",
          }}
        >
          No Data
        </h5>
      );
    }
  }, [
    currentPage,
    getDataPagination,
    getPagesLength,
    loadingEarning,
    rowsPerPage,
    theme,
  ]);

  return (
    <>
      <div className={cx(style.diamond_history_container)}>
        <DiamondCard
          classes={cx(
            style.diamond__history__cardLabel,
            theme?.isDarkmode && style.diamond__history__darkCardLabel
          )}
          label=""
          theme={theme}
        >
          {renderTable()}
        </DiamondCard>
        <Disclaimer>
          <p>
            Data provided using{" "}
            <a href="https://thegraph.com/en/" target="_blank" rel="noreferrer">
              The Graph's service
            </a>
            . Due to network traffic, data might be temporary out of sync.
          </p>
          <p>
            Your stakes are safe as long as the transactions were successful.
            You can check it on{" "}
            <a
              href={
                dev()
                  ? `https://testnet.bscscan.com/address/${account.address}`
                  : `https://testnet.bscscan.com/address/${account.address}`
                //TODO: `https://bscscan.com/address/${account.address}`
              }
              target="_blank"
              rel="noreferrer"
            >
              BSCScan
            </a>
            .
          </p>
        </Disclaimer>
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
        heading="Confirm Unstake"
        message={`Do you want to confirm unstaking?`}
        loading={isUnstakingInProgress}
        onConfirm={() => handleUnstakeSubmit(window.ethereum)}
      />
    </>
  );
};

export default withTranslation()(connect(mapState)(DiamondHistory));

const Disclaimer = styled.div`
  margin: 1rem 0;
  text-align: center;
`;
