import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import styles from './ModeratorModal.module.sass';
import CONSTANTS from '../../../constants';

const ModeratorModal = (props) => {
  const { sendOffer, onRef } = props;
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
    if (onRef) {
      onRef(handleOpen);
    }
  }, [onRef]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.modalContainer}>
        <Typography variant="h6" component="h2">
          Send Answering message
        </Typography>
        <Formik
          initialValues={{ message: '' }}
          onSubmit={(values, { resetForm }) => {
            sendOffer(
              CONSTANTS.OFFER_STATUS_DECLINED,
              currentOfferId,
              values.message
            );
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
  );
};

export default ModeratorModal;
