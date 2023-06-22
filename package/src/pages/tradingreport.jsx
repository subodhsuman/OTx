import React from "react";
import SettingLayout from "../Layout/SettingLayout.jsx";
import SettingWrapper from "../utilites/SettingWrapper.jsx";
const TradingReport = () =>{
    return(
        <>  
            <SettingLayout>
                <SettingWrapper heading="download trading report">
                    <div className="trading_report">
                        <h6 className="mb-2 text-capitalize">get your trading report on your email.</h6>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="mb-3 p-3 date-picker rounded">
                                    <label forHTML="" className="form-label text-capitalize">from date</label>
                                    <input type="date" className="form-control border-0" />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-3 p-3 date-picker rounded">
                                    <label forHTML="" className="form-label text-capitalize">to date</label>
                                    <input type="date" className="form-control border-0" />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="include">
                                <p className="mb-2">
                                    The report will include:
                                </p>
                                <ul className="ps-0 list-unstyled">
                                    <li>1. Exchange Trades</li>
                                    <li>2. P2P Trades</li>
                                    <li>3. STF Trades</li>
                                    <li>4. Current Coin Balance</li>
                                    <li>6. Ledger History</li>
                                    <li>7. Airdrops and other distributions</li>
                                </ul>
                                </div>
                            </div>
                        </div>
                        <div className="save_btn text-center mt-3">
                            <button type="button" className="btn px-5 rounded-pill text-uppercase border-0">requst trading report</button>
                        </div>
                    </div>
                </SettingWrapper>
            </SettingLayout>
        </> 
    )
}

export default TradingReport;