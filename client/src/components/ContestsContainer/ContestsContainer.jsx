import { useEffect, useMemo } from 'react';
import styles from './ContestContainer.module.sass';
import Spinner from '../Spinner/Spinner';
import ContestBox from '../ContestBox/ContestBox';

const ContestsContainer = (props) => {
  const { isFetching, loadMore, haveMore, contests, goToExtended, history } =
    props;

  useEffect(() => {
    const scrollHandler = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        if (haveMore) {
          loadMore(contests.length);
        }
      }
    };

    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [contests, haveMore, loadMore]);

  const setContestList = useMemo(() =>
    contests.map((contest) => (
      <ContestBox
        data={contest}
        key={contest.id}
        history={history}
        goToExtended={goToExtended}
      />
    )), [contests, goToExtended, history]);

  return (
    <div>
      {setContestList}
      {!contests.length && !isFetching && (
        <div className={styles.emptyNotification}>
          This contests list is empty
        </div>
      )}
      {isFetching && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ContestsContainer;
