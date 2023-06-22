import React, { useState, useEffect } from 'react'
import SettingLayout from "../Layout/SettingLayout";
import SettingWrapper from "../utilites/SettingWrapper.jsx";
import UploadImage from '../Common/UploadImage/UploadImage';
import { useFormik } from 'formik';
import *as Yup from 'yup';
import ApiClass from "../api/api";
import SwalClass from '../Common/Swal.js';
import Document from "./Document"


const Kyc = () => {
    const TypeItem = ['choose', 'aadhaar', 'driving', 'voter'];
    const [kycStatus, setKycStatus] = useState("");
    const [statusColor, setstatusColor] = useState();
    const [rejectStatus, setRejectStatus] = useState("")
    const [form, setForm] = useState(true);
    const [disp, setDisp] = useState();
    const [loading, setLoading] = useState(true);
    const [subLoading, setSubLoading] = useState(false);
    // const [docType, setDocType] = useState("choose");


    const [customError, setCustomError] = useState("");



    const uploadpic = ({ fileObject, id }) => {
        setFieldValue(id, fileObject);
    }



    let validationSchema = Yup.object({
        first_name: Yup.string()
            .max(15, 'Must be 15 Characters or Less')
            .required('First Name Must Be  Required.')
            .matches(/^[A-Za-z ]*$/, 'Please enter valid name'),
        // last_name: Yup.string()
        //     .max(20, 'Must be 20 Characters or Less')
        //     .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
        //     .required('Last Name Must Be  Required.'),
        address: Yup.string()
            .max(120, "Must be 120 character or less")
            .required('Address Must  Be  Required.'),
        date_birth: Yup.string()
            .required("Date of Birth Must Be Required"),
        identity_number: Yup.string()
            .required('This Field Must Be Required!'),
        pan_card_number: Yup.string()
            .max(10, 'Must Be Exactly 10 Digits')
            .min(10, 'Must Be Exactly 10 Digits')
            .required("PAN Number Must Be Required")
            .matches(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/, "PAN number must be valid"),
        identity_type: Yup.string()
            .required("This Field Must Be Required!"),
        panType: Yup.string()
            .required("This Field Must Be Required"),
        identity_front_path: Yup.string()
            .required("Identity_Front_Path is Required"),
        identity_back_path: Yup.string()
            .required("Identity_Back_Path is Required"),
        pan_card_path: Yup.string()
            .required("Document Image is Required"),
    });

    const { errors, touched, handleSubmit, handleChange, values, setFieldValue,resetForm } = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            middle_name: "",
            date_birth: "",
            address: "",
            identity_number: "",
            pan_card_number: "",
            pan: "",
            identity_type: "",
            panType: "",
            identity_front_path: '',
            identity_back_path: "",
            pan_card_path: ""
        },
        validationSchema,
        onSubmit: async () => {
            currentDoc(values.identity_type)
            if (customError != " ") {
                return;
            }
            var formData = new FormData();
            formData.append("identity_front_path", values.identity_front_path)
            formData.append("identity_back_path", values.identity_back_path)
            formData.append("pan_card_path", values.pan_card_path)
            formData.append("first_name", values.first_name)
            formData.append("middle_name", values.middle_name)
            formData.append("last_name", values.last_name)
            formData.append("date_birth", values.date_birth)
            formData.append("nationality", values.national)
            formData.append("address", values.address)
            formData.append("identity_type", values.identity_type)
            formData.append("identity_number", values.identity_number)
            formData.append("pan_verify", values.panType)
            formData.append("pan_card_number", values.pan_card_number) 
            const response = await ApiClass.postRequest("userkyc/create", true, formData)

            if (response === undefined) {
                setSubLoading(false);
                SwalClass.error(response?.data?.message);
                return;
            }
            if (response?.data?.status_code == 0) {
                resetForm()
                setSubLoading(false);
                SwalClass.error(response?.data?.message);
                return;
            } if (response?.data?.status_code == 1) {
                resetForm()
                setSubLoading(false);
                getData()
                return;
            }
        }
    });

    const getData = async () => {
        setLoading(true)//for loader
        const response1 = await ApiClass.getNodeRequest("user-kyc/get") 
        if (response1 === undefined) {
            setLoading(false)
            SwalClass.error("404 NOT FOUND")
            return;
        }
        if (response1?.data?.status_code == 0) {
            setLoading(false)
            SwalClass.error(response1?.data?.message);
            return;
        }
        if (response1?.data?.status_code == 1) {
            setLoading(false)
            if (response1.data.data.user_kyc_status === "pending") {
                setForm(false)
                setstatusColor("white");
                setKycStatus("Your Kyc has been submitted successfully and Pending For Approval ");
            } if (response1.data.data.user_kyc_status === "completed") {
                setForm(false)
                setstatusColor("green");
                setKycStatus(" Your Kyc is Verified and Completed.");
            } if (response1.data.data.user_kyc_status === "new") {
                setDisp("none")
                setForm(true)
                setKycStatus("");
            } if (response1.data.data.user_kyc_status === "rejected") {
                setForm(true)
                setRejectStatus(response1.data.data.user_kyc_status_message) 
            }
            return;
        }
    }

    const getKycData = async () => {
        setLoading(true)//for loader
        const response1 = await ApiClass.getNodeRequest("user-kyc/get")

        if (response1 === undefined) {
            setLoading(false)
            SwalClass.error("404 NOT FOUND")
            return;
        }
        if (response1?.data?.status_code == 0) {
            setLoading(false)
            SwalClass.error(response1?.data?.message);
            return;
        }
        if (response1?.data?.status_code == 1) {
            setLoading(false)
            if (response1.data.data.user_kyc_status === "pending") {
                setForm(false)
                setstatusColor("white");
                setKycStatus("Your Kyc has been submitted successfully and Pending for Approval ");
            } if (response1.data.data.user_kyc_status === "completed") {
                setForm(false)
                setstatusColor("green");
                setKycStatus(" Your Kyc is Verified and Completed.");
            } if (response1.data.data.user_kyc_status === "new") {
                setDisp("none")
                setForm(true)
                setKycStatus("");
            } if (response1.data.data.user_kyc_status === "rejected") {
                setForm(true)
                setRejectStatus(response1.data.data.user_kyc_status_message) 
            }
            return;
        }
    }

    const currentDoc = (val) => {
        if (val == "") { return setCustomError(" ") }
        if (val != "") {
            switch (values.identity_type) {
                case "aadhaar":
                    const adar = new RegExp('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$');
                    if (!adar.test(val)) { 
                        setCustomError("The Aadhar card format is Invalid.");
                        return;
                    }

                    setCustomError(" ");
                    break;
                case "driving":
                    const Driving_licence = new RegExp('^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$');
                    if (!Driving_licence.test(val)) {
                        setCustomError("The Driving_licence format is Invalid.");
                        return;
                    }
                    setCustomError(" ");
                    break;
                case "voter":
                    const Voter_card = new RegExp('^([a-zA-Z]){3}([0-9]){7}?$');

                    if (!Voter_card.test(val)) {
                        setCustomError("The Voter_card format is Invalid.");
                        return;
                    }

                    setCustomError(" ");

                    break;
                default:
                    setCustomError(" ");

            }
        }


    }

    useEffect(() => {
        getKycData();
    }, [])

    const inputJson = { errors, touched, setFieldValue, TypeItem, currentDoc };

    return (
        <>
            <SettingLayout>
                <div id="kyc_changes">
                    <SettingWrapper heading="KYC detail">
                        {loading ?
                            <div className="d-flex spinner_border  justify-content-center" >
                                <div className="spinner-border" role="status" >
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            :
                            <>
                                {form ?
                                    <>

                                        <form className="profile_form" encType="multipart/form-data" onSubmit={handleSubmit}>
                                            <div className="alert alert-danger text-center" style={{ display: disp }} role="alert">
                                                <span>{rejectStatus}</span>
                                            </div>
                                             
                                            <div className="basic_heading text-center mb-4">
                                                <h6 className="mb-0 text-capitalize">basic details</h6>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 col-md-6 col-xl-6">

                                                    <div className="mb-3">
                                                        {/* <label htmlFor="f_name" className="mb-2 text-capitalize">first name</label>
                                    <input type="text" name="f_name" placeholder="First Name" className="form-control border-0 rounded-pill" /> */}
                                                        <Document type="input" inputJson={inputJson} inputName="first_name" inputLable="First Name" placeholder="Enter your first name " />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="mb-3">
                                                        {/* <label htmlFor="m_name" className="mb-2 text-capitalize">middle name</label>
                                    <input type="text" name="m_name" placeholder="Middle Name" className="form-control border-0 rounded-pill" /> */}
                                                        <Document type="input" inputJson={inputJson} inputName="middle_name" inputLable="Middle Name" placeholder="Enter your middle name " />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="mb-3">
                                                        {/* <label htmlFor="l_name" className="mb-2 text-capitalize">last name</label>
                                    <input type="text" name="l_name" placeholder="Last Name" className="form-control border-0 rounded-pill" /> */}
                                                        <Document type="input" inputJson={inputJson} inputName="last_name" inputLable="Last Name" placeholder="Enter your last name " />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="mb-3">
                                                        {/* <label htmlFor="dob" className="mb-2 text-capitalize">date of birth</label>
                                    <input type="date" name="dob" placeholder="Date" className="form-control border-0 rounded-pill" /> */}
                                                        <Document type="date" inputJson={inputJson} inputName="date_birth" inputLable="DOB" placeholder="dd-mm-yy" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-12 col-xl-12">
                                                    <div className="mb-3">
                                                        {/* <label htmlFor="address" className="mb-2 text-capitalize">Address</label>
                                    <input type="text" name="address" placeholder="Enter Address" className="form-control border-0 rounded-pill" /> */}
                                                        <Document type="textarea" inputJson={inputJson} inputName="address" inputLable="Address" placeholder="Enter Address " />
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="" />
                                            <div className="basic_heading text-center my-4 ">
                                                <h6 className="mb-0 text-capitalize">identity verification</h6>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <Document type="form" inputJson={inputJson} inputName="identity_type" inputLable="Document Type" placeholder="Enter Address " />
                                                </div>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="mb-3">
                                                        {/* <label htmlFor="doc_num" className="mb-2 text-capitalize">document number</label>
                                    <input type="text" name="doc_num" placeholder="Enter Document Number" className="form-control border-0 rounded-pill" /> */}
                                                        <Document type="input" inputJson={inputJson} inputName="identity_number" inputLable="Document Number" placeholder="Enter your Identity Number" />
                                                        {
                                                            (customError != "") ?
                                                                <span style={{ color: "red" }}> {customError}</span>
                                                                :
                                                                ""
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="mb-3">
                                                    <label className="mb-2"> Upload Front </label> <br></br>
                                                        {/* <label htmlFor="file_front" className="mb-2 text-capitalize">upload front</label>
                                    <input type="file" name="file_front" placeholder="Upload Front" className="form-control border-0 rounded-pill" /> */}
                                                        <UploadImage inputJson={inputJson} uploadpic={uploadpic} inputName="identity_front_path" name="identity_front_path" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="mb-3">
                                                        {/* <label htmlFor="file_back" className="mb-2 text-capitalize">upload back</label>
                                    <input type="file" name="file_back" placeholder="Upload Back" className="form-control border-0 rounded-pill" /> */}
                                      <label className="mb-2"> Upload Back </label> <br></br>
                                                        <UploadImage inputJson={inputJson} uploadpic={uploadpic} inputName="identity_back_path" name="identity_back_path" />
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="basic_heading text-center my-4">
                                                <h6 className="mb-0 text-capitalize">pan card verification</h6>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 col-md-6 col-xl-6">

                                                    <div className="mb-3">
                                                        {/* <label htmlFor="f_name" className="mb-2 text-capitalize">document type</label>
                                    <select className="form-select text-capialize">
                                        <option>Pan Card</option>
                                    </select> */}
                                                        <Document type="form-select" inputJson={inputJson} inputName="panType" inputLable="Document Type" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="mb-3">
                                                        {/* <label htmlFor="doc_num" className="mb-2 text-capitalize">document number</label>
                                    <input type="text" name="doc_num" placeholder="Enter Document Number" className="form-control border-0 rounded-pill" /> */}
                                                        <Document type="input" inputJson={inputJson} inputName="pan_card_number" inputLable="Document Number" placeholder="Enter your Document Number" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="mb-5">
                                                        {/* <label htmlFor="file_both" className="mb-2 text-capitalize">upload document</label>
                                    <input type="file" name="file_both" placeholder="Upload Document" className="form-control border-0 rounded-pill" /> */}
                                       <label className="mb-2"> Upload Front </label> <br></br>
                                                        <UploadImage inputJson={inputJson} uploadpic={uploadpic} inputName="pan_card_path" name="pan_card_path" type="file" id='identity_front_path' accept="image/*" /> {/* AMOUNT */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="save_btn text-center">
                                                {(subLoading) ?
                                                    <button className="btn btn-primary btn_submit shadow-none border-0 w-25 text-dark" type="button" disabled>
                                                        <span className="spinner-grow spinner-grow-sm " role="status" aria-hidden="true"></span>
                                                        Loading...
                                                    </button>
                                                    :
                                                    <button type="submit" className="btn px-5 rounded text-capitalize border-0">save</button>}
                                            </div>
                                        </form>
                                    </> :
                                    <>
                                        <div className="setting-content p-5">
                                            <form className="row justify-content-between">
                                                <div className='text-center my-auto py-5 fs-4' style={{ color: statusColor }}>{kycStatus}</div>
                                            </form>
                                        </div>
                                    </>
                                }
                            </>
                        }
                    </SettingWrapper>
                </div>
            </SettingLayout>
        </>
    )
}
export default Kyc;