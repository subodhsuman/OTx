import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiClass from '../../api/api';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../Redux/reducres/userReducer';
import SwalClass from '../../Common/Swal';


const VerificationView = () => {
    const dispatch = useDispatch();
    let token = "";
    let navigate = useNavigate();


    const Authentication = async () => {
        {
            let response = await ApiClass.postRequest("register/verify", false, { token: token });
            if (response?.data) {
                if (response.data.status_code == 1) {
                    localStorage.setItem("token", response.data?.data?.token);
                    dispatch(loginUser(response?.data?.data));
                    localStorage.setItem("user", JSON.stringify(response.data?.data?.user));
                    await new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
                        navigate("/");
                    });
                } else {
                    SwalClass.error(response?.data?.message);
                    navigate("/signup", { replace: true });
                }
            }
        }
    }


    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        token = params.get('token')
        if (!token || token == "") {
            navigate("/login", { replace: true });
        }
        Authentication();
    }, [])




    let is_success = false;
    let is_failure = false;
    return (
        <div>
            <section className="auth-coinxhub" style={{minHeight:'87vh'}}>

                <div className="container">
                    <div className="row align-items-center justify-content-center">

                        {/* <!-- Form box  --> */}
                        <div className="col-lg-6 col-md-7">
                            <div className="auth-formbox mb-5 p-5">
                                <div className="row">
                                    {/* <!-- Tagline  --> */}
                                    <div className="col-md-12 text-center">
                                        {(!is_success && !is_failure) ?
                                            <h2 className="m-0 fw-bolder mb-5" >Verifying Email please
                                                wait...</h2>
                                            :
                                            <h2 className="m-0 fw-bolder mb-5">We are re-directing you to exchange
                                                page.....</h2>}

                                        {(!is_failure) ?
                                            <div className="spinner fs-1 d-flex justify-content-center align-items-center gap-3">
                                                <span role="status" aria-hidden="true"></span>
                                                <span>Loading...</span>
                                            </div>
                                            :
                                            <h2 className="m-0 fw-bolder mb-5">Verification link is expired. Please try
                                                again...</h2>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default VerificationView