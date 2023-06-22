import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import _ from "lodash";
import exactMath from "exact-math";
import P2pBuyComponent from "../../components/p2p/P2pBuyComponent.jsx";
import SwalClass from "../../Common/Swal";
import { loginUser } from '../../Redux/reducres/userReducer';
import { socket } from "../../service/socket";
import P2pbuyComponent from "../../Scss/components/p2p/P2pbuyComponent.jsx";
import P2psellComponent from "../../Scss/components/p2p/P2psellComponent";
import { onHandleKeyDown, onHandleKeyPress, onHandleKeyUp, onHandlePaste, _breakBalance } from "../../Common/InputText.js";
import ApiClass from "../../api/api";
import Select from "react-select";
import { useFormik } from 'formik';
import * as Yup from 'yup'

const mathConfig = {
    returnString: true,
    eMinus: Infinity,
};

export default function P2pDashboard() {
    const [showerr, setShowerr] = useState("");
    const [loader, setLoader] = useState("")
    const [error1, setError1] = useState("");
    const [error, setError] = useState("");

    const [selected, setSelected] = useState([]);
    const Options = [
        {
            value: "0",
            label: "bank transfer",
        },
        {
            value: "1",
            label: "Gpay",
        },
        {
            value: "2",
            label: "PhonePay",
        },
        {
            value: "3",
            label: "Paytm",
        },
    ];
    const [tab1, setTab1] = useState("buy");
    const [selected1, setSelected1] = useState([])
    const [TabType, setTabType] = useState("b");
    const [mData, setMData] = useState(null)
    const [PairPrice, setPairPrice] = useState(0);
    const [balance, setBalance] = useState(null);
    const [payment, setPayment] = useState(null);
    const [curPrice, setCurPrice] = useState(0);
    const nav = useNavigate();
    var [clicked, setClicked] = useState(0);
    const [secondpageCount, setSecondPerPageData] = useState(0);
    const [seconditemOffset, setSecondRecordData] = useState(0);
    const [pageCount, perPageData] = useState(0);
    const [itemOffset, recordData] = useState(0);
    const types = [{ l: "BUY", v: "b" }, { l: "SELL", v: "s" }]
    const [TabData, setTabData] = useState({
        b: null,
        s: null
    });
    const [inital, setInitalPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [paymentMethod, setPaymentMethod] = useState("")
    useEffect(() => {
        // console.log('tab change',TabType)
        if (TabType != undefined) {
            P2p("", TabType);
        }
        const sockets = socket();

        sockets.on('p2pOrderUpdate', (data) => {
            if (data.update) {
                P2p("", TabType);
                // P2p("", "s");
            }
        });


        sockets.on('sendLivePriceUpdate', (_price) => {
            _priceINR = _price;
        });

        return () => {
            sockets.disconnect();
        }

    }, [TabType]);
    const IsLogin = useSelector((state) => {
        return state.user.token ? true : false;
    });
    var page = 1;
    const P2p = async (ptype = "", type, search = "") => {
        setLoading(true)
        setPaymentMethod(ptype == "" ? "All Payment" : ptype);

        type = type == "b" ? "buy" : "sell";


        let url = `P2P/P2POrder/orderlist?per_page=${4}&order_type=${type}&page=${page}&amount=${search}`;

        if (ptype.length > 0) {
            url = `${url}&payment_type=${ptype}`;
        }
        let result = await ApiClass.getNodeRequest(url, true);
        if (result?.data?.status_code == 0) {
            SwalClass.success(result?.data?.message);
            return
        }
        if (result?.data?.status_code == 1) {
            let val = Object.assign(result?.data?.data, { "o_type": type });
            setTabData(TabData => ({ ...TabData, [type.substring(0, 1)]: val }));
            setInitalPage(parseInt(result?.data?.data?.current_page))
            type == "buy" ? perPageData(parseInt(result?.data?.data?.last_page)) : setSecondPerPageData(parseInt(result?.data?.data?.last_page))
            type == "buy" ? recordData(parseInt(result?.data?.data?.total)) : setSecondRecordData(parseInt(result?.data?.data?.total))
        }
        setLoading(false)
    }
    const { handleSubmit, touched, handleChange, values, errors, resetForm } = useFormik({
        initialValues: {
            currency: 'USDT',
            at_price: '',
            min_quantity: '',
            max_quantity: '',
            with_currency: "INR"
        },
        validationSchema: Yup.object({
            at_price: Yup.string()
                // .max(15, 'Must be 15 characters or less')
                .required('This Field is Required'),
            min_quantity: Yup.string()
                .required("This Field is Required"),
            max_quantity: Yup.string()
                .required("This Field is Required")

        }),
        onSubmit: async (body) => {

            let allData = body;

            if (tab1 == 'sell' && selected1.length == 0) {
                setShowerr("This Field is Required");
                return

            }

            allData.payment_type = "";
            if (tab1 === "sell") {
                selected1.map((val) => {
                    allData.payment_type = `${val.value},${allData.payment_type}`;

                });
                allData.payment_type = allData.payment_type.slice(0, -1);
            }

            allData.order_type = tab1;
            setLoader(true);
            const res = await ApiClass.postNodeRequest("P2P/P2POrder/create", true, allData);
            if (res === undefined) {
                SwalClass.error("server is not found")
                return;
            }
            if (res?.data?.status_code == 0) {
                SwalClass.error(res?.data?.message);
                setLoader(false);
                return;
            }
            if (res?.data?.status_code == 1) {
                // console.log("dfdfdf");
                SwalClass.success(res?.data?.message);
                setLoader(false);
                resetForm();
                document.getElementById("closeTransferModal").click()

            }


        },
    });
    const pairHandle = (val) => {

        if (val == 0 || val.length == 0) {
            setPairPrice(0);
            setCurPrice(0);
        }

        val = _breakBalance(val);
        setPairPrice(val);
        let Type = TabData[TabType]?.o_type;
        let p = (Type == "buy") ? exactMath.div(val || 0, mData?.at_price || 1, mathConfig) : exactMath.mul(val || 0, mData?.at_price || 0, mathConfig);
        p = _breakBalance(p);
        setCurPrice(p);
    }
    const pType = async () => {
        let res = await ApiClass.getNodeRequest("P2P/P2POrder/paymenttype", true)
        let d = [];
        for (const [key, value] of Object.entries(res?.data?.data)) {
            d.push({ value: key, label: key })
        }
        setPayment(d);
        // setPayment(Object.keys(res?.data?.data).map((key) => key))
    }
    const CurrencyHandle = (val) => {

        if (val == 0 || val.length == 0) {
            setPairPrice(0);
            setCurPrice(0);
        }


        val = _breakBalance(val);
        setCurPrice(val);
        let Type = TabData[TabType]?.o_type;
        let p = (Type == "buy") ? exactMath.mul(val || 0, mData?.at_price || 0, mathConfig) : exactMath.div(val || 0, mData?.at_price || 1, mathConfig);
        p = _breakBalance(p);
        setPairPrice(p);
    };
    const bal = async () => {
        let res = await ApiClass.getNodeRequest("P2P/P2POrder/P2PWallet", true)
        setBalance(res.data.data);
    }
    const handlePageClick = (e, t) => {

        page = page + e.selected;
        P2p("", t, "", page);

    };
    useEffect(() => {
        if (IsLogin) {
            bal()
            pType()
        }
    }, [])
    // const PlaceOrder = async (e) => {

    //     let body = {};

    //     e.preventDefault()
    //     body.with_currency = mData?.with_currency;
    //     body.currency = mData?.currency;
    //     body.order_id = mData?.id;
    //     body.order_type = TabData[TabType]?.o_type;
    //     body.quantity = (TabData[TabType]?.o_type == "buy") ? curPrice : PairPrice;

    //     var payment_methods = "";
    //     selected.map((data, i) => {
    //         payment_methods = data.label + "," + payment_methods;
    //     })
    //     payment_methods = payment_methods.slice(0, -1)
    //     body.payment_type = payment_methods;
    //     const response = await ApiClass.postNodeRequest("P2P/trade/create", true, body)
    //     if (response?.data?.status_code == 0) {
    //         SwalClass.error(response?.data?.message);
    //         // maintain = true
    //         return;
    //     }

    //     if (response?.data?.status_code == 1) {
    //         document.getElementById('closeP2pModal').click();
    //         nav(`/p2p-chat?s=${response?.data?.data?.match_order_id}`)

    //         SwalClass.success(response?.data?.message);
    //     }
    // }
    const PlaceOrder = async (e) => {

        let body = {};

        e.preventDefault()
        body.with_currency = mData?.with_currency;
        body.currency = mData?.currency;
        body.order_id = mData?.id;
        body.order_type = TabData[TabType]?.o_type;
        body.quantity = (TabData[TabType]?.o_type == "buy") ? curPrice : PairPrice;

        var payment_methods = "";
        selected.map((data) => {
            payment_methods = data.label + "," + payment_methods;
        })
        payment_methods = payment_methods.slice(0, -1)
        body.payment_type = payment_methods;
       
        if ((PairPrice == "0" || PairPrice == " ") && (curPrice == "0" || curPrice == ' ')) {
            setError("Amount should be greater then 0.");
            return;
        }
        if (selected.length == 0 && TabData[TabType]?.o_type == "sell") {
            setError1('Payment  Type is Required');
            return;

        }
        if (PairPrice == '0' || curPrice == '0') {
            return;
        }

        const response = await ApiClass.postNodeRequest("P2P/trade/create", true, body)
        if (response?.data?.status_code == 0) {
            SwalClass.error(response?.data?.message);
            return;
        }
        if (response?.data?.status_code == 1) {
            document.getElementById('closeP2pModal').click();
            nav(`/p2p-chat?s=${response?.data?.data?.match_order_id}`)
            SwalClass.success(response?.data?.message);
            
        }

    }
    let optionData = []
    // payment_Types.map((val,index)=>{
    //     optionData.push({value:val,label:val})
    //  })
    const modalData = (val) => {
        setPairPrice(0);
        setCurPrice(0);
        setMData(val);
    }
    const changeTab = (val) => {
        setTab1(val);

    }
    console.log(tab1,"ff")

    const selectValue = (e) => {
        setSelected1(e);
        setShowerr("")
    }

    // console.log(TabType,'types data');
    return (
        <>
            <div>
                <section className="p2p_buy_sell">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="p2p_buy_box p-3">
                                    <div className="link_box_p2p d-flex align-items-center justify-content-between mb-3">
                                        <div className="p2p_main_box d-flex align-items-center ">
                                            <ul className="nav nav-pills mb-2 mb-md-0" id="pills-tab" role="tablist">
                                                {
                                                    types != null &&
                                                    types.map((v, i) => {
                                                        return (
                                                            <li key={i} className="nav-item " role="presentation">
                                                                <button className={`nav-link ${(v.v == TabType) ? `${TabType == 'b' ? 'active-green' : 'active-red'} active` : ``} `} id="pills-Buy-tab" onClick={() => { setTabType(v.v) }} data-bs-toggle="pill" data-bs-target={`#nav-p_${TabType}`} type="button" role="tab" aria-controls="pills-Buy" aria-selected="true">{v.l}</button>
                                                            </li>
                                                        )
                                                    })}
                                                {/* {console.log(v.v , 'dfd')} */}
                                            </ul>
                                            {/*  buy sell tabs */}
                                            <div className="tabs_p2p ms-3">
                                                <ul className="list-group list-group-horizontal">
                                                    {/* <li className="list-group-item active">BTC</li> */}
                                                    <li className="list-group-item">USDT/INR</li>
                                                    {/* <li className="list-group-item">ETH</li>
                                    <li className="list-group-item">TRX</li> */}
                                                </ul>
                                            </div>
                                        </div>
                                        {IsLogin &&
                                            <div className="order_links">
                                                <ul className="list-group list-group-horizontal">
                                                    <li className="list-group-item"> <Link to="" data-bs-toggle="modal"
                                                        data-bs-target="#create_modal">Create Order</Link>  </li>
                                                    <li className="list-group-item"> <Link to="/p2p-order">Order History </Link></li>
                                                    <li className="list-group-item"><Link to="/p2p-mywallet">My Wallets</Link></li>
                                                </ul>
                                            </div>
                                        }
                                        {/* links */}
                                    </div>
                                    <div>
                                        {TabType && <P2pBuyComponent P2p={P2p} type={TabType} />}
                                    </div>
                                    {/* top tab and heading */}
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className={`tab-pane fade text-white ${TabType == "b" ? 'show active' : ''}`} id="nav-p_b" role="tabpanel" aria-labelledby="pills-Buy-tab" tabIndex="0">
                                            {TabType == "b" && <P2pbuyComponent P2p={P2p} inital={inital} modalData={modalData} handlePageClick={handlePageClick} pageCount={pageCount} paymentMethod={paymentMethod} IsLogin={IsLogin} loading={loading} TabData={TabData} itemOffset={itemOffset} />}
                                        </div>
                                        {/* p2p buy component */}
                                        <div className={`tab-pane fade text-white ${TabType == "s" ? 'show active' : ''}`} id="nav-p_s" role="tabpanel" aria-labelledby="pills-Sell-tab" tabIndex="0">
                                            {TabType == "s" && <P2psellComponent P2p={P2p} inital={inital} handlePageClick={handlePageClick} modalData={modalData} pageCount={pageCount} paymentMethod={paymentMethod} IsLogin={IsLogin} loading={loading} TabData={TabData} secondpageCount={secondpageCount} seconditemOffset={seconditemOffset} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* create order model */}
                <div
                    className="modal fade"
                    id="create_modal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered  modal-lg">
                        <div className="modal-content">
                            <div className="modal-header border-bottom-0">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">
                                    Create Order
                                </h1>
                                <button
                                    type="button"
                                    className="btn_close shadow-none border-0"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    id="closeTransferModal"
                                >
                                    <svg
                                        height="24px"
                                        width="24px"
                                        style={{ fill: "var(--ex-buy-white)" }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 320 512"
                                    >
                                        <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className="nav-link buy active"
                                            id="pills-Buy1-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-Buy1"
                                            type="button"
                                            role="tab"
                                            aria-controls="pills-Buy1"
                                            aria-selected="true"
                                            onClick={() => changeTab("buy")}
                                        >
                                            Buy
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className="nav-link sell"
                                            id="pills-Sell1-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-Sell1"
                                            type="button"
                                            role="tab"
                                            aria-controls="pills-Sell1"
                                            aria-selected="false"
                                            onClick={() => changeTab("sell")}
                                        >
                                            Sell
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="pills-Buy1"
                                        role="tabpanel"
                                        aria-labelledby="pills-Buy1-tab"
                                        tabIndex="0"
                                    >
                                        <div className="row">
                                            <form className="row" onSubmit={handleSubmit}>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text" style={{ backgroundColor: 'var(--p2p-tab)', color: 'var(--white' }} id="basic-addon1">Currency</span>
                                                            <input type="text" className="form-control shadow-none " aria-label="Username" aria-describedby="basic-addon1" name="currency"
                                                                id="currency"
                                                                onChange={handleChange}
                                                                value={values.currency}
                                                                readOnly />
                                                        </div>
                                                        {errors.currency && touched.currency && (
                                                            <span style={{ color: "red", fontSize: "small" }}>
                                                                {errors.currency}
                                                            </span>
                                                        )}
                                                    </div>

                                                </div>
                                            
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text" style={{ backgroundColor: 'var(--p2p-tab)', color: 'var(--white' }} id="basic-addon1"> With Currency</span>
                                                            <input type="text" className="form-control shadow-none " aria-label="Username" aria-describedby="basic-addon1" name="currency"
                                                                id="currency"
                                                                onChange={handleChange}
                                                                value={values.with_currency}
                                                                readOnly />
                                                        </div>
                                                        {errors.currency && touched.currency && (
                                                            <span style={{ color: "red", fontSize: "small" }}>
                                                                {errors.currency}
                                                            </span>
                                                        )}
                                                        
                                                    </div>
                                                </div>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-1">

                                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                                            At Price
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control shadow-none border-0"
                                                            id="exampleInputEmail1"
                                                            aria-describedby="emailHelp"
                                                            name='at_price'
                                                            onKeyPress={(e) => onHandleKeyPress(e, 2)}
                                                            onKeyUp={(e) => onHandleKeyUp(e)}
                                                            onKeyDown={(e) => onHandleKeyDown(e)}
                                                            onPaste={(e) => onHandlePaste(e, 2)}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onChange={handleChange}
                                                            value={values.at_price}
                                                        />
                                                    </div>
                                                    {errors.at_price && touched.at_price && (
                                                        <span style={{ color: "red", fontSize: "small" }}>
                                                            {errors.at_price}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-1">
                                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                                            Min Quantity
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control shadow-none border-0"
                                                            id="exampleInputEmail1"
                                                            aria-describedby="emailHelp"
                                                            name="min_quantity"
                                                            onKeyPress={(e) => onHandleKeyPress(e, 2)}
                                                            onKeyUp={(e) => onHandleKeyUp(e)}
                                                            onKeyDown={(e) => onHandleKeyDown(e)}
                                                            onPaste={(e) => onHandlePaste(e, 2)}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onChange={handleChange}
                                                            value={values.min_quantity}
                                                        />
                                                    </div>
                                                    {errors.min_quantity && touched.min_quantity && (
                                                        <span style={{ color: "red", fontSize: "small" }}>
                                                            {errors.min_quantity}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-1">
                                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                                            Max Quantity
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control shadow-none border-0"
                                                            id="exampleInputEmail1"
                                                            aria-describedby="emailHelp"
                                                            name='max_quantity'
                                                            onKeyPress={(e) => onHandleKeyPress(e, 2)}
                                                            onKeyUp={(e) => onHandleKeyUp(e)}
                                                            onKeyDown={(e) => onHandleKeyDown(e)}
                                                            onPaste={(e) => onHandlePaste(e, 2)}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onChange={handleChange}
                                                            value={values.max_quantity}


                                                        />
                                                    </div>

                                                    {errors.max_quantity && touched.max_quantity && (
                                                        <span style={{ color: "red", fontSize: "small" }}>
                                                            {errors.max_quantity}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-md-12 col-lg-12 col-xl-12">
                                                    <div className="form_box my-4 text-center">
                                                        {loader ? (
                                                            <button
                                                                type="submit"
                                                                className="btn_buycoin shadow-none"
                                                            >
                                                                <span
                                                                    className="spinner-grow spinner-grow-sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Loading...
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="submit"
                                                                className="btn_buycoin shadow-none"
                                                            >
                                                                Buy Coin
                                                            </button>
                                                        )

                                                        }
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="pills-Sell1"
                                        role="tabpanel"
                                        aria-labelledby="pills-Sell1-tab"
                                        tabIndex="0"
                                    >
                                        <div className="row">
                                            <form className="row" onSubmit={handleSubmit}>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text" style={{ backgroundColor: 'var(--p2p-tab)', color: 'var(--white' }} id="basic-addon1">Currency</span>
                                                            <input type="text" className="form-control shadow-none " aria-label="Username" aria-describedby="basic-addon1" name="currency"
                                                                id="currency"
                                                                onChange={handleChange}
                                                                value={values.currency}
                                                                readOnly />
                                                        </div>
                                                        {errors.currency && touched.currency && (
                                                            <span style={{ color: "red", fontSize: "small" }}>
                                                                {errors.currency}
                                                            </span>
                                                        )}
                                                    </div>

                                                </div>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-3">
                                                        <div className="input-group">
                                                            <span className="input-group-text" style={{ backgroundColor: 'var(--p2p-tab)', color: 'var(--white' }} id="basic-addon1">Currency</span>
                                                            <input type="text" className="form-control shadow-none " aria-label="Username" aria-describedby="basic-addon1" name="currency"
                                                                id="currency"
                                                                onChange={handleChange}
                                                                value={values.with_currency}
                                                                readOnly />
                                                        </div>
                                                        {errors.with_currency && touched.with_currency && (
                                                            <span style={{ color: "red", fontSize: "small" }}>
                                                                {errors.with_currency}
                                                            </span>
                                                        )}
                                                    </div>

                                                </div>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-1">
                                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                                            At Price
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control shadow-none border-0"
                                                            id="exampleInputEmail1"
                                                            aria-describedby="emailHelp"
                                                            onKeyPress={(e) => onHandleKeyPress(e, 2)}
                                                            onKeyUp={(e) => onHandleKeyUp(e)}
                                                            onKeyDown={(e) => onHandleKeyDown(e)}
                                                            onPaste={(e) => onHandlePaste(e, 2)}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            name='at_price'
                                                            onChange={handleChange}
                                                            value={values.at_price}

                                                        />
                                                    </div>
                                                    {errors.at_price && touched.at_price && (
                                                        <span style={{ color: "red", fontSize: "small" }}>
                                                            {errors.at_price}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-3">
                                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                                            Payment Method
                                                        </label>
                                                        <Select

                                                            name="group_members"
                                                            options={payment}
                                                            value={selected1 || ""}
                                                            onChange={selectValue}
                                                            labelledBy="Select"
                                                            isMulti
                                                        />

                                                    </div>

                                                    {
                                                        (showerr != "") ? <span style={{ color: "red", fontSize: "small" }}>{showerr}</span> : ""
                                                    }
                                                </div>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-1">
                                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                                            Min Quantity
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control shadow-none border-0"
                                                            id="exampleInputEmail1"
                                                            aria-describedby="emailHelp"
                                                            name='min_quantity'
                                                            onKeyPress={(e) => onHandleKeyPress(e, 2)}
                                                            onKeyUp={(e) => onHandleKeyUp(e)}
                                                            onKeyDown={(e) => onHandleKeyDown(e)}
                                                            onPaste={(e) => onHandlePaste(e, 2)}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onChange={handleChange}
                                                            value={values.min_quantity}

                                                        />
                                                    </div>
                                                    {errors.min_quantity && touched.min_quantity && (
                                                        <span style={{ color: "red", fontSize: "small" }}>
                                                            {errors.min_quantity}
                                                        </span>
                                                    )}

                                                </div>
                                                <div className="col-md-12 col-lg-6 col-xl-6">
                                                    <div className="form_box mb-1">
                                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                                            Max Quantity
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control shadow-none border-0"
                                                            id="exampleInputEmail1"
                                                            aria-describedby="emailHelp"
                                                            name='max_quantity'
                                                            onKeyPress={(e) => onHandleKeyPress(e, 2)}
                                                            onKeyUp={(e) => onHandleKeyUp(e)}
                                                            onKeyDown={(e) => onHandleKeyDown(e)}
                                                            onPaste={(e) => onHandlePaste(e, 2)}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onChange={handleChange}
                                                            value={values.max_quantity}
                                                        />
                                                    </div>
                                                    {errors.max_quantity && touched.max_quantity && (
                                                        <span style={{ color: "red", fontSize: "small" }}>
                                                            {errors.max_quantity}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-md-12 col-lg-12 col-xl-12">
                                                    <div className="form_box my-4 text-center">
                                                        {loader ? (
                                                            <button
                                                                type="submit"
                                                                className="btn_sellcoin shadow-none"
                                                            >
                                                                <span
                                                                    className="spinner-grow spinner-grow-sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Loading...
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="submit"
                                                                className="btn_sellcoin shadow-none"
                                                            >
                                                                Sell Coin
                                                            </button>

                                                        )

                                                        }
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* create order model end */}
            </div>
            <div className="modal fade modal-lg" id="buy-sell-modal" tabIndex="-1" aria-labelledby="buy-sell-modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border rounded-0 p-modal" style={{ color: 'var(--white)' }}>
                        <div className="modal-header position-relative border-bottom-0 p-0">
                            <button type="button" className="btn p-0 border-0 position-absolute" id="closeP2pModal" data-bs-dismiss="modal" aria-label="Close" style={{ top: '-18px', right: '-17px', zIndex: '1' }}>
                                <img src="/images/icons/modal_cross.svg" alt="" className="img-fluid" />
                            </button>
                        </div>
                        <div className="modal-body p-0 p-body">
                            <div className="p-modal-user border-bottom p-3">
                                <div className="p-user-area mb-2">
                                    <p className="mb-2 text-uppercase">{mData?.user?.name}</p>

                                </div>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="p-bar">
                                            <p className="mb-0 text-capitalize">price</p>
                                            <span>{mData?.at_price} {mData?.with_currency}</span>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="p-bar">
                                            <p className="mb-0 text-capitalize">available</p>
                                            <span>{mData?.pending_quantity} {mData?.currency}</span>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="p-bar">
                                            <p className="mb-0 text-capitalize">payment time limit</p>
                                            <span>15 MINUTES</span>
                                        </div>
                                    </div>
                                    {(TabData[TabType]?.o_type) == "buy" &&
                                        <div className="col-lg-3">
                                            <div className="p-bar">
                                                <p className="mb-0 text-capitalize">seller's payment method</p>
                                                <span style={{ color: 'var(--ch-neon)' }}>{mData?.payment_type}</span>
                                            </div>
                                        </div>}
                                </div>
                            </div>
                            <div className="p-modal-form p-3">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-lg-8">
                                        <form onSubmit={(e) => PlaceOrder(e)} >
                                            <div className="d-flex justify-content-between">
                                                <label htmlFor="" className="text-capitalize mb-2">i want to  {(TabData[TabType]?.o_type) == "buy" ? "pay" : "sell"}</label>
                                                {(TabData[TabType]?.o_type) == "sell" && <span className="text-end">Balance : {balance ? _breakBalance(balance?.total_balance) : 0} {mData?.currency} </span>}
                                            </div>
                                            <div className="input-group mb-3 border rounded">
                                                <input type="text" className="form-control" id="quantity" name="quantity"
                                                    placeholder=
                                                    {(TabData[TabType]?.o_type) == "buy" ?
                                                        `${mData?.min_quantity * mData?.at_price}-${mData?.pending_quantity * mData?.at_price} ` : `${mData?.min_quantity}-${mData?.pending_quantity}`} aria-label="amount" aria-describedby="basic-addon-amount"


                                                    value={PairPrice}
                                                    onChange={(e) => {
                                                        pairHandle(e.target.value);
                                                    }}

                                                    onKeyPress={(e) => onHandleKeyPress(e, 2)}
                                                    onKeyUp={(e) => onHandleKeyUp(e)}
                                                    onKeyDown={(e) => onHandleKeyDown(e)}
                                                    onPaste={(e) => onHandlePaste(e, 2)}
                                                    onDragOver={(e) => e.preventDefault()}
                                                />

                                                <span className="input-group-text border-0" id="basic-addon-amount">

                                                    <p className="mb-0 text-uppercase"> {(TabData[TabType]?.o_type) == "buy" ? mData?.with_currency : mData?.currency}</p>
                                                </span>
                                            </div>
                                            <div className="input-errors" >
                                                {PairPrice == '0' && (
                                                    <span style={{ color: 'red', fontSize: 'small' }}>{error}</span>)}
                                            </div>
                                            <label htmlFor="" className="text-capitalize mb-2">i will receive</label>
                                            <div className="input-group mb-3 border rounded">
                                                <input type="text" className="form-control" placeholder={(TabData[TabType]?.o_type) == "buy" ?
                                                    `${mData?.min_quantity}-${mData?.pending_quantity} ` : `${mData?.min_quantity * mData?.at_price}-${mData?.pending_quantity * mData?.at_price} `} aria-label="amount" aria-describedby="basic-addon-amount"


                                                    value={curPrice}
                                                    onChange={(e) => {
                                                        CurrencyHandle(e.target.value);
                                                    }}

                                                    onKeyPress={(e) => onHandleKeyPress(e, 2)}
                                                    onKeyUp={(e) => onHandleKeyUp(e)}
                                                    onKeyDown={(e) => onHandleKeyDown(e)}
                                                    onPaste={(e) => onHandlePaste(e, 2)}
                                                    onDragOver={(e) => e.preventDefault()}

                                                />
                                                <span className="input-group-text border-0" id="basic-addon-amount">
                                                    <p className="mb-0 text-uppercase">
                                                        {(TabData[TabType]?.o_type) == "buy" ? mData?.currency : mData?.with_currency}
                                                    </p>
                                                </span>
                                            </div>
                                            <div className="input-errors" >
                                                {curPrice == '0' && (
                                                    <span style={{ color: 'red', fontSize: 'small' }}>{error}</span>)
                                                }
                                            </div>

                                            {(TabData[TabType]?.o_type) == "sell" && <>
                                                <label htmlFor="" className="text-capitalize mb-2">payment method</label>
                                                <div className="dropdown set-payment">

                                                    <Select
                                                        name="group_members"
                                                        options={payment}
                                                        value={selected || ""}
                                                        onChange={setSelected}
                                                        labelledBy="Select"
                                                        isMulti
                                                        className="mb-3"
                                                    />
                                                </div>
                                                <div className="input-errors" >
                                                    {selected.length == 0 && (
                                                        <span style={{ color: 'red', fontSize: 'small' }}>{error1}</span>)}
                                                </div>

                                            </>}
                                            <button
                                                className="btn w-100 mb-3 rounded-0 text-uppercase text-white"
                                                style={(TabData[TabType]?.o_type) == "sell" ? { borderColor: 'var(--ch-red)', background: 'var(--ch-red)' }
                                                    : { borderColor: 'var(--ch-green)', background: 'var(--ch-green)' }}
                                            >
                                                {(TabData[TabType]?.o_type) == "buy" ? `buy ${mData?.currency}` : `sell ${mData?.currency}`}
                                            </button>

                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>


    )
}