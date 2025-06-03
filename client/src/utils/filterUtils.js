import queryString from 'query-string';
import isEqual from 'lodash/isEqual';

export const parseParamsToUrl = (creatorFilter, history) => {
  const obj = { ...creatorFilter };

  Object.keys(obj).forEach((el) => {
    if (!obj[el]) delete obj[el];
  });
  history.push(`/dashboard?${queryString.stringify(obj)}`);
};

export const parseUrlForParams = (
  search,
  creatorFilter,
  newFilter,
  clearContestsList,
  getCreatorContests
) => {
  const obj = queryString.parse(search);
  const filter = {
    typeIndex: Number(obj.typeIndex) || 1,
    contestId: obj.contestId ?? '',
    industry: obj.industry ?? '',
    awardSort: obj.awardSort || 'asc',
    ownEntries: obj.ownEntries !== undefined ? Boolean(obj.ownEntries) : false,
    isActive:
      obj.isActive !== undefined
        ? Boolean(obj.isActive)
        : creatorFilter.isActive,
  };
  if (!isEqual(filter, creatorFilter)) {
    newFilter(filter);
  }
  clearContestsList();
  getCreatorContests(0, filter);
};

export const getPredicateOfRequest = (creatorFilter) => {
  const obj = {};
  Object.keys(creatorFilter).forEach((el) => {
    if (creatorFilter[el]) {
      obj[el] = creatorFilter[el];
    }
  });
  obj.ownEntries = creatorFilter.ownEntries;
  return obj;
};