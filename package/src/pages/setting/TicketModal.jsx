import SettingWrapper from "../../utilites/SettingWrapper.jsx";
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import ApiClass from "../../api/api";
import SwalClass from "../../Common/Swal.js";
import { useParams } from 'react-router-dom';

export default function TicketModal() {

    const [getloading, setGetoading] = useState(true);
    const [commentloading, setCommentloading] = useState(false);
    const { id } = useParams();
    const [xx, setData] = useState({})
    const [comments, setComment] = useState([])
    const status = open;
    const loadPost = async () => {
        setGetoading(true);
        const response = await ApiClass.getRequest(`ticket/get/${id}`, true);
        if (response === undefined) {
            setGetoading(false);
            setCommentloading(false);
            SwalClass.error("404 NOT FOUND");
            return;
        }
        if (response?.data?.status_code == 0) {
            setGetoading(false);
            setCommentloading(false);
            SwalClass.error(response?.data?.message);
            return;
        }
        if (response?.data?.status_code == 1) {
            setGetoading(false)
             setCommentloading(false);
            setData(response.data.data)
            setComment(response.data.data.comments)
            return;
        }
    }
    useEffect(() => {
        loadPost();
    }, []);

    const formik = useFormik({
        initialValues: {
            ticket_id: id,
            comment: '',
        },
        validationSchema: yup.object({
            comment: yup.string()
                .required('Comment is  Required.')
        }),
        onSubmit: async (body) => {
            setCommentloading(true);
            const response1 = await ApiClass.postRequest("ticket_comment/create", true, body);
            if (response1 === undefined) {
                setCommentloading(false);
                SwalClass.error("404 NOT FOUND")
            }
            if (response1?.data?.status_code == 0) {
                setCommentloading(false);
                loadPost();
                SwalClass.error(response1?.data?.message);
            }
            if (response1?.data?.status_code == 1) {
                setCommentloading(false);
                loadPost();
                formik.resetForm();
            }
        }
    })
    return (
        <div id="main">
            <div className="link_next p-4">
                <Link to="/ticketlist" className="text-capitalize mb-0 "><img src="../images/icons/back.svg" alt="back" className="img-fluid" /> back</Link>
            </div>
            <SettingWrapper heading="Ticket List">
            {getloading ?
               <div className="d-flex spinner_border  justify-content-center" >
                  <div className="spinner-border" role="status" >
                     <span className="visually-hidden">Loading...</span>
                  </div>
               </div>
               :
                <div className="modal_list px-4">
                    <div className="name_info">
                        <p className="text-capitalize mb-2">name : <span>    {xx.author_name}</span></p>
                        <h5 className="text-capitalize">status : <span> {xx.status}</span></h5>
                    </div>
                    <div className="comment_box">
                        <label htmlFor="">Comments</label>
                        <div className="scroll_box p-3 my-2">
                            {comments.map((val, i) => {
                                return (
                                    <div className="comment_section p-3 mb-3" key={i}>
                                        <div className="profile_box d-flex align-items-center justify-content-between">
                                            <div className="img_comment"><h3 className="text-capitalize"><img src="../images/icons/profile.svg" alt="text" className="img-fluid me-2" /> {val.name}</h3></div>
                                            <div className="date_comment">{
                                                new Date(
                                                    val.created_at
                                                ).toLocaleString()
                                            }</div>
                                        </div>
                                        {/* top */}
                                        <div className="content_info"><p>{val.comment}</p></div>
                                        {/* bottom */}
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                    {/* comment box */}
                    <form onSubmit={formik.handleSubmit}>

                    <div className="comment_text mb-4">
                        <label htmlFor="" className="mb-2">Comment</label>
                        <textarea
                           type="text"
                           name="comment" id="comment"
                           onChange={formik.handleChange}
                           value={formik.values.comment}
                        className="form-control shadow-none border-0" placeholder="Leave a comment here"  style={{ height: '100px' }}></textarea>
                    {formik.errors.comment ? <div style={{ color: 'red' }}>{formik.errors.comment}</div> : null}
                    </div>

                    {/* type comment */}

                    <div className="btn_box text-center">
                    {(commentloading) ?
                            <button className="btn btn-primary btn_submit shadow-none border-0 w-25 text-dark" type="button" disabled>
                            <span className="spinner-grow spinner-grow-sm " role="status" aria-hidden="true"></span>
                            Loading...
                            </button>
                         :
                        <button type="Submit" className="btn_submit shadow-none border-0 w-25">Submit</button>}
                    </div>
                    </form>

                    {/* submit button */}

                </div>
               }
            </SettingWrapper>
        </div>
    );
}