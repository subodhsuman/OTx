import React, { useEffect, useState } from "react";
import signupimg from "/images/auth/signup.png";
import FormWrapper from "../../utilites/FormWrapper";
import { Link } from 'react-router-dom';
import SwalClass from '../../Common/Swal';
import { useFormik } from "formik";
import * as Yup from "yup";
import ApiClass from "../../api/api";

import hide from "/images/icons/hide.svg";
import show from "/images/icons/show.svg";
export default function Signup() {
  // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  //  states
  const [referral, setRefferal] = useState();
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(hide);
  const [type1, setType1] = useState("password");
  const [icon1, setIcon1] = useState(hide);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("referral");
    setRefferal(q ? q : "");
    if (q) {
      setFieldValue("referral", q)
    }
  }, []);

  // password hide and show function
  const handelToggel = () => {
    if (type == "password") {
      setIcon(show);
      setType("text");
    } else {
      setIcon(hide);
      setType("password");

    }
  };

  const handelToggel1 = () => {
    if (type1 == "password") {
      setIcon1(show);
      setType1("text");
    } else {
      setIcon1(hide);
      setType1("password");

    }
  };

  // formik error validations
  const { errors, touched, resetForm, handleSubmit, handleChange, values, setFieldValue } = useFormik({
    initialValues: {
      name: "",
      lname: "",
      email: "",
      mobile: "",
      password: "",
      confirm_password: "",
      referral: "",
      country_code: "+91",
      country_name: "India",
      terms: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()

        .max(15, "Must be 15 Characters or less")
        .required("Name must be  Required.")
        .matches(/^[A-Za-z ]*$/, "Please enter valid name"),
      lname: Yup.string()
        .max(20, "Must be 20 Characters or less")
        .matches(/^[A-Za-z ]*$/, "Please enter valid name")
        .required("Last Name must be  Required."),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email Address must be  Required."),
      mobile: Yup.string()
        .required("Mobile Number must be Required")
        .max(10, "Must Be Exactly 10 Digits")
        .matches(/^[0-9]+$/, "Must be only Digits")
        .min(10, "Must be exactly 10 digits"),
      password: Yup.string()
        .required("Password is Required")
        .min(6, "Password is too Short - Should Be 6 Chars Minimum")
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one uppercase,one lowercase, one number and one special case character"
        ),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password's not match")
        .required("Confirm Password is Required"),
      referral: Yup.string().max(10, "Must be 10 Characters"),
      terms: Yup.boolean()
        .oneOf([true], "You have To Agree Term & Condition.")
        .required("You have To Agree Term & Condition."),
    }),
    // API CALL
    onSubmit: async (values) => {
      setLoading(true);
      const response = await ApiClass.postRequest("register", false, values);
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
        setLoading(false);
        SwalClass.success(response?.data?.message);
        resetForm();
        return;
      }
    },
  });

  return (
    <div>
      <section className="signup-sec">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-6 col-xl-6">
              <div className="login-image text-center">
                <img src={signupimg} alt="login" className="img-fluid" />
              </div>
              {/**login-image**/}
            </div>
            {/**col-md-6 col-lg-6 col-xl-6**/}

            <div className="col-md-6 col-lg-6 col-xl-5 mx-auto">
              <FormWrapper auth_heading="sign up  to OTX">
                <form onSubmit={handleSubmit}>
                  <div className="form-box">
                    <div className="row form-row">
                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>First name</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">

                          <input type="text" name="name" id="name" onChange={handleChange} value={values.name} placeholder="Enter First Name" className="form-control" autoComplete="off" />
                        </div>
                        <div className="input-errors" >
                          {errors.name && touched.name && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>Last name</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">
                          <input type="text" placeholder=" Last Name"
                            name="lname"
                            id="Lname"
                            onChange={handleChange}
                            value={values.lname}
                            className="form-control" />
                        </div>
                        <div className="input-errors" >
                          {errors.lname && touched.lname && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.lname}
                            </span>
                          )}
                        </div>
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12 user-name**/}

                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>email address</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">
                          <input type="email"
                            name="email"
                            id="email"
                            onChange={handleChange}
                            value={values.email}
                            placeholder="Enter the Email Address" className="form-control" autoComplete="off" />
                        </div>
                        <div className="input-errors" >
                          {errors.email && touched.email && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>Mobile</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">
                          <input type="text"
                            id="phone"
                            name="mobile"
                            onChange={handleChange}
                            value={values.mobile}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            placeholder="Enter the Mobile Number" className="form-control" autoComplete="off" />
                        </div>
                        <div className="input-errors" >
                          {errors.mobile && touched.mobile && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.mobile}
                            </span>
                          )}
                        </div>
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12 email address**/}

                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>password</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">

                          <input type={type}
                            name="password"
                            id="password"
                            onChange={handleChange}
                            value={values.password}
                            placeholder="Enter the password" className="form-control" />
                          <span className="input-group-text" id="basic-addon1">
                            <img
                              src={icon}
                              alt="eyeicon"
                              className="img-fluid"
                              onClick={handelToggel}
                              style={{ cursor: 'pointer' }}
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
                      {/**col-md-12 col-lg-12 col-xl-12 password**/}

                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>confirm password</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">
                          <input type={type1} id="confirm-password" name="confirm_password" onChange={handleChange} value={values.confirm_password}
                            placeholder="Enter the password" className="form-control" />
                            <span className="input-group-text" id="basic-addon1">
                            <img
                              src={icon1}
                              alt="eyeicon"
                              className="img-fluid"
                              onClick={handelToggel1}
                              style={{ cursor: 'pointer' }}
                            />
                          </span>
                        </div>
                        <div className="input-errors" >
                        {errors.confirm_password && touched.confirm_password &&
                          (<span style={{ color: "red", fontSize: "small" }}>
                            {errors.confirm_password}
                          </span>)}
                      </div>
                      </div>
                      
                      {/**col-md-12 col-lg-12 col-xl-12 confirm password**/}

                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>referral code</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">
                          <input
                            name="referral"
                            id="referral"
                            onChange={handleChange}
                            value={referral || values.referral}
                            type="text" placeholder="Enter the Referral Code" className="form-control" autoComplete="off" />
                        </div>
                        <div className="input-errors" >
                          {errors.referral && touched.referral
                            && (
                              <span style={{ color: "red", fontSize: "small" }}>
                                {errors.referral}
                              </span>
                            )}
                        </div>
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12 referral code**/}

                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <input className="form-check-input "
                            type="checkbox"
                            name="terms"
                            id="terms"
                            onChange={handleChange}
                            value={values.terms}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                            style={{
                              color: "var(--white)",
                              fontSize: "var(--fs-13)",
                            }}
                          >
                          By Clicking On SignUp  You Agree to Terms and Condtions.
                          </label>
                          <div className="input-errors ps-0" >
                            {errors.terms && touched.terms && (
                              <span style={{ color: "red", fontSize: "small" }}>
                                {errors.terms}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12 terms & condition**/}

                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="submit-btn">
                          {(loading) ?
                            <button className="btn btn-primary" type="button" disabled>
                              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                              Loading...
                            </button>
                            :
                            <button className="btn btn-primary" type="submit" >Sign Up</button>}
                        </div>
                        {/**submit-btn**/}
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12 submit-btn**/}

                      <div className="col-md-12 col-lg-12 col-xl-12">
                        <div className="signup-link">
                          <span>
                            Already Have An Account,You <br /> Can{" "}
                            <Link to="/login">Sign In</Link>
                          </span>
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
