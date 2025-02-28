import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

import OffersContainer from '../OffersContainer/OffersContainer';
import OffersItem from '../OffersContainer/OffersItem/OffersItem';
import { getOffers, updateOffer } from '../../store/slices/offersSlice';
import styles from './ModeratorDashboard.module.sass';
import SpinnerLoader from '../Spinner/Spinner';
import CONSTANTS from '../../constants';

const ModeratorDashboard = (props) => {
  const { getOffers, updateOffer, offers, haveMore, isFetching } = props;
  const [open, setOpen] = useState(false);
  const [currentOfferId, setCurrentOfferId] = useState(null);

  const handleOpen = (offerId) => {
    setCurrentOfferId(offerId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentOfferId(null);
  };

  useEffect(() => {
    getOffers({ limit: 10 });
  }, [getOffers]);

  const sendOffer = (status, offerId, message = '') => {


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
  };

  const offersList = () => {
    return offers.map((offer) => (
      <OffersItem
        data={offer}
        sendOffer={sendOffer}
        key={offer.id}
        openModal={() => handleOpen(offer.id)}
      />
    ));
  };

  const loadMore = (startFrom) => {
    if(offers.length !== 0) {
      getOffers({ limit: 10, offset: startFrom });
    }
  };

  return (
    <>
      <div className={styles.mainContainer}>
        {!isFetching ? (
          <OffersContainer haveMore={haveMore} loadMore={loadMore}>
            {offersList()}
          </OffersContainer>
        ) : (
          <SpinnerLoader />
        )}
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box className={styles.modalContainer}>
          <Typography variant="h6" component="h2">
            Send Answering message
          </Typography>
          <Formik
            initialValues={{ message: '' }}
            onSubmit={(values, { resetForm }) => {
              sendOffer(CONSTANTS.OFFER_STATUS_DECLINED, currentOfferId, values.message)
              resetForm();
              handleClose();
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Field
                  as={TextField}
                  name="message"
                  label="Message"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
                <Box className={styles.btnsContainer}>
                  <Button
                    className={styles.closeBtn}
                    variant="contained"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button
                    className={styles.sendBtn}
                    type="submit"
                    variant="contained"
                    onClick={() => setFieldValue('message', '')}
                  >
                    Send without answer
                  </Button>
                  <Button
                    className={styles.sendBtn}
                    type="submit"
                    variant="contained"
                    disabled={values.message.length < 5}
                  >
                    Send
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => state.offerStore;
const mapDispatchToProps = (dispatch) => ({
  getOffers: (data) => dispatch(getOffers(data)),
  updateOffer: (offer) => dispatch(updateOffer(offer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
