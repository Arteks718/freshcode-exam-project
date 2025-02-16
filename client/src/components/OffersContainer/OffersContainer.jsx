import styles from './OffersContainer.module.sass';

const OffersContainer = (props) => {
  const { children, loadMore, haveMore } = props;

  return (
    <div className={styles.offerContainer}>
      {children.length !== 0 ? (
        <div className={styles.offersList}>{children}</div>
      ) : (
        <div className={styles.emptyNotification}>
          At the moment, list of offers is empty!
        </div>
      )}
      {haveMore && <button className={styles.loadMore} onClick={() => loadMore(children.length)}>LOAD MORE</button>}
    </div>
  );
};

export default OffersContainer;
