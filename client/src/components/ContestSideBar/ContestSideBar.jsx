import React from 'react';
import { connect } from 'react-redux';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { GrDiamond } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa6";
import styles from './ContestSideBar.module.sass';
import CONSTANTS from '../../constants';
import { getTimeStr } from '../../utils/dateUtils';

const ContestSideBar = (props) => {
  const { totalEntries } = props;
  const { User, prize, createdAt } = props.contestData;
  // TODO Change images to icon
  return (
    <div className={styles.contestSideBarInfo}>
      <div className={styles.contestInfo}>
        <div className={styles.awardAndTimeContainer}>
          <div className={styles.prizeContainer}>
            <GrDiamond />
            <span>{`$ ${prize}`}</span>
          </div>
          <div className={styles.timeContainer}>
            <div className={styles.timeDesc}>
              <FaRegClock />
              <span>Going</span>
            </div>
            <span className={styles.time}>{getTimeStr(createdAt, true)}</span>
          </div>
          <div className={styles.guaranteedPrize}>
            <IoCheckmarkCircle />
            <span>Guaranteed prize</span>
          </div>
        </div>
        <div className={styles.contestStats}>
          <span>Contest Stats</span>
          <div className={styles.totalEntrie}>
            <span className={styles.totalEntriesLabel}>Total Entries</span>
            <span>{totalEntries}</span>
          </div>
        </div>
      </div>
      {props.data.id !== User.id && (
        <div className={styles.infoCustomerContainer}>
          <span className={styles.labelCustomerInfo}>About Contest Holder</span>
          <div className={styles.customerInfo}>
            <img
              src={
                User.avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicURL}${User.avatar}`
              }
              alt="user"
            />
            <div className={styles.customerNameContainer}>
              <span>{`${User.firstName} ${User.lastName}`}</span>
              <span>{User.displayName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => state.userStore;

export default connect(mapStateToProps, null)(ContestSideBar);
