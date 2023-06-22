import React, { useState, useEffect } from 'react';
import SettingLayout from '../Layout/SettingLayout.jsx';
import SettingWrapper from "../utilites/SettingWrapper.jsx";
import ApiClass from '../api/api.js';
import SwalClass from "../Common/Swal.js";
    
const Authentication = () => {
    const [factor, setfactor] = useState("0");
    const [loading, setLoading] = useState(false);
    const [getloading, setGetoading] = useState(true);
    const [click, setClick] = useState(false);


    const loadPost = async () => {
        setGetoading(true)
        const response = await ApiClass.getRequest("2fa/get", true);
        if (response === undefined) {
            setGetoading(false);
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
            setfactor(response.data.data._2fa)
            return;
        }
    }
    useEffect(() => {
        loadPost();
    }, []);
    const handleChange = (event) => {
        if (factor !== event.target.value) {
            setClick(true)
            setfactor(event.target.value)
        }
    }
    const loaddata = async () => {
        setLoading(true);
        const response = await ApiClass.postRequest("2fa/update", true, { two_factor: factor });
        if (response?.data) {
            setLoading(false);
            if (response.data.status_code == 1) {
                setClick(!click)
                SwalClass.success(response.data.message);
            } else {
                SwalClass.error(response.data.message);
            }
        }
    }

    return (
        <>
            <SettingLayout>
                <SettingWrapper heading="2F authentication setting">
                {getloading ?
                        <div className="d-flex spinner_border  justify-content-center" >
                          <div className="spinner-border" role="status" >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                        :
                    <form className="profile_form">
                        <div className="row mb-3">
                            <div className="col-12 col-lg-12 col-xl-6">
                                <div className="two-auth mb-3 p-4 rounded d-flex justify-content-between align-items-center" style={{ background: 'var(--black-bg)' }}>
                                    <div className="">
                                        <label htmlFor="mobile" className="mb-2 text-capitalize">email verification</label>
                                        <p className="mb-0 text-capitalize rounded-pill  px-1 py-1 px-sm-3 py-sm-1" style={{ background: 'var(--ex-green)' }}>most recommended</p>
                                    </div>
                                    {/* <input type="radio" /> */}
                                    <input type="radio" name="flexRadioDefault"
                                        id="flexRadioDefault1" value={2} checked={factor == 2} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-12 col-lg-12 col-xl-6">
                                <div className="two-auth mb-3 p-4 rounded d-flex justify-content-between align-items-center" style={{ background: 'var(--black-bg)' }}>
                                    <div className="">
                                        <label htmlFor="mobile" className="mb-2 text-capitalize">none</label>
                                        <p className="mb-0 text-capitalize rounded-pill px-1 py-1 px-sm-3 py-sm-1" style={{ background: 'var(--ex-red)' }}>not recommended</p>
                                    </div>
                                    {/* <input type="radio" /> */}
                                    <input className="form-check-input shadow-none" type="radio" name="flexRadioDefault"
                                        id="flexRadioDefault2" value={0} checked={factor == 0} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {click &&
                            <div className="text-center mt-3">
                                {
                                    (!loading) ?
                                        <div className="save_btn text-center">
                                            <button type="button" onClick={loaddata} disabled={loading} className="btn px-5 rounded text-capitalize border-0">update</button>
                                        </div>

                                        :
                                        <div className="save_btn text-center">
                                            <button type="button" className="btn px-5 rounded text-capitalize border-0">Loading...</button>
                                        </div>
                                }
                            </div>
                        }

                    </form>
                    }
                </SettingWrapper>
            </SettingLayout>
        </>
    )
}
export default Authentication;