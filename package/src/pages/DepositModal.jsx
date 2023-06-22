import React, { useState } from 'react'

const DepositModal = ({ portfolio_Data, deposite_Data, copy, activeTab, setTab, Set_network, generateQRCode }) => {
    const [copied,setCopied]=useState("Copy")
    const copyText = () => {
        var data = document.getElementById("address-input");
        data.select();
        document.execCommand("copy");
            setCopied("Copied")
        
        setTimeout(() => {
            setCopied("Copy");
          }, 2000);

    }

    return (
        <div className="modal fade" id="modaldeposit" tabIndex="-1" aria-labelledby="modaldepositLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header border-bottom-0">

                        <h5 className="modal-title text-uppercase m-auto" id="exampleModalLabel"> deposit {portfolio_Data.symbol}</h5>

                        <button type="button" className="btn-close border-0 shadow-none m-0" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        {portfolio_Data.deposit_enable ? (
                            <div className="row px-2 px-lg-5 align-items-center">
                                <div className="col-md-12 col-lg-12 col-xl-12">
                                    <div className="currency_name text-center mb-2">

                                        <ul className="nav nav-pills nav-fill" id="pills-tab" role="tablist">
                                            {portfolio_Data?.currency_networks?.map((network, i) => {
                                                if (network?.deposit_enable) {
                                                    return (
                                                        <li className="nav-item" role="presentation" key={i}>
                                                            <button
                                                                value={network.network_id || ''}
                                                                role="tab"
                                                                aria-selected="true"
                                                                id="pills-bep-tab"
                                                                className={`nav-link  ${activeTab === i ? "active" : ""
                                                                    }`}
                                                                onClick={(e) => { setTab(i); Set_network(network.id) }} key={i}
                                                            >

                                                                {network?.token_type}
                                                            </button>
                                                        </li>
                                                    )
                                                }

                                            })}

                                        </ul>

                                        {/* <button type="button" className="currency_btn shadow-none border-0 w-100" > mmm{portfolio_Data?.token_type} </button> */}
                                    </div>
                                </div>
                                {/* token end */}
                                <div className="col-md-12 col-lg-12 col-xl-12">
                                    <div className="currency_name mb-3">
                                        <label htmlFor="">Wallet Address</label>
                                    </div>
                                </div>
                                {/* wallet address */}

                                <div className="col-md-4 col-lg-3 col-xl-3">
                                    <div className="currency_name mb-4">
                                        <h4>SCAN OR CODE</h4>
                                        <img src={generateQRCode(deposite_Data?.wallet_address)} alt="image" className="img-fluid" />
                                        {/* src="../images/portfolio/scanner.png" */}
                                    </div>
                                </div>
                                {/* scanner */}

                                <div className="col-md-8 col-lg-9 col-xl-9">
                                    <div className="currency_name mb-4">
                                        <label htmlFor="" className="mb-2">COPY LINK</label>
                                        <div className="input-group  mb-3">
                                            <input type="text" className="form-control shadow-none border-0"
                                                // placeholder="0Xc3cc469f3d1647014f10f99a4b00d1c6281bf12f" 
                                                aria-label="Username" aria-describedby="basic-addon1"
                                                id="address-input"
                                                value={deposite_Data?.wallet_address}
                                                placeholder={deposite_Data?.wallet_address}

                                                readOnly
                                            />
                                            <span className="input-group-text" id="basic-addon1">
                                                <button type="button" className="btn_copy shadow-none border-0" onClick={() => copyText()} >{copied}
                                                    <img src="../images/icons/copy.svg" alt="text" className="img-fluid ms-1" />
                                                    {/* <img src="../images/icons/copy.svg" alt="text" className="img-fluid ms-1" /> */}

                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* copy link */}

                                <div className="col-md-12 col-lg-12 col-xl-12">
                                    <div className="deposit_data_box p-3">
                                        <div className="deposit_box d-flex align-items-center justify-content-between mb-3">
                                            <div className="list_deposit"><p className="mb-0">Min Deposit</p></div>
                                            <div className="list_data"><p className="mb-0 text-end">{deposite_Data?.deposit_min}{" "}
                                                {deposite_Data?.token_type}</p></div>
                                        </div>
                                        <div className="deposit_box d-flex align-items-center justify-content-between mb-3">
                                            <div className="list_deposit"><p className="mb-0">Expected Arrival</p></div>
                                            <div className="list_data"><p className="mb-0  text-end">15 Network Confirmation</p></div>
                                        </div>
                                        <div className="deposit_box d-flex align-items-center justify-content-between mb-3">
                                            <div className="list_deposit"><p className="mb-0">Expected Lock</p></div>
                                            <div className="list_data"><p className="mb-0  text-end" >15 Network Confirmation</p></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className='mb-3' style={{ color: "var(--tab-grey)", textAlign: "center" }}>
                                {" "}
                                {portfolio_Data.deposit_desc}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DepositModal