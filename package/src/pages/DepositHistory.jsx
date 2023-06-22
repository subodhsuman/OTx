import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ApiClass from "../api/api";
import { ClockLoader } from "react-spinners";

export default function DepositHistory() {

  const [depositHis, setDepositHis] = useState()
  const [loading, setLoading] = useState(false);
  let userId = useSelector((state) => {
    return state.user.detail.id
  })

  const getDeposite = async () => {
    setLoading(true)
    let res = await ApiClass.getRequest(`deposit/get/${userId}`, true);
    setLoading(false)
    setDepositHis(res.data.data)
  }

  useEffect(() => {
    getDeposite()
  }, []);

  return (
    <div>
      <section className="deposit_history">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 col-lg-12 col-xl-12">
              <div className="history_heading text-center p-4">
                <h3 className="mb-0">DEPOSIT TRANSACTIONS</h3>
              </div>
            </div>
            {/* top headings */}
            <div className="col-md-12 col-lg-12 col-xl-12">
              <div className="table_history table-responsive px-4">
                <Link to="/portfolio" className="text-capitalize mb-0"><img src="../images/icons/back.svg" alt="back" className="img-fluid" /> back</Link>

                {loading ?
                  <div className="d-flex spinner_border  justify-content-center my-5 py-5">
                    <div className="spinner-border" role="status" >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>

                  :


                  <table className="table text-nowrap align-middle text-center mt-3">
                    <thead>
                      <tr>
                        <th scope="col" className="text-uppercase">symbol</th>
                        <th scope="col" className="text-uppercase">TYPE</th>
                        <th scope="col" className="text-uppercase">amount</th>
                        <th scope="col" className="text-uppercase">wallet address</th>
                        <th scope="col" className="text-uppercase">STATUS</th>
                        <th scope="col" className="text-uppercase">created AT</th>
                      </tr>
                    </thead>
                    {depositHis?.length > 0
                      ?
                      <tbody>
                        {depositHis != undefined && depositHis?.map((val, i) => {
                          return (
                            <tr key={i}>
                              <td className="text-uppercase">{val?.symbol}</td>
                              <td className="text-uppercase">{val?.chain_type}</td>
                              <td>{val?.amount}</td>
                              <td>{val?.token_address ? val?.token_address : "---"}</td>
                              <td className="text-capitalize">{val?.status}</td>
                              <td className="text-capitalize">{new Date(val?.created_at).toLocaleString('en-GB')}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                      :
                      <tbody className="text-center">
                        <tr>
                          <th colSpan="12">
                            <div className="no_record">
                              <div>
                                {/* <img src="" alt="image" className="img-fluid mb-3"  /> <br></br> */}
                                <p className="text-uppercase text-white">no records found</p>
                              </div>
                            </div>
                          </th>
                        </tr>
                      </tbody>
                    }
                  </table>
                }
              </div>

            </div>
          </div>
        </div>

      </section>
    </div>
  );
}