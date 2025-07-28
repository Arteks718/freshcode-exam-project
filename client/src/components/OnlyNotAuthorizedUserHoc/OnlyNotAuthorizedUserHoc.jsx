import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../store/slices/userSlice';
import Spinner from '../Spinner/Spinner';

const OnlyNotAuthorizedUserHoc = (Component) => {
  const HocForLoginSignUp = (props) => {
    const { checkAuth, isFetching, data, history } = props;
    useEffect(() => {
      checkAuth(history.replace);
    }, [checkAuth, history.replace]);

    if (isFetching) {
      return <Spinner />;
    }
    if (!data) {
      return <Component history={history} />;
    }
    return null;
  };

  const mapStateToProps = (state) => state.userStore;

  const mapDispatchToProps = (dispatch) => ({
    checkAuth: (replace) => dispatch(getUser(replace)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(HocForLoginSignUp);
};

export default OnlyNotAuthorizedUserHoc;
