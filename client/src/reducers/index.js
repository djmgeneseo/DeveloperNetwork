import { combineReducers } from 'redux';
import alert from './alert'
import register from './auth.js'

export default combineReducers({ // any reducers I created
  alert,
  register
})