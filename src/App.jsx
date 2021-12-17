import React from 'react'
import { Provider } from "react-redux"
import './App.css'
//import { ChallengeApi } from './httpApi'
import Challenge from './Challenge/Challenge'

export const App = ({reduxStore}) => {
  //let api = new ChallengeApi()
  //api.connect()
  //setTimeout(()=>{api.unsubscribe()},10000)
  return (
    <Provider store={reduxStore}>
      <main className="App">
        <Challenge />
      </main>
    </Provider>
  )
}

