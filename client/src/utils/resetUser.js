import CONSTANTS from "../constants"
import store from "../store"
import { clearOffersList } from "../store/slices/offersSlice";
import { clearUserError } from "../store/slices/userSlice"

const resetUser = (history) => {
  const dispatch = store.dispatch;
  localStorage.removeItem(CONSTANTS.ACCESS_TOKEN)
  dispatch(clearUserError)
  dispatch(clearOffersList)
  history.replace('/login')
  history.go()
}

export default resetUser