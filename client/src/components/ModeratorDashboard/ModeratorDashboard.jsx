import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import OffersContainer from '../OffersContainer/OffersContainer';
import OffersItem from '../OffersContainer/OffersItem/OffersItem';
import { getOffers } from '../../store/slices/offersSlice';
import styles from './ModeratorDashboard.module.sass';

const ModeratorDashboard = (props) => {
  const { getAllOffers, offers } = props;
  useEffect(() => {
    getAllOffers();
  }, [getAllOffers]);

  const offersList = () => {
    return offers.map((offer) => <OffersItem data={offer} />);
  };

  return (
    <div className={styles.mainContainer}>
      <OffersContainer>{offersList()}</OffersContainer>
    </div>
  );
};

const mapStateToProps = (state) => state.offerStore;
const mapDispatchToProps = (dispatch) => ({
  getAllOffers: () => dispatch(getOffers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
