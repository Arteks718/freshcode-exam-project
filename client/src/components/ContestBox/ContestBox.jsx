import React from 'react';
import { IoDiamondOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import styles from './ContestBox.module.sass';
import CONSTANTS from '../../constants';
import { getTimeStr } from '../../utils/dateUtils';

const ContestBox = (props) => {
  const { history, goToExtended } = props;
  const {
    id,
    title,
    contestType,
    typeOfName,
    brandStyle,
    typeOfTagline,
    prize,
    count,
    createdAt,
  } = props.data;


  const getPreferenceContest = () => {
    switch (contestType) {
      case CONSTANTS.NAME_CONTEST:
        return typeOfName;
      case CONSTANTS.LOGO_CONTEST:
        return brandStyle;
      default:
        return typeOfTagline;
    }
  };

  const ucFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <div
      className={styles.contestBoxContainer}
      onClick={() => goToExtended(history, id)}
    >
      <div className={styles.mainContestInfo}>
        <div className={styles.titleAndIdContainer}>
          <span className={styles.title}>{title}</span>
          <span className={styles.id}>{`(#${id})`}</span>
        </div>
        <div className={styles.contestType}>
          <span>{`${ucFirstLetter(
            contestType
          )} / ${getPreferenceContest()}`}</span>
        </div>
        <div className={styles.contestType}>
          <span>
            This is an Invitation Only Contest and is only open to those
            Creatives who have achieved a Tier A status.
          </span>
        </div>
        <div className={styles.prizeContainer}>
          <div className={styles.guaranteedContainer}>
            <IoCheckmarkCircle />
            <span>Guaranteed prize</span>
          </div>
          <div className={styles.prize}>
            <IoDiamondOutline />
            <span>{`$${prize}`}</span>
          </div>
        </div>
      </div>
      <div className={styles.entryAndTimeContainer}>
        <div className={styles.entriesContainer}>
          <div className={styles.entriesCounter}>
            <FaUser />
            <span>{count}</span>
          </div>
          <span>Entries</span>
        </div>
        <div className={styles.timeContainer}>
          <span className={styles.timeContest}>{getTimeStr(createdAt)}</span>
          <span>Going</span>
        </div>
      </div>
    </div>
  );
};

export default ContestBox;
