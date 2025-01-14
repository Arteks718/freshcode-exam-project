import React from 'react';
import moment from 'moment';
import styles from './ContestBox.module.sass';
import CONSTANTS from '../../constants';

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

  const getTimeStr = () => {
    const diff = moment.duration(moment().diff(moment(createdAt)));
    let str = '';
    if (diff._data.days !== 0) str = `${diff._data.days}d `;
    if (diff._data.hours !== 0) str += `${diff._data.hours}h`;
    if (str.length === 0) str = 'less than one hour';
    return str;
  };

  const getPreferenceContest = () => {
    if (contestType === CONSTANTS.NAME_CONTEST) return typeOfName;
    if (contestType === CONSTANTS.LOGO_CONTEST) return brandStyle;
    return typeOfTagline;
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
            <div>
              <img
                src={`${CONSTANTS.STATIC_IMAGES_PATH}smallCheck.png`}
                alt="check"
              />
            </div>
            <span>Guaranteed prize</span>
          </div>
          <div className={styles.prize}>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}diamond.png`}
              alt="diamond"
            />
            <span>{`$${prize}`}</span>
          </div>
        </div>
      </div>
      <div className={styles.entryAndTimeContainer}>
        <div className={styles.entriesContainer}>
          <div className={styles.entriesCounter}>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}entrieImage.png`}
              alt="logo"
            />
            <span>{count}</span>
          </div>
          <span>Entries</span>
        </div>
        <div className={styles.timeContainer}>
          <span className={styles.timeContest}>{getTimeStr()}</span>
          <span>Going</span>
        </div>
      </div>
    </div>
  );
};

export default ContestBox;
