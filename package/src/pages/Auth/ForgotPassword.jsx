import React, { useEffect, useState } from 'react'
import password from "/images/auth/password.png";
import FormWrapper from "../../utilites/FormWrapper";
import { Link, useNavigate } from 'react-router-dom';
import SwalClass from '../../Common/Swal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ApiClass from "../../api/api"
import { useSelector } from "react-redux";


export default function ForgotPassword() {

  // let navigate = useNavigate();
  // let IsLogin = useSelector((state) => state.user.token ? true : false);
  // useEffect(() => {
  //     if (IsLogin) {
  //         navigate("/")
  //     }
  // })

  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const [loading, setLoading] = useState(false);
  const { errors, touched, resetForm, handleSubmit, handleChange, values, setFieldValue } = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email Address must be  Required.'),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      const response = await ApiClass.postRequest("forgot-password", false, values);
      if (response === undefined) {
        setLoading(false);
        SwalClass.error("404 NOT FOUND")
        return;
      }
      if (response?.data?.status_code == 0) {
        setLoading(false);
        SwalClass.error(response?.data?.message);
        return;
      }
      if (response?.data?.status_code == 1) {
        setLoading(false);
        SwalClass.success(response?.data?.message);
        resetForm();
        return;
      }
    },
  });

  return (
    <div>
      <section className="forgot-sec">
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
              <FormWrapper auth_heading="forgot password">
                <form onSubmit={handleSubmit} >
                  <div className="form-box">
                    <div className="row form-row">
                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>email</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">

                          <input type="email" placeholder="Enter the Email Address" className="form-control" autoComplete="off"
                            name='email' id="email" onChange={handleChange} value={values.email}
                          />

                        </div>
                        <div className="input-errors" >
                          {errors.email && touched.email && (
                            <span style={{ color: 'red', fontSize: 'small' }}>{errors.email}</span>)}
                        </div>
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12**/}



                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="submit-btn">

                          {
                            (loading) ?
                              <button className="btn btn-primary" type="button" disabled>
                                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                Loading...
                              </button> :
                              <button className="btn btn-primary" type="submit">Get OTP</button>
                          }
                        </div>
                        {/**submit-btn**/}
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
