import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ApiClass from "../api/api";
const getAllPairs = async () => {
  let response = await ApiClass.getNodeRequest("list-crypto/get", false);
  return response?.data?.data ?? [];
};
const ListCrypto = await getAllPairs();
const btnType = ["buy", "sell"];
export default function BuysellPage() {
  const [pair, setPair] = useState("USDT");
  const [symbol, setSymbol] = useState("BTC");
  const [activesym, setActiveSym] = useState();
  const [PairPrice, setPairPrice] = useState();
  const [curPrice, setCurPrice] = useState();
  const [tab, setTab] = useState("buy");

  const IsLogin = useSelector((state) => {
    return state.user.token ? true : false;
});
const navigate = useNavigate()
  useEffect(() => {
    setActiveSym(ListCrypto[pair].find((v) => v.currency == symbol));
  }, [symbol]);
  useEffect(() => {
    if (pair == "USDT") {
      setSymbol("BTC");
    }
    if (pair == "TRX") {
      setSymbol("WIN");
    }
    if (pair == "BTC") {
      setSymbol("XMR");
    }
    if (pair == "ETH") {
      setSymbol("NEO");
    }
  }, [pair]);
  const numeric = (e) => {
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105) ||
      e.keyCode === 8 || //Backspace
      e.keyCode === 116 || // refresh
      e.keyCode === 46 //delete
    ) {
    } else {
      e.preventDefault();
    }
  };
  const pairHandle = (val) => {
    setPairPrice(val);
    setCurPrice((val / parseFloat(activesym?.price)).toFixed(8));
  };
  const CurrencyHandle = (val) => {
    setCurPrice(val);
    setPairPrice(activesym.price * val);
  };
  const handleOrders =()=>{
 if(!IsLogin){
  navigate('/login')
 }
  }

  return (
    <>
      <section className="buysell_page d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-7 col-xl-7">
              <div className="buy_sell_box">
                <div className="top_heading">
                  <h3 className="text-center mb-4">BUY & SELL CRYPTO</h3>
                </div>
                {/* buy sell heading */}
                <div className="buysell_content">
                  <div className="tabs_btn p-2 px-5">
                    <ul
                      className="nav nav-pills nav-fill "
                      id="pills-tab"
                      role="tablist"
                    >
                    {
                      btnType.map((v, i) => {
                        return (
                        <li className="nav-item" role="presentation" key={i}>
                          <button onClick={() => setTab(v)}  className={`nav-link  ${
                              (tab == v) ? `active ${v}_btn` : `${v}_btn`}`}
                          >
                            {v}
                          </button>
                        </li>
                        )
                      })
                    }
                    </ul>
                  </div>
                  <div className="tabs-info">
                    <div className="tab-content" id="pills-tabContent">
                      <div
                        className="tab-pane fade show active"
                        id="pills-Buy"
                        role="tabpanel"
                        aria-labelledby="pills-Buy-tab"
                        tabIndex="0"
                      >
                        <div className="buy_box py-3 px-4">
                          <div className="text-center currency_head mb-3">
                            <p className="text-capitalize mb-0">
                              1 {pair} ≈{" "}
                              {(1 / parseFloat(activesym?.price)).toFixed(8)}{" "}
                              {activesym?.currency}
                              <img
                                src={activesym?.image}
                                style={{ width: "25px" }}
                                className="img-fluid ms-2"
                                alt="currency-image"
                                loading="lazy"
                              />
                            </p>
                          </div>
                          <form className="row">
                            <div className="col-md-12 col-lg-12 col-xl-12">
                              <div className="mb-4 input_form">
                                <label
                                  htmlFor="exampleInputEmail1"
                                  className="form-label"
                                >
                                  Select Pair Here
                                </label>
                                <div className="input-group mb-3">
                                  <span
                                    className="input-group-text border-0"
                                    id="basic-addon1"
                                  >
                                    <select
                                      className=" form-select shadow-none border-0 "
                                      aria-label="Default select example"
                                      onChange={(e) => setPair(e.target.value)}
                                    >
                                      {Object.keys(ListCrypto).map((v, i) => {
                                        if (v != "FAV")
                                          return <option key={i} value={v}>{v}</option>;
                                      })}
                                    </select>
                                  </span>
                                  <input
                                    type="text"
                                    onKeyDown={numeric}
                                    value={PairPrice}
                                    onChange={(e) => {
                                      pairHandle(e.target.value);
                                    }}
                                    className="form-control shadow-none border-0"
                                    placeholder="1"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12 col-lg-12 col-xl-12">
                              <div className="mb-4 input_form">
                                <label
                                  htmlFor="exampleInputEmail1"
                                  className="form-label"
                                >
                                  Select Currency
                                </label>
                                <div className="input-group mb-3">
                                  <span
                                    className="input-group-text border-0"
                                    id="basic-addon1"
                                  >
                                    <select
                                      className="coin-sel form-select shadow-none border-0 "
                                      aria-label="Default select example"
                                      onChange={(e) =>
                                        setSymbol(e.target.value)
                                      }
                                    >
                                      {ListCrypto[pair]?.map((v, index) => {
                                        return (
                                          <option key={index} className="mx-2"> {v.currency}</option>
                                        );
                                      })}
                                    </select>
                                  </span>
                                  <input
                                    type="text"
                                    onKeyDown={numeric}
                                    className="form-control shadow-none border-0"
                                    placeholder="1"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={curPrice}
                                    onChange={(e) => {
                                      CurrencyHandle(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12 col-lg-12 col-xl-12">
                              <div className="btn-buy-box text-center mb-3">
                               
                                
                              
                                <button
                                onClick={()=>handleOrders()}
                                  type="button"
                                  className={` w-50 shadow-none border-0 text-capitalize ${
                                    tab == "buy" ? `btn_buy` : `btn_sell`
                                  }`}
                                >
                                  {tab == "buy" ? "Buy" : "Sell"}
                                </button>
                               
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
