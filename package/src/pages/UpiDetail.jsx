import React, { useState, useEffect } from 'react';
import SettingLayout from "../Layout/SettingLayout.jsx";
import { useFormik } from 'formik';
import * as yup from 'yup';
import ApiClass from '../api/api.js';
import SwalClass from '../Common/Swal.js';
import Swal from 'sweetalert2'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useSelector } from "react-redux";

export default function UpiDetail() {
    const [remerk, setRemerk] = useState("");
    const [bank, setBank] = useState([]);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState()
    const [getloading, setGetoading] = useState(false);
    const [show, setShow] = useState(false)


    const loadPost = async () => {
        setGetoading(true)
        const response = await ApiClass.getRequest("userupi/get", true);

        if (response === undefined) {
            setLoading(false);
            SwalClass.error("404 NOT FOUND");
            return;
        }
        if (response?.data?.status_code == 0) {
            setLoading(false);
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
            upi_id: '',
        },
        validationSchema: yup.object({
            alias: yup.string().required('Alias Must Be  Required.')
                .matches(/^[A-Za-z ]*$/, 'Please enter valid name'),

            upi_id: yup.string().required("UPI id is required.")
                .min(10, 'UPI id atleast 10 digits long')
                .max(20, 'Must Be Exactly 20 Digits'),


        }),

        onSubmit: async (body) => {
            setGetoading(false);
            setLoading(true);
            const response1 = await ApiClass.postRequest("userupi/create", true, body);
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
                SwalClass.success(response1?.data?.message);

                loadPost();
                setShow(!show)
                formik.resetForm();

            }
        }

    })

    const clear = async (id) => {
        let res = await ApiClass.deleteRequest("userupi/delete/" + id, true);
        if (res.data.status_code == 1) {
            document.getElementById("Close").click()
            SwalClass.success(res.data.message)
            loadPost()
        }
        if (res.data.status_code == 0) {
            document.getElementById("Close").click()
            SwalClass.error(res.data.message)
        }
    }
    const Status = async (id) => {
        let res = await ApiClass.updateRequest(`userupi/account_status/${id}/1`, true);
        if (res.data.status_code == 1) {
            SwalClass.success(res.data.message)
            document.getElementById("statusClose").click()
            loadPost()
        }
        if (res.data.status_code == 0) {
            document.getElementById("statusClose").click()
            SwalClass.error(res.data.message)
        }
    }



    function closeDialog() {
        $modal.modal('hide');
    }
    const { theme } = useSelector((state) => {
        return state.user;
    })
    return (
        <div>
            <SettingLayout>
                <section className="setting_layout" style={{ padding: '35px 0px 80px 0px' }}>
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
                                            <div className="bank_head justify-content-between d-md-flex d-block mb-5">
                                                {/* <ul
                                                    className="nav nav-pills mb-3"
                                                    id="pills-tab"
                                                    role="tablist"
                                                >
                                                    <li className="nav-item" role="presentation">
                                                        <button
                                                            className="nav-link active"
                                                            id="pills-bank-tab"
                                                            data-bs-toggle="pill"
                                                            data-bs-target="#pills-bank"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="pills-bank"
                                                            aria-selected="true"
                                                        >
                                                            UPI
                                                        </button>
                                                    </li>

                                                </ul> */}
                                                <div className="add_bank">
                                                    <button type="button" className="bank_btn" onClick={() => setShow(!show)}  >
                                                        <img
                                                            src="/images/icons/plus.svg"
                                                            alt="icon"
                                                            className="img-fluid me-2"
                                                            loading="lazy"
                                                        />
                                                        Add Upi
                                                    </button>
                                                </div>
                                            </div>

                                            {show && <section className="add_bank" style={{ padding: '0px 0px 80px 0px' }}>
                                                <div className="container-fluid">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="inner_setting rounded" style={{ backgroundColor: 'var(--box-bg)' }}>
                                                                <div className="sub_heading text-center py-4" style={{ backgroundColor: 'var(--modal-head)', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                                                                    <h5 className="mb-0 text-capitalize" style={{ fontSize: '15px', color: 'var(--stg-green)' }}>Upi details</h5>
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
                                                                        <label htmlFor="" className="mb-2">UPI ID</label>
                                                                        <input
                                                                            type="text" name="upi_id" id="upi_id"
                                                                            placeholder="Enter UPI Id" onChange={formik.handleChange}
                                                                            value={formik.values.upi_id} onPaste={(e) => e.preventDefault()}
                                                                            className="form-control"
                                                                            aria-label="Account  Number"
                                                                            aria-describedby="basic-addon1"
                                                                            autoComplete="on"
                                                                        /> {formik.errors.upi_id && formik.touched.upi_id && (
                                                                            <span style={{ color: 'red' }}>{formik.errors.upi_id}</span>)}
                                                                    </div>


                                                                    {/* buttons */}
                                                                    <div className="save_btn d-flex justify-content-end gap-4">
                                                                        <button type="button" className="btn px-5 rounded text-capitalize border-0" style={{
                                                                            backgroundColor: 'var(--stg-green)',
                                                                            color: 'var(--black-bg)',
                                                                            fontSize: '14px',
                                                                            fontWeight: '500'
                                                                        }} onClick={() => setShow(!show)}>CANCEL</button>
                                                                        <button type="submit" className="btn px-5 rounded text-capitalize border-0" style={{
                                                                            backgroundColor: 'var(--stg-green)',
                                                                            color: 'var(--black-bg)',
                                                                            fontSize: '14px',
                                                                            fontWeight: '500'
                                                                        }}>submit</button>
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
                                                                                Your Upi Account Details For IMPS Payments
                                                                            </h6>


                                                                            <div className="account_head d-flex text-center" style={{ fontWeight: 'bold' }}>
                                                                                <div style={{ flexBasis: '25%' }}>UPI Id</div>
                                                                                <div style={{ flexBasis: '25%' }}>Account Name</div>
                                                                                <div style={{ flexBasis: '25%' }}>Verify Status</div>
                                                                                <div style={{ flexBasis: '25%' }}>Action</div>
                                                                                <div style={{ flexBasis: '25%' }}>Active Status</div>

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
                                                                                                    checked={val.status == 1}
                                                                                                    style={{ backgroundColor: 'var(--stg-green)' }} />
                                                                                                <label
                                                                                                    className="form-check-label"
                                                                                                    htmlFor="flexRadioDefault1" >
                                                                                                    {val.upi_id}
                                                                                                </label>
                                                                                            </div>

                                                                                        </div>
                                                                                        <div style={{ flexBasis: '25%' }}>{val.alias}</div>
                                                                                        <div style={{ flexBasis: '25%' }}>{val.verify_status == "rejected" &&
                                                                                            <button className='btn p-1 border-0 w-100 rounded-0' onClick={() => setRemerk(val?.remark)} style={{ backgroundColor: 'var(--ch-red)', fontSize: '13px', color: 'var(--ch-white)' }}
                                                                                                data-bs-toggle="modal"
                                                                                                data-bs-target="#verifystatusmodalUpi">
                                                                                                {val.verify_status}
                                                                                            </button>}
                                                                                            {val.verify_status == "completed" &&
                                                                                                <button className='btn p-1 border-0 w-100 rounded-0' style={{ backgroundColor: 'var(--ch-green)', fontSize: '13px', color: 'var(--ch-black)' }}>
                                                                                                    {val.verify_status}
                                                                                                </button>}
                                                                                            {val.verify_status == "pending" &&
                                                                                                <button className='btn p-1 border-0 w-100 rounded-0' style={{ backgroundColor: 'var(--ch-yellow)', fontSize: '13px', color: 'var(--ch-black)' }}>
                                                                                                    {val.verify_status}
                                                                                                </button>}
                                                                                        </div>
                                                                                        <div style={{ flexBasis: '25%' }}> <button type="button" style={{
                                                                                            backgroundColor: 'var(--stg-green)',
                                                                                            color: 'var(--black-bg)',
                                                                                            fontSize: '14px',
                                                                                            fontWeight: '500'
                                                                                        }} className="btn rounded" onClick={() => setId(val.id)} data-bs-toggle="modal" data-bs-target="#RemoveliasModal">Remove</button></div>
                                                                                        {val.status == "0" ?
                                                                                            <div style={{ flexBasis: '25%' }}>


                                                                                                <button type="button" style={{
                                                                                                    backgroundColor: 'var(--stg-green)',
                                                                                                    color: 'var(--black-bg)',
                                                                                                    fontSize: '14px',
                                                                                                    fontWeight: '500'
                                                                                                }} className="btn rounded" onClick={() => setId(val.id)} data-bs-toggle="modal" data-bs-target="#ActiveliasModal">Active</button>
                                                                                            </div>
                                                                                            :
                                                                                            <div style={{ flexBasis: '25%' }}>
                                                                                                <button type="button" style={{
                                                                                                    backgroundColor: 'var(--stg-green)',
                                                                                                    color: 'var(--black-bg)',
                                                                                                    fontSize: '14px',
                                                                                                    fontWeight: '500'
                                                                                                }} className="btn rounded" >Already Active</button>


                                                                                            </div>
                                                                                        }
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
                                                </div>



                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </SettingLayout>


            {/*Edit Modal */}
            <div className="kyc_update_modal">
                <div className="modal fade" id="EditaliasModal" tabIndex="-1" aria-labelledby="EditaliasModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body px-4">
                                <h5 className="text-center mb-3">Edit alias</h5>

                                <div className="d-flex justify-content-between mb-4">
                                    <span>Current Alias</span>
                                    <span>Upi Account -2355</span>
                                </div>

                                <form action="">
                                    <div className="alise mb-5">
                                        <label htmlFor="basic-url" className="form-label">New Alias</label>
                                        <div className="input-group mb-3">
                                            <input type="text" className="form-control shadow-none" id="basic-url" aria-describedby="basic-addon3" />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center gap-4 my-3">
                                        <button type="button" className="btn_back py-2">CANCEL</button>
                                        <button type="button" className="btn_next py-2">CONFIRM</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Remove Account Modal */}
            <div className="kyc_update_modal">
                <div className="modal fade" id="RemoveliasModal" tabIndex="-1" aria-labelledby="RemoveliasModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content text-center">
                            <div className="modal-header border-0">
                                <button type="button" className="btn-close shadow-none" id="Close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body px-4">
                                <img src="/images/icons/warning.svg" alt="icon" className="img-fluid mb-3" loading="lazy" />
                                <h5 className="text-center mb-3">Please Confirm</h5>

                                <p>Are you  sure you want to remove UPI account</p>
                                <div className="my-4">
                                    <button type="button" style={{
                                        backgroundColor: 'var(--stg-green)',
                                        color: 'var(--black-bg)',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }} className="btn rounded" data-bs-dismiss="modal"> CANCEL</button>
                                    <button type="button" style={{
                                        backgroundColor: 'var(--stg-green)',
                                        color: 'var(--black-bg)',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                        className="btn rounded mx-2" onClick={() => { clear(id) }} > REMOVE</button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>






            {/* Active Account Modal */}
            <div className="kyc_update_modal">
                <div className="modal fade" id="ActiveliasModal" tabIndex="-1" aria-labelledby="ActiveliasModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content text-center">
                            <div className="modal-header border-0">
                                <button type="button" className="btn-close shadow-none" id="statusClose" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body px-4">
                                <img src="/images/icons/warning.svg" alt="icon" className="img-fluid mb-3" loading="lazy" />
                                <h5 className="text-center mb-3">Please Confirm</h5>

                                <p>Are you  sure you want to Active UPI account</p>
                                <div className="my-4">
                                    <button type="button" style={{
                                        backgroundColor: 'var(--stg-green)',
                                        color: 'var(--black-bg)',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }} className="btn rounded" data-bs-dismiss="modal"> CANCEL</button>
                                    <button type="button" style={{
                                        backgroundColor: 'var(--stg-green)',
                                        color: 'var(--black-bg)',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }} className="btn rounded mx-2" onClick={() => { Status(id) }} > Active</button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* verify status  */}
            <div className="kyc_update_modal">
                <div className="modal fade" id="verifystatusmodalUpi" tabIndex="-1" aria-labelledby="verifystatusmodalUpiLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body px-4">
                                <h5 className="text-center mb-3">Verify Status</h5>
                                <h5 className='mb-1 text-center'><svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox='0 0 48 48' fill='var(--ch-red)'><path d="M24 44q-4.15 0-7.8-1.575-3.65-1.575-6.35-4.275-2.7-2.7-4.275-6.35Q4 28.15 4 24t1.575-7.8Q7.15 12.55 9.85 9.85q2.7-2.7 6.35-4.275Q19.85 4 24 4t7.8 1.575q3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24t-1.575 7.8q-1.575 3.65-4.275 6.35-2.7 2.7-6.35 4.275Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.95Q41 31.1 41 24q0-3.05-1.05-5.85T37 13.05L13.05 37q2.25 1.95 5.075 2.975Q20.95 41 24 41Zm-12.95-6.05 23.9-23.9q-2.3-1.95-5.1-3T24 7q-7.1 0-12.05 4.95Q7 16.9 7 24q0 3.05 1.1 5.875t2.95 5.075Z" /></svg>&nbsp;Rejected</h5>

                                <p className='mb-3 text-center' style={{ color: 'var(--ch-red)', wordBreak: "break-all" }}>
                                    Reason:
                                    <p>{remerk}</p>
                                </p>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
