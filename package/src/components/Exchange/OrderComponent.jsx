import React, { useState, useEffect, useRef } from "react";
import ApiClass from "../../api/api.js";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';
import SwalClass from "../../Common/Swal.js";
import Emitter from "../../event/Emitter.jsx";
import { OrderModal } from "./OrderModal.jsx";

let defaultTab = "r";

export default function OrderComponent() {
    const types = [{ l: "Open", v: "r" }, { l: "My Orders", v: "c" }];

    let login = useSelector((state) => {
        return state.user.token ? true : false;
    })

    let referral_code = useSelector((state) => state?.user?.detail?.referral_code);

    const [TabData, setTabData] = useState({
        r: null,
        c: null
    });

    const [TabType, setTabType] = useState("r");
    const [lastPage, setLastPage] = useState(0)
    const [lastPager, setLastPager] = useState(0)

    const [count, setCount] = useState(0);
    const [pages, setPages] = useState(1);
    const [pagesrem, setPagesrem] = useState(1);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (login) {
            getOrders("c");
            getOrders("r");
        }
    }, []);

    const getOrders = async (type, page = 1, per_page = 10) => {
        setLoading(true)
        type = type == "r" ? "remaining" : "completed";
        let result = await ApiClass.getNodeRequest(`orders/get?type=${type}&page=${page}&per_page=${per_page}`, true);
        if (result?.data?.status_code == 1) {
            let val = Object.assign(result?.data?.data, { "o_type": type });
            if (val?.o_type == "remaining") {
                setLastPager(val.last_page)
                setLoading(false)

            }
            if (val?.o_type == "completed") {
                setLastPage(val?.last_page)
                setLoading(false)
            }


            setTabData(TabData => ({ ...TabData, [type.substring(0, 1)]: val }));
        }
    }

    const ws = useRef(null);


    const onHandleTab = (tab) => {
        setTabType(tab);
    }

    const handlePageClick = async (p) => {
        setLoading(true)

        setPages(pages + 1)

        getOrders("c", p)

    }
    const handlePageClickrem = async (p) => {
        setLoading(true)
        setPagesrem(pagesrem + 1)
        getOrders("r", p)
    }

    const deleteApi = (data, call) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--ex-green)",
            cancelButtonColor: "#d33",
            confirmButtonText:
                call === "edit" ? "Edit And Cancel It!" : "Yes, Delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let response = await ApiClass.postNodeRequest(`orders/cancel-order/${data.id}`, true, {});
                if (response?.data?.status_code == 0) {
                    SwalClass.error(response?.data?.message);
                }
                if (response?.data?.status_code === "1") {
                    call === "edit" ? Emitter.emit("sendingdata", data) : "";
                    SwalClass.success(response?.data?.message);
                }
            }
        });

    };


    useEffect(() => {
        ws.current = new WebSocket(ApiClass.nodeWebsocket);

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ "method": "ORDER", "params": [referral_code] }));
        }

        ws.current.onmessage = async (event) => {
            let d = JSON.parse(event.data);
            if (d.update) {
                // if (TabType == defaultTab) {
                    // console.log('john remaining update');
                    await getOrders("r");
                // } else {
                    await getOrders("c");
                // }
            }
        }
        return () => {
            ws.current.close()
        }

    }, []);

    function myStyle(order) {
        if (order.pending_qty == 0) return 100;
        return ((order.quantity - order.pending_qty) * 100) / order.quantity;
    }


    return (
        <div>
            <div className="order_box p-2">
                <div className="order_tabs">
                    <ul className="nav nav-pills nav-fill p-2" id="pills-tab" role="tablist">
                        {types.map((btn, index) => {
                            return (
                                <li className="nav-item" role="presentation" key={index}>
                                    <button className={`nav-link ${(btn.v == defaultTab) ? `active` : ``}`} id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#Open-24" type="button" role="tab" aria-controls="pills-home" aria-selected="true" onClick={() => onHandleTab(btn.v)}>{btn.l}</button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                {/* tabs end */}
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-Open" role="tabpanel" aria-labelledby="pills-Open-tab">

                        <div className="table_box_data">
                            <div className="tabs_heading d-flex align-items-center justify-content-between  py-2">
                                <div className="head1 text-uppercase">pair</div>
                                <div className="head2  text-uppercase">QTY</div>
                            </div>
                            {
                                loading ?
                                    <div className=" " style={{padding:"100px 0px"}}>
                                        <div className="spinner-border" style={{ color: "var(--ex-green)" }} role="status">
                                            {/* <span className="sr-only"></span> */}
                                        </div>
                                    </div> :
                                    <div>
                                        <div className="data_list">
                                            {
                                                (TabData[TabType]?.data && TabData[TabType]?.data?.length > 0
                                                    ?
                                                    TabData[TabType]?.data && TabData[TabType]?.data.map((val, i) => {
                                                        return (
                                                            <div className="list_data" key={i}>
                                                                <div className=" currency_list d-flex align-items-center justify-content-between ">
                                                                    <div className="currency_name text-uppercase text-start w-75"><p className="mb-0">{val.currency}/{val.with_currency}</p></div>
                                                                    <div className="amount_currency w-25 text-end"><p className="mb-0">{val.at_price}</p></div>
                                                                </div>
                                                                <div className=" currency_list1 d-flex align-items-center justify-content-between ">
                                                                    <div className="currency_name text-uppercase text-start w-75"><p className="mb-0">QTY</p></div>
                                                                    <div className="amount_currency w-25 text-end"><p className=" mb-0">{val.quantity}</p></div>
                                                                </div>
                                                                {(TabData[TabType]?.o_type) === "remaining" &&

                                                                <div className=" currency_list1 d-flex align-items-center justify-content-between ">
                                                                    <div className="currency_name text-uppercase text-start w-75"><p className="mb-0">{val.order_type}</p></div>
                                                                    <div className="amount_currency w-25 text-end"><p className=" mb-0">{val.total}</p></div>
                                                                </div>}
                                                                

                                                                {(TabData[TabType]?.o_type) === "completed" &&
                                                                    <div className=" currency_list1 d-flex align-items-center justify-content-between ">
                                                                        <div className="currency_name text-uppercase w-75 text-start"><p className="mb-0">{new Date(val?.created_at).toLocaleDateString('en-GB')}</p></div>
                                                                        <div className="amount_currency w-25 text-end border-bottom-0"><p className="mb-0">{val.total}</p></div>
                                                                    </div>}
                                                                {(TabData[TabType]?.o_type) === "completed" &&
                                                                    <div className=" currency_list3 d-flex align-items-center justify-content-between ">
                                                                        <div className="btn_status"><p className="mb-0 text-uppercase" style={{ color: 'var(--white)', fontSize: 'var(--fs-12)' }} >status</p></div>
                                                                        <div className="badges_data text-end"><span className="badge text-capitalize" style={(val.current_status =="completed")?{ backgroundColor: 'var(--ex-green)' }:{ backgroundColor: 'var(--ex-red)' }}>
                                                                            {val.current_status}</span></div>
                                                                    </div>}

                                                                {(TabData[TabType]?.o_type) === "completed" &&
                                                                    <div className=" currency_list4 d-flex align-items-center justify-content-between ">
                                                                        <div className="action_box"><p className="mb-0 text-uppercase" style={{ color: 'var(--white)', fontSize: 'var(--fs-12)' }}>action</p></div>
                                                                        <div className="action_img text-end"><img src="/images/icons/eye.svg" alt="icons" className="img-fluid me-3" data-bs-toggle="modal" data-bs-target="#orderModal" onClick={() => { setCount(val.id) }} /></div>
                                                                    </div>}

                                                                {(TabData[TabType]?.o_type) === "remaining" && <div>
                                                                    <div className=" currency_list3 d-flex align-items-center justify-content-between">
                                                                        <div className="btn-box"><button type="button" className="btn_edit shadow-none border-0  text-uppercase p-0" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => {
                                                                            deleteApi(val, "edit");
                                                                        }} >
                                                                            EDIT
                                                                        </button></div>
                                                                        <div className="total_amount text-end"><button type="button" className="btn_cancel shadow-none border-0  text-uppercase p-0" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => {
                                                                            deleteApi(val, "delete");
                                                                        }}>
                                                                            DELETE
                                                                        </button></div>
                                                                    </div>
                                                                </div>}
                                                                <div className="progress_bar_box text-center ">
                                                                    <label htmlFor="">{parseInt(myStyle(val))}%</label>
                                                                    <div className="progress">
                                                                        <div className="progress-bar" role="progressbar" aria-label="Danger example" style={{ width: parseInt(myStyle(val)) + "%" }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )


                                                    }) :
                                                    <div>
                                                        <div colSpan="9" className='text-center text-light'> No Record Found</div>
                                                    </div>)
                                            }
                                        </div>
                                        {/* <!-- Load More Button --> */}
                                        {TabType == "r" && lastPager > 1 && lastPager > pagesrem &&
                                            <div className="load-more-btn mt-3">
                                                <button className="btn text-capitalize btn-sm" style={{ backgroundColor: 'var(--tab-active)', color: 'var(--black)' }} onClick={() => { handlePageClickrem(pagesrem + 1) }}>
                                                    load more..
                                                </button>
                                            </div>
                                        }
                                        {TabType == "c" && lastPage > 1 && lastPage > pages &&
                                            <div className="load-more-btn mt-3">
                                                <button className="btn text-capitalize btn-sm" style={{ backgroundColor: 'var(--tab-active)', color: 'var(--black)' }} onClick={() => { handlePageClick(pages + 1) }}>
                                                    load more..
                                                </button>
                                            </div>
                                        }
                                    </div>
                            }

                        </div>


                    </div>
                </div>
            </div>
            <OrderModal count={count} />
        </div>
    )
}