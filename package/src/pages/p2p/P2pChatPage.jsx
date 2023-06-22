import React from "react";
import P2pChatComponent from "../../components/p2p/P2pChatComponent";
// import qr_code from '/images/icons/qr_code.svg';
import Info from '/images/icons/info_neon.svg';
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiClass from "../../api/api";
import { useEffect } from "react";
import { useState } from "react";
import SwalClass from "../../Common/Swal";
import { useSelector } from "react-redux";
import { socket } from "../../service/socket";
import Timer from "./Timer";
let type, rec_id, sockets, OtherUserDetail;
let all_methods = [];
let ask = [
  {
    ask: "I do not want to trade anymore",
  },
  {
    ask: "I do not meet the requirements of the advertiser's trading terms and condition",
  },
  {
    ask: "Seller is asking for extra fee",
  },
  {
    ask: "Problem with seller's payment method result in unsuccessful payments",
  },
  {
    ask: "Other reasons",
  }

]
function generateQRCode(address = null) {
  return (
    "https://chart.googleapis.com/chart?cht=qr&chl=" + "upi://pay?pa=" +
    address + "&chs=160x160&chld=L|0"
  );
}
export default function P2pChatPage() {
  const [reason, setReason] = useState('')
  let token = useSelector((state) => { return state.user.token });
  let nav = useNavigate()
  const UserId = useSelector((state) => {
    return state.user.detail.id;
  });
  const [searchParams] = useSearchParams({});
  let id = searchParams.get("s");
  const [data, setData] = useState([])
  const [zoom, setZoom] = useState(false)

  const [cancel, setCancel] = useState(true)
  const [confirm, setConfirm] = useState(false)
  const [step, setStep] = useState(1)
  const [notified, setNotified] = useState(false)
  const [notifieSeller, setNotifieSeller] = useState(true);
  const [isSocket, setIsSocket] = useState(false);

  const [hasExpried, setHasExpried] = useState("");


  const [otherReason, setOtherReason] = useState(false);
  const [orderStatus, setorderStatus] = useState(false)
  const copyText = (v) => {
    let text = document.getElementById(v).innerText;
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
  }


  useEffect(() => {

    OrderDetail();

    return () => {
      sockets.disconnect();
    }
  }, []);
  // const handleChange = (event) => {
  //     setP_type(event.target.value)
  // };


  // const [paymentMethod, setPaymentMethod] = useState([]);
  const [curremtPaymentMethod, setcurremtPaymentMethod] = useState("bank"); 

  // useEffect(() => {
  // },[curremtPaymentMethod]);


  useEffect(() => { 
    if (reason == "Other reasons" || otherReason) {
      setOtherReason(true);
    }

    if (reason != "Other reasons" && !otherReason) {
      setOtherReason(false);
    }
    ask?.map((val) => {
      if (val.ask == reason && reason != "Other reasons") {
        setOtherReason(false);
      }
    })

  }, [reason])


  const OrderDetail = async () => {
    let response = await ApiClass.getNodeRequest(`P2P/trade/getorder?match_id=${id}`, true);

    if (response?.data?.status_code == "1") {
      if (response?.data?.data?.order?.buyer?.user_id == UserId) {
        type = "buy"
      }
      if (response?.data?.data?.order?.seller?.user_id == UserId) {
        type = "sell"
      }
      if (response?.data?.data?.order?.buyer_confirmation == "1") {
        setStep(2)
        setNotified(true)
        setNotifieSeller(false)
      }
      if (response?.data?.data?.order?.seller_confirmation == "1") {
        setStep(3)
        setConfirm(true)

      }
      if (response?.data?.data?.sell_bank_details != null) {
        if (!all_methods.includes("bank")) {
          all_methods.push("bank");
        }
      }


      if (response?.data?.data?.sell_upi_details != null) {
        if (!all_methods.includes("upi")) {
          all_methods.push("upi");
        }
      }

      // setPaymentMethod(all_methods);


      OtherUserDetail = response?.data?.data?.receiver_user
      setData(response?.data?.data)
      rec_id = (response?.data?.data?.receiver_user?.id);



      // connection with socket

      connectWithSocket(rec_id);

      setHasExpried(response?.data?.data?.order?.expired_at);
    }
    if (response?.data?.status_code == "0") {
      SwalClass.error(response.data.message)
      nav("/p2p")
    }


  }
  const Cancel = async (val = null) => {
    if (!val && reason == '') {
      SwalClass.error("Reason is Required.");
      return;
    }

    let response = await ApiClass.postNodeRequest(`P2P/P2POrder/cancelorder?match_id=${id}`, true, { remark: reason || val });
    if (response.data.status_code == 0) {
      SwalClass.error(response?.data?.message)
    }
    if (response.data.status_code == 1) {
      SwalClass.success(response?.data?.message); 
      document.getElementById("closeModal").click();

      let cancel_order = {
        receiver_id: rec_id,
        match_id: id,
        sender_id: UserId,

      }
      sockets.emit("CancelOrder", cancel_order);
      setCancel(false)
      setTimeout(() => {
        nav("/p2p")
      }, 2000);
    }
  }
  const NotifySeller = async () => {
    let response = await ApiClass.postNodeRequest(`P2P/trade/send_mail?match_id=${id}`, {}, true);
    if (response?.data?.status_code == 0) {
      SwalClass.error(response?.data?.message)
    }
    if (response.data.status_code == 1) {
      setNotifieSeller(false)
      setStep(2)
      SwalClass.success(response?.data?.message)
      sockets.emit('transferNotified', {
        seller_id: rec_id,
        match_id: id,
        sender_id: UserId
      });
    }
  }
  const PaymentRec = async () => {
    var response = await ApiClass.postNodeRequest('P2P/trade/confirmOrder?match_id=' + id, true);
    if (response?.data?.status_code == "1") {
      setConfirm(true)
      setStep(3)
      sockets.emit('PaymentReceived', {
        api_status_code: response.data.status_code,
        api_message: response.data.message,
        buyer_id: rec_id,
        match_id: id,
        sender_id: UserId
      });
      setTimeout(() => {
        nav("/p2p")
      }, 2000);
    }
  }



  const connectWithSocket = async (rec_id) => {
    sockets = socket({ query: `token=${token}` });

    sockets.on('connect', () => {
 
      sockets.emit('connectChatRoom', UserId, rec_id);

      setIsSocket(true);

    });


    sockets.on('disconnect', function () {
      console.log('disconnect has been disconnected');
    });


    sockets.on('showReceivedButton', (data) => {
      setStep(2)

      if (data) {
        setNotified(true)
      }
    });
    sockets.on('showMsg', (v) => { 
      if (v.receiver_id == UserId && v.api_status_code == "0") {
        setCancel(false)
        setTimeout(() => {
          nav("/p2p")
        }, 2000);
      }
      if (v.receiver_id == UserId && v.api_status_code == "1") {
        setStep(3)
        setConfirm(true)
        setTimeout(() => {
          nav("/p2p")
        }, 2000);
      }
    });
  }

  useEffect(() => {
    if (orderStatus) {
      Cancel("Times Up")
    }
  }, [orderStatus])


  // function handlePayment(e, v){
  //   if(e.target.checked){
  //     setcurremtPaymentMethod(v)
  //   }
  // }
  return (
    <>
      <section className="chat_box">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="buy_from">
                  <h6 className="text-white">{type == "buy" ? "Buy from " : "Sell to "}
                    {OtherUserDetail?.name} </h6>
                  <p className="mb-2">
                    The Order Is Created , Please Wait For System Confirmation.

                  </p>
                  {/* <Timer expiry={hasExpried} setorderStatus={setorderStatus} /> */}
                  <div className="timer_box d-flex text-white mb-3">
                    <button className="timer-btn">
                    <Timer expiry={hasExpried} setorderStatus={setorderStatus} />
                    </button>


                  </div>
                </div>
              </div>
              <div className="col-md-6 text-md-end text-start">
                <div className="order_detail_box">
                  <p>

                    <span className="me-3">Order Number:</span> {data?.order?.id}
                  </p>
                  <p>

                    <span className="me-3">Time Created:</span>{new Date(data?.order?.buyer?.updated_at).toLocaleString("en-GB")}
                  </p>
                </div>
              </div>
            </div>
            <div className="row chat_main_box mt-5 py-5 p-3">
              <div className="col-md-12">
                <div className="list mb-4">
                  <ul className="list-unstyled text-white d-md-flex d-block justify-content-evenly" >
                    {step == 1 ? <li style={{ backgroundColor: 'var(--green)' }}><p className="mb-0 text-capitalize" >
                      1.{type == "buy" ? "transfer payments to seller" : "Pending Payment"}
                    </p> </li> : <li><p className="mb-0 text-capitalize" >
                      1.{type == "buy" ? "transfer payments to seller" : "Pending Payment"}
                    </p> </li>}
                    {step == 2 ? <li style={{ backgroundColor: 'var(--green)' }}> 2.  {type == "buy" ? "pending seller to release crypto" :
                      "Release Crypto to the buyer?"}</li> : <li className="mb-0 text-capitalize">2.  {type == "buy" ? "pending seller to release crypto" :
                        "Release Crypto to the buyer?"}</li>}
                    {step == 3 ? <li style={{ backgroundColor: 'var(--green)' }}> 3. Completed </li> : <li> 3. Completed </li>}
                  </ul>
                </div>
              </div>
              <div className="col-md-12 col-xl-6">
              {(type == "sell" || notifieSeller) && cancel && !confirm &&
                <>
                  {/* // Confirm Order Info */}
                  <div className="text-white mb-4">
                    <p className="text-white">{type == "buy" && "confirm"} Order Info</p>

                    {/* ABOUT ORDER */}
                    <div className="about_order d-flex justify-content-between  mb-5">
                      <div className="border_end" style={{ flexBasis: "22.3%" }}>
                        <p>Amount</p>
                        <span >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13.495" height="19" viewBox="0 0 13.495 19" fill="var(--trade-green)">
                            <path id="Path_1580" data-name="Path 1580" d="M410.613,546.354a5.97,5.97,0,0,0,2-1.656,5.547,5.547,0,0,0,.877-2.144h2.29s.438-.585,1.218-1.754a.048.048,0,0,0-.049-.049h-3.508a4.254,4.254,0,0,0-.926-1.949h3.264a14.625,14.625,0,0,0,1.218-1.8H404.718a17.477,17.477,0,0,0-1.218,1.754v.049h3.215a5.633,5.633,0,0,1,1.8.341,3.444,3.444,0,0,1,1.949,1.559h-5.749s-.438.585-1.218,1.754a.048.048,0,0,0,.049.049h7.308a2.02,2.02,0,0,1-.146.779c-.633,1.754-2.338,2.631-5.018,2.631a7.872,7.872,0,0,1-1.51-.1v1.754c0,.049,2.387,2.826,7.21,8.428h2.631c.049,0,.049,0,.049-.049v-.341l-6.041-7.308a6.246,6.246,0,0,1-.828-1.072A6.972,6.972,0,0,0,410.613,546.354Z" transform="translate(-403.5 -537)" />
                          </svg>
                          {(data?.order?.at_price) * (data?.order?.quantity)}
                        </span>
                      </div>
                      <div className="border_end" style={{ flexBasis: "22.3%" }}>
                        <p>Price</p>
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="13.495" height="19" viewBox="0 0 13.495 19" fill="var(--trade-green)">
                          <path id="Path_1580" data-name="Path 1580" d="M410.613,546.354a5.97,5.97,0,0,0,2-1.656,5.547,5.547,0,0,0,.877-2.144h2.29s.438-.585,1.218-1.754a.048.048,0,0,0-.049-.049h-3.508a4.254,4.254,0,0,0-.926-1.949h3.264a14.625,14.625,0,0,0,1.218-1.8H404.718a17.477,17.477,0,0,0-1.218,1.754v.049h3.215a5.633,5.633,0,0,1,1.8.341,3.444,3.444,0,0,1,1.949,1.559h-5.749s-.438.585-1.218,1.754a.048.048,0,0,0,.049.049h7.308a2.02,2.02,0,0,1-.146.779c-.633,1.754-2.338,2.631-5.018,2.631a7.872,7.872,0,0,1-1.51-.1v1.754c0,.049,2.387,2.826,7.21,8.428h2.631c.049,0,.049,0,.049-.049v-.341l-6.041-7.308a6.246,6.246,0,0,1-.828-1.072A6.972,6.972,0,0,0,410.613,546.354Z" transform="translate(-403.5 -537)" fill="var(--hideous-grey)" />
                        </svg> {data?.order?.at_price}</span>
                      </div>
                      <div style={{ flexBasis: "33.3%" }}>
                        <p>Quantity</p>
                        <span> {data?.order?.quantity} USDT</span>
                      </div>
                    </div>
                    {/* ABOUT Seller's Account */}
                    <div className="about_seller_ac">
                      {type == "buy" ? <>
                        <p>

                          Transfer The Funds To The Seller's Account Provided Below.
                        </p>
                        <img
                          src={Info}
                          alt="info"
                        />&nbsp;
                        OTX only supports real-name verified payments methods
                      </> : <div className="mb-2"></div>}
                      <div className="select_account  d-md-flex d-block gap-md-4 gap-0 align-items-center  mb-5 mt-2">
                        {
                          all_methods &&
                          all_methods.map((v, i) => {
                            return (<div
                              className="form-check px-3 mb-2 border_end d-flex align-items-baseline"
                              // style={{ flexBasis: "26.3%" }}
                              key={i}
                            >
                              <input
                                className="form-check-input shadow-none"
                                type="checkbox"
                                name="flexRadioDefault"
                                value={v}
                                onChange={() => setcurremtPaymentMethod(v)} checked={curremtPaymentMethod == v}
                              />
                              <label className="form-check-label" htmlFor="flexRadioDefaultupi">
                                {v == "bank" &&
                                  <img
                                    src="/images/p2p-chat/bank.png"
                                    alt="img"
                                    loading="lazy"
                                    className=""
                                    height="50"
                                    width="60"
                                  />}
                                {v == "upi" && <img
                                  src="/images/p2p-chat/upi.png"
                                  alt="img"
                                  loading="lazy"
                                  className="img-fluid"
                                />}
                              </label>

                            </div>
                            )
                          })
                        }
                      </div>
                    </div>
                    {curremtPaymentMethod == "bank" &&
                      <div className="detail_box p-4 rounded-2 w_50 mb-4">
                        <p onClick={() => copyText("bank-name-input")} id="bank-name-input">
                          Name: <span className="mx-3" >{data?.sell_bank_details?.alias}&nbsp;</span>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15.098"
                              height="19.826"
                              viewBox="0 0 12.098 13.826"
                            >
                              <path
                                id="Icon_awesome-copy"
                                data-name="Icon awesome-copy"
                                d="M8.641,12.1v1.08a.648.648,0,0,1-.648.648H.648A.648.648,0,0,1,0,13.178V3.24a.648.648,0,0,1,.648-.648H2.592v7.993A1.514,1.514,0,0,0,4.1,12.1Zm0-9.289V0H4.1a.648.648,0,0,0-.648.648v9.937a.648.648,0,0,0,.648.648H11.45a.648.648,0,0,0,.648-.648V3.456H9.289A.65.65,0,0,1,8.641,2.808Zm3.267-.838L10.127.19A.648.648,0,0,0,9.669,0H9.505V2.592H12.1V2.429a.648.648,0,0,0-.19-.458Z"
                                fill="#fff"
                              />
                            </svg>
                          </span>
                        </p>
                        <p onClick={() => copyText("bank-account-input")} id="bank-account-input">
                          Account Number: {data?.sell_bank_details?.account_number}&nbsp;{" "}
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15.098"
                              height="19.826"
                              viewBox="0 0 12.098 13.826"
                            >
                              <path
                                id="Icon_awesome-copy"
                                data-name="Icon awesome-copy"
                                d="M8.641,12.1v1.08a.648.648,0,0,1-.648.648H.648A.648.648,0,0,1,0,13.178V3.24a.648.648,0,0,1,.648-.648H2.592v7.993A1.514,1.514,0,0,0,4.1,12.1Zm0-9.289V0H4.1a.648.648,0,0,0-.648.648v9.937a.648.648,0,0,0,.648.648H11.45a.648.648,0,0,0,.648-.648V3.456H9.289A.65.65,0,0,1,8.641,2.808Zm3.267-.838L10.127.19A.648.648,0,0,0,9.669,0H9.505V2.592H12.1V2.429a.648.648,0,0,0-.19-.458Z"
                                fill="#fff"
                              />
                            </svg>
                          </span>
                        </p>
                        <p onClick={() => copyText("bank-ifsc_code-input")} id="bank-ifsc_code-input">
                          IFSC Code:{data?.sell_bank_details?.ifsc_code}&nbsp;
                          <span className="ms-3">
                            {" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16.748"
                              height="19.748"
                              viewBox="0 0 14.748 14.748"
                            >
                            </svg>
                          </span>
                        </p>
                      </div>}
                    {curremtPaymentMethod == "upi" &&
                      <div className="detail_box p-4 rounded-2 w_50 mb-4">
                        <p>
                          Name: <span className="mx-3"> {data?.sell_upi_details?.alias}&nbsp;</span>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15.098"
                              height="19.826"
                              viewBox="0 0 12.098 13.826"
                            >
                              <path
                                id="Icon_awesome-copy"
                                data-name="Icon awesome-copy"
                                d="M8.641,12.1v1.08a.648.648,0,0,1-.648.648H.648A.648.648,0,0,1,0,13.178V3.24a.648.648,0,0,1,.648-.648H2.592v7.993A1.514,1.514,0,0,0,4.1,12.1Zm0-9.289V0H4.1a.648.648,0,0,0-.648.648v9.937a.648.648,0,0,0,.648.648H11.45a.648.648,0,0,0,.648-.648V3.456H9.289A.65.65,0,0,1,8.641,2.808Zm3.267-.838L10.127.19A.648.648,0,0,0,9.669,0H9.505V2.592H12.1V2.429a.648.648,0,0,0-.19-.458Z"
                                fill="#fff"
                              />
                            </svg>
                          </span>
                        </p>
                        <p>
                          Upi Id: <span className="mx-3">{data?.sell_upi_details?.upi_id}&nbsp;</span>{" "}
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15.098"
                              height="19.826"
                              viewBox="0 0 12.098 13.826"
                            >
                              <path
                                id="Icon_awesome-copy"
                                data-name="Icon awesome-copy"
                                d="M8.641,12.1v1.08a.648.648,0,0,1-.648.648H.648A.648.648,0,0,1,0,13.178V3.24a.648.648,0,0,1,.648-.648H2.592v7.993A1.514,1.514,0,0,0,4.1,12.1Zm0-9.289V0H4.1a.648.648,0,0,0-.648.648v9.937a.648.648,0,0,0,.648.648H11.45a.648.648,0,0,0,.648-.648V3.456H9.289A.65.65,0,0,1,8.641,2.808Zm3.267-.838L10.127.19A.648.648,0,0,0,9.669,0H9.505V2.592H12.1V2.429a.648.648,0,0,0-.19-.458Z"
                                fill="#fff"
                              />
                            </svg>
                          </span>
                        </p>
                        <p>
                          Payment QR Code:{" "}
                          <span className="ms-3">
                            {" "}
                            <p className="mb-0">

                              {!zoom && <img src={generateQRCode(data?.sell_upi_details?.upi_id)} alt="copy" onClick={() => setZoom(true)} width="25px" className="img-fluid pointer" />}
                              {zoom && <img src={generateQRCode(data?.sell_upi_details?.upi_id)} alt="copy" onClick={() => setZoom(false)} className="img-fluid pointer" />}
                            </p>
                          </span>
                        </p>
                      </div>}

                    {/* After Transferring The Funds */}
                    {type == "buy" && notifieSeller &&
                      <div className="transferd_box mb-5">
                        <p>
                          After Transferring The Funds. Click On The <br />
                          "Transferred, Notify Seller" Button.
                        </p>

                        <div className="d-md-flex d-block gap-3">
                          <button
                            type="button"
                            className="btn mb-2 mx-2 btn_transfer rounded-5 text-uppercase"
                            onClick={NotifySeller}
                          >
                            transferred,notify seller
                          </button>
                          <button
                            type="button"
                            className="btn mb-2 mx-2 btn_cancel rounded-5 text-uppercase"
                            data-bs-toggle="modal"
                            data-bs-target="#Cancel_ordre_Modal"
                          >
                            cancel order
                          </button>
                        </div>
                      </div>}



                  </div>

                  {/* Have A Question. */}
                  {/* <div className="have_question mb-5">
                  <p className="text-decoration-underline"> Have A Question.</p>
                  <h6>FAQ</h6>
                  <span className="p-0 text-start text-white" data-bs-toggle="modal" data-bs-target="#have_a_que_Modal">
                    <span className="me-2"><svg xmlns="http://www.w3.org/2000/svg" width="12.564" height="12.564" viewBox="0 0 9.564 9.564">
                      <path id="Icon_awesome-plus" data-name="Icon awesome-plus" d="M8.881,6.007H5.807V2.933a.683.683,0,0,0-.683-.683H4.441a.683.683,0,0,0-.683.683V6.007H.683A.683.683,0,0,0,0,6.691v.683a.683.683,0,0,0,.683.683H3.757v3.074a.683.683,0,0,0,.683.683h.683a.683.683,0,0,0,.683-.683V8.057H8.881a.683.683,0,0,0,.683-.683V6.691A.683.683,0,0,0,8.881,6.007Z" transform="translate(0 -2.25)" fill="#2dbd96" />
                    </svg>
                    </span>
                    I have already paid, but the order expires and the system automatically cancels  it .What should I do?</span>
                </div> */}

                  {/* After confirming the payment */}

                  <div className="confirming_box">
                    <p className="text-white"> After confirming the payment, be sure to click the " Payment received" button.</p>
                    {type == "sell" && notified &&
                      <div className="d-md-flex d-block  gap-5 align-items-center">
                        <button
                          type="button"
                          className="btn mb-3 mb-md-0 btn_transfer rounded-5 text-uppercase"
                          onClick={() => PaymentRec()} >
                          Payment Received
                        </button>
                        {/* <p className="text-white mb-0">Transaction issue , applied after(07:24)</p> */}
                      </div>}
                  </div>
                  </>
                }
                <div className="text-center">
                                            {!cancel && <h1 className="fs-5" style={{ color: 'var(--ex-red)' }}><svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 48 48" fill="var(--ch-red)"><path d="M24 34q.7 0 1.175-.475.475-.475.475-1.175 0-.7-.475-1.175Q24.7 30.7 24 30.7q-.7 0-1.175.475-.475.475-.475 1.175 0 .7.475 1.175Q23.3 34 24 34Zm-1.35-7.65h3V13.7h-3ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 23.95q0-4.1 1.575-7.75 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24.05 4q4.1 0 7.75 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm.05-3q7.05 0 12-4.975T41 23.95q0-7.05-4.95-12T24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24.05 41ZM24 24Z" /></svg><p>Order Cancelled</p></h1>}
                                            {confirm && <h1 className="fs-5" style={{ color: 'var(--buy-green)' }}><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="var(--ch-neon)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M9.999 13.587 7.7 11.292l-1.412 1.416 3.713 3.705 6.706-6.706-1.414-1.414z"></path></svg><p>Order Confirmed</p></h1>}
                                        </div>
                </div>


              <div className="col-md-12 col-xl-6 mt-5 text-white">
                <P2pChatComponent id={id} socket={sockets} UserId={UserId} OtherUserDetail={OtherUserDetail} data={data} />
              </div>
            </div>
          </div>
      </section>

      {/* <!-- cancel order Modal --> */}
      <div
        className="modal cancel_order_modal fade"
        id="Cancel_ordre_Modal"
        tabIndex="-1"
        aria-labelledby="Cancel_ordre_ModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 d-flex justify-content-center">
              <h5 className="modal-title" id="Cancel_ordre_ModalLabel">
                Cancel Order
              </h5>
              <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close" id="closeModal"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    style={{ fill: "rgba(255, 255, 255, 1)" }}
                    viewBox="0 0 512 512"
                  >
                    <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" />
                  </svg>
                </span>
                <h6 className="mb-0">Tips</h6>
              </div>
              <ul className="list-unstyled ms-4 mb-4">
                <li>
                  1. If you have already paid the seller,please do not cancel
                  the order.
                </li>
                <li>
                  2. If the seller does not reply to chat within 15 mins, you
                  will be unaccountable for this order's cancellation. It will
                  not affect your completion rate.You can make upto{" "}
                  <span>5 unaccountable cancellations</span> in a day.
                </li>
                <li>
                  3. Your account will be suspended for the day if you exceed
                  3 accountable cancellations in a day.
                </li>
              </ul>

              <h6 className="mb-3">Why Do You Want To Cancel The Order?</h6>
              {ask.map((v, i) => {
                return (
                  <div className="form-check mb-2" key={i}>
                    <input className="form-check-input" onChange={(e) => setReason(e?.target?.value)} type="radio" name="i" value={v.ask} id="checkbox1"/>
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                      {v.ask}
                    </label>
                  </div>
                )
              })}
              {otherReason &&
                <textarea className="form-control" placeholder="Write your reason here"
                  name="reason" id="reason" onInput={e => setReason(e.target.value)}
                  rows="5"
                />}
            </div>
            <div className="modal-footer border-0 justify-content-center gap-4 mb-3">
              <button
                type="button"
                className="btn btn_cancel text-uppercase rounded-4 px-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="button"  className="btn btn_confirm text-uppercase rounded-4 px-3" onClick={() => Cancel()}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Have A Question Modal */}

      <div className="modal have_question_modal fade" id="have_a_que_Modal" tabIndex="-1" aria-labelledby="have_a_que_ModalLabel" aria-hidden="true">
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 d-flex justify-content-center">
              <h5 className="modal-title" id="have_a_que_ModalLabel">Have A Question</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex">
                <span className="me-2"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                  <path id="Icon_feather-message-square" data-name="Icon feather-message-square" d="M31.5,22.5a3,3,0,0,1-3,3h-18l-6,6V7.5a3,3,0,0,1,3-3h21a3,3,0,0,1,3,3Z" transform="translate(-3 -3)" fill="none" stroke="#2dbd96" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                </svg>
                </span>
                <h5>Negotiate With The Counterparty</h5>
              </div>
              <p className="ms-5 text-white">If there is an issue with the transaction, the most effective solution is to
                contact the counterparty directly. You can upload the payment receipt
                and account information in the chat window for both parties to verify
                and negotiate</p>
              <h4 className="ms-5 text-start"><span style={{ color: 'var(--green' }}>Chat</span></h4>
            </div>
            <div className="border_top">
              <div className="p-3">
                <h6>Appeal</h6>
                <p className="text-white">The order has been completed and asset is no longer escrowed by OTX.
                  Please note that we are unable to directly trace back your assets.</p>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault11" />
                  <label className="form-check-label text-white" htmlFor="flexRadioDefault11">
                    I paid but the order is cancelled.
                  </label>
                </div>
                <div className="form-check mb-4">
                  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault22" checked />
                  <label className="form-check-label text-white" htmlFor="flexRadioDefault22">
                    Other reasons
                  </label>
                </div>
                <div className="input-group">

                  <textarea className="form-control shadow-none" aria-label="With textarea">State the reason..</textarea></div>
              </div>
            </div>
            <div className="modal-footer border-0 justify-content-center gap-3">

              <button type="button" className="btn btn_cancel px-4 rounded-4 text-uppercase" data-bs-dismiss="modal" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" >Done</button>
              <button type="button" className="btn btn_confirm px-4 rounded-4 text-uppercase">Cancel</button>
            </div>
          </div>
        </div>
      </div>


      {/* 2ND MODAL */}
      <div className="modal modal_confirm fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 d-flex justify-content-center">

              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center mb-5">
              <span className="mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="89.617" height="89.617" viewBox="0 0 89.617 89.617">
                <g id="cancel-svgrepo-com" transform="translate(-0.001)">
                  <g id="Group_31230" data-name="Group 31230" transform="translate(0.001)">
                    <path id="Path_1978" data-name="Path 1978" d="M44.809,0A44.809,44.809,0,1,0,89.618,44.808,44.809,44.809,0,0,0,44.809,0Zm16.9,61.886a4.579,4.579,0,0,1-6.475,0l-10.2-10.2-10.66,10.66a4.579,4.579,0,1,1-6.474-6.476L38.566,45.215l-9.925-9.924a4.579,4.579,0,0,1,6.476-6.476l9.924,9.924L54.5,29.278a4.579,4.579,0,1,1,6.475,6.476l-9.46,9.461,10.2,10.2A4.579,4.579,0,0,1,61.712,61.886Z" transform="translate(-0.001)" fill="#2dbd96" />
                  </g>
                </g>
              </svg>
              </span>
              <p className="text-white mt-4"> You Order Has Been Cancelled.</p>
              <button className="btn btn_confirm px-4 rounded-4 text-uppercase" data-bs-dismiss="modal">Continue</button>

            </div>
            {/* <div className="modal-footer">
              <button className="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">Back to first</button>
            </div> */}
          </div>
        </div>
      </div>

      {/* <!-- Button trigger modal -->
<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tips_Modal">
  Launch demo modal
</button> */}

      {/* <!-- Modal --> */}
      <div className="modal tips_modal fade" id="tips_Modal" tabIndex="-1" aria-labelledby="tips_ModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 d-flex justify-content-center">
              <h5 className="modal-title" id="tips_ModalLabel">Tips</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body px-4">
              <div className="solution mb-4">
                <h6 style={{ color: 'var(--green)' }}>Solution 1:</h6>
                <p className="text-white">If you paid but the order is canceled, your assets cannot be traced back
                  automatically. Please chat with the seller and ask the seller to refund.</p>
              </div>


              <div className="solution">
                <h6 style={{ color: 'var(--green)' }}>Solution 2:</h6>
                <p className="text-white">If you paid but the order is canceled, your assets cannot be traced back
                  automatically. Please open a support ticket with order number.</p>
              </div>
            </div>
            <div className="modal-footer justify-content-center gap-md-5 gap-2 border-0 mb-3">
              <button type="button" className="btn btn_cancel px-4 rounded-4 text-uppercase" data-bs-dismiss="modal">Support</button>
              <button type="button" className="btn  btn_confirm px-4 rounded-4 text-uppercase">place another order</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
