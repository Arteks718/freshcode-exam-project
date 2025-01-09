import _ from 'lodash';

export const sortEvents = (events) => {
  return _(events)
  .sortBy((event) => new Date(event.finishDate).getTime())
  .partition(
    (event) => new Date(event.finishDate).getTime() >= new Date().getTime()
  )
  .flatMap((partition) => partition)
  .value()
}