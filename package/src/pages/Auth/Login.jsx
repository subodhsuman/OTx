import React, { useEffect, useRef, useState } from "react";
import loginimg from "/images/auth/login.png";
import FormWrapper from "../../utilites/FormWrapper";
import { Link } from "react-router-dom";
import PasswordInput from "../../utilites/PasswordInput";
import ReCAPTCHA from 'react-google-recaptcha';
import { loginUser } from "../../Redux/reducres/userReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ApiClass from "../../api/api"
import SwalClass from "../../Common/Swal";
import { useSelector } from "react-redux";
import hide from "/images/icons/hide.svg";
import show from "/images/icons/show.svg";
export default function Login() {

  let navigate = useNavigate();
  // let IsLogin = useSelector((state) => state.user.token ? true : false);
  // useEffect(() => {
  //   if (IsLogin) {
  //     navigate("/")
  //   }
  // })

  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  const dispatch = useDispatch();
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(hide);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef();

  const handleToggle = () => {
    if (type === "password") {
      setIcon(show);
      setType("text");
    } else {
      setIcon(hide);
      setType("password");
    }
  };
  const { errors, touched, handleSubmit, handleChange, values, setFieldValue, resetForm } = useFormik({
    initialValues: {
      email: "",
      password: "",
      captcha_response: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required."),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 chars minimum")
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase,one lowercase, one number and one special case character"
        ),
        captcha_response:Yup.string()
        .required("Captcha is required")

    }),
    onSubmit: async (body) => {
      setLoading(true)
      const response = await ApiClass.postRequest("login", false, body);
      if (response === undefined) {
        setLoading(false);
        SwalClass.error("404 NOT FOUND");
        return;
      }
      if (response?.data?.status_code == "0") {
        SwalClass.error(response?.data?.message);
        recaptchaRef.current.reset();
        setLoading(false)
        return;
      }
      // hhhh

      if (response?.data?.status_code == 1 && response?.data?.data?.token) {
        localStorage.setItem("token", response.data?.data?.token);
        dispatch(loginUser(response?.data?.data));
        localStorage.setItem("user", JSON.stringify(response.data?.data?.user));
        await new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
          setLoading(false)
          navigate("/exchange");
          resetForm();
          recaptchaRef.current.reset();
        });
      }
      if (
        response?.data?.status_code == 1 &&
        !response?.data?.data?.token
      ) {
        localStorage.setItem("email", response.data.data.email);
        localStorage.setItem("timer", response.data.data.expired_at);
        setLoading(false);
        SwalClass.success(response?.data?.message);
        navigate("/otp");
        resetForm();
        recaptchaRef.current.reset();
        return;
      }
    }
  });

  // CAPTCHA ON CHANGE FUNCTION
  function onChange(value) {
    setFieldValue("captcha_response", value);
  }

  // CAPTCHA ON Expired FUNCTION
  function onExpired() {
    recaptchaRef.current.reset();
  }

  return (
    <div>
      <section className="login-sec">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-6 col-xl-6">
              <div className="login-image text-center">
                <img src={loginimg} alt="login" className="img-fluid" />
              </div>
              {/**login-image**/}
            </div>
            {/**col-md-6 col-lg-6 col-xl-6**/}

            <div className="col-md-6 col-lg-6 col-xl-5 mx-auto">
              <FormWrapper auth_heading="sign in to OTX">
                <form onSubmit={handleSubmit}>
                  <div className="form-box">
                    <div className="row form-row">
                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>email</label>
                        </div>
                        {/**label-box**/}
                        <div className="input-group">
                          <input type="email" placeholder="Enter the Email Address"
                            name="email"
                            id="email"
                            onChange={handleChange}
                            value={values.email}
                            className="form-control" autoComplete="off" v-model="email" />
                        </div>
                        <div className="input-errors">
                          {errors.email && touched.email && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.email}
                            </span>
                          )}
                        </div>
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12**/}

                      <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                        <div className="label-box mb-1">
                          <label>password</label>
                        </div>

                        <div className="input-group">

                          <input
                            type={type}
                            id="password"
                            onChange={handleChange}
                            autoComplete="off"
                            name="password"
                            value={values.password}
                            placeholder="Enter the password" className="form-control" />
                          <span className="input-group-text" id="basic-addon1">
                            <img
                              src={icon}
                              alt="eyeicon"
                              className="img-fluid"
                              onClick={handleToggle} style={{ cursor: 'pointer' }}
                            />
                          </span>
                        
                        </div>
                        <div className="input-errors">
                          {errors.password && touched.password && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.password}
                            </span>
                          )}
                        </div>
                        <div className="col-md-12 mx-4 mt-4">
                          <div className="google-captcha">

                            <ReCAPTCHA
                              ref={recaptchaRef}
                              sitekey={ApiClass.CAPTCHA_SITE_KEY}
                              onChange={onChange}
                              onExpired={onExpired}
                              theme="light"
                            />
                          </div>
                        </div>
                        <div className="input-errors ps-4">
                          {errors.captcha_response && touched.captcha_response && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.captcha_response}
                            </span>
                          )}
                        </div>
                        <div className="forgot-link mt-1 text-end">
                          <span>
                            <Link
                              to="/forgotpassword"
                              style={{
                                textDecoration: "none",
                                color: "var(--light-green)",
                              }}
                            >
                              forgot password
                            </Link>
                          </span>
                        </div>
                        {/**forgot-link**/}
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
                            <button className="btn btn-primary" type="submit" >Sign In</button>}
                        </div>
                        {/**submit-btn**/}
                      </div>
                      {/**col-md-12 col-lg-12 col-xl-12**/}

                      <div className="col-md-12 col-lg-12 col-xl-12">
                        <div className="signup-link">
                          <span>
                            If You Don't Have An Account,You <br /> Can{" "}
                            <Link to="/signup">Sign Up</Link>
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
