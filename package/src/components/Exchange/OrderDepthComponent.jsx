
import OrderTable from "../../assets/json/OrderTable.json";
import React, { useEffect, useRef, useState } from 'react';
import ApiClass from '../../api/api.js';
import _ from "lodash";
import exactMath from "exact-math";
import Emitter from "../../event/Emitter.jsx"


var highest = "";
var Lowest = "";
export default function OrderDepthComponent({ active }) {
  const OrderTabs = ["market depth", "order volume"];
  const [tab, setTab] = useState("market depth");
  const ws = useRef(null)
  let { symbol, listed, currency, pair_with } = active;
  const [buyData, setBuyData] = useState([]);
  const [sellData, setSellData] = useState([]);

  const onMount = async () => {
    (ws.current != null) ? ws.current.close() : "";
    let url = (listed) ? `orders/order-book?currency=${currency}&with_currency=${pair_with}` : `list-crypto/market-data/${symbol}`;

    const response = await ApiClass.getNodeRequest(url, false);

    if (response?.data?.status_code == 1) {
      setBuyData(response?.data?.data?.bids)
      setSellData(response?.data?.data?.asks)
    }
  }
  const maxVol = () => {
    let ca = buyData.concat(sellData);
    let maxv = _.maxBy(ca, (el) => parseFloat(el[1]));
    return maxv?.[1] || 0;
  }
  const md_buyData = () => {
    if (buyData == undefined) {
      return [];
    }
    let s = 0;
    let x = buyData.map((el) => {
      let n = exactMath.add(s, el[1]);
      s = n;
      return [parseFloat(el[0]), n];
    });

    highest = _.head(x)?.[0] || "";

    return x;
  }
  const md_sellData = () => {

    if (sellData == undefined) {
      return [];
    }
    let s = 0;
    let x = sellData.map((el) => {
      let n = exactMath.add(s, el[1]);
      s = n;
      return [parseFloat(el[0]), n];
    });
    Lowest = _.head(x)?.[0] || "";
    return x;
  }
  const mdMaxVol = () => {
    let mx_buy = _.last(md_buyData())?.[1] || 0;
    let mx_sell = _.last(md_sellData())?.[1] || 0;
    return _.gt(parseFloat(mx_buy), parseFloat(mx_sell)) ?
      parseFloat(mx_buy) :
      parseFloat(mx_sell);
  }
  useEffect(() => {
    onMount(); // call api for set initial data

    let socketUrl = (listed) ? ApiClass.nodeWebsocket : ApiClass.binanceWebsocket;

    // connect socket
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        method: (listed) ? "ADD" : "SUBSCRIBE",
        params: (listed) ? [symbol.toLowerCase() + "@depth"] : [symbol.toLowerCase() + "@depth10@1000ms"],
        id: 3,
      }));
    }

    // closed socket
    ws.current.onclose = () => {};

    ws.current.onmessage = (event) => {
      let Smessage = JSON.parse(event.data);
      if (Smessage?.bids) { setBuyData(Smessage?.bids) };
      if (Smessage?.asks) { setSellData(Smessage?.asks) };
    }
  }, [symbol])

  return (
    <div>
      <div className="orderdepth">
        <div className="order-heading-box mb-2">
          <div className="row tabs-row align-items-center">
            <div className="col-md-6 col-lg-4 col-xl-6 col-xxl-4">
              <div className="order-title">
                <h3 className="mb-0 text-capitalize">order book</h3>
              </div>
              {/**order-heading**/}
            </div>
            {/**col-md-6 col-lg-6 col-xl-6**/}

            <div className="col-md-6 col-lg-8 col-xl-6 col-xxl-8">
              <div className="order-tab">
                <ul
                  className="nav nav-pills nav-fill"
                  id="pills-tab"
                  role="tablist"
                >
                  {OrderTabs.map((val, i) => {
                    return (
                      <li className="nav-item" role="presentation" key={i}>
                        <button
                          className={
                            tab == val ? `nav-link active` : `nav-link`
                          }
                          id="pills-market-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-market"
                          type="button"
                          role="tab"
                          aria-controls="pills-market"
                          aria-selected="true"
                          onClick={() => setTab(val)}
                          key={i}
                        >
                          {val}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {/**order-tab**/}
            </div>
            {/**col-md-6 col-lg-6 col-xl-6**/}
          </div>
          {/**row tabs-row**/}
        </div>
        {/**order-heading-box**/}

        <div className="table-box">
          <div
            className="tab-pane fade show active"
            id="pills-market"
            role="tabpanel"
            aria-labelledby="pills-market-tab"
            tabIndex="0"
          >
            <div className="inner-table">
              <div className="row table-row">
                <div className="col-md-6 col-lg-6 col-xl-6 pe-md-0 pe-xl-0">
                  <div className="table-responsive">
                    <div className="table_box table-borderless">
                      <div className="d-flex align-item-center justify-content-between table_head ">
                        <div className="head1 w-50 p-1 text-capitalize "> volume</div>
                        <div className="head1 w-50 p-1 text-capitalize ">
                          {tab == "market depth" ? "buy price" : "bid price"}
                        </div>
                      </div>

                      <div className="table_content">
                        {tab == "market depth" ?



                          md_buyData().map((val, i) => {
                            return (
                              <div className="d-flex align-item-center justify-content-between content_info"


                                style={tab == "market depth" ?
                                  { background: `linear-gradient(to left,var(--ex-green-bg)	 ${(((val[1] / mdMaxVol()) * 100)).toFixed(2)}% , transparent 2%)`, cursor: 'pointer' }
                                  :
                                  { background: `linear-gradient(to left, var(--ex-red-bg) ${(((val[1] / maxVol()) * 100)).toFixed(2)}%, transparent 2%)`, cursor: 'pointer' }}

                                onClick={() => {
                                  Emitter.emit("getPrice", { p: val[0], t: "h" });
                                }}
                                key={i}>
                                <div className="w-50 info-box1">{parseFloat(val[1])}</div>
                                <div className="w-50 info-box1" style={{ color: 'var(--ex-green)' }}>{parseFloat(val[0])}</div>
                              </div>
                            );
                          })

                          :
                          buyData.map((val, i) => {
                            return (
                              <div className="d-flex align-item-center justify-content-between content_info"
                                style={{ background: `linear-gradient(to left, var(--ex-green-bg) ${(((val[1] / maxVol()) * 100)).toFixed(2)}%, transparent 2%)`, cursor: 'pointer' }}

                                onClick={() => {
                                  Emitter.emit("getPrice", { p: val[0], t: "h" });
                                }}
                                key={i}>
                                <div className="w-50 info-box1">{parseFloat(val[1])}</div>
                                <div className="w-50 info-box1" style={{ color: 'var(--ex-green)' }}>{parseFloat(val[0])}</div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                  </div>
                  {/**table-responsive**/}
                </div>
                {/**col-md-6 col-lg-6 col-xl-6**/}

                <div className="col-md-6 col-lg-6 col-xl-6 ps-md-0 ps-xl-0">
                  <div className="table-responsive">
                    <div className="table_box table-borderless" id="sell-table">
                      <div className="d-flex align-item-center justify-content-between table_head ">
                        <div className="head1 w-50 p-1 text-capitalize">
                          {tab == "market depth" ? "sell price" : "ask price"}
                        </div>
                        <div className="head1 w-50 p-1 text-capitalize"> volume</div>
                      </div>
                      <div className="table_content">
                        {tab == "market depth" ?
                          md_sellData()?.map((val, i) => {
                            return (
                              <div key={i} className="d-flex align-item-center justify-content-between content_info text-center"
                                style={{ background: `linear-gradient(to right,var(--ex-red-bg)	 ${(((val[1] / mdMaxVol()) * 100)).toFixed(2)}% , transparent 2%)`, cursor: 'pointer' }}
                                onClick={() => {
                                  Emitter.emit("getPrice", { p: val[0], t: "l" });
                                }}>
                                <div className="w-50 info-box1" style={{ color: 'var(--ex-red)' }}>{parseFloat(val[0])}</div>
                                <div className=" w-50 info-box1">  {parseFloat(val[1])}</div>
                              </div>
                            );
                          })
                          :
                          sellData?.map((val, i) => {
                            return (
                              <div className="d-flex align-item-center justify-content-between content_info text-center"
                                style=
                                {{ background: `linear-gradient(to right, var(--ex-red-bg) ${(((val[1] / maxVol()) * 100)).toFixed(2)}%, transparent 2%)`, cursor: 'pointer' }}
                                onClick={() => {
                                  Emitter.emit("getPrice", { p: val[0], t: "l" });
                                }}>
                                <div className="w-50 info-box1" style={{ color: 'var(--ex-red)' }}>{parseFloat(val[0])}</div>
                                <div className=" w-50 info-box1">  {parseFloat(val[1])}</div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  {/**table-responsive**/}
                </div>
                {/**col-md-6 col-lg-6 col-xl-6**/}
              </div>
              {/**row table-row**/}
            </div>
            {/**inner-table**/}
          </div>
        </div>
        {/**table-box**/}
      </div>
      {/**orderdepth**/}
    </div>
  );
}
Emitter.on("event_price_handle", (t) => {
  let price =
    // t === "h"
    //   ? max_bids()?.map((price) => price[0])[0]
    //   : md_sellData()?.map((price) => price[0])[0];
    t === "h" ? highest : Lowest;

  Emitter.emit("getPrice", { p: price, t: t });
});
