import {
  FETCH_BOOK__FAILURE,
  FETCH_BOOK__START,
  FETCH_BOOK__SUCCESS,
  SET_BOOK_ROW,
  DELETE_BOOK_ROW
} from "./actions"

const initialState = {
  bookRows: null,
  fetchFailure: false,
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case FETCH_BOOK__START:
      return {
        ...state,
        fetchedContact: null,
      }

    case FETCH_BOOK__SUCCESS:
      return {
        ...state,
        bookRows: payload.bookRows,
      }

    case FETCH_BOOK__FAILURE:
      return {
        ...state,
        fetchFailure: true,
      }

    case DELETE_BOOK_ROW:
      return {
        ...state,
        bookRows: state.bookRows.filter(e=>e[0]!=payload)
      }
    case SET_BOOK_ROW: {

      return {
        ...state,
        bookRows: [...state.bookRows.filter(e=>e[0]!=payload[0]), payload]
//        bookHash: {...state.bookHash, [payload[0]] : [payload[1],payload[2]]}
      }
    }
    default:
      return state

  }
}

export default reducer