import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getUser } from '../../store/slices/userSlice';
import Spinner from '../Spinner/Spinner';

const PrivateHoc = Component => {
  
  const Hoc = props => {
    const { data, getUser, history, match, isFetching } = props;

    useEffect(() => {
      if(!data){
        getUser();
        // history.replace('/login');
        return;
      }
    }, [])


    return (
      <>
        {isFetching ? (
          <Spinner />
        ) : (
          <Component
            history={history}
            match={match}
            {...props}
          />
        )}
      </>
    );
  }

  const mapStateToProps = (state) => state.userStore;

  const mapDispatchToProps = (dispatch) => ({
    getUser: () => dispatch(getUser()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Hoc);
};

export default PrivateHoc;
