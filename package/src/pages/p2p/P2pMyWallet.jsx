import react from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiClass from "../../api/api.js";
import SwalClass from "../../Common/Swal.js";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { _breakBalance } from "../../Common/InputText.js";

export default function P2pMyWallet() {
  const [data, setData] = useState({});
  const [amt, setAmt] = useState(0);
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(false)

  const mywallet = async () => {
    setLoader(true)
    const res = await ApiClass.getNodeRequest("P2P/P2POrder/P2PWallet", true);
    setLoader(false)
    if (res === undefined) {
      SwalClass.error("Server is not found");
      return;
    }
    if (res?.data?.status_code == 0) {
      SwalClass.error(res?.data?.message);
      return;
    }

    if (res?.data?.status_code == 1) { 
      setData(res?.data?.data);
      SwalClass.success(res?.data?.message);
      return;
    }
  };
  useEffect(() => {
    mywallet();
  }, []);


  const TransferFond = async (e) => {
    if (!err) {
      e.preventDefault();

      let data = {
        amount: amt,
        currency: "USDT"
      }

      const res = await ApiClass.postNodeRequest("P2P/cryptotransfer/transfer", true, data) 

      if (res?.data?.status_code == 0) {
        SwalClass.error(res?.data?.message)
        return;
      }

      if (res?.data?.status_code == 1) {
        SwalClass.success(res?.data?.message)
        await mywallet();
        setAmt(0)
        document.getElementById("closeTransferModal").click()

      }

    }
  };

  useEffect(() => {
    if (amt > 0) {
      setErr(false)
    }
  }, [amt])


  const showErr = () => {
    if (amt <= 0 || amt == '') {
      setErr(true)
    }
  }

  const onHandleKeyPress = (e) => {
    if (e.charCode == 32) {
      e.preventDefault();
    }

    let res =
      e.charCode != 8 &&
      ((e.charCode >= 48 && e.charCode <= 57) ||
        (e.charCode == 46 && e.target.value.indexOf(".") == -1));
    if (e.charCode != 46 && e.target.value.indexOf(".") == -1) {
      e.target.value = e.target.value.replace(/^0+/, "");
    }
    if (e.charCode == 46 && e.target.value.indexOf(".") == -1) {
      e.target.value = `${e.target.value.slice(
        0,
        e.target.selectionStart
      )}.${e.target.value
        .slice(e.target.selectionStart, e.target.value.length)
        .slice(0)}`;
      res = false;
    }
    if (e.charCode == 46 && e.target.value.indexOf(".") == -1) {
      e.target.value = `${e.target.value.slice(
        0,
        e.target.selectionStart
      )}.${e.target.value
        .slice(e.target.selectionStart, e.target.value.length)
        .slice(0, decimal)}`;
      res = false;
    }
    if (
      e.key == "0" &&
      (e.target.selectionStart == "0" || e.target.selectionStart == "1") &&
      e.target.value.indexOf(0) == "0"
    ) {
      e.preventDefault();
    }
    if (
      e.charCode != 46 &&
      e.charCode >= 48 &&
      e.charCode <= 57 &&
      e.target.value.slice(0, e.target.selectionStart) == 0 &&
      e.target.selectionStart == 1
    ) {
      e.target.value = `${e.key}${e.target.value.slice(
        e.target.selectionStart,
        e.target.value.length
      )}`;
      e.preventDefault();
    }
    // Only for Zero Decimal value of pair and currency
    if (e.charCode == 46) {
      e.preventDefault();
    }
    // if user directly entry dot without entering zero at zeroth place
    if (e.charCode == 46 && e.target.value == ".") {
      e.target.value = "0.";
      e.preventDefault();
    }

    //if value gt>1 does not enter 0 at zero index
    if (e.target.value > 1 && e.target.selectionStart == "0" && e.key == "0") {
      e.preventDefault();
    }
    return res ? res : e.preventDefault();
  };

  return (
    <div>
      <section className="order_history">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/p2p" className="text-decoration-none">
                <svg
                  height="20px"
                  width="20px"
                  style={{ fill: "var(--ex-buy-white)" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>{" "}
                Back
              </Link>
            </div>
            <div className="col-md-12">
              <div className="table_order table-responsive mt-4"> 
                {data == undefined ?

                  <div className="text-center text-white">
                    No Record Found
                  </div>
                  :
                  Object.keys(data).length != null > 0 ?
                    <table className="table align-middle text-nowrap text-center">
                      <thead>
                        <tr>
                          <th className="text-capitalize" colSpan={1}>currency</th>
                          <th className="text-capitalize text-center" colSpan={1}>balance</th>
                          <th className="text-capitalize text-center" colSpan={1}>locked</th>
                          <th className="text-capitalize text-center" colSpan={1}>action</th>
                        </tr>
                      </thead>
                      <tbody>


                        {loader ?
                          <tr>
                            <td colSpan={6}>
                              <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                <p className="mb-0">
                                  <Skeleton count={1} />
                                </p>
                              </SkeletonTheme>
                            </td>
                          </tr> :

                          <tr>
                            <td className="" colSpan={1}>{data?.currency}</td>
                            <td className="text-center" colSpan={1}>{(data?.total_balance) ? _breakBalance(data?.total_balance) : ""}</td>
                            <td className="text-center" colSpan={1}>{data?.freeze_balance}</td>
                            <td className="text-center" colSpan={1}>
                              <button
                                type="button"
                                className="btn_status shadow-none border-0"
                                data-bs-toggle="modal"
                                data-bs-target="#transfer_modal"
                              >
                                Transfer Funds
                              </button>
                            </td>
                          </tr>

                        }
                      </tbody>
                    </table> :
                    <div className='text-center my-5 p-5 border'>{data?.message}</div>
                }


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* transfer fund */}
      <div
        className="modal fade"
        id="transfer_modal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-bottom-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Fund Transfer
              </h1>
              <button
                type="button"
                className="btn_close shadow-none border-0"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeTransferModal"
              >
                <svg
                  height="24px"
                  width="24px"
                  style={{ fill: "var(--ex-buy-white)" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
                </svg>
              </button>
            </div>
            <div className="modal-body pb-0 pt-4">
              <div className="col-md-12 col-lg-12 col-xl-12">
                <div className="form_box mb-3">
                  <form className="fund-form" onSubmit={TransferFond}>
                    <input
                      type="text"
                      className="form-control shadow-none border-0"
                      placeholder="Enter Amount"
                      name="amt"
                      id="amt"
                      value={amt}
                      onChange={(e) => setAmt(e.target.value)}
                      onKeyPress={(e) => onHandleKeyPress(e)}
                      aria-describedby="emailHelp"
                    />
                    {err && <p className='text-danger'>The Amount should be greater than zero</p>}
                    <div className="modal-footer border-top-0">
                      <button
                        type={amt > 0 ? "submit" : "button"}
                        onClick={showErr}
                        className="btn_transfer shadow-none border-0"
                      >
                        Transfer
                      </button>
                      <button
                        type="button"
                        className="btn_close"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
