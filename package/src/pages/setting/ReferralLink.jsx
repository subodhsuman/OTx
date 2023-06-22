import React, { useState, useEffect } from "react";
import SettingWrapper from "../../utilites/SettingWrapper.jsx";
import SettingLayout from "../../Layout/SettingLayout.jsx";
import ApiClass from "../../api/api.js";
import SwalClass from "../../Common/Swal.js";

export default function ReferralLink() {

  let userDetail = JSON.parse((localStorage.getItem("user")));
  let referal_code = userDetail?.referral_code;
  let url = ApiClass.VUE_DOMAIN + "signup?referral=" + referal_code;

  var page = 1;

  const [copy, setCopy] = useState("Copy");
  const [refcopy, setRefCopy] = useState("Copy");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [pageCount, perPageData] = useState(0);
  const [itemOffset, recordData] = useState(0);

  //copy scan QR code function
  // const copyText = () => {
  //   let add = document.getElementById("address-input");
  //   add.select();
  //   document.execCommand("copy");
  //   setCopy("Copied!");

  //   // After 2 second Copied change to Copy
  //   setTimeout(() => {
  //     setCopy("Copy");
  //   }, 2000);
  // };


  const copyText = () => {
    var data = document.getElementById("reffer");
    data.select();
    document.execCommand("copy");
    setCopy("Copied")
    
    setTimeout(() => {
      setCopy("Copy");
      }, 2000);

}

  


  //copy scan QR code function
  const copyRefferalText = () => {
    let add = document.getElementById("ref-input");
    add.select();
    document.execCommand("copy");
    setRefCopy("Copied")

    // After 2 second Copied change to Copy
    setTimeout(() => {
      setRefCopy("Copy");
    }, 2000);
  };

 

  const getRefferalData = async (page) => {
    let res = await ApiClass.getRequest(`user/getReferrals?page=${page}&per_page=2`, true);
    setLoading(true);
    if (res === undefined) {
      setLoading(false);
      SwalClass.error(res?.data?.message);
      return;
    }

    if (res?.data?.status_code == 0) {
      setLoading(false);
      SwalClass.error(res?.data?.message);
      return;
    }

    if (res?.data?.status_code == 1) {
      setLoading(false);
      setData(res.data.data);
      perPageData(parseInt(res?.data?.data?.last_page));
      recordData(parseInt(res?.data?.data?.total));
      return;
    }
  }

  useEffect(() => {
    getRefferalData(page)
  }, []);

  const handlePageClick = (event) => {
    page = page + event.selected
    loadPost(page);
  };

  return (
    <>
      <SettingLayout>
        <SettingWrapper heading="Referral-Link">
          {loading ?
            <div className="d-flex spinner_border  justify-content-center" >
              <div className="spinner-border" role="status" >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            :
            <div className="form_link px-2 px-lg-5">
              <form className="row">
                <div className="col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <input type="text" className="form-control shadow-none border-0" id="reffer" value={url} placeholder={url} aria-label="Recipient's username" aria-describedby="basic-addon2" readOnly />
                    <span className="input-group-text" id="basic-addon2"><button type="button" className="btn_copy shadow-none border-0" onClick={() => copyText()}>{copy} <img src="../images/icons/copy.svg" alt="text" className="img-fluid" /></button></span>
                  </div>
                </div>
                {/* first copy */}

                <div className="col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <input type="text" className="form-control shadow-none border-0" id="ref-input" value={referal_code} placeholder={referal_code} aria-label="Recipient's username" aria-describedby="basic-addon2"  readOnly />
                    <span className="input-group-text" id="basic-addon2"><button type="button" className="btn_copy shadow-none border-0" onClick={() => copyRefferalText()}>{refcopy} <img src="../images/icons/copy.svg" alt="text" className="img-fluid" /></button></span>
                  </div>
                </div>
                {/* second copy */}
              </form>
              <div className="referral_table table-responsive">
                <table className="table text-center text-nowrap align-middle table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Referral Code</th>
                      <th scope="col">Status</th>
                      <th scope="col">Created At</th>
                    </tr>
                  </thead>
                  <tbody>

                    {data?.length == 0 ?
                      <tr ><td colspan={6} className="mx-auto py-3" >No record Found</td>  </tr>
                      :
                      data?.map((val, i) => {
                        return (
                          <tr key={i}>
                            <td>{val?.name}</td>
                            <td>{val?.email}</td>
                            <td>{val?.referral_code}</td>
                            <td>
                              <div className="status_change">
                                <span className="badge">{val?.status}</span>
                              </div>
                            </td>
                            <td>{new Date(val.created_at).toLocaleString('en-GB')}</td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>

              </div>

            </div>
          }
          {pageCount > 1 &&
            <div className='d-flex justify-content-end mt-5'>
              <div className="pagination " >
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=" >>"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  pageCount={pageCount}
                  itemOffset={itemOffset}
                  previousLabel="<<"
                  renderOnZeroPageCount={null}
                  containerClassName={"pagination mb-0 pagination_main"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link "}
                  previousClassName={"page-item "}
                  previousLinkClassName={"page-link border-success  shadow-none"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link border-success  shadow-none"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active bg-success border-0"}
                />
              </div>
            </div>}
        </SettingWrapper>
      </SettingLayout>
    </>
  );
}