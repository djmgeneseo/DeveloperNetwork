import {SET_ALERT, REMOVE_ALERT} from '../actions/types';

const initialState = [];

export default function(state = initialState, action) {
  const {type, payload} = action;

  switch(action.type){
    case SET_ALERT:
      return [...state,payload];
    case REMOVE_ALERT:
      // return all alerts EXCEPT for that which matches the payload
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}