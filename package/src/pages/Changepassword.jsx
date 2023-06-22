import React,{useState,useEffect} from "react";
import SettingLayout from '../Layout/SettingLayout.jsx';
import SettingWrapper from "../utilites/SettingWrapper.jsx";
import SwalClass from '../Common/Swal.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ApiClass from "../api/api.js"
import hide from "/images/icons/hide.svg";
import show from "/images/icons/show.svg";
import { useNavigate } from "react-router";
const changepassword = ()=>{
let navigate = useNavigate();
  const [type, setType] = useState("password");
  const [type1, setType1] = useState("password");
  const [icon, setIcon] = useState(hide);
  const [icon1, setIcon1] = useState(hide);
  const [loading, setLoading] = useState(false);
  const [subLoding,setSubLoading] = useState(false);

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
  const handelToggel1 = () => {
    if (type1 == 'password') {
      setIcon1(show);
      setType1("text");
    } else {
      setIcon1(hide);
      setType1("password");
    }
  }

  // formik error validations
  const { errors, touched, resetForm, handleSubmit, handleChange, values, setFieldValue } = useFormik({
    initialValues: {
      old_password:'',
      new_password: '',
      confirm_password: '',
      token: ''
    },

    validationSchema: Yup.object({
      old_password:Yup.string()
      .required("Old Password is Required"),
      new_password: Yup.string()
        .required("New Password is Required")
        .min(6, "Password is too Short - Should Be 6 Chars Minimum").matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, "Password must contain at least 8 characters, one uppercase, one uppercase,one lowercase, one number and one special case character"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("new_password")], "Password's not match")
        .required("Confirm Password is Required"),
    }),
    // API CALl
    onSubmit: async (values) => {
      setSubLoading(true);
      const response = await ApiClass.postRequest("user/change_password", true, values);
      if (response === undefined) {
        setSubLoading(false);
        SwalClass.error("404 NOT FOUND")
        return;
      }
      if (response?.data?.status_code == 0) {
        setSubLoading(false);
        SwalClass.error(response?.data?.message);
        return;
      }

      if (response.data.status_code == 1) {
        setSubLoading(false);
        SwalClass.success(response?.data?.message);
        dispatch(clearState());
        localStorage.clear();
        navigate("/login")
        
      }
    },
  });

  useEffect(() => {
    setTimeout(() => {
        setLoading(false)
    }, 1000);

    const params = new URLSearchParams(window.location.search)
        setFieldValue("token", params.get('token'));
  }, [])
    return(
        <>
        <SettingLayout>
            <SettingWrapper heading="Change Password">
            {loading ?
                    <div className="d-flex spinner_border  justify-content-center" >
                        <div className="spinner-border" role="status" >
                        <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    :
                    <>
                <div className="change_password">
                    <form className="profile_form" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="old_password" className="mb-2 text-capitalize">old password</label>
                            <input type="text" name="old_password" placeholder="Old Password" className="form-control border-0 rounded" onChange={handleChange} value={values.old_password}/>
                        
                        <div className="input-errors" >
                          {errors.old_password && touched.old_password && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.old_password}
                            </span>
                          )}
                        </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirm_password" className="mb-2 text-capitalize">New password</label>
                            <div className="input-group rounded-pill setting-groupped">
                                <input type={type} className="form-control border-0" name="new_password" placeholder="New Password" onChange={handleChange} value={values.new_password} />
                         <span className="input-group-text border-0" id="basic-addon1">
                            <img
                              src={icon}
                              alt="eyeicon"
                              className="img-fluid"
                              onClick={handelToggel} style={{ cursor: 'pointer' }}
                            />
                          </span>
                    
                            </div>
                        <div className="input-errors" >
                          {errors.new_password && touched.new_password && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.new_password}
                            </span>
                          )}
                        </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="new_password" className="mb-2 text-capitalize">confirm password</label>
                            <div className="input-group rounded-pill setting-groupped">
                                <input type={type1} className="form-control border-0" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} value={values.confirm_password}/>
                        <span className="input-group-text border-0" id="basic-addon1">
                            <img
                              src={icon1}
                              alt="eyeicon"
                              className="img-fluid"
                              onClick={handelToggel1} style={{ cursor: 'pointer' }}
                            />
                          </span>
                            </div>
                        <div className="input-errors" >
                          {errors.confirm_password && touched.confirm_password && (
                            <span style={{ color: "red", fontSize: "small" }}>
                              {errors.confirm_password}
                            </span>
                          )}
                        </div>
                        </div>
                        <div className="save_btn text-center">
                        {(subLoding) ?
                            <button className="btn btn-primary btn_submit shadow-none border-0 w-25 text-dark" type="button" disabled>
                            <span className="spinner-grow spinner-grow-sm " role="status" aria-hidden="true"></span>
                            Loading...
                            </button>
                         :
                            <button type="submit" className="btn px-5 rounded text-capitalize border-0">submit</button>}
                        </div>
                    </form>
                </div>
</>}
            </SettingWrapper>
        </SettingLayout>
            
        </>
    )
}
export default changepassword;