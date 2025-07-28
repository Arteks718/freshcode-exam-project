import { useEffect, useRef, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { getOffers, updateOffer } from '../../store/slices/offersSlice';
import OffersContainer from '../OffersContainer/OffersContainer';
import OffersItem from '../OffersContainer/OffersItem/OffersItem';
import ModeratorModal from './ModeratorModal/ModeratorModal';
import styles from './ModeratorDashboard.module.sass';
import CONSTANTS from '../../constants';
import TryAgain from '../TryAgain/TryAgain';

const ModeratorDashboard = (props) => {
  const {
    getOffers,
    updateOffer,
    offers,
    haveMore,
    isFetching,
    clearOffersList,
    error,
  } = props;
  const modalOpenRef = useRef(null);

  useEffect(() => {
    getOffers({ limit: 10 });
  }, [getOffers]);

  const sendOffer = useCallback(
    (status, offerId, message = '') => {
      if (status === CONSTANTS.OFFER_STATUS_DECLINED) {
        toast(`Offer#${offerId} was declined!`);
        return updateOffer({
          status,
          offerId,
          message,
        });
      } else {
        toast(`Offer#${offerId} was approved!`);
        return updateOffer({ status, offerId });
      }
    },
    [updateOffer]
  );

  const offersList = useMemo(() => {
    return offers.map((offer) => (
      <OffersItem
        data={offer}
        sendOffer={sendOffer}
        key={offer.id}
        openModal={() => modalOpenRef.current(offer.id)}
      />
    ));
  }, [offers, sendOffer]);

  const loadMore = (startFrom) => {
    if (offers.length !== 0) {
      getOffers({ limit: CONSTANTS.LIMIT_GETTING_CONTESTS, offset: startFrom });
    }
  };

  const tryLoadAgain = () => {
    clearOffersList();
    getOffers({ limit: CONSTANTS.LIMIT_GETTING_CONTESTS });
  };

  return (
    <>
      <div className={styles.mainContainer}>
        {error ? (
          <TryAgain getData={tryLoadAgain} />
        ) : (
          <OffersContainer haveMore={haveMore} loadMore={loadMore} isFetching={isFetching}>
            {offersList}
          </OffersContainer>
        )}
      </div>
      <ModeratorModal
        sendOffer={sendOffer}
        onRef={(ref) => (modalOpenRef.current = ref)}
      />
    </>
  );
};

const mapStateToProps = (state) => state.offerStore;
const mapDispatchToProps = (dispatch) => ({
  getOffers: (data) => dispatch(getOffers(data)),
  updateOffer: (offer) => dispatch(updateOffer(offer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
