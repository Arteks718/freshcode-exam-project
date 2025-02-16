import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import OffersContainer from '../OffersContainer/OffersContainer';
import OffersItem from '../OffersContainer/OffersItem/OffersItem';
import { getOffers, updateOffer } from '../../store/slices/offersSlice';
import styles from './ModeratorDashboard.module.sass';
import SpinnerLoader from '../Spinner/Spinner';

const ModeratorDashboard = (props) => {
  const { getAllOffers, updateOffer, offers, haveMore, isFetching } = props;
  useEffect(() => {
    getAllOffers({ limit: 10 });
  }, [getAllOffers]);

  const offersList = () => {
    return offers.map((offer) => (
      <OffersItem data={offer} updateOffer={updateOffer} />
    ));
  };

  const loadMore = (startFrom) => {
    getAllOffers({ limit: 10, offset: startFrom });
  };

  return (
    <div className={styles.mainContainer}>
      {!isFetching ? (
        <OffersContainer haveMore={haveMore} loadMore={loadMore}>
          {offersList()}
        </OffersContainer>
      ) : <SpinnerLoader />}
    </div>
  );
};

const mapStateToProps = (state) => state.offerStore;
const mapDispatchToProps = (dispatch) => ({
  getAllOffers: (data) => dispatch(getOffers(data)),
  updateOffer: (offer) => dispatch(updateOffer(offer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
