import React, { useState, useEffect } from 'react';
import SettingLayout from '../Layout/SettingLayout.jsx';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ApiClass from '../api/api.js';
import SwalClass from '../Common/Swal.js';
import 'react-loading-skeleton/dist/skeleton.css'

export default function BankDetail() {

  const [bank, setBank] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rloading, setRLoading] = useState(false);
  const [id, setId] = useState()
  const [getloading, setGetoading] = useState(false);
  const [show, setShow] = useState(false)
  const numeric = (e) => {
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105) ||
      e.keyCode === 8 || //Backspace
      e.keyCode === 116 || // refresh
      e.keyCode === 46 //delete
    ) { } else {
      e.preventDefault();
    }
  };

  const loadPost = async () => {
    setGetoading(true)
    const response = await ApiClass.getRequest("userbanks/get", true);
    if (response === undefined) {
      SwalClass.error("404 NOT FOUND");
      return;
    }
    if (response?.data?.status_code == 0) {
      setGetoading(false);
      SwalClass.error(response?.data?.message);
      return;
    }
    if (response?.data?.status_code == 1) {
      setGetoading(false);
      setBank(response.data.data)
      if (response.data.data.length == 0) {
        setShow(!show)
      }
    }

  }
  useEffect(() => {
    loadPost();
  }, []);

  const formik = useFormik({
    initialValues: {
      alias: '',
      account_number: '',
      confirm_account_number: '',
      account_type: '',
      ifsc_code: ''
    },
    validationSchema: yup.object({
      alias: yup.string().required('Alias Must Be  Required.')
        .matches(/^[A-Za-z ]*$/, 'Please enter valid name'),

      account_number: yup.string().required("Account number is required.")
        .matches(/^[0-9]+$/, "Must Be Only Digits")
        .min(10, 'account number atleast 10 digits long')
        .max(20, 'Must Be Exactly 20 Digits'),

      confirm_account_number: yup.string()
        .required("Confirm account number is required.")
        // .sameAs(account_number)
        .min(10, 'Must be exactly 10 digits')
        .max(20, 'Must Be Exactly 20 Digits')
        .oneOf([yup.ref("account_number"), null], "Confirm account number must be same as account number"),
      account_type: yup.string().required('Account type Must Be  Required.'),
      ifsc_code: yup.string().required('Ifsc code Must Be  Required.')
        .matches(/[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/, "Fill correct Ifsc code")

    }),

    onSubmit: async (body) => {
      setGetoading(false);
      setLoading(true);
      const response1 = await ApiClass.postRequest("userbanks/create", true, body);
      if (response1 === undefined) {
        setLoading(false);
        SwalClass.error(response1?.data?.message);
        return;
      }

      if (response1?.data?.status_code == 0) {
        setLoading(false);

        SwalClass.error(response1?.data?.message);
        return;
      }

      if (response1?.data?.status_code == 1) {
        setLoading(false);
        loadPost();
        setShow(!show)
        formik.resetForm();

      }
    }

  })

  const clear = async (id) => {
    setRLoading(true)
    let res = await ApiClass.deleteRequest("userbanks/delete/" + id, true);
    if (res.data.status_code == 1) {
      setRLoading(false)
      document.getElementById("Close").click()
      loadPost()
    }
  }

  function closeDialog() {
    $modal.modal('hide');
  }
  return (
    <div>
      <SettingLayout>
        <section className="setting_layout" style={{padding:'35px 0px 80px 0px'}}>
          <div className="container-fluid">
            {/***  MAIN HEADING ***/}
            {/*** CONTENT ***/}
            <div className="row">
              <div className="col-md-12">
                <div className="inner_setting">
                  {getloading ?
                    <div className="d-flex spinner_border  justify-content-center">
                      <div className="spinner-border" role="status" style={{ width: "50px", height: "50px" }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    :

                    <div className="bank_detail ms-md-4 ms-0">
                      {/* bank detail haed  */}
                      <div className="bank_head justify-content-between d-md-flex d-block mb-4">
                        <div className="add_bank">
                          <button type="button" className="bank_btn" onClick={() => setShow(!show)}  >
                            <img
                              src="/images/icons/plus.svg"
                              alt="icon"
                              className="img-fluid me-2"
                              loading="lazy"
                            />
                            Add Bank
                          </button>
                        </div>
                      </div>

                      {show && <section className="add_bank" style={{padding:'0px 0px 80px 0px'}}>
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="inner_setting rounded" style={{ backgroundColor: 'var(--box-bg)' }}>
                                <div className="sub_heading text-center py-4" style={{ backgroundColor: 'var(--modal-head)', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                                  <h5 className="mb-0 text-capitalize" style={{ fontSize: '15px', color: 'var(--stg-green)' }}>bank details</h5>
                                </div>


                                {/* bank detail form */}
                                <form onSubmit={formik.handleSubmit} className="row mx-4 otx_form_field py-4">
                                  <div className="col-md-6 col-lg-6  col-xl-4  mb-md-5 mb-4">
                                    <label htmlFor="" className="mb-2">Account Holder Name</label>
                                    <input
                                      type="text"
                                      id="alias"
                                      onChange={formik.handleChange} value={formik.values.alias}
                                      className="form-control"
                                      placeholder="Alias Name"
                                      aria-label="name"
                                      aria-describedby="basic-addon1"
                                      autoComplete="on"
                                    />{formik.errors.alias && formik.touched.alias && (
                                      <span style={{ color: 'red' }}>{formik.errors.alias}</span>)}
                                  </div>
                                  <div className="col-md-6 col-lg-6  col-xl-4  mb-md-5 mb-4">
                                    <label htmlFor="" className="mb-2">Account  Number</label>
                                    <input
                                      type="text" name="account_number" id="account_number"
                                      onKeyDown={numeric} placeholder="Enter Account Number" onChange={formik.handleChange}
                                      value={formik.values.account_number} onPaste={(e) => e.preventDefault()}
                                      className="form-control"
                                      aria-label="Account  Number"
                                      aria-describedby="basic-addon1"
                                      autoComplete="on"
                                    /> {formik.errors.account_number && formik.touched.account_number && (
                                      <span style={{ color: 'red' }}>{formik.errors.account_number}</span>)}
                                  </div>
                                  <div className="col-md-6 col-lg-6  col-xl-4  mb-md-5 mb-4">
                                    <label htmlFor="" className="mb-2">Re-Enter Account Number</label>
                                    <input
                                      type="text" name="confirm_account_number" onKeyDown={numeric} id="confirm_account_number" className="form-control" placeholder="Re-Enter Account Number" required="" v-model="quantity" onChange={formik.handleChange} value={formik.values.confirm_account_number} aria-describedby="basic-addon1" onPaste={(e) => e.preventDefault()}
                                    />
                                    {formik.errors.confirm_account_number && formik.touched.confirm_account_number && (
                                      <span style={{ color: 'red' }}>{formik.errors.confirm_account_number}</span>)}
                                  </div>
                                  <div className="col-md-6 col-lg-6  col-xl-4  mb-md-5 mb-4">
                                    <label htmlFor="" className="mb-2">IFSC Code</label>
                                    <input
                                      type="text" name="ifsc_code" id="ifsc_code" className="form-control" placeholder="Enter Ifsc Code"
                                      onChange={formik.handleChange} value={formik.values.ifsc_code} aria-describedby="basic-addon1"
                                    />
                                    {formik.errors.ifsc_code && formik.touched.ifsc_code && (
                                      <span style={{ color: 'red' }}>{formik.errors.ifsc_code}</span>)}
                                  </div>

                                  {/* ____________Nationality _________  */}
                                  <div className="col-md-6 col-lg-6 col-xl-4 mb-md-5 mb-4">
                                    <label htmlFor="" className="mb-2"> Nationality </label>

                                    <select className="form-select" aria-label="Default select example" name="country" id="country" onChange={formik.handleChange} value={formik.values.country} aria-describedby="basic-addon1">
                                      <option value="choose">Choose..</option>
                                      <option value="1">India</option>
                                    </select>
                                    {formik.errors.country && formik.touched.country && (
                                      <span style={{ color: 'red' }}>{formik.errors.country}</span>)}
                                  </div>


                                  <div className="col-md-6 col-lg-6 col-xl-4 mb-md-5 mb-4">
                                    <label htmlFor="" className="mb-2"> Account Type </label>
                                    <select className="form-select" aria-label="Default select example" name="account_type" id="account_type" onChange={formik.handleChange} value={formik.values.account_type} aria-describedby="basic-addon1">
                                      <option value="">Choose..</option>
                                      <option value="saving">Saving</option>
                                      <option value="current">Current</option>
                                    </select>
                                    {formik.errors.account_type && formik.touched.account_type && (
                                      <span style={{ color: 'red' }}>{formik.errors.account_type}</span>)}
                                  </div>



                                  {/* buttons */}
                                  <div className="save_btn d-flex justify-content-end gap-4">
                                    <button type="button" className="btn px-5 rounded text-capitalize border-0" style={{
                                      backgroundColor: 'var(--stg-green)',
                                      color: 'var(--black-bg)',
                                      fontSize: '14px',
                                      fontWeight: '500'
                                    }}
                                      onClick={() => setShow(!show)}>CANCEL</button>
                                    {loading ?
                                      <button type="button" className="btn px-5 rounded text-capitalize border-0"
                                        style={{
                                          backgroundColor: 'var(--stg-green)',
                                          color: 'var(--black-bg)',
                                          fontSize: '14px',
                                          fontWeight: '500'
                                        }}
                                      >Loading ...</button> :
                                      <button type="submit" className="btn px-5 rounded text-capitalize border-0"
                                        style={{
                                          backgroundColor: 'var(--stg-green)',
                                          color: 'var(--black-bg)',
                                          fontSize: '14px',
                                          fontWeight: '500'
                                        }}
                                      >submit</button>}
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>}
                      {!show &&
                        <div className="tab-content" id="pills-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="pills-bank"
                            role="tabpanel"
                            aria-labelledby="pills-bank-tab"
                          >
                            <div className="bank_box">

                              <div className="accordion mb-5" id="BnkAccordionExample">
                                <div className="accordion-item">
                                  <div
                                    id="collapsebank"
                                    className="accordion-collapse collapse show"
                                    aria-labelledby="headingBank"
                                    data-bs-parent="#BnkAccordionExample"
                                  >
                                    <div className="accordion-body">
                                      <h6 className="mb-5">
                                        Your Bank Account Details For IMPS Payments
                                      </h6>


                                      <div className="account_head d-flex text-center" style={{ fontWeight: 'bold' }}>
                                        <div style={{ flexBasis: '25%' }}>Account Number</div>
                                        <div style={{ flexBasis: '25%' }}>Account Name</div>
                                        <div style={{ flexBasis: '25%' }}>IFSC Code</div>
                                        <div style={{ flexBasis: '25%' }}>Account Type</div>
                                        <div style={{ flexBasis: '25%' }}>Action</div>

                                      </div>
                                      <hr className="account_head_bottom" />

                                      {bank.map((val, i) => {
                                        return (

                                          <div className="account_head d-flex text-center py-3" key={i}>
                                            <div style={{ flexBasis: '25%' }}>
                                              <div className="form-check">
                                                <input
                                                  className="form-check-input"
                                                  type="radio"
                                                  name="flexRadioDefault"
                                                  id="flexRadioDefault1"
                                                  defaultChecked
                                                  style={{ backgroundColor: 'var(--stg-green)' }} />
                                                <label
                                                  className="form-check-label"
                                                  htmlFor="flexRadioDefault1" >
                                                  {val.account_number}
                                                </label>
                                              </div>

                                            </div>
                                            <div style={{ flexBasis: '25%' }}>{val.alias}</div>
                                            <div style={{ flexBasis: '25%' }}>{val.ifsc_code}</div>
                                            <div style={{ flexBasis: '25%' }}>{val.account_type}</div>
                                            <div style={{ flexBasis: '25%' }}>
                                              <button type="button" onClick={() => setId(val.id)}
                                                style={{
                                                  backgroundColor: 'var(--stg-green)',
                                                  color: 'var(--black-bg)',
                                                  fontSize: '14px',
                                                  fontWeight: '500'
                                                }} className="btn rounded" data-bs-toggle="modal" data-bs-target="#RemoveliasModal">Remove</button>
                                            </div>
                                          </div>
                                        )
                                      })}

                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-upi"
                            role="tabpanel"
                            aria-labelledby="pills-upi-tab"
                          >
                            <h6 className="mb-5"> Add Your UPI/VPN ID for UPI Payments</h6>
                            <form action="" className="row charlie_form_field">
                              <div className="col-md-6 col-lg-6  col-xl-4  mb-md-5 mb-4">
                                <label htmlFor="" className="mb-2">Alias</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Alias"
                                  aria-label="name"
                                  aria-describedby="basic-addon1"
                                  autoComplete="on"
                                />
                              </div>
                              <div className="col-md-6 col-lg-6  col-xl-4  mb-md-5 mb-4">
                                <label htmlFor="" className="mb-2">UPI / VPA ID</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="ID"
                                  aria-label="name"
                                  aria-describedby="basic-addon1"
                                  autoComplete="on"
                                />
                              </div>

                              <div className="col-xl-12 text-end">
                                <div className="upi_box d-flex gap-2 gap-md-4 justify-content-end">
                                  <button type="button" className="btn_back" onClick={() => closeDialog()}> CANCEL </button>
                                  {(loading) ?
                                    <button className="btn btn-primary btn_submit shadow-none border-0 w-25 text-dark" type="button" disabled>
                                      <span className="spinner-grow spinner-grow-sm " role="status" aria-hidden="true"></span>
                                      Loading...
                                    </button>
                                    :
                                    <button type="button" className="btn_next"> SUBMIT </button>}
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </SettingLayout>


      {/* Remove Account Modal */}
      <div className="kyc_update_modal">
        <div className="modal fade" id="RemoveliasModal" tabIndex="-1" aria-labelledby="RemoveliasModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header border-0">
                <button type="button" className="btn-close shadow-none" id="Close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body px-4">
                {/* <img src="/public/images/icons/warning.svg" alt="icon" className="img-fluid mb-3" loading="lazy" /> */}
                <h5 className="text-center mb-3">Please Confirm</h5>

                <p>Are you  sure you want to remove bank account</p>
                {rloading ?
                <div className="my-4">
                  <button type="button"
                    style={{
                      backgroundColor: 'var(--stg-green)',
                      color: 'var(--black-bg)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }} className="btn rounded" >Loading...</button>
                    </div>
                  :
                  <div className="my-4">
                    <button type="button"
                      style={{
                        backgroundColor: 'var(--stg-green)',
                        color: 'var(--black-bg)',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      className="btn rounded mx-2" data-bs-dismiss="modal"> CANCEL</button>

                    <button type="button"
                      style={{
                        backgroundColor: 'var(--stg-green)',
                        color: 'var(--black-bg)',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      className="btn rounded mx-2" onClick={() => { clear(id) }} > REMOVE</button>
                  </div>
                }


              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
