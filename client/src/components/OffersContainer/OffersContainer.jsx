import SpinnerLoader from '../Spinner/Spinner';
import styles from './OffersContainer.module.sass';

const OffersContainer = (props) => {
  const { children, loadMore, haveMore, isFetching } = props;

  return (
    <div className={styles.offerContainer}>
      {<div className={styles.offersList}>{children}</div>}
      {!children.length && !isFetching && (
        <div className={styles.emptyNotification}>
          At the moment, list of offers is empty!
        </div>
      )}
      {isFetching && (
        <div className={styles.spinnerContainer}>
          <SpinnerLoader />
        </div>
      )}
      {haveMore && (
        <button
          className={styles.loadMore}
          onClick={() => loadMore(children.length)}
        >
          LOAD MORE
        </button>
      )}
    </div>
  );
};

export default OffersContainer;
