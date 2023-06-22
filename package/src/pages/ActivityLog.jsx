import SettingLayout from '../Layout/SettingLayout.jsx';
import SettingWrapper from "../utilites/SettingWrapper.jsx";
import React, { useState, useEffect } from 'react';
import ApiClass from "../api/api";
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import SwalClass from '../Common/Swal.js';

const Activity = () => {
    var page = 1;
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, perPageData] = useState(0);
    const [itemOffset, recordData] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadPost = async (page) => {
        setLoading(true)
        const response = await ApiClass.getRequest(`log/get?page=${page}&per_page=5`, true);

        if (response === undefined) {
            setLoading(false);
            SwalClass.error(response?.data?.message);
            return;
        }

        if (response?.data?.status_code == 0) {
            setLoading(false);
            SwalClass.error(response?.data?.message);
            return;
        }

        if (response?.data?.status_code == 1) {
            setLoading(false);
            setCurrentItems(response.data.data.data);
            perPageData(parseInt(response.data.data.last_page));
            recordData(parseInt(response.data.data.total));
            return;
        }
    }

    useEffect(() => {
        loadPost(page);
    }, []);
    const handlePageClick = (event) => {
        page = page + event.selected
        loadPost(page);
    };

    return (
        <>
            <SettingLayout>
                <SettingWrapper heading="activity log">
                    <div className="activity_outer p-4 rounded table-responsive mb-3">
                    {loading ?
                        <div className="d-flex spinner_border  justify-content-center" >
                          <div className="spinner-border" role="status" >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                        :
                    <div className="row">
                            { currentItems.map((val,i)=>{
                                return(
                                    <div className="col-md-12 col-lg-12 col-xl-12 activity_outer mb-3" key={i}>
                                    <div className="row p-3">
                                        <div className="col-md-2 col-lg-2 col-xl-2">
                                            <div className="dta_list">
                                             <p className="text-capitalize mb-0">date:</p>
                                            </div>
                                        </div>
                                        <div className="col-md-10 col-md-10 col-xl-10">
                                            <div className="dta_list">
                                             <p className="text-capitalize mb-0">{moment(val.created_at).format("MMMM Do YYYY, h:mm:ss a")}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-lg-2 col-xl-2">
                                            <div className="dta_list">
                                             <p className="text-capitalize mb-0">ip:</p>
                                            </div>
                                        </div>
                                        <div className="col-md-10 col-md-10 col-xl-10">
                                            <div className="dta_list">
                                             <p className="text-capitalize mb-0">{val.ip}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-lg-2 col-xl-2">
                                            <div className="dta_list">
                                             <p className="text-capitalize mb-0">activity:</p>
                                            </div>
                                        </div>
                                        <div className="col-md-10 col-md-10 col-xl-10">
                                            <div className="dta_list">
                                             <p className="text-capitalize mb-0" style={{color:'var(--stg-green)'}}>{val.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                   
                               {/* row end */}
                               </div>
                                )
                            })}
            
                       </div>
}
                        
                    </div>
                     {pageCount > 1 &&
                            <div className='d-flex justify-content-end mt-5'>
                                <div className="pagination " >
                                    <ReactPaginate
                                        breakLabel="..."
                                        nextLabel=" >>"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={2}
                                        pageCount={pageCount}
                                        itemOffset={itemOffset}
                                        previousLabel="<<"
                                        renderOnZeroPageCount={null}
                                        containerClassName={"pagination mb-0 pagination_main"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link "}
                                        previousClassName={"page-item "}
                                        previousLinkClassName={"page-link border-success  shadow-none"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link border-success  shadow-none"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active bg-success border-0"}
                                    />
                                </div>
                            </div>}
                   
                </SettingWrapper>
            </SettingLayout>
        </>
    )
}
export default Activity;