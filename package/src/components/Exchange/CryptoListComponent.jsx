import React, { useEffect, useRef, useState } from "react";
import CryptoList from "../../assets/json/CryptoList.json"
import Emitter from "../../event/Emitter.jsx"; // event handler
import ApiClass from "../../api/api.js";
import Currency from "./Currency.jsx";

export default function CryptoListComponent({ ListCrypto, active }) {

  let { listed, image, price, changeC, symbol, change, high, low, pair_with } = active;
  let allPairData = ListCrypto?.data ?? {};

  let tickers = ListCrypto?.tickers ?? [];
  let listed_tickers = ListCrypto?.listed_tickers ?? [];
  const [tab, setTab] = useState(pair_with);
  const [allPair, setPair] = useState(allPairData);
  const [search, setSearch] = useState('')
  const [sortType, setSortType] = useState();
  const [changeType, setChangeType] = useState();


  const ws = useRef(null);

  useEffect(() => {
    let ticker_subs = (listed) ? listed_tickers.map((v) => v.toLowerCase() + "@ticker") : tickers.map((v) => v.toLowerCase() + "@ticker");
    let socket_url = (listed) ? ApiClass.nodeWebsocket : ApiClass.binanceWebsocket;

    ws.current = new WebSocket(socket_url);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        method: (listed) ? "ADD" : "SUBSCRIBE",
        params: ticker_subs,
        id: 1,
      }));
    }
    ws.current.onclose = () => { }


  }, []);

  const getList = () => {
    Emitter.emit('EVENT_DETAIL_BAR', { image, price, changeC, symbol, change, high, low });
    ws.current.onmessage = (event) => {
      let data = JSON.parse(event.data);

      allPair[tab]?.filter(function (v, i) {
        if (v.symbol == data.s) {
          v.changeC = v.changeC < data.P ? 1 : 2; // change color condition
          v.flag = v.price < data.c ? 1 : 2; // change price color condition
          v.change = data.P;
          v.price = data.c;
          v.high = data.h;
          v.low = data.l;
        }

      });
      // detail Bar Event Fire
      if (active.symbol == data.s) {
        active.changeC = active.changeC < data.P ? 1 : 2;
        active.flag = active.price < data.c ? 1 : 2;
        active.change = data.P;
        active.price = data.c;
        active.high = data.h;
        active.low = data.l;
        Emitter.emit('EVENT_DETAIL_BAR', active);
      }


      // if (homeSymbols.includes(data.s)) {
      //     let r = {
      //         symbol: data.s,
      //         price: data.c,
      //         change: data.P
      //     }


      //     Emitter.emit('EVENT_HOME_TOP_COINS', r);
      // }


      setPair(allPair => ({ ...allPair, [tab]: allPair[tab] }));
    }
  }

  useEffect(() => {
    getList(search)
  }, [allPair[tab], active.symbol]);
  useEffect(()=>{
    setTab(pair_with)

  },[active])

  // SEARCH --------
  const searchList = () => {
    let result = allPair[tab];
    if (search != "") {
      return allPair[tab].filter((item) => {
        return item.symbol.toLowerCase().includes(search.toLowerCase());
      });
    } else {
      return result;
    }
  };

  // SHORTING -----

  const SortSymbol = () => {
    allPair[tab] = allPair[tab].sort(function (a, b) {
      if (a.symbol < b.symbol) return 1;
      if (a.symbol > b.symbol) return -1;
      return 0;
    });
    sortType === true ? allPair[tab] : allPair[tab].reverse();
  };

  // CHANGE -----
  const changeHandle = () => {
    allPair[tab] = allPair[tab].sort(function (a, b) {
      return a.change - b.change

    });
    changeType === true ? allPair[tab] : allPair[tab].reverse();
  }
  useEffect(() => {
    searchList();
  }, [search]);

  const onHandleKeyPress = (e) => {
    if (e.charCode == 32) {
      e.preventDefault()
    }
  }

  return (
    <div>
      <div className="crypto-list">
        <div className="tabs-box mb-2">
          <ul className="nav nav-pills nav-fill" id="pills-tab" role="tablist">
            {
              Object.keys(allPair).map((v, i) => {
                return (
                  <li className="nav-item" role="presentation" key={i}>
                    <button
                      className={(tab == v) ? `nav-link active` : `nav-link`}
                      id="home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#fav"
                      type="button"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                      onClick={() => setTab(v)}
                      key={i}
                    >
                      {v}
                    </button>
                  </li>
                );
              })
            }
          </ul>

        </div>
        {/**tabs-box**/}

        <div className="search-box mb-2">
          <div className="input-group">
            <span className="input-group-text" id="search-input">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="20px"
                height="20px"
                style={{ fill: "var(--grey)" }}
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
              </svg>
            </span>
            <input type="text" className="form-control " placeholder="Search here..." onKeyPress={(e) => onHandleKeyPress(e)}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        {/**search-box**/}
        <div className="table-heading mb-3">
          <ul className="heading-list">
            <li onClick={() => { SortSymbol(); setSortType(!sortType) }}>
              pair{" "}
              <span>


                {sortType ?
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="11px"
                    height="11px"
                    style={{ fill: "var(--grey)" }}><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" /></svg>
                  :
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    width="11px"
                    height="11px"
                    style={{ fill: "var(--grey)" }}
                  >
                    <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>}
              </span>
            </li>
            <li onClick={() => { changeHandle(); setChangeType(!changeType); }}>
              change{" "}
              <span>
                {changeType ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="11px"
                  height="11px"
                  style={{ fill: "var(--grey)" }}><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" /></svg> :
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    width="11px"
                    height="11px"
                    style={{ fill: "var(--grey)" }}
                  >
                    <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>}
              </span>
            </li>
          </ul>
        </div>

        <div className="tab-info">
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane show active"
              id="pills-usdt"
              role="tabpanel"
              aria-labelledby="pills-usdt-tab"
              tabIndex="0"
            >
              {
                searchList().map((v, i) => {
                  return (
                    <Currency data={v} key={i} s={symbol} active={active}/>
                  )
                })
              }
            </div>


          </div>
        </div>
        {/**tab-info**/}
      </div>
      {/**crypto-list**/}
    </div>
  );
}
