import React from 'react';
import { Redirect } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import useUser from '../../hooks/useUser';

const PrivateHoc = (Component) => {
  const Hoc = (props) => {
    const { history, match } = props;
    const { data, isFetching, isLoading } = useUser();

    if (isLoading && isFetching) {
      return <Spinner />;
    }

    if (!isFetching && !data) {
      return <Redirect to="/login" />;
    }

    return !isFetching && <Component history={history} match={match} {...props} />;
  };

  return Hoc;
};

export default PrivateHoc;
