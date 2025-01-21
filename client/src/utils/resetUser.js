import CONSTANTS from "../constants"
import store from "../store"
import { clearUserError } from "../store/slices/userSlice"

const resetUser = (history) => {
  const dispatch = store.dispatch;
  localStorage.removeItem(CONSTANTS.ACCESS_TOKEN)
  dispatch(clearUserError)
  history.replace('/login')
  history.go()
}

export default resetUser