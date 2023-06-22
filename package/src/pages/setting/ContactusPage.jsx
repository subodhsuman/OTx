import SettingWrapper from "../../utilites/SettingWrapper.jsx";
import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';
import ApiClass from '../../api/api';
import SwalClass from "../../Common/Swal.js";

export default function ContactusPage() {
    const [contact, setContact] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subLoading, setSubLoading] = useState(false);

    const loadPost = async () => {
        setLoading(true);
        setSubLoading(true);
        const response = await ApiClass.getRequest("ticket_type/get", true);
        if (response === undefined) {
            setLoading(false);
            setSubLoading(false);
            SwalClass.error(response?.data?.message);
            return;
        }

        if (response?.data?.status_code == 0) {
            setLoading(false);
            setSubLoading(false);
            SwalClass.error(response?.data?.message);
        }

        if (response?.data?.status_code == 1) {
            setLoading(false);
            setSubLoading(false);
            setContact(response.data.data)
        }


    }
    useEffect(() => {
        loadPost();
    }, []);

    const formik = useFormik({
        initialValues: {
            title: '',
            category_id: '',
            author_name: '',
            author_email: '',
            content: ''
        },
        validationSchema: yup.object({
            title: yup.string().required('Title is Required')
                .max(12, 'Must Be  12 Digits  of title'),
            category_id: yup.string().required(" Category Number is Required"),
            author_name: yup.string()
                .required("Name  is Required")
                .min(3, 'Must be 3 digits of name')
                .matches(/^[A-Za-z ]*$/, 'Ple../../'),
                author_email: yup.string()
                .email("Invalid email address")
                .required("Email Address must be  Required"),
            content: yup.string().required('Query must be  Required')
                .min(2, 'Must be 2 digits of query'),


        }),
        onSubmit: async (body) => {
            setSubLoading(true);
            const response1 = await ApiClass.postRequest("ticket/create", true, body);

            if (response1 === undefined) {
                setSubLoading(false);
                SwalClass.error(response1?.data?.message);
                return;
            }

            if (response1?.data?.status_code == 0) {
                setSubLoading(false);
                SwalClass.error(response1?.data?.message);
            }

            if (response1?.data?.status_code == 1) {
                setSubLoading(false);
                SwalClass.success(response1?.data?.message);
                formik.resetForm();
            }

        }

    })
    return (
        <div id="main">
            <div className="link_next p-4">
                <Link to="/support" className="text-capitalize mb-0 "><img src="../images/icons/back.svg" alt="back" className="img-fluid" /> back</Link>
            </div>
            <SettingWrapper heading="contact us">
               {loading ?
                    <div className="d-flex spinner_border  justify-content-center" >
                        <div className="spinner-border" role="status" >
                        <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                        :
                <div className="form_box px-5">
                    <form className="row justify-content-center" onSubmit={formik.handleSubmit}>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                            <div className="form_content mb-4">
                                <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                                <input type="text" name="title" id="title" className="form-control shadow-none border-0" placeholder="Enter the title" onChange={formik.handleChange} value={formik.values.title} aria-describedby="basic-addon1" />
                                {formik.errors.title && formik.touched.title && (
                                    <span style={{ color: 'red' }}>{formik.errors.title}</span>)}
                            </div>
                        </div>
                        {/* title */}

                        <div className="col-md-12 col-lg-6 col-xl-6">
                            <div className="form_content mb-4">
                                <label htmlFor="exampleInputEmail1" className="form-label">Choose Category</label>
                                <select className="form-select shadow-none border-0" aria-label="Default select example" name="category_id" id="category_id" onChange={formik.handleChange} value={formik.values.category_id} aria-describedby="basic-addon1" required="" >
                                    <option value="choose">Choose..</option>
                                    {contact.map((data, index) => {
                                        return (
                                            <option key={index} value={data.id}>{data.name}</option>
                                        );
                                    })}
                                </select>
                                {formik.errors.category_id && formik.touched.category_id && (
                                    <span style={{ color: 'red' }}>{formik.errors.category_id}</span>)}
                            </div>
                        </div>
                        {/* Category */}

                        <div className="col-md-12 col-lg-6 col-xl-6">
                            <div className="form_content mb-4">
                                <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                                <input type="text" name="author_name" id="author_name" className="form-control shadow-none border-0" placeholder="Enter the name" onChange={formik.handleChange} value={formik.values.author_name} aria-describedby="basic-addon1" />
                                {formik.errors.author_name && formik.touched.author_name && (
                                    <span style={{ color: 'red' }}>{formik.errors.author_name}</span>)}
                            </div>
                        </div>
                        {/* name */}

                        <div className="col-md-12 col-lg-6 col-xl-6">
                            <div className="form_content mb-4">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email-Id</label>

                                <input type="email" name="author_email" id="author_email" className="form-control shadow-none border-0" placeholder="admin@gmail.com" onChange={formik.handleChange} value={formik.values.author_email} aria-describedby="basic-addon1" required="" v-model="quantity" />
                                {formik.errors.author_email && formik.touched.author_email && (
                                    <span style={{ color: 'red' }}>{formik.errors.author_email}</span>)}
                            </div>
                        </div>
                        {/* email */}
                        <div className="col-md-12 col-lg-6 col-xl-6">
                            <div className="form_content mb-4">
                                <label htmlFor="exampleInputEmail1" className="form-label">Query</label>

                                <textarea name="content" id="content" className="form-control shadow-none border-0" placeholder="Leave a comment here" onChange={formik.handleChange} value={formik.values.content} aria-describedby="basic-addon1" style={{ height: '100px' }}></textarea>
                                {formik.errors.content && formik.touched.content && (
                                    <span style={{ color: 'red' }}>{formik.errors.content}</span>)}
                            </div>
                        </div>
                        {/* comments */}
                        <div className="col-md-12 col-lg-12 col-xl-12">
                            <div className="form_content mb-4 text-center">
                                {(subLoading) ?
                                    <button className="btn btn-primary btn_submit shadow-none border-0 w-25 text-uppercase text-dark" type="button" disabled>
                                    <span className="spinner-grow spinner-grow-sm " role="status" aria-hidden="true"></span>
                                    Loading...
                                    </button>
                                :
                                <button type="submit" className="btn_submit shadow-none border-0 w-25 text-uppercase">submit</button>
                                }
                            </div>
                        </div>
                    </form>

                    {/* form end */}

                </div>
              }
            </SettingWrapper>
        </div>
    );
}