import password from "/images/auth/password.png";
import FormWrapper from "../../utilites/FormWrapper";
import OTPInput, { ResendOTP } from "otp-input-react";


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ApiClass from "../../api/api";
import SwalClass from "../../Common/Swal.js";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik"; // Form Validation Formik Plugin
import * as Yup from "yup"; // ITS OPTIONAL FOR SMALL VALIDATION METHOD
import { loginUser } from '../../Redux/reducres/userReducer';


export default function OTP() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  const dispatch = useDispatch();

  const nav = useNavigate();

  const [btnShow, setBtnShow] = useState(false);
  const [time, setTime] = useState("");
  const [showTime, setshowTime] = useState(true);
  const [count, setCount] = useState(0);
  const [color, setColor] = useState("green");
  const [loading, setLoading] = useState(false);

  const numeric = (e) => {
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105) ||
      e.keyCode === 8 || //Backspace
      e.keyCode === 116 || // refresh
      e.keyCode === 46 //delete
    ) {
    } else {
      e.preventDefault();
    }
  };
  const { errors, touched, resetForm, handleSubmit, handleChange, values, setFieldValue } = useFormik({

    initialValues: {
      otp: "",
      email: localStorage.getItem("email"),
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required("OTP is required")
        .min(6, "OTP is too short - should be 6 digits minimum")
        .max(6, "OTP is too Long - should be 6 digits maximum"),
    }),

    onSubmit: async (body) => {
      setLoading(true);
      const response = await ApiClass.postRequest("validateotp", false, body);
      // If API 404 NOT FOUND RESULT COMES
      if (response === undefined) {
        setLoading(false);
        SwalClass.error("404 NOT FOUND");
        return;
      }

      if (response?.data?.status_code == 0) {
        setLoading(false);
        SwalClass.error(response?.data?.message);
        resetForm();
        return;
      }

      if (response?.data?.status_code == 1 && response?.data?.data?.token) {
        localStorage.setItem("token", response.data?.data?.token);
        localStorage.setItem("user", JSON.stringify(response.data?.data?.user));
        dispatch(loginUser(response?.data?.data));
        await new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
          nav("/exchange");
          resetForm();
          SwalClass.success(response?.data?.message);
          setLoading(false)
          localStorage.removeItem("email");
          localStorage.removeItem("timer");
        });
      }
    },
  });
  async function clicked() {
    let body = {
      email: localStorage.getItem("email"),
      type: "login",
    };

    const response = await ApiClass.postRequest("resendotp", false, body);
    // If API 404 NOT FOUND RESULT COMES
    if (response === undefined) {
      SwalClass.error("404 NOT FOUND");

      return;
    }
    if (response?.data?.status_code == 0) {
      SwalClass.error(response?.data?.message);


      return;
    }

    if (response?.data?.status_code == 1) {
      setColor("green");
      SwalClass.success(response?.data?.message);
      localStorage.setItem("timer", response.data.data.expired_at);
      setCount(count + 1);
      setshowTime(true);
      setBtnShow(false);
      resetForm();
      return;
    }
  }
  //timer

  useEffect(() => {
    let x = setInterval(function () {
      let now = new Date().getTime();
      let timer = localStorage.getItem("timer");
      let Finalseconds = parseInt(new Date(timer).getTime());

      let distance = Finalseconds - now;
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance < 1) {
        clearInterval(x);
        setTime();
        setBtnShow(true);
        setshowTime(false);
      }
      if (distance < 120000) {
        setColor("red");
      }
      if (seconds < 0 && minutes < 0) {
        seconds = 0;
        minutes = 0;
      }

      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      setTime("0" + minutes + ":" + seconds);
    }, 1000);
  }, [count]);

  const CustomhandleChange = (e) => {
    setFieldValue("otp", e)
  }
  return (
    <div>
      <section className="otp-sec">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-6 col-xl-6">
              <div className="login-image text-center">
                <img src={password} alt="login" className="img-fluid" />
              </div>
              {/**login-image**/}
            </div>
            {/**col-md-6 col-lg-6 col-xl-6**/}

            <div className="col-md-6 col-lg-6 col-xl-5 mx-auto">
              <FormWrapper auth_heading="enter otp">
                <form onSubmit={handleSubmit}>
                  <div className="form-box">
                    <div className="row form-row">
                      <div className="col-md-12 col-lg-12 col-xl-12">
                        <div className="label-box mb-1">
                          <label>enter OTP</label>
                        </div>
                        <div className="otp-input mt-3">
                          <OTPInput value={values.otp} autoFocus OTPLength={6} otpType="number" onKeyDown={numeric} name="otp" onPaste={(e) => e.preventDefault()} id="otp" onChange={(e) => CustomhandleChange(e)} className="otp_box mb-4" inputClassName="me-0 form-control"
                            inputStyles={{ height: '40px', width: '40px' }} />
                          <div className="input-errors" >
                            {errors.otp && touched.otp && (
                              <div style={{ color: "red" }}>
                                {errors.otp}
                              </div>
                            )}
                          </div>
                        </div>
                        {/**input-group**/}
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12**/}
                      <div className="col-md-12 position-relative">
                        <div className="submit-btn">
                          <span className="m-0" > {showTime ? <p style={{ color: color }}>Resend OTP in ({time})</p> : <p className="m-0 col-md-12 mb-3">
                            Don't receive OTP yet?
                            <button className="btn btn-primary" onClick={clicked}>Resend otp</button>
                          </p>} </span>
                        </div>
                      </div>
                      <div className="col-md-12 position-relative">
                        <div className="submit-btn">
                          {loading &&
                            <button className="btn btn-primary" disabled>   <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                              Loading...</button>
                          }
                          {!loading &&
                            <button className="btn btn-primary">Submit</button>
                          }
                        </div>
                      </div>

                      {/**col-md-12 col-lg-12 col-xl-12**/}
                    </div>
                    {/**row form-row**/}
                  </div>
                  {/**form-box**/}
                </form>
              </FormWrapper>
            </div>
            {/**col-md-6 col-lg-6 col-xl-6**/}
          </div>
          {/**row**/}
        </div>
        {/**container**/}
      </section>
      {/**login-sec**/}
    </div>
  );
}
