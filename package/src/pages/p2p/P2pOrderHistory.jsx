import React, { useState, useEffect } from "react";
// import Heading from "../../Components/SettingPage/Heading";
import ApiClass from '../../api/api';
// import ClockLoader from "react-spinners/ClockLoader";
import { useSelector } from "react-redux";
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
export default function P2pOrderHistory() {
    const OrderTable = [
        {
            type: 'buy',
            minqty: '50',
            maxqty: '50',
            price: '80',
            created: '12/21/2023',
            status: 'Complete',
        },


    ]
    const { theme } = useSelector((state) => {
        return state.user;
    })
    const [dep, setDep] = useState()
    const [loading, setLoading] = useState(false);
    var page = 1;
    const [pageCount, perPageData] = useState(0);
    const [itemOffset, recordData] = useState(0);
    let Userid = useSelector((state) => {
        return state.user.detail.id
    })
    const nav = useNavigate()
    const OrderHistory = async (page) => {
        setLoading(true)
        let res = await ApiClass.getNodeRequest(`P2P/P2POrder/allorderlist?user_id=${Userid}&per_page=10&page=${page}`, true);
        setLoading(false)
        perPageData(parseInt(res.data.data.last_page));
        recordData(parseInt(res.data.data.total));
        setDep(res?.data?.data?.data)
    }

    useEffect(() => {
        OrderHistory(page)
    }, []);
    const NavigateOrder = (val) => {
        if (val.buyer.length > 0) {
            nav(`/p2p-chat?s=${val?.buyer[0]?.id}&type=${val.order_type}`)
        }
        if (val.seller.length > 0) {
            nav(`/p2p-chat?s=${val?.seller[0]?.id}&type=${val.order_type}`)
        }

    }
    const handlePageClick = (event) => {
        page = page + event.selected;
        OrderHistory(page);
    };
    return (
        <div>
            <section className="order_history">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Link to="/p2p" className="text-decoration-none"><svg height="20px" width="20px" style={{ fill: "var(--ex-buy-white)" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg> Back</Link>
                        </div>
                        <div className="col-md-12">
                            <div className="table_order table-responsive mt-4">
                                <table className="table align-middle text-nowrap text-center">
                                    <thead>
                                        <tr>
                                            <th scope="col">Order Type</th>
                                            <th scope="col">Min Quantity</th>
                                            <th scope="col">Max Quantity</th>
                                            <th scope="col">At Price</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dep?.length == 0 ?

                                            <div className="text-center text-white">
                                                No Record Found
                                            </div>
                                            :
                                            dep?.map((val, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{val.order_type}</td>
                                                        <td>{val.max_quantity}</td>
                                                        <td>{val.pending_quantity}</td>
                                                        <td>{val.at_price}</td>
                                                        <td>{new Date(val.created_at).toLocaleString('en-GB')}</td>
                                                        <td> <button type="button" className="btn_status shadow-none border-0" style={(val.status == "cancelled" &&
                                                        {
                                                            backgroundColor: 'var(--ex-red)',
                                                            color: 'var(--white)',
                                                        }) || (val.status == "partially_completed" &&
                                                        {
                                                            backgroundColor: 'var(--yellow)',
                                                            color: 'var(--white)',
                                                        })
                                                            || (val.status == "processing" &&
                                                            {
                                                                backgroundColor: 'var(--ex-green-bg)',
                                                                color: 'var(--white)',
                                                            }) || (val.status == "completed" &&
                                                            {
                                                                backgroundColor: 'var(--ex-green)',
                                                                color: 'var(--white)',
                                                            }) || {}
                                                        }
                                                            // onClick={() => { val.status == "processing" ? nav(`/p2pnext?s=${val?.buyer.map((v) => v.id)}`) : "" }}
                                                            onClick={() => { val.status == "processing" ? NavigateOrder(val) : "" }}>{val.status}</button> </td>
                                                    </tr>
                                                );
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {pageCount > 1 && (
                        <div className="d-flex justify-content-end mt-3">
                            <div className="pagination ">
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel=" >>"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={2}
                                    pageCount={pageCount}
                                    itemOffset={itemOffset}
                                    previousLabel="<<"
                                    renderOnZeroPageCount={null}

                                    containerClassName={"pagination pagination_main"}
                                    pageClassName={"page-item"}
                                    pageLinkClassName={`page-link  bg-transparent shadow-none  ${`text-white`}`}
                                    previousClassName={"page-item "}
                                    previousLinkClassName={`page-link border-primary  shadow-none  ${`text-white`}`}
                                    nextClassName={"page-item"}
                                    nextLinkClassName={`page-link border-primary  shadow-none  ${`text-white`}`}
                                    breakClassName={"page-item"}
                                    breakLinkClassName={`page-link ${`text-white`}`}
                                    activeClassName={"active bg-primary border-0 "}

                                />
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
}