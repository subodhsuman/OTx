import React, { useState, useEffect } from "react";
import { onHandleKeyDown, onHandleKeyPress, onHandleKeyUp, onHandlePaste } from '../../Common/InputText';
export default function P2pBuyComponent({ P2p, type }) {
    //   console.log({type});
    // console.log(TabData,'tabdata check')
    const [select1, setSelect1] = useState({
        id: 1,
        name: "inr",
        image: "coin.png",
    });
    const [select, setSelect] = useState({
        id: 1,
        name: "All Payments",
    });
    const [select2, setSelect2] = useState({
        id: 1,
        name: "All Regions",
    });
    let CoinList1 = [
        { id: 1, name: "inr", image: "coin.png" },
    ];
    let CoinList = [
        { id: 1, name: "All Payments" },
        { id: 4, name: "Bank Transfer" },
        { id: 5, name: "Upi" },
    ];
    useEffect(() => {
        select.name == "All Payments" ? P2p("", type) : select.name == "Bank Transfer" ? P2p("bank_transfer", type) : P2p("upi", type)

        return () => {
            if (!select) return;
        }
    }, [select])


    return (
        <div>
            <div className="row">
                <div className="col-md-6 col-lg-4  col-xl-3  col-xxl-3">
                    <div className="top_head_p2p mb-3">
                        {type &&
                            <form onSubmit={() => P2p("", type, document.getElementById("amount").value, "search")}>
                                <label htmlFor="">Amount</label>

                                <div className="input-group">
                                    <input type="text" className="form-control shadow-none" placeholder="Enter Amount" onKeyPress={(e) => onHandleKeyPress(e, 2)}
                                        onKeyUp={(e) => onHandleKeyUp(e)}
                                        onKeyDown={(e) => onHandleKeyDown(e)}
                                        onPaste={(e) => onHandlePaste(e, 2)}
                                        onDragOver={(e) => e.preventDefault()} id="amount" aria-label="Enter Amount" aria-describedby="basic-addon1" />
                                    <span className="input-group-text" id="basic-addon1">INR</span>
                                    <span id="amount" className="input-group-text"><input onClick={() => { P2p("", type, document.getElementById("amount").value, "search") }} className="btn_search shadow-none border-0" type="button" value="Search"></input></span>
                                </div>

                            </form>}
                    </div>
                </div>
                {/* col-end */}
                <div className="col-md-2 col-lg-2  col-xl-2  col-xxl-1">
                    <div className="top_head_p2p mb-3">
                        <label htmlFor="">Fiat</label>
                        <div className="dropdown">
                            <button className="btn btn_drop dropdown-toggle text-uppercase" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img
                                    src={`/images/p2p/${select1.image}`}
                                    alt="icon"
                                    className="img-fluid me-2"
                                />
                                {select1.name}
                            </button>
                            <div className="dropdown-menu">
                                <ul className="list_orders list-unstyled mb-0">
                                    {CoinList1.map((val, i) => {
                                        return (
                                            <li className="list-items mx-3 text-uppercase py-1" onClick={() => setSelect1(val)} key={i}> <img
                                                src={`/images/p2p/${select1.image}`}
                                                alt="icon"

                                                className="img-fluid me-2"
                                            />{val.name}</li>
                                        );
                                    })}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
                {/* col */}
                <div className="col-md-4 col-lg-3  col-xl-2  col-xxl-2">
                    <div className="top_head_p2p mb-3">
                        <label htmlFor="">Payment</label>
                        <div className="dropdown">
                            <button className="btn btn_drop dropdown-toggle text-capitalize w-100 d-flex align-items-center justify-content-between" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {select.name}{" "}
                            </button>
                            <div className="dropdown-menu px-2">
                                <div className="input-group mb-2">
                                    <span className="input-group-text px-2" id="basic-addon1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17.567" height="17.566" viewBox="0 0 17.567 17.566">
                                            <path id="Icon_metro-search" data-name="Icon metro-search" d="M19.593,16.877l-4.161-3.539a1.857,1.857,0,0,0-1.262-.548,6.589,6.589,0,1,0-.737.737,1.857,1.857,0,0,0,.548,1.262L17.52,18.95a1.476,1.476,0,1,0,2.073-2.073ZM9.158,12.907A4.392,4.392,0,1,1,13.55,8.516,4.392,4.392,0,0,1,9.158,12.907Z" transform="translate(-2.57 -1.928)" fill="#2dbd96" />
                                        </svg>
                                    </span>
                                    <input type="text" className="form-control shadow-none border-0 ps-0" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" />
                                </div>
                                {/* search bar */}
                                <ul className="list_orders list-unstyled mb-0">
                                    {CoinList.map((val, i) => {
                                        return (
                                            <li className="list-items text-capitalize py-1 " key={i} onClick={() => setSelect(val)} >{val.name}</li>
                                        );
                                    })}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
                {/* col end */}
                {/* <div className="col-md-4 col-lg-3  col-xl-3  col-xxl-2">
                <div className="top_head_p2p mb-3">
                        <label htmlFor="">Available Region(s) </label>
                        <div className="dropdown">
                        <button className="btn btn_drop dropdown-toggle text-capitalize w-100 d-flex align-items-center justify-content-between"  type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {select2.name}{" "}
                        </button>
                        <div className="dropdown-menu px-2">
                                <div className="input-group mb-2">
                                    <span className="input-group-text px-2" id="basic-addon1">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="17.567" height="17.566" viewBox="0 0 17.567 17.566">
  <path id="Icon_metro-search" data-name="Icon metro-search" d="M19.593,16.877l-4.161-3.539a1.857,1.857,0,0,0-1.262-.548,6.589,6.589,0,1,0-.737.737,1.857,1.857,0,0,0,.548,1.262L17.52,18.95a1.476,1.476,0,1,0,2.073-2.073ZM9.158,12.907A4.392,4.392,0,1,1,13.55,8.516,4.392,4.392,0,0,1,9.158,12.907Z" transform="translate(-2.57 -1.928)" fill="#2dbd96"/>
                                       </svg>
                                    </span>
                                    <input type="text" className="form-control shadow-none border-0 ps-0" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1"/>
                                </div>
                                  
                                  <ul className="list_orders list-unstyled mb-0">
                                    {CoinList2.map((val, i) => {
                                return (   
                                    <li className="list-items text-capitalize py-1 "  onClick={() => setSelect2
                                        (val)} >{val.name}</li>
                                    );
                                        })}
                                 </ul>
                        </div>
                                
                    </div>                          
                </div>
                </div> */}
                {/* col end */}
                {/* <div className="col-md-2 col-lg-2  col-xl-2  col-xxl-1 align-self-end pb-4">
                    <div className="top_head_p2p ">
                        <button className="btn_filter shadow-none border-0" type="button">Filter <svg xmlns="http://www.w3.org/2000/svg" className="ms-2" width="12.63" height="5.85" viewBox="0 0 12.63 7.85">
    <path id="Path_20791" data-name="Path 20791" d="M143.36,12.63l-7.85-6.324L143.36,0Z" transform="translate(0 143.36) rotate(-90)" fill="#fff" fill-rule="evenodd"/>
    </svg>
    </button>
                    </div>
                </div> */}
            </div>
            {/* row end */}
        </div>
    )
}