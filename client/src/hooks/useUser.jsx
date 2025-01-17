import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import CONSTANTS from '../constants';
import { getUser } from '../store/slices/userSlice';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

const useUser = () => {
  const dispatch = useDispatch();
  const { data, isFetching, error } = useSelector((state) => state.userStore);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.hasOwnProperty(CONSTANTS.ACCESS_TOKEN);
  
  useEffect(() => {
    if (!data && token) {
      dispatch(getUser());
    }
    setIsLoading(false);
  }, [data, dispatch, token]);

  return { data, isFetching, isLoading, error };
};

export default useUser