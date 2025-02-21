import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import LightBox from 'react-18-image-lightbox';
import { IoMdArrowDropdown } from 'react-icons/io';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import {
  getContestById,
  setOfferStatus,
  clearSetOfferStatusError,
  changeEditContest,
  changeContestViewMode,
  changeShowImage,
} from '../../store/slices/contestByIdSlice';
import Header from '../../components/Header/Header';
import ContestSideBar from '../../components/ContestSideBar/ContestSideBar';
import styles from './ContestPage.module.sass';
import OfferBox from '../../components/OfferBox/OfferBox';
import OfferForm from '../../components/OfferForm/OfferForm';
import CONSTANTS from '../../constants';
import Brief from '../../components/Brief/Brief';
import Spinner from '../../components/Spinner/Spinner';
import TryAgain from '../../components/TryAgain/TryAgain';
import 'react-18-image-lightbox/style.css';
import Error from '../../components/Error/Error';

const ContestPage = (props) => {
  const {
    getData,
    goToExpandedDialog,
    clearSetOfferStatusError,
    contestByIdStore,
    changeShowImage,
    changeContestViewMode,
    userStore,
    chatStore,
    setOfferStatus,
  } = props;

  const getDataForContest = () => {
    const { params } = props.match;
    getData({ contestId: params.id });
  };

  useEffect(() => {
    getDataForContest();

    return () => {
      changeEditContest(false);
    };
  }, []);

  const setStatsOffers = () => {
    const { onReviewCount, rejectedCount } = contestByIdStore.contestData;
    const array = [];
    if (onReviewCount) {
      array.push(
        <div className={styles.statReview}>
          <span>On review</span>
          <span className={styles.statCount}>{onReviewCount}</span>
        </div>
      );
    }
    if (rejectedCount) {
      array.push(
        <div className={styles.statRejected}>
          <span>Rejected by you</span>
          <span className={styles.statCount}>{rejectedCount}</span>
        </div>
      );
    }

    return array.length !== 0 ? (
      <div className={styles.statsContainer}>
        <span className={styles.statsLabel}>
          STATS <IoMdArrowDropdown />
        </span>
        <div className={styles.stats}>{array}</div>
      </div>
    ) : null;
  };

  const setOffersList = () => {
    const { role } = userStore.data;
    const roleFilter = (offer) =>
      role === CONSTANTS.CUSTOMER
        ? offer.status !== CONSTANTS.OFFER_STATUS_DECLINED &&
          offer.status !== CONSTANTS.OFFER_STATUS_REVIEW
        : true;

    const array = contestByIdStore.offers
      .filter(roleFilter)
      .map((offer) => (
        <OfferBox
          data={offer}
          key={offer.id}
          needButtons={needButtons}
          setOfferStatus={handleSetOfferStatus}
          contestType={contestByIdStore.contestData.contestType}
          date={new Date()}
        />
      ));

    return array.length !== 0 ? (
      array
    ) : (
      <div className={styles.notFound}>
        There is no suggestion at this moment
      </div>
    );
  };

  const needButtons = (offerStatus) => {
    const contestCreatorId = contestByIdStore.contestData.User.id;
    const userId = userStore.data.id;
    const contestStatus = contestByIdStore.contestData.status;
    return (
      contestCreatorId === userId &&
      contestStatus === CONSTANTS.CONTEST_STATUS_ACTIVE &&
      offerStatus === CONSTANTS.OFFER_STATUS_APPROVED
    );
  };

  const handleSetOfferStatus = (creatorId, offerId, command) => {
    clearSetOfferStatusError();
    const { id, orderId, priority } = contestByIdStore.contestData;
    const obj = {
      command,
      offerId,
      creatorId,
      orderId,
      priority,
      contestId: id,
    };
    setOfferStatus(obj);
  };

  const findConversationInfo = (interlocutorId) => {
    const { messagesPreview } = chatStore;
    const { id } = userStore.data;
    const participants = [id, interlocutorId];
    participants.sort(
      (participant1, participant2) => participant1 - participant2
    );
    for (let i = 0; i < messagesPreview.length; i++) {
      if (isEqual(participants, messagesPreview[i].participants)) {
        return {
          participants: messagesPreview[i].participants,
          id: messagesPreview[i].id,
          blackList: messagesPreview[i].blackList,
          favoriteList: messagesPreview[i].favoriteList,
        };
      }
    }
    return null;
  };

  const goChat = () => {
    const { User } = contestByIdStore.contestData;
    goToExpandedDialog({
      interlocutor: User,
      conversationData: findConversationInfo(User.id),
    });
  };

  const {
    isShowOnFull,
    imagePath,
    error,
    isFetching,
    isBrief,
    contestData,
    offers,
    setOfferStatusError,
  } = contestByIdStore;
  const { role } = userStore.data;

  return (
    <div>
      {/* <Chat/> */}
      {isShowOnFull && (
        <LightBox
          mainSrc={`${CONSTANTS.publicURL}${imagePath}`}
          onCloseRequest={() =>
            changeShowImage({ isShowOnFull: false, imagePath: null })
          }
        />
      )}
      <Header />
      {error ? (
        <div className={styles.tryContainer}>
          <TryAgain getData={getData} />
        </div>
      ) : isFetching ? (
        <div className={styles.containerSpinner}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.mainInfoContainer}>
          <div className={styles.infoContainer}>
            <div className={styles.buttonsContainer}>
              <span
                onClick={() => changeContestViewMode(true)}
                className={classNames(styles.btn, {
                  [styles.activeBtn]: isBrief,
                })}
              >
                Brief
              </span>
              <span
                onClick={() => changeContestViewMode(false)}
                className={classNames(styles.btn, {
                  [styles.activeBtn]: !isBrief,
                })}
              >
                Offer
              </span>
            </div>
            {isBrief ? (
              <Brief contestData={contestData} role={role} goChat={goChat} />
            ) : (
              <div className={styles.offersContainer}>
                {role === CONSTANTS.CREATOR &&
                  contestData.status === CONSTANTS.CONTEST_STATUS_ACTIVE && (
                    <OfferForm
                      contestType={contestData.contestType}
                      contestId={contestData.id}
                      customerId={contestData.User.id}
                    />
                  )}
                {role === CONSTANTS.CUSTOMER && setStatsOffers()}
                {setOfferStatusError && (
                  <Error
                    data={setOfferStatusError.data}
                    status={setOfferStatusError.status}
                    clearError={clearSetOfferStatusError}
                  />
                )}
                <div className={styles.offers}>{setOffersList()}</div>
              </div>
            )}
          </div>
          <ContestSideBar
            contestData={contestData}
            totalEntries={offers.length}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { contestByIdStore, userStore, chatStore } = state;
  return { contestByIdStore, userStore, chatStore };
};

const mapDispatchToProps = (dispatch) => ({
  getData: (data) => dispatch(getContestById(data)),
  setOfferStatus: (data) => dispatch(setOfferStatus(data)),
  clearSetOfferStatusError: () => dispatch(clearSetOfferStatusError()),
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeEditContest: (data) => dispatch(changeEditContest(data)),
  changeContestViewMode: (data) => dispatch(changeContestViewMode(data)),
  changeShowImage: (data) => dispatch(changeShowImage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContestPage);
