import React, { useState, useEffect } from 'react';
import password from "/images/auth/password.png";
import FormWrapper from "../../utilites/FormWrapper";
import PasswordInput from "../../utilites/PasswordInput";
import { Link, useNavigate } from 'react-router-dom';
import SwalClass from '../../Common/Swal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ApiClass from "../../api/api"
import { useSelector } from 'react-redux';
import hide from "/images/icons/hide.svg";
import show from "/images/icons/show.svg";
export default function ResetPassword() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  let navigate = useNavigate();

  // let IsLogin = useSelector((state) => state.user.token ? true : false);
  // useEffect(() => {
  //   if (IsLogin) {
  //     navigate("/")
  //   }
  // })
  //  states
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(hide);
  const [loading, setLoading] = useState(false);

  // password hide and show function
  const handelToggel = () => {
    if (type == 'password') {
      setIcon(show);
      setType("text");
    } else {
      setIcon(hide);
      setType("password");
    }
  }

  // formik error validations
  const { errors, touched, resetForm, handleSubmit, handleChange, values, setFieldValue } = useFormik({
    initialValues: {
      password: '',
      confirm_password: '',
      token: ''
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .required("Password is Required")
        .min(6, "Password is too Short - Should Be 6 Chars Minimum").matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, "Password must contain at least 8 characters, one uppercase, one uppercase,one lowercase, one number and one special case character"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password's not match")
        .required("Confirm Password is Required"),
    }),
    // API CALl
    onSubmit: async (values) => {
      setLoading(true);
      const response = await ApiClass.postRequest("password/reset", false, values);
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

      if (response.data.status_code == 1) {
        SwalClass.success(response?.data?.message);
        navigate("/login");
      }
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setFieldValue("token", params.get('token'));
  }, [])

  return (
    <div>
      <section className="resetpassword-sec">
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
              <FormWrapper auth_heading="reset your password">
                <form onSubmit={handleSubmit} >
                  <div className="form-box">
                    <div className="row form-row">
                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>new password*</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">
                          <input type={type} placeholder="Enter the password" className="form-control" name='password' id="password" onChange={handleChange} value={values.password} />
                          <span className="input-group-text" id="basic-addon1">
                            <img
                              src={icon}
                              alt="eyeicon"
                              className="img-fluid"
                              onClick={handelToggel} style={{ cursor: 'pointer' }}
                            />
                          </span>
                        </div>
                        <div className="input-errors" >
                          {errors.password && touched.password && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.password}
                            </span>
                          )}
                        </div>
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12**/}

                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>re-enter new password*</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">

                          <input id="confirm-password" name='confirm_password' onChange={handleChange} value={values.confirm_password} type="hidden2 ? 'password' : 'text' " placeholder="Enter the password" className="form-control " autoComplete="off" v-model="confirm_password" />

                        </div>
                        <div className="input-errors" >
                          {errors.confirm_password && touched.confirm_password && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.confirm_password}
                            </span>
                          )}
                        </div>
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12**/}

                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="submit-btn">
                          {(loading) ?
                            <button className="btn btn-primary" type="button" disabled>
                              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                              Loading...
                            </button>
                            :
                            <button className="btn btn-primary" type="submit" >Reset Password</button>}
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
