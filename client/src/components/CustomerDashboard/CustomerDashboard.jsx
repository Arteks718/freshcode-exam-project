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
    getContests({ limit: CONSTANTS.LIMIT_GETTING_CONTESTS, contestStatus: customerFilter });
    return () => clearContestsList()
  }, [customerFilter, getContests, clearContestsList]);

  const loadMore = (startFrom) => {
    getContests({
      limit: CONSTANTS.LIMIT_GETTING_CONTESTS,
      offset: startFrom,
      contestStatus: customerFilter,
    });
  };

  const tryToGetContest = () => {
    clearContestsList();
    getContests({ limit: CONSTANTS.LIMIT_GETTING_CONTESTS, contestStatus: customerFilter });
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
          <TryAgain getData={tryToGetContest} />
        ) : (
          <ContestsContainer
            contests={contests}
            isFetching={isFetching}
            error={error}
            loadMore={loadMore}
            haveMore={haveMore}
            history={history}
            goToExtended={goToExtended}
          />
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
