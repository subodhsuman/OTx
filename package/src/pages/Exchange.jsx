import React, { useEffect, useState } from "react";
import CryptoListComponent from "../components/Exchange/CryptoListComponent";
import DetailBarComponent from "../components/Exchange/DetailBarComponent";
import ChartComponent from "../components/Exchange/ChartComponent";
import OrderDepthComponent from "../components/Exchange/OrderDepthComponent";
import TradeHistoryComponent from "../components/Exchange/TradeHistoryComponent";
import BuySellComponent from "../components/Exchange/BuySellComponent";
import OrderComponent from "../components/Exchange/OrderComponent"
import { Link, useLocation, useSearchParams } from "react-router-dom";
import ApiClass from "../api/api";
import { useSelector } from "react-redux";

const getAllPairs = async () => {
  let response = await ApiClass.getNodeRequest("list-crypto/get", false);
  return response?.data ?? [];
}
const ListCrypto = await getAllPairs();
export default function About() {
  const [favCoins, setFavCoinsData] = useState(null);
  const [favCoinsSymbols, setFavCoinsSymbols] = useState(null);

  let IsLogin = useSelector((state) => state.user.token ? true : false);
  const getFavPair = async () => {

    let response = await ApiClass.getNodeRequest("favpair/get", true);
    // console.log(response?.data?.data);
    if (response?.data?.status_code == 1) {
      return response?.data;
    }
    return [];
  }
  useEffect(() => {
    if (IsLogin) {
      (async () => {
        let r = await getFavPair();
        r?.data ? setFavCoinsData(r?.data) : setFavCoinsData([]);
        r?.fav_symbols ? setFavCoinsSymbols(r?.fav_symbols) : setFavCoinsSymbols([]);
      })();
    }

    if (!IsLogin) {
      (async () => {
        setFavCoinsData([]);
        setFavCoinsSymbols([]);
      })();


    }
  }, []);
  ListCrypto.data.FAV = (favCoins != null) ? favCoins : [];

  const [searchParams] = useSearchParams({});

  let allTickers = ListCrypto?.listed_tickers.concat(ListCrypto?.tickers); // getting all tickers
  let symbol = allTickers.includes(searchParams.get("s")) ? searchParams.get("s") : "BTCUSDT"; // current symbol
  const location = useLocation();
  let sys = location.search;
  useEffect(() => { symbol = sys.split("=")[1] }, [sys?.split("=")[1]])
  let pair_with = symbol.slice(-3); // slice pair with
  pair_with = pair_with == "SDT" ? "USDT" : pair_with; // Original pair with
  let Active = ListCrypto?.data[pair_with].find((v) => v.symbol == symbol);

  const setFavPairs = (type, favData) => {

    let fsymbol = favData.symbol;

    if (type == "push") {
      favCoinsSymbols.push(fsymbol);
      favCoins.push(favData);
      // setFavCoinsData((favCoins)=> [favData,...favCoins]);
      // console.log(favCoins)
    } else {
      const index = favCoinsSymbols.indexOf(fsymbol);
      if (index > -1) { favCoinsSymbols.splice(index, 1); }
      const index2 = favCoins.findIndex(v => v.symbol == fsymbol);
      if (index2 > -1) { favCoins.splice(index2, 1); }
      // console.log(favCoins)

    }
  }

  return (
    <div id="exchange">
      <section className="exchange-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-2 mb-md-3">
             {/* { <CryptoListComponent ListCrypto={ListCrypto}
                active={Active} />} */}
                 {
                        (IsLogin && favCoins) 
                        ?
                        <CryptoListComponent ListCrypto={ListCrypto} active={Active}  />
                        : ''
                    }
                    
                    {
                        (!IsLogin) 
                        ?
                        <CryptoListComponent ListCrypto={ListCrypto} active={Active}  />
                        : ''
                    }
            </div>
            {/**col-xxl-2**/}

            <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-8 mb-md-3">
              <div className="row center-row">
                <div className="col-xl-12 col-xxl-12 mb-2">
                {/* {favCoinsSymbols && <DetailBarComponent active={Active} favCoinsSymbols={favCoinsSymbols} setFavPairs={setFavPairs} />} */}
                  <DetailBarComponent active={Active} favCoinsSymbols={favCoinsSymbols} setFavPairs={setFavPairs} />
                </div>
                {/**col-xl-12 col-xxl-12 detailbar**/}

                <div className="col-xl-12 col-xxl-12 mb-3">
                  <ChartComponent activeSym={Active} />
                </div>
                {/**col-xl-12 col-xxl-12 chart**/}

                <div className="col-xl-12 col-xxl-6 mb-xl-3">
                  <OrderDepthComponent active={Active} />
                </div>
                {/**col-xl-12 col-xxl-6 OrderDepthComponent**/}

                <div className="col-xl-12 col-xxl-6">
                  <TradeHistoryComponent active={Active} />
                </div>
                {/**col-xl-12 col-xxl-6 TradeHistoryComponent**/}
              </div>
              {/**row center-row**/}
            </div>
            {/**col-xl-6 col-xxl-8**/}

            <div className="col-md-12 col-lg-3 col-xl-3 col-xxl-2">
              <div className="row right-row justify-content-center text-center">
                <div className="col-md-6 col-lg-12 col-xl-12 col-xxl-12 mb-3">
                  {(IsLogin) ? <OrderComponent /> :
                    <div className="log-reg">
                     <div>
                     <Link to="/login"><button type="button" className="btn btn-success mb-2 border-0 rounded-pill" style={{ backgroundColor: 'var(--ex-buy-green)'}} >LOGIN</button></Link>
                      <p className="mb-2" style={{ color: 'var(--white)' }}>OR</p>
                      <Link to="/signup"><button type="button" className="btn btn-success border-0 rounded-pill" style={{ backgroundColor: 'var(--ex-buy-green)' }}>REGISTER</button></Link>
                     </div>
                    </div>
                  }
                </div>
                {/**col-xl-12 col-xxl-12 order-component**/}
                <div className="col-md-6 col-lg-12 col-xl-12 col-xxl-12">
                  <BuySellComponent active={Active} />
                </div>
                {/**col-xl-12 col-xxl-12 buysell-component**/}
              </div>
              {/**"row right-row**/}
            </div>
            {/**col-xl-3 col-xxl-2**/}
          </div>
          {/**row**/}
        </div>
        {/**container-fluid**/}
      </section>
      {/**exchange-sec**/}
    </div>
  );
}