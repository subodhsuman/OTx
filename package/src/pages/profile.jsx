import React, { useState, useEffect } from 'react'
import SettingLayout from '../Layout/SettingLayout.jsx';
import SettingWrapper from "../utilites/SettingWrapper.jsx";
import { useFormik } from 'formik';
import * as yup from 'yup';
import SwalClass from '../Common/Swal';
import ApiClass from "../api/api";


const Profile = () => {
    const [profile, setProfile] = useState({})
    const [loading, setLoading] = useState(true);
    const [btn, setbtn] = useState(false)
    const loadPost = async () => {
        setLoading(true)
        const response = await ApiClass.getNodeRequest("user/get", true);
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
            let data = response?.data?.data;
            setProfile(response.data.data)
            formik.setFieldValue('name', data.name)
            formik.setFieldValue('email', data.email)
            formik.setFieldValue('mobile', data.mobile)
            formik.setFieldValue('status', profile.status)
        }
    }
    useEffect(() => {
        loadPost();
    }, []);

    useEffect(() => {

        if (Object.keys(profile).length > 0) {
            formik.setFieldValue('name', profile.name)
            formik.setFieldValue('email', profile.email)
            formik.setFieldValue('mobile', profile.mobile)
            formik.setFieldValue('status', profile.status)

        }
    }, [profile]);

    const formik = useFormik({
        initialValues: {
            name: '',
            mobile: '',
            email: '',
            status: '',

        },

        // Create validation schema:
        validationSchema: yup.object({
            name: yup.string().required('Name Must Be  Required.')
                .max(15, 'Must be 15 characters or less')
                .matches(/^[a-zA-Z]+$/, 'Please enter valid name'),

            mobile: yup.string().required("Mobile Number Must Be Required")
                .matches(/^[0-9]+$/, "Must Be Only Digits")
                .min(10, 'Must be exactly 10 digits')
                .max(10, 'Must Be Exactly 10 Digits'),
            email: yup.string()
                .email('Invalid email address')
                .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
                .required('This Field is Required.'),
            // status: yup.string().required(),
        }),
        onSubmit: async () => {

            var form_data = {
                name: formik.values.name,
            }
            setLoading(true);
            const response1 = await ApiClass.postRequest("user/reset_email", true, form_data);
            if (response1?.data?.status_code == 0) {
                setLoading(false);
                SwalClass.error(response1?.data?.message);
                return;
            }
            if (response1 === undefined) {
                setLoading(false);
                SwalClass.error("404 NOT FOUND")
                return;
            }

            if (response1?.data?.status_code == 1) {
                setLoading(false);
                localStorage.clear();
                dispatch(clearState());
                navigate("/login");
                formik.resetForm();
                recaptchaRef.current.reset();
            }
        }
    })
    return (
        <>
            <SettingLayout>
                <SettingWrapper heading="profile detail">
                    {loading ?
                        <div className="d-flex spinner_border  justify-content-center" >
                          <div className="spinner-border" role="status" >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                        :
                        <form className="profile_form">
                            <div className="row">
                                <div className="col-12 col-md-6 col-xl-6">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="mb-2 text-capitalize">name</label>
                                        <input type="text" name="name" id="name" className="form-control border-0 rounded-pill" placeholder="admin" value={formik.values.name} disabled />
                                    </div>
                                </div>
                                {/* <div className="col-12 col-md-6 col-xl-6">
                                    <div className="mb-3">
                                        <label htmlFor="mobile" className="mb-2 text-capitalize">mobile number</label>
                                        <input type="text" maxLength="10" name="mobile" id="mobile" className="form-control border-0 rounded-pill" placeholder="number" value={formik.values.mobile} aria-describedby="basic-addon1" disabled />
                                    </div>
                                </div> */}
                                <div className="col-12 col-md-6 col-xl-6">
                                    <div className="mb-3">
                                        <label htmlFor="email" className="mb-2 text-capitalize">email-Id</label>
                                        {/* <input type="email" name="email" placeholder="admin@gmail.com" className="form-control border-0 rounded-pill" disabled /> */}
                                        <input type="text" name="email" id="email" className="form-control border-0 rounded-pill" placeholder="admin@gmail.com" value={formik.values.email} aria-describedby="basic-addon1" disabled />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-xl-6">
                                    <div className="mb-3">
                                        <label htmlFor="status" className="mb-2 text-capitalize">status</label>
                                        <input type="text" name="status" placeholder="Active" className="form-control border-0 rounded-pill" disabled />
                                    </div>
                                </div>
                            </div>
                        </form>}
                </SettingWrapper>
            </SettingLayout>

        </>
    )
}
export default Profile;