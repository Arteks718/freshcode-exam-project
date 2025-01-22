import React from 'react';
import Spinner from '../Spinner/Spinner';
import useUser from '../../hooks/useUser';

const PrivateHoc = (Component) => {
  const Hoc = (props) => {
    const { history, match } = props;
    const { isFetching, isLoading, token } = useUser();

    if (isLoading && isFetching) {
      return <Spinner />;
    }
    if (isFetching && !token) {
      return history.replace('/login')
    }

    return !isFetching && <Component history={history} match={match} {...props} />;
  };

  return Hoc;
};

export default PrivateHoc;
