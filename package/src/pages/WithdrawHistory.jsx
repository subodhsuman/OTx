import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClockLoader } from "react-spinners";
import ApiClass from "../api/api";

export default function WithdrawHistory(){

    const [loading, setLoading] = useState(false);
    const [withd, setWithd] = useState();

    const getwithdraw = async () => {
      setLoading(true)
      let response = await ApiClass.getRequest("wallet-trans/get", true); 
      setWithd(response?.data?.data)
      setLoading(false)
  
    }
    useEffect(() => {
      getwithdraw()
    }, [])



    return(
 <div>
   <section className="withdraw_history">
    <div className="container-fluid">
        <div className="row">
            <div className="col-md-12 col-lg-12 col-xl-12">
               <div className="history_heading text-center p-4">
                <h3 className="mb-0">WITHDRAW TRANSACTIONS</h3>
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
                        <th scope="col" className="text-uppercase">amount</th>
                        <th scope="col" className="text-uppercase">status</th>
                        <th scope="col" className="text-uppercase">type</th>
                        <th scope="col" className="text-uppercase">ADDRESS</th>
                        <th scope="col" className="text-uppercase">created AT</th>
                        </tr>
                    </thead>
                    {withd?.length > 0
                    ?
                    <tbody>
                        {withd != undefined && withd.map((val,i) =>{
                        return(
                            <tr  key={i}>
                            <td className="text-uppercase">{val?.currency}</td>
                            <td>{val?.amount}</td>
                            <td className="text-capitalize">{val?.status}</td>
                            <td>{val?.type}</td>
                            <td>{val?.to_address ? val?.to_address : "---"}</td>
                            <td className="text-capitalize">{new Date(val?.updated_at).toLocaleString('en-GB')}</td>   
                         </tr>
                        )
                          } )}
                          
                    </tbody>
                    :
                    <tbody className="text-center">
                      <tr>
                        <th colSpan="12">
                            <div className="no_record">
                                <div>
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