import React from "react"
import { connect } from "react-redux"
import { loadBookRows, setRowData } from "../Challenge/actions"

class Challenge extends React.Component {
    constructor(props) {
        super(props)
        this.handleMessage = this.handleMessage.bind(this)
        this.url = 'wss://api-pub.bitfinex.com/ws/2/'
        this.channelId = null
        this.connectionOpen = false
        this.connect = this.connect.bind(this)
        this.subscribe = this.subscribe.bind(this)
        this.unsubscribe = this.unsubscribe.bind(this)
        this.ping = this.ping.bind(this)
    }
    componentDidMount() {
        this.connect()
        //setTimeout(()=>{this.unsubscribe()},10000)
    }
    componentWillUnmount() {
        this.unsubscribe()
    }
    render() {
        
        let rLeft = null
        let rRight = null
        if (this.props.bookRows != null) {
            let total = 0
            rLeft = this.props.bookRows.map((v,i) => {
                if (v[2]>0) {
                    total += v[2]
                    let fmtAmount = v[2].toLocaleString('en-US',{ minimumFractionDigits: 4,maximumFractionDigits: 4 })
                    let fmtTotal = total.toLocaleString('en-US',{ minimumFractionDigits: 4,maximumFractionDigits: 4 })
                    let fmtValue = v[0].toLocaleString('en-US')
                    return (
                        <tr key={i}>
                        <td>{v[1]}</td><td>{fmtAmount}</td><td>{fmtTotal}</td><td>{fmtValue}</td>
                        </tr>
                    )
                }
            })
            total = 0
            rRight = this.props.bookRows.map((v,i) => {
                if (v[2]<0) {
                    total += -v[2]
                    let amount = -v[2]
                    let fmtAmount = amount.toLocaleString('en-US',{ minimumFractionDigits: 4,maximumFractionDigits: 4 })
                    let fmtTotal = total.toLocaleString('en-US',{ minimumFractionDigits: 4,maximumFractionDigits: 4 })
                    let fmtValue = v[0].toLocaleString('en-US')
                    return (
                        <tr key={i}>
                        <td>{fmtValue}</td><td>{fmtTotal}</td><td>{fmtAmount}</td><td>{v[1]}</td>
                        </tr>
                    )
                }
            })
        }



        return (
            <div className="widget">
                <span className="bookHeader">ORDER BOOK</span> <span className="bookHeaderTicket">BTC/USD</span>
                <hr />
            <table>
                <tbody>
                <tr>
                    <td valign="top">
                    <table>
                <thead>
                    <tr>
                    <td>COUNT</td>
                    <td>AMOUNT</td>
                    <td>TOTAL</td>
                    <td>PRICE</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        (rLeft == null) ? <tr key="0"><td colSpan="4">Loading...</td></tr>: rLeft
                    }
                </tbody>
            </table>
                    </td>
                    <td valign="top">
                    <table>
                <thead>
                    <tr>
                    <td>PRICE</td>
                    <td>TOTAL</td>
                    <td>AMOUNT</td>
                    <td>COUNT</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        (rRight == null) ? <tr key="0"><td colSpan="4">Loading...</td></tr>: rRight
                    }
                </tbody>
            </table>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        )
    }

    connect() {
        this.wss = new WebSocket(this.url)
        this.wss.onopen = () => {
            this.connectionOpen = true
            this.subscribe()
        }
        
        this.wss.onmessage = (msg) => this.handleMessage(msg.data)

        this.wss.onclose = (event) => {
            if (!event.wasClean) setTimeout(this.connect(),5000)
        }
    }

    subscribe() {
        this.wss.send(JSON.stringify({
            "event": "subscribe",
            "channel": 'book',
            "symbol": "tBTCUSD",
            "length": "10",
            "prec": "P0"
         }))
    }
    ping() {
        this.wss.send(JSON.stringify({
            "event":"ping",
            "cid": 898989
         }))
    }
    unsubscribe() {
        this.wss.send(JSON.stringify({
            "event": "unsubscribe",
            "chanId": this.channelId
         }))
    }

    handleMessage(jsonData) { 
        let msgData = JSON.parse(jsonData)
        if (msgData.constructor === Array) {
            if (msgData[1].length == 50) {
                this.props.setBookRows(msgData[1])
            }
            if (msgData[1].length == 3) {
                this.props.setRowData(msgData[1])
            }
        }
        if (msgData.event == 'subscribed') {
            this.channelId = msgData.chanId
        }
//        console.log(msgData)
    }
}

const mapStateToProps = (state) => ({
    bookRows: state.appChallenge.bookRows
})
const mapDispatchToProps = (dispatch) => ({
    setBookRows:
      (rows) => dispatch(loadBookRows(rows)),
    setRowData:
      (row) => dispatch(setRowData(row))
})

export default connect(mapStateToProps, mapDispatchToProps)(Challenge)