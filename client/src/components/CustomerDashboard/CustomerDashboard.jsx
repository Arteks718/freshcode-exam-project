import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { IoMdRefresh } from 'react-icons/io';
import {
  getContests,
  clearContestsList,
  setNewCustomerFilter,
} from '../../store/slices/contestsSlice';
import CONSTANTS from '../../constants';
import ContestsContainer from '../ContestsContainer/ContestsContainer';
import ContestBox from '../ContestBox/ContestBox';
import styles from './CustomerDashboard.module.sass';
import TryAgain from '../TryAgain/TryAgain';
import { goToExtended } from '../../utils/contestUtils';

const CustomerDashboard = (props) => {
  const {
    getContests,
    haveMore,
    error,
    customerFilter,
    isFetching,
    history,
    clearContestsList,
    newFilter,
    contests,
  } = props;

  useEffect(() => {
    getContests({ limit: 8, contestStatus: customerFilter });
  }, [customerFilter, getContests]);

  const loadMore = (startFrom) => {
    getContests({
      limit: 8,
      offset: startFrom,
      contestStatus: customerFilter,
    });
  };

  const setContestList = () => {
    const array = contests.map((contest) => (
      <ContestBox
        data={contest}
        key={contest.id}
        history={history}
        goToExtended={goToExtended}
      />
    ));
    return array;
  };

  const tryToGetContest = () => {
    clearContestsList();
    getContests({ limit: 8, contestStatus: customerFilter });
  };

  const updateFilter = (status) => {
    if (status !== customerFilter) {
      newFilter(status);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filterContainer}>
        <div
          onClick={() => updateFilter(CONSTANTS.CONTEST_STATUS_ACTIVE)}
          className={classNames({
            [styles.activeFilter]:
              CONSTANTS.CONTEST_STATUS_ACTIVE === customerFilter,
            [styles.filter]: CONSTANTS.CONTEST_STATUS_ACTIVE !== customerFilter,
          })}
        >
          Active Contests
        </div>
        <div
          onClick={() => updateFilter(CONSTANTS.CONTEST_STATUS_FINISHED)}
          className={classNames({
            [styles.activeFilter]:
              CONSTANTS.CONTEST_STATUS_FINISHED === customerFilter,
            [styles.filter]:
              CONSTANTS.CONTEST_STATUS_FINISHED !== customerFilter,
          })}
        >
          Completed contests
        </div>
        <div
          onClick={() => updateFilter(CONSTANTS.CONTEST_STATUS_PENDING)}
          className={classNames({
            [styles.activeFilter]:
              CONSTANTS.CONTEST_STATUS_PENDING === customerFilter,
            [styles.filter]:
              CONSTANTS.CONTEST_STATUS_PENDING !== customerFilter,
          })}
        >
          Inactive contests
        </div>
        <IoMdRefresh
          className={classNames([
            styles.refreshButton,
            isFetching && styles.loading,
          ])}
          onClick={tryToGetContest}
        />
      </div>
      <div className={styles.contestsContainer}>
        {error ? (
          <TryAgain getData={tryToGetContest()} />
        ) : (
          <ContestsContainer
            isFetching={isFetching}
            loadMore={loadMore}
            history={history}
            haveMore={haveMore}
          >
            {setContestList()}
            {!contests.length && !isFetching && (
              <div className={styles.emptyNotification}>
                This contests list is empty
              </div>
            )}
          </ContestsContainer>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => state.contestsList;

const mapDispatchToProps = (dispatch) => ({
  getContests: (data) =>
    dispatch(getContests({ requestData: data, role: CONSTANTS.CUSTOMER })),
  clearContestsList: () => dispatch(clearContestsList()),
  newFilter: (filter) => dispatch(setNewCustomerFilter(filter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDashboard);
