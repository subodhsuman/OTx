import React from "react";
export default function P2pbuyComponent({ P2p, IsLogin, TabData, modalData }) {
  return (
    <div className="otx-table">
      <div className="row">
        <div className="col-md-12">
          <div className="buy_list d-none d-md-flex align-items-center text-center p-3 ps-0 mb-3">
            <div className="buy_heading">
              <h3 className="m-0">Advertisers</h3>
              <h3 className="m-0">(Completion rate)</h3>
            </div>
            <div className="buy_heading">
              <h3 className="" style={{ marginRight: " 98px" }}>
                Price
              </h3>
            </div>
            <div className="buy_heading">
              <h3 className="">Limit / Available</h3>
            </div>
            <div className="buy_heading hide_heading">
              <h3 className="">Payment</h3>
            </div>
            <div className="buy_heading1">
              <h3 className="">
                Trade<span className="badge ms-2">0 fee</span>
              </h3>
            </div>
          </div>
          <div className="table-data">
            {/* loop */}
            {TabData["s"]?.data?.length > 0 ?
              TabData["s"]?.data?.map((val, i) => {
                return (
                  <div className="mb-2 ">
                    <div className="main-data-list d-md-flex align-items-center px-3 mt-5 mt-md-0 py-3 ">
                      {/* table data div-1 */}
                      <div className="list_box_buy d-flex gap-3 mb-3 mb-md-0 justify-content-md-center ">
                        <div className="otx-icon">
                          {/* <img src="./images/icons/p2p-icon.png" alt="logo" /> */}
                          <span className="text-uppercase">o</span>
                        </div>
                        <div className="otx-icon-data">
                          <p className="m-0">{val?.user?.name}</p>
                        </div>
                      </div>
                      {/* table data div-2 */}
                      <div className="list_box_buy d-flex gap-3 mb-3 mb-md-0  justify-content-md-center ">
                        {val.at_price} {val.with_currency}
                      </div>
                      {/* table data div-3 */}
                      <div className="list_box_buy limit_box  ps-md-2 justify-content-md-center mb-3 mb-md-0">
                        <div className="justify-content-md-center align-items-center">
                          <div className="rating_box mb-2">
                            Available: {val.pending_quantity} {val.currency}
                          </div>
                          <div className="limit_rate ">Limit: {val.min_quantity * val.at_price} {val.with_currency} - {val.pending_quantity * val.at_price} {val.with_currency}</div>
                        </div>
                        <div className="d-flex justify-content-md-center align-items-center">
                          <div className="rating_box ">{val.limit}</div>
                          <div className="limit_rate  ps-5">{val.limitdata}</div>
                        </div>
                      </div>
                      {/* table data div-4 */}
                      <div className="imps-box list_box_buy text-md-center mb-3 mb-md-0">
                        <p className="text-uppercase m-0">
                          <span>{val.payment_type}</span>
                        </p>
                      </div>
                      {/* table data div-5 */}
                      <div className="col-lg-2">
                        <div className="mrkt-type-trade mb-2 mb-lg-0">
                          <button
                            className="btn rounded-pill text-capitalize py-2 px-4 px-md-3 px-lg-4"
                            style={{ background: 'var(--trade-red)', color:'#FFF' }}
                            data-bs-toggle="modal"
                            data-bs-target={IsLogin ? "#buy-sell-modal" : ""}
                            onClick={() => { IsLogin ? modalData(val) : nav("/login") }}
                          >
                            <p className="mb-0 text-white">Sell{val.currency}</p>

                          </button>

                        </div>
                      </div>
                      {/* <div className=" buy-usdt-btn list_box_buy text-md-center mb-3 mb-md-0">
                      <a
                        className="btn sell-btn rounded-pill taxt-capitalize py-2 px-4 px-md-3 px-lg-4"
                        data-bs-toggle="collapse"
                        href={`#collapseExample${i}`}
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                      >
                        Sell {val.currency}
                      </a>
                    </div> */}
                    </div>
                    {/* collapse data */}
                    <div className="collapse" id={`collapseExample${i}`}>
                      <div className="card card-body rounded-0">
                        <div className="main-data-list1 d-lg-flex justify-content-between align-items-center  gap-2">
                          {/* collapse-content div 1 */}
                          <div className="collapse-content">
                            <div className="list_box_buy1 d-flex gap-3 mb-3">
                              <div className="otx-icon">
                                <span className="text-uppercase">o</span>
                              </div>
                              <div className="otx-icon-data1">
                                <p className="m-0">{val.data1}</p>
                                <label>
                                  {val.data2} | {val.data2}
                                </label>
                              </div>
                            </div>
                            <div className="list_box_buy1 ">
                              <p>
                                {val.data4} &nbsp; &nbsp; <span>{val.data5}</span>
                              </p>
                            </div>
                          </div>
                          {/* collapse-content div 2 */}
                          <div className="collapse-content">
                            <div className="list_box_buy limit_box ps-2  mb-3">
                              <div className="d-flex  align-items-center">
                                <div className="rating_box text-center  me-4">
                                  {val.data6}
                                </div>
                                <div className="limit_rate ">{val.data7}</div>
                              </div>
                              <div className="d-flex  align-items-center">
                                <div className="rating_box ">{val.data8}</div>
                                <div className="limit_rate  ps-5">{val.data9}</div>
                              </div>
                            </div>
                            <div className="imps-box list_box_buy d-flex gap-3">
                              <label>{val.data10}</label>
                              <p className="text-uppercase m-0">
                                {val.data11} &nbsp; &nbsp;{" "}
                                <span>{val.data12}</span>
                              </p>
                            </div>
                          </div>

                          {/* collapse-content div 3 */}
                          <div>
                            <div className="collapse-content d-lg-flex gap-3">
                              <div className="mt-3 mt-lg-0">
                                <label className="mb-2">I want to pay</label>
                                <div className="input-group rounded-pill mb-4">
                                  <input
                                    type="text"
                                    className="form-control  border-0 shadow-none bg-transparent"
                                    aria-label="Dollar amount (with dot and two decimal places)"
                                  />
                                  <span className="input-group-text bg-transparent border-0 ">
                                    All
                                  </span>
                                  <span className="input-group-text text-uppercase border-0  bg-transparent">
                                    czk
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3 mt-lg-0">
                                <label className="mb-2">I will receive</label>
                                <div className="input-group rounded-pill mb-4">
                                  <span className="input-group-text bg-transparent border-0 ">
                                    00
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control shadow-none bg-transparent border-0 "
                                    aria-label="Amount (to the nearest dollar)"
                                  />
                                  <span className="input-group-text text-uppercase bg-transparent border-0 ">
                                    usdt
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="sell-input  d-lg-flex justify-content-between gap-3">
                              <div className="sell-dropdown">
                                <div className="input-group rounded-pill">
                                  <input
                                    type="text"
                                    className="form-control bg-transparent border-0 shadow-none"
                                    aria-label="Text input with dropdown button"
                                    placeholder="set payment method"
                                  />
                                  <button
                                    className="btn btn-outline-secondary dropdown-toggle border-0 shadow-none"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <img src="./images/icons/down-arrow.svg" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <a className="dropdown-item" href="#">
                                        Action
                                      </a>
                                    </li>
                                    <li>
                                      <a className="dropdown-item" href="#">
                                        Another action
                                      </a>
                                    </li>
                                    <li>
                                      <a className="dropdown-item" href="#">
                                        Something else here
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a className="dropdown-item" href="#">
                                        Separated link
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="sell-btn w-50 d-grid ">
                                <a
                                  href=""
                                  className="text-decoration-none text-center rounded-pill py-2 mt-3 mt-lg-0"
                                >
                                  Sell USDT
                                </a>
                              </div>
                            </div>
                          </div>
                          {/* collapse-content div 4 */}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
              :
              <div className="row py-2 m-2 border align-items-center text-center justify-content-between"    >
                <div className="col">
                  No records Found
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
