import React, { useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import {
  getContests,
  clearContestsList,
  setNewCreatorFilter,
} from '../../store/slices/contestsSlice';
import { getDataForContest } from '../../store/slices/dataForContestSlice';
import ContestsContainer from '../ContestsContainer/ContestsContainer';
import styles from './CreatorDashboard.module.sass';
import TryAgain from '../TryAgain/TryAgain';
import CONSTANTS from '../../constants';
import { goToExtended } from '../../utils/contestUtils';

const types = [
  '',
  'name,tagline,logo',
  'name',
  'tagline',
  'logo',
  'name,tagline',
  'logo,tagline',
  'name,logo',
];

const CreatorDashboard = (props) => {
  const {
    getContests,
    getDataForContest,
    contests,
    clearContestsList,
    newFilter,
    history,
    haveMore,
    creatorFilter,
    isFetching,
    error,
    location: { search },
    dataForContest,
  } = props;

  const getCreatorContests = useCallback(
    (offset, filter) =>
      getContests({
        limit: CONSTANTS.LIMIT_GETTING_CONTESTS,
        offset,
        ...filter,
      }),
    [getContests]
  );

  const parseParamsToUrl = useCallback(
    (creatorFilter) => {
      const obj = { ...creatorFilter };

      Object.keys(obj).forEach((el) => {
        if (!obj[el]) delete obj[el];
      });
      history.push(`/Dashboard?${queryString.stringify(obj)}`);
    },
    [history]
  );

  const parseUrlForParams = useCallback(
    (search) => {
      const obj = queryString.parse(search);
      const filter = {
        typeIndex: obj.typeIndex || 1,
        contestId: obj.contestId ?? '',
        industry: obj.industry ?? '',
        awardSort: obj.awardSort || 'asc',
        ownEntries: obj.ownEntries !== undefined ? obj.ownEntries : false,
      };
      if (!isEqual(filter, creatorFilter)) {
        newFilter(filter);
      }
      clearContestsList();
      getCreatorContests(0, filter);
    },
    [creatorFilter, newFilter, clearContestsList, getCreatorContests]
  );

  const changePredicate = ({ name, value }) => {
    newFilter({
      [name]: value === 'Choose industry' ? null : value,
    });
    parseParamsToUrl({
      ...creatorFilter,
      ...{ [name]: value === 'Choose industry' ? null : value },
    });
  };

  const renderSelectType = () => {
    const array = types.map((el, i) =>
      i !== 0 ? (
        <option key={i - 1} value={el}>
          {el}
        </option>
      ) : null
    );
    return (
      <select
        onChange={({ target }) =>
          changePredicate({
            name: 'typeIndex',
            value: types.indexOf(target.value),
          })
        }
        value={types[creatorFilter.typeIndex]}
        className={styles.input}
      >
        {array}
      </select>
    );
  };

  const renderIndustryType = () => {
    const { data, isFetching } = dataForContest;
    const array = [
      <option key={0} value={null}>
        Choose industry
      </option>,
      ...(!isFetching && data?.industry
        ? data.industry.map((industry, i) => (
            <option key={i + 1} value={industry}>
              {industry}
            </option>
          ))
        : []),
    ];
    return (
      <select
        onChange={({ target }) =>
          changePredicate({
            name: 'industry',
            value: target.value,
          })
        }
        value={creatorFilter.industry}
        className={styles.input}
      >
        {array}
      </select>
    );
  };

  const getPredicateOfRequest = () => {
    const obj = {};
    Object.keys(creatorFilter).forEach((el) => {
      if (creatorFilter[el]) {
        obj[el] = creatorFilter[el];
      }
    });
    obj.ownEntries = creatorFilter.ownEntries;
    return obj;
  };

  const loadMore = (startFrom) => {
    getCreatorContests(startFrom, getPredicateOfRequest());
  };

  const tryLoadAgain = () => {
    clearContestsList();
    getCreatorContests(0, getPredicateOfRequest());
  };

  useEffect(() => {
    getDataForContest();
    return () => clearContestsList();
  }, [clearContestsList, getDataForContest]);

  useEffect(() => {
    parseUrlForParams(search);
  }, [search, parseUrlForParams]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filterContainer}>
        <span className={styles.headerFilter}>Filter Results</span>
        <div className={styles.inputsContainer}>
          <div
            onClick={() =>
              changePredicate({
                name: 'ownEntries',
                value: !creatorFilter.ownEntries,
              })
            }
            className={classNames(styles.myEntries, {
              [styles.activeMyEntries]: creatorFilter.ownEntries,
            })}
          >
            My Entries
          </div>
          <div className={styles.inputContainer}>
            <span>By contest type</span>
            {renderSelectType()}
          </div>
          <div className={styles.inputContainer}>
            <span>By contest ID</span>
            <input
              type="text"
              onChange={({ target }) =>
                changePredicate({
                  name: 'contestId',
                  value: target.value,
                })
              }
              name="contestId"
              value={creatorFilter.contestId}
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <span>By industry</span>
            {renderIndustryType()}
          </div>
          <div className={styles.inputContainer}>
            <span>By amount award</span>
            <select
              onChange={({ target }) =>
                changePredicate({
                  name: 'awardSort',
                  value: target.value,
                })
              }
              value={creatorFilter.awardSort}
              className={styles.input}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>
      {error ? (
        <div className={styles.messageContainer}>
          <TryAgain getData={tryLoadAgain} />
        </div>
      ) : (
        <ContestsContainer
          isFetching={isFetching}
          error={error}
          loadMore={loadMore}
          history={history}
          haveMore={haveMore}
          contests={contests}
          goToExtended={goToExtended}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { contestsList, dataForContest } = state;
  return { ...contestsList, dataForContest };
};

const mapDispatchToProps = (dispatch) => ({
  getContests: (data) =>
    dispatch(getContests({ requestData: data, role: CONSTANTS.CREATOR })),
  clearContestsList: () => dispatch(clearContestsList()),
  newFilter: (filter) => dispatch(setNewCreatorFilter(filter)),
  getDataForContest: () => dispatch(getDataForContest()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreatorDashboard)
);
