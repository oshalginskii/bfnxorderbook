export const FETCH_BOOK__FAILURE = 'FETCH_BOOK__FAILURE'
export const FETCH_BOOK__START = 'FETCH_BOOK__START'
export const FETCH_BOOK__SUCCESS = 'FETCH_BOOK__SUCCESS'
export const SET_BOOK_ROW = 'SET_BOOK_ROW'
export const DELETE_BOOK_ROW = 'DELETE_BOOK_ROW'

export const loadBookRows = (rowData) => {
    let bookHash = {}
    rowData.map(v=>{ bookHash[v[0]] = [v[1],v[2]]})
    return {
        type: FETCH_BOOK__SUCCESS,
        payload: {
            bookRows: rowData,
            bookHash: bookHash
        }
    }
}

export const setRowData = (row) => {
    if (row[1]=='0') {
        return {
            type: DELETE_BOOK_ROW,
            payload: row[0]
        }
    }
    else return {
        type: SET_BOOK_ROW,
        payload: row
    }
}
