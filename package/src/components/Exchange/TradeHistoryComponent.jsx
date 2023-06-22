// import React from "react";
// import TradeTable from "../../assets/json/TradeTable.json"

// export default function TradeHistoryComponent() {

//   return (
//     <div>
//       <div className="tradehistory">
//         <div className="trade-table">
//           <div className="trade-head mb-3">
//             <h3 className="text-capitalize mb-0">trade history</h3>
//           </div>
//           <div className="table-responsive">
//             <table className="table table-borderless">
//               <thead>
//                 <tr>
//                   <th>price</th>

//                   <th>volume</th>

//                   <th>time</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {TradeTable.TradeData.map((val, i) => {
//                   return (
//                     <tr key={i} style={ val.ordertype == 'buy' ?  {backgroundColor: "var(--ex-green-bg)"} :  {backgroundColor: "var(--ex-red-bg)"} }>
//                       <td style={ val.ordertype == 'buy' ?  {color: "var(--green)"} :  {color: "var(--red)"} }>{val.price}</td>

//                       <td style={ val.ordertype == 'buy' ?  {color: "var(--green)"} :  {color: "var(--red)"} }>{val.vol}</td>

//                       <td>{val.time}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           {/**table-responsive**/}
//         </div>
//         {/**trade-table**/}
//       </div>
//       {/**tradehistory**/}
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from "react";
import TradeTable from "../../assets/json/TradeTable.json"
import ApiClass from "../../api/api.js"
import 'react-loading-skeleton/dist/skeleton.css'

export default function TradeHistoryComponent({ active }) {
  let { listed, symbol, currency, pair_with } = active; // destructure props data

  //states
  const [data, setData] = useState([]);

  const ws = useRef(null);


  const getTradeData = async () => {   //Trade history Api
    (ws.current != null) ? ws.current.close() : "";

    let url = (listed) ? `orders/trade-book?currency=${currency}&with_currency=${pair_with}` : `list-crypto/trade-history/${symbol}`;

    const response = await ApiClass.getNodeRequest(url, false);
    if (response?.data?.status_code == 1) {
      let res = response?.data?.data.map((v) => ({ p: parseFloat(v.p), q: parseFloat(v.q), type: parseFloat(v.m), t: new Date(+v.T).toLocaleTimeString("en-GB") }));
      setData(res)
    }
  }


  const SocketConnection = async () => {

    let socketUrl = (listed) ? ApiClass.nodeWebsocket : ApiClass.binanceWebsocket;

    // connect socket
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        method: (listed) ? "ADD" : "SUBSCRIBE",
        params: (listed) ? [symbol.toLowerCase() + "@trade"] : [symbol.toLowerCase() + "@trade"],
        id: 3,
      }));
    }
    ws.current.onclose = () => { };

    ws.current.onmessage = (event) => {
      let obj = JSON.parse(event.data);

      if (obj["e"] == "trade") {

        let new_data = { p: parseFloat(obj["p"]), q: parseFloat(obj["q"]), t: new Date(+obj["T"]).toLocaleTimeString("en-GB"), type: obj["m"] };

        setData((data) => [new_data, ...data]);

        setData((data) => {
          let alldata = [...data];
          alldata.pop();
          return alldata;
        });

      }
    }
  }

  useEffect(() => {
    getTradeData()
    SocketConnection()
  }, [symbol])
  return (
    <div>
      <div className="tradehistory">
        <div className="trade-table">
          <div className="trade-head mb-3">
            <h3 className="text-capitalize mb-0">trade history</h3>
          </div>
          <div className="table-responsive">
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th>price</th>

                  <th>volume</th>

                  <th>time</th>
                </tr>
              </thead>

              <tbody>
                {data.map((val, i) => {
                  return (
                    <tr key={i} style={val.type ? { backgroundColor: "var(--ex-green-bg)" } : { backgroundColor: "var(--ex-red-bg)" }}>
                      <td style={(val.type) ? { color: 'var(--ex-green)' } : { color: 'var(--ex-red)' }}>{val.p}</td>

                      <td style={val.type  ? { color: "var(--ex-green)" } : { color: "var(--ex-red)" }}> {val.q}</td>
                      <td> {val.t}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/**table-responsive**/}
        </div>
        {/**trade-table**/}
      </div>
      {/**tradehistory**/}
    </div>
  );
}

