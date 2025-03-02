import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import Rating from 'react-rating';
import { withRouter } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { confirmAlert } from 'react-confirm-alert';
import { MdOutlineStar, MdOutlineStarBorder } from 'react-icons/md';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import {
  changeMark,
  clearChangeMarkError,
  changeShowImage,
} from '../../store/slices/contestByIdSlice';
import CONSTANTS from '../../constants';
import styles from './OfferBox.module.sass';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './confirmStyle.css';

const OfferBox = (props) => {
  const {
    id,
    data,
    role,
    contestType,
    setOfferStatus,
    messagesPreview,
    clearError,
    changeMark,
    needButtons,
    changeShowImage,
    goToExpandedDialog
  } = props;

  const { id: offerId, mark, User, status, fileName, text } = data;
  const { id: userId, avatar, firstName, lastName, email, rating } = User;

  const conversationInfo = useMemo(() => {
    const participants = [offerId, userId].sort(
      (participant1, participant2) => participant1 - participant2
    );

    return (
      messagesPreview.find((message) =>
        isEqual(participants, message.participants)
      ) || null
    );
  }, [messagesPreview, offerId, userId]);

  const respondOffer = useCallback(
    (status) => {
      confirmAlert({
        title: 'confirm',
        message: 'Are u sure?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => setOfferStatus(userId, offerId, status),
          },
          {
            label: 'No',
          },
        ],
      });
    },
    [setOfferStatus, userId, offerId]
  );

  const onMarkChange = useCallback((value) => {
    clearError();
    changeMark({
      mark: value,
      offerId,
      isFirst: !mark,
      creatorId: userId,
    });
  }, [clearError, changeMark, mark, offerId, userId]);

  const handleGoChat = useCallback(() => {
    goToExpandedDialog({
      interlocutor: User,
      conversationData: conversationInfo,
    });
  }, [User, conversationInfo, goToExpandedDialog]);

  const offerStatus = () => {
    switch (status) {
      case CONSTANTS.OFFER_STATUS_REJECTED:
        return (
          <i
            className={classNames('fas fa-times-circle reject', styles.reject)}
          />
        );
      case CONSTANTS.OFFER_STATUS_WON:
        return (
          <i
            className={classNames(
              'fas fa-check-circle resolve',
              styles.resolve
            )}
          />
        );
      case CONSTANTS.OFFER_STATUS_REVIEW:
        return (
          <i className={classNames('fas fa-search review', styles.review)} />
        );
      case CONSTANTS.OFFER_STATUS_DECLINED:
        return (
          <i
            className={classNames(
              'fas fa-search-minus decline',
              styles.decline
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.offerContainer}>
      {offerStatus()}
      <div className={styles.mainInfoContainer}>
        <div className={styles.userInfo}>
          <div className={styles.creativeInfoContainer}>
            <img
              src={
                avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicURL}${avatar}`
              }
              alt="user"
            />
            <div className={styles.nameAndEmail}>
              <span>{`${firstName} ${lastName}`}</span>
              <span>{email}</span>
            </div>
          </div>
          <div className={styles.creativeRating}>
            <span className={styles.userScoreLabel}>Creative Rating </span>
            <Rating
              initialRating={rating}
              fractions={2}
              fullSymbol={
                <MdOutlineStar size="20" color="#556da5" alt="star" />
              }
              placeholderSymbol={
                <MdOutlineStar size="20" color="#556da5" alt="star" />
              }
              emptySymbol={
                <MdOutlineStarBorder size="20" color="#556da5" alt="star" />
              }
              readonly
            />
          </div>
        </div>
        <div className={styles.responseConainer}>
          {contestType === CONSTANTS.LOGO_CONTEST ? (
            <img
              onClick={() =>
                changeShowImage({
                  imagePath: fileName,
                  isShowOnFull: true,
                })
              }
              className={styles.responseLogo}
              src={`${CONSTANTS.publicURL}${fileName}`}
              alt="logo"
            />
          ) : (
            <span className={styles.response}>{text}</span>
          )}
          {userId !== id && (
            <Rating
              fractions={2}
              fullSymbol={
                <MdOutlineStar size="20" color="#556da5" alt="star" />
              }
              placeholderSymbol={
                <MdOutlineStar size="20" color="#556da5" alt="star" />
              }
              emptySymbol={
                <MdOutlineStarBorder size="20" color="#556da5" alt="star" />
              }
              onClick={onMarkChange}
              placeholderRating={mark}
            />
          )}
        </div>
        {role !== CONSTANTS.CREATOR && (
          <i onClick={handleGoChat} className="fas fa-comments" />
        )}
      </div>
      {needButtons(status) && (
        <div className={styles.btnsContainer}>
          <div
            onClick={() => respondOffer(CONSTANTS.OFFER_STATUS_WON)}
            className={styles.resolveBtn}
          >
            Resolve
          </div>
          <div
            onClick={() => respondOffer(CONSTANTS.OFFER_STATUS_REJECTED)}
            className={styles.rejectBtn}
          >
            Reject
          </div>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  changeMark: (data) => dispatch(changeMark(data)),
  clearError: () => dispatch(clearChangeMarkError()),
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeShowImage: (data) => dispatch(changeShowImage(data)),
});

const mapStateToProps = (state) => {
  const { changeMarkError } = state.contestByIdStore;
  const { id, role } = state.userStore.data;
  const { messagesPreview } = state.chatStore;
  return {
    changeMarkError,
    id,
    role,
    messagesPreview,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OfferBox)
);
