import React, { useEffect, useState } from "react";
import ApiClass from "../../src/api/api"
import { useFormik } from "formik"; // Form Validation Formik Plugin
import * as Yup from "yup";
import SwalClass from "../Common/Swal.js";
import { useSelector } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";
import { Link, Navigate, useNavigate } from "react-router-dom";
import WithdrawModal from "./WithdrawModal";
import DepositModal from "./DepositModal";
import {onHandleKeyDown, onHandleKeyPress,onHandleKeyUp,onHandlePaste} from "../Common/InputText.js";
var total;

export default function PortfolioPage() {

    const navigate = useNavigate()
  const [t_balance, set_t_balance] = useState(0)

  const [error, setError] = useState(false)

    const [PortfolioData, setPortfolioData] = useState([]);
    const [search, setSearch] = useState({
        type: "search",
        value: "",
    });
    const [toggel, setToggel] = useState({
        type: "toggel",
        value: "",
    });
    const [portfolio_Data, setPortfolio_Data] = useState({});
    const [withdraw_Data, setWithdraw_Data] = useState();
    const [deposite_Data, setDeposite_Data] = useState({});
    const [amountError, setAmountError] = useState(false);
    const [activeTab, setTab] = useState(0);
    const [copy, setCopy] = useState("Copy");
    const [loading, setLoading] = useState(false);
    const [Submitloading, setSubmitLoading] = useState(false);

    let IsLogin = true
    //   let IsLogin = useSelector((state) => state.user.token ? true : false);
    const getList = async () => {
        setLoading(true);
        const response = await ApiClass.getNodeRequest("user-crypto/get", true);
        total = response.data.mainTotal;
        const res = response.data.data.map((item) => {
            item.total_price = Number(item.quantity) * Number(item.c_price);
            return item;
        });
        setPortfolioData(res)
        setLoading(false);

        return response?.data || [];
    };
    useEffect(() => {
        if (IsLogin) {
            getList()
        }
    }, [])
    const getListData = () => {
        let ST = search.type;
        var SV = search.value;
        let T = toggel.type;
        var V = toggel.value;
        let all_data = PortfolioData;
        if (ST == "search" && SV != "") {
            return PortfolioData.filter((item) => {
                if (T == "toggle" && V == false) {
                    return item.name.toLowerCase().includes(SV.toLowerCase()) && parseFloat(item.c_bal) != 0;
                }
                else if (T == "toggle" && V == true) {
                    return item.name.toLowerCase().includes(SV.toLowerCase());
                }
                else {
                    return item.name.toLowerCase().includes(SV.toLowerCase());
                }
            });
        }
        if (ST == "search" && SV == "") {
            if (T == "toggle" && V == true) {
                return all_data;
            }
            if (T == "toggle" && V == false) {
                return PortfolioData.filter((item) => {
                    return item.name.toLowerCase().includes(SV.toLowerCase()) && parseFloat(item.c_bal) != 0;
                });
            }
        }
        return all_data;
    };
    // Model_enabel check both withdraw and deposite
    const Model_Click_handler = (portfolio_data) => {
        setPortfolio_Data(portfolio_data);
        setWithdraw_Data(portfolio_data?.currency_networks?.[0]);
        setDeposite_Data(portfolio_data?.currency_networks?.[0]);
    };
    // Set network data in select option in withdraw form
    const network_set = (e) => {
        const { value } = e.target;
        const current_network = portfolio_Data?.currency_networks.find(
            (v) => v.id == value
        );
        setWithdraw_Data(current_network);
    };
    //formik validations
    const formik = useFormik({
        initialValues: {
            destination: "",
            amount: "",
        },
        validationSchema: Yup.object({
            destination: Yup.string().required("Destination is Required."),
            amount: Yup.string().required("Amount is Required."),
        }),
        onSubmit: async (body) => {
            setSubmitLoading(true)
            let new_body = {
                amount: body.amount,
                currency: portfolio_Data.symbol,
                toAddress: body.destination,
                token_type: withdraw_Data.token_type,
            };
            if (Number(portfolio_Data.quantity) > Number(body.amount)) {
                setAmountError(false);
                const response = await ApiClass.postRequest(
                    "block/transfer",
                    true,
                    new_body
                );
                if (response === undefined) {
                    setSubmitLoading(false)
                    SwalClass.error("404 NOT FOUND");
                }
                if (response?.data?.status_code == 0) {
                    setSubmitLoading(false)
                    SwalClass.error(response?.data?.message);
                }


                if (response?.data?.status_code == 1) {
                    setSubmitLoading(false)
                    document.getElementById('closeModalWith').click();
                    localStorage.setItem("email", response.data?.data?.email);
                    localStorage.setItem("timer", response.data?.data?.expired_at);
                    navigate("/otp-withdraw")
                    SwalClass.success(response?.data?.message);
                    formik.resetForm();
                }
            } else {
                setAmountError(true);
                setSubmitLoading(false)

            }
        },
    });

    // Set network data in button in deposite form
    const Set_network = (id) => {
        const currentdeposite_network = portfolio_Data?.currency_networks.find(
            (v) => v.id == id
        );
        setDeposite_Data(currentdeposite_network);
    };


    //Change scan QR code Image
    function generateQRCode(address) {
        return (
            "https://chart.googleapis.com/chart?cht=qr&chl=" +
            address +
            "&chs=160x160&chld=L|0"
        );
    }
    const transferFunds = async (event) => {

        event.preventDefault()
        if (!error && t_balance > 0) {
          let body = {
            amount: t_balance,
          }
          const response = await ApiClass.postNodeRequest("P2P/cryptotransfer/credit", true, body)
          if (response?.data?.status_code == 0) {
            SwalClass.error(response?.data?.message);
            return;
          }
    
          if (response?.data?.status_code == 1) {
            SwalClass.success(response?.data?.message);
            set_t_balance(0)
            document.getElementById('closePortfolioTransferModal').click();
            getList()
          }
        }
      }
      useEffect(() => {
        if (t_balance > 0) {
          setError(false)
        }
      }, [t_balance])
      const checkError = () => {
        if (t_balance <= 0 || t_balance == "") {
          setError(true)
        }
      }
    return (
        <div>
            <section className="portfolio_page p-3">
                <div className="container-fluid">
                    <div className="row row_bg_box align-items-center">
                        <div className="col-md-6 col-lg-6 col-xl-6">
                            <div className="search_box px-3 py-2">
                                <label htmlFor="">Your Balance</label>
                                <p>{total} USDT</p>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1"><img src="../images/icons/search.svg" alt="icons" className="img-fluid" /></span>

                                    <input type="text" className="form-control shadow-none ps-0" value={search.value} placeholder="Search here..." aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                                        onChange={(e) =>
                                            setSearch({
                                                ...search,
                                                type: "search",
                                                value: e.target.value.trimStart(),
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {/* search box column end */}

                        <div className="col-md-6 col-lg-6 col-xl-6">
                            <div className="router_boxes text-end">
                                <div className="portfolio_routers mb-2">
                                    <Link to="/withdraw-history" className="px-2 withdraw_red" >Withdraw History</Link>
                                    <Link to="/deposit-history" className="border-start px-2 deposit_green" >Deposit History</Link>
                                    <a className="border-start px-2 deposit_green" style={{ cursor:"pointer" }}data-bs-toggle="modal" data-bs-target="#transferFundsPortfolio" >Transfer USDT to P2P Wallet</a>
                                </div>
                              
                                <div className="form-check form-switch pe-2">
                                    {/* <input className="form-check-input shadow-none me-2" type="checkbox" id="flexSwitchCheckChecked" /> */}
                                    <input className="form-check-input shadow-none me-2" type="checkbox" id="flexSwitchCheckDefault" role="switch" defaultChecked={true}
                                        onChange={(e) =>
                                            setToggel({
                                                ...toggel,
                                                type: "toggle",
                                                value: e.target.checked,
                                            })
                                        }
                                    />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Show Empty Balances</label>
                                </div>
                            </div>
                        </div>
                        {/* histories end */}
                        <div className="col-md-12 col-lg-12 col-xl-12 px-0">
                            <div className="portfolio_table table-responsive">
                                <table className="table text-center text-nowrap align-middle table-borderless">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-start" style={{ paddingLeft: '105px' }}>Assets</th>
                                            <th scope="col">Current Price</th>
                                            <th scope="col">Qty</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Portfolio</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ?
                                            <tr >
                                                <td colspan={6}>
                                                    <div className="d-flex spinner_border  justify-content-center my-5 py-5">
                                                        <div className="spinner-border" role="status" >
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            :

                                            getListData().map((portfolio, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="">
                                                            <div className="w-100 d-flex justify-content-center">
                                                                <div className="currency d-flex align-items-center w-50 justify-content-start">
                                                                    <div><img
                                                                        src={portfolio.image}
                                                                        style={{ height: '40px' }}
                                                                        alt={""}
                                                                        className="me-2"
                                                                        onError={event => {
                                                                            event.target.src = "./not-found.png"
                                                                            event.onerror = null
                                                                        }}
                                                                    /></div>
                                                                    <div className="data_info"><p className="mb-0 text-start">{portfolio.name} <br /><span>{portfolio.currency}</span></p></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{portfolio.c_price}</td>
                                                        <td>{portfolio.quantity}</td>
                                                        <td>{portfolio.total_price}</td>
                                                        <td>
                                                            <div className="progress_bar">
                                                                <label htmlFor="">{portfolio.label}</label>
                                                                <div className="progress">
                                                                    <div className="progress-bar" role="progressbar" style={{
                                                                        width: total > 0 ? (portfolio.total_price / Number(total) * 100).toFixed(2) + "%" : 0 + "%",
                                                                    }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                                </div>
                                                                <div>
                                                                    <p className=" mb-0">{total > 0 ? ((portfolio.total_price) / Number(total) * 100).toFixed(2) : 0}%</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="button_group">

                                                                <button
                                                                    type="button" className="btn_dp shadow-none border-0 pe-3"
                                                                    data-bs-toggle="modal" data-bs-target="#withdrawModal"
                                                                    onClick={() =>
                                                                        Model_Click_handler(portfolio)
                                                                    }
                                                                >  Withdraw</button>
                                                                <button type="button" className="btn_wd shadow-none border-0 ps-3" data-bs-toggle="modal" data-bs-target="#modaldeposit" onClick={() => Model_Click_handler(portfolio)}>Deposit</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        {/*  portfolio table data end */}

                    </div>

                    {/* modal withdraw  start*/}
                    <WithdrawModal portfolio_Data={portfolio_Data} withdraw_Data={withdraw_Data} formik={formik} amountError={amountError} network_set={network_set} setSubmitLoading={setSubmitLoading} setAmountError={setAmountError} Submitloading={Submitloading} />

                    {/* modal deposit  start*/}
                    <DepositModal portfolio_Data={portfolio_Data} deposite_Data={deposite_Data} copy={copy} activeTab={activeTab} setTab={setTab} Set_network={Set_network} generateQRCode={generateQRCode} />
                </div>
                <div className="modal fade" id="transferFundsPortfolio" tabIndex="-1" aria-labelledby="transferFundsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content fundexchange">
            <div className="modal-header border-bottom-0">
              <h1 className="modal-title text-capitalize" id="transferFundsModalLabel">fund transfer</h1>
              <button type="button" className="btn border-0 p-0" data-bs-dismiss="modal" aria-label="Close" id="closePortfolioTransferModal">
                <svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 48 48" fill="var(--ch-white)"><path d="m16.5 33.6 7.5-7.5 7.5 7.5 2.1-2.1-7.5-7.5 7.5-7.5-2.1-2.1-7.5 7.5-7.5-7.5-2.1 2.1 7.5 7.5-7.5 7.5ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z" /></svg>
              </button>
            </div>
            <div className="modal-body">
              <form className="fund-form" onSubmit={transferFunds} >
                <input type="text" placeholder="Enter Amount" name="t_balance" id="t_balance" className="form-control mb-3" value={t_balance}
                 onKeyPress= {(e) => onHandleKeyPress(e, 2)}
                 onKeyUp= {(e) => onHandleKeyUp(e)}
                 onKeyDown= {(e) => onHandleKeyDown(e)}
                 onPaste={ (e) => onHandlePaste(e, 2)}
                 onDragOver={ (e) => e.preventDefault()}
                onChange={e => set_t_balance(e.target.value)} />
                {error && <p className='text-danger'>The Amount should be greater than zero</p>}
                <div className="d-flex justify-content-end gap-3">
                  <button
                    type={t_balance > 0 ? "submit" : "button"}
                    onClick={checkError}
                    style={{
                        backgroundColor: 'var(--stg-green)',
                        color: 'var(--black-bg)',
                        fontSize: '14px',
                        fontWeight: '500'
                    }} className="btn rounded" 

                  >
                    transfer
                  </button>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    style={{
                        backgroundColor: 'var(--stg-green)',
                        color: 'var(--black-bg)',
                        fontSize: '14px',
                        fontWeight: '500'
                    }} className="btn rounded" 

                  >
                    close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
            </section>

        </div>
    );
}

