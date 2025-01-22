import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import CONSTANTS from '../constants';
import { getUser } from '../store/slices/userSlice';

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
    console.log('test2')
  }, [data, dispatch, token]);
  return { data, isFetching, isLoading, error, token };
};

export default useUser