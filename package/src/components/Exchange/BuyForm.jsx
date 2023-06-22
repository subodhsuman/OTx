import React, { useState, useEffect } from 'react'
import { useFormik } from "formik"; // Form Validation Formik Plugin
import * as Yup from "yup"; // ITS OPTIONAL FOR SMALL VALIDATION METHOD
import exactMath from "exact-math";
import BuyInput from './BuyInput';
import { useNavigate } from 'react-router-dom';
import _ from "lodash";
import ApiClass from '../../api/api.js';
import SwalClass from "../../Common/Swal.js";
import Emitter from "../../event/Emitter.jsx";
import { useSelector } from 'react-redux';
const config = { returnString: true, eMinus: Infinity, ePlus: Infinity };

const OT = {
    // ======== ORDER ===========
    OBL: 'BUY', // ORDER BUY LABEL
    OBV: 'buy',  // ORDER BUY VALUE
    OSL: 'SELL', // ORDER SELL LABEL
    OSV: 'sell', // ORDER SELL VALUE
    OBT: 'buy-tab',
    OST: 'sell-tab',
    // ======== TYPE ==============
    TML: 'MARKET', // TYPE MARKET LABEL
    TMV: 'market', // TYPE MARKET VALUE
    TSLL: 'STOP LIMIT', // TYPE STOP LIMIT LABEL
    TSLV: 'stop_limit', // TYPE STOP LIMIT VALUE
    TLL: 'LIMIT', // TYPE LIMIT LABEL
    TLV: 'limit', // TYPE LIMIT VALUE
}

const orderTypeItem = [{ l: OT.OBL, v: OT.OBV, t: OT.OBT }, { l: OT.OSL, v: OT.OSV, t: OT.OST }];  // label and value
const TypeItem = [{ l: OT.TML, v: OT.TMV }, { l: OT.TLL, v: OT.TLV }, { l: OT.TSLL, v: OT.TSLV }]; // label and value
const Percentage = [{ l: "25%", v: 25 }, { l: "50%", v: 50 }, { l: "75%", v: 75 }, { l: "MAX", v: 100 }]; // label and value


function BuyForm({ active, getUserFund }) {

    const [btnLoading, setBtnLoading] = useState(false)
    const IsLogin = useSelector((state) => {
        return state.user.token ? true : false;
    });
    var { pair_with, currency, price, decimal_pair, decimal_currency, p_balance, c_balance } = active;

    const [b, setB] = useState({
        p_balance: p_balance,
        c_balance: c_balance
    })


    const [formType, setFormType] = useState({
        type: OT.TLV, // TYPE LIMIT VALUE
        o_type: OT.OBV,  // ORDER BUY VALUE
    });

    const onHandleTab = (k, v) => {
        setFormType(formType => ({ ...formType, [k]: v }));
        (k == "type") ? setFieldValue("type", v) : setFieldValue("order_type", v);
    }

    const HandlePercentage = (v) => {
        let d = (formType.o_type == OT.OBV) ? b.p_balance : b.c_balance;

        let price = getKeyValue("at_price");

        if (price == 0 && price == "") {
            return;
        }

        let total = getKeyValue("total");

        total = exactMath.div(exactMath.mul(d, v, config), 100, config);

        setKeyValue('total', total);

        let qty = (price > 0 && total > 0) ? exactMath.div(total, price, config) : 0;

        setKeyValue("quantity", qty);
    }

    const setKeyValue = (k, v) => {
        let d = (k != "quantity") ? decimal_pair : decimal_currency;
        let value = parseFloat(v).toFixed(d);
        document.getElementById(k).value = value;
        setFieldValue(k, value);
    }

    const getKeyValue = (k) => {
        return document.getElementById(k)?.value ?? 0;
    }

    const setLatestFund = async () => {
        let latestFund = await getUserFund();
        b.c_balance = _.get(latestFund.find((v) => v.currency == currency), "balance"); // getting user currency balance
        b.p_balance = _.get(latestFund.find((v) => v.currency == pair_with), "balance"); // getting user pair balance
        setB(b => ({ ...b, b }));
    }

    const { handleChange, setFieldValue, handleSubmit, errors, touched, resetForm } = useFormik({
        initialValues: {
            order_type: formType.o_type,  // ORDER BUY VALUE
            type: formType.type, // TYPE LIMIT VALUE
            currency: currency,
            with_currency: pair_with,
            stop_price: "",
            at_price: "",
            quantity: "",
            total: "",
        },
        validationSchema: Yup.object({
            at_price: Yup.number().required("This Field is Required.").moreThan(0, "Price should be greater than 0."),
            quantity: Yup.number().required("This Field is Required.").moreThan(0, "Amount should be greater than 0."),
            total: Yup.number().required("This Field is Required.").moreThan(0, "Total should be greater than 0.")
        }),
        onSubmit: async (body) => {
            setBtnLoading(true)
            let param = body;

            if (param.type == OT.TLV) {   // if type is equal to limit
                param = _.omit(param, ['stop_price']);
            }

            let response = await ApiClass.postNodeRequest(`orders/place-order`, true, param);

            if (response?.data?.status_code == 0) {
                SwalClass.error(response?.data?.message);
                setBtnLoading(false)

                return;
            }

            if (response?.data?.status_code == 1) {
                setKeyValue("at_price", price); setKeyValue("quantity", 0); setKeyValue("total", 0);  // reset form and values
                await setLatestFund(); // update user balance
                SwalClass.success(response?.data?.message);
                setBtnLoading(false)

                return;
            }

        }
    });
    Emitter.on("getPrice", (value) => {
        value.t === "l"
            ? setFormType((formType) => ({ ...formType, o_type: OT.OBV }))
            : setFormType((formType) => ({ ...formType, o_type: OT.OSV }));

        setKeyValue("at_price", value.p);
    });

    Emitter.once("sendingdata", (cur) => {
        setKeyValue("at_price", cur.at_price);
        setKeyValue("quantity", cur.quantity);
        setKeyValue("total", cur.total);
    });

    useEffect(() => {
        setKeyValue("at_price", price);
        setFieldValue("currency", currency);
        setFieldValue("with_currency", pair_with);
        setKeyValue("quantity", 0); setKeyValue("total", 0);
        setB({ p_balance, c_balance })
    }, [currency]);

    // Emitter.once("EVENT_SET_DEPTH_PRICE", ({ p, t }) => {
    //     if (p != "") {
    //         setKeyValue("at_price", p);
    //         let c = (t == OT.OBV) ? OT.OSV : OT.OBV;
    //         setFormType(formType => ({ ...formType, o_type: c, type: OT.TLV }));
    //     }
    // });

    const inputJson = { handleChange, setKeyValue, getKeyValue, active, errors, touched };
    const nav = useNavigate()
    return (
        <>
            <div className="buysell">
                <div className="buysell-tab mb-4">
                    <ul className="nav nav-pills nav-fill" id="pills-tab" role="tablist">
                        {
                            orderTypeItem.map((v, i) => {
                                return (
                                    <li className="nav-item text-light" role="presentation" key={i}>
                                        <button className={`nav-link ${(v.v == OT.OBV) ? ['green-active'] : ['red-active']} ${(v.v == formType.o_type) ? `active` : ``} ${(v.v == OT.OBV) ? `` : ''}`} id="buy-buy-tab" data-bs-toggle="pill" data-bs-target={`#${v.v}`} type="button" role="tab" aria-controls="pills-buy" aria-selected="true" onClick={() => onHandleTab("o_type", v.v)}>{v.l}</button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                <div className="tab-info">
                    <div className="tab-content" id="pills-tabContent">
                        <div
                            className="tab-pane show active"
                            id="pills-buy"
                            role="tabpanel"
                            aria-labelledby="pills-buy-tab"
                            tabIndex="0"
                        >
                            <div className="buy-tab mb-3">
                                <ul
                                    className="nav nav-pills nav-fill"
                                    id="pills-tab"
                                    role="tablist"
                                >
                                    {TypeItem.map((v, i) => {
                                        return (
                                            <li className="nav-item" role="presentation" key={i}>
                                                {/* <!--  market, limit, stop limit   --> */}
                                                <button className={`nav-link ${(v.v == formType.type) ? `active text-default` : `text-default`}`} id="pills-buy-market-tab"
                                                    data-bs-toggle="pill" data-bs-target="#pills-buy-market"
                                                    type=" " role="tab" aria-controls="pills-buy-market"
                                                    aria-selected="true" onClick={() => onHandleTab("type", v.v)}> {v.l} </button>
                                            </li>
                                        )
                                    })
                                    }

                                </ul>
                            </div>

                            <div className="buy-content">
                                <div className="tab-content" id="pills-tabContent">
                                    <div
                                        className="tab-pane show active"
                                        id="pills-buy-market"
                                        role="tabpanel"
                                        aria-labelledby="pills-buy-market-tab"
                                        tabIndex="0"
                                    >
                                        <form onSubmit={handleSubmit}>

                                            {formType.type != OT.TMV && (
                                                <span
                                                    className={`${formType.o_type == OT.OBV ? `text-success` : `text-danger`
                                                        }`}
                                                    style={{
                                                        float: "right !important",
                                                        marginTop: "10px",
                                                        marginBottom: "10px",
                                                        cursor: "pointer",
                                                    }}
                                                    // onClick={() =>
                                                    //     Emitter.emit(
                                                    //         "event_price_handle",
                                                    //         formType.o_type == OT.OBV ? "l" : "h"
                                                    //     )
                                                    // }
                                                >
                                                    {formType.o_type == OT.OBV ? "Lowest Price" : "Highest Price"}
                                                </span>
                                            )}
                                            <br />

                                            <div className="form-box">
                                                <div className="row form-row">
                                                    <div className="col-md-12 col-lg-12 col-xl-12 mb-2">
                                                        <div className="col-md-12 col-lg-12 col-xl-12 mb-2">
                                                            {(formType.type == OT.TSLV) && <BuyInput inputJson={inputJson} inputName="trigger" inputLable="Trigger Price" />}
                                                        </div>
                                                        <div style={(formType.type != OT.TMV) ? {} : { display: "none" }}>
                                                            <BuyInput inputJson={inputJson} inputName="at_price" inputLable="At Price" />
                                                        </div>

                                                    </div>

                                                    <div className="col-md-12 col-lg-12 col-xl-12 mb-2">

                                                        <BuyInput inputJson={inputJson} inputName="quantity" inputLable="Amount" />
                                                    </div>
                                                    {
                                                        (IsLogin) ?


                                                            (formType.o_type == OT.OSV && formType.type != OT.TMV) &&
                                                            // <div className="hstack gap-3">
                                                            <div className="col-md-12 col-lg-12 col-xl-12 mb-3 text-white">
                                                                <div className="hstack">
                                                                    {Percentage.map((v, i) => {
                                                                        return (<div style={{ cursor: "pointer" }} onClick={() => HandlePercentage(v.v)} key={i}>{v.l}</div>);
                                                                    })}
                                                                </div>
                                                            </div>

                                                            :
                                                            ""
                                                    }


                                                    <br />

                                                    {(formType.type != OT.TMV) && <BuyInput inputJson={inputJson} inputName="total" inputLable="Total" /> /* TOTAL */}
                                                    {/**col-md-12 col-lg-12 col-xl-12**/}




                                                    {
                                                        (IsLogin) ?
                                                            (formType.o_type == OT.OBV && formType.type != OT.TMV) &&
                                                            <div className="col-md-12 col-lg-12 col-xl-12 mb-3 text-white">
                                                                <div className="hstack">                                                {Percentage.map((v, i) => {
                                                                    return (<div style={{ cursor: "pointer" }} onClick={() => HandlePercentage(v.v)} key={i}>{v.l}</div>);
                                                                })}
                                                                </div>
                                                            </div>
                                                            :
                                                            ""
                                                    }




                                                    {(IsLogin) && <div className="col-md-12 col-lg-12 col-xl-12 mb-3">
                                                        <div className="wallet-box">
                                                            <p className="mb-0 text-uppercase">
                                                                <span>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 512 512"
                                                                        height="14px"
                                                                        width="14px"
                                                                        style={{ fill: "var(--grey)" }}
                                                                    >
                                                                        <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 336c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
                                                                    </svg>
                                                                </span>{" "}
                                                                {(formType.o_type == OT.OBV) ? `${pair_with} : ${b.p_balance}` : `${currency} : ${b.c_balance}`}
                                                            </p>
                                                        </div>
                                                        {/**wallet-box**/}
                                                    </div>}
                                                    {/**col-md-12 col-lg-12 col-xl-12**/}
                                                    {
                                                        (IsLogin) ?
                                                            <div className="col-md-12 col-lg-12 col-xl-12">
                                                                <div className="submit-btn">
                                                                    {btnLoading ? <button type="button" disabled id={(formType.o_type == OT.OBV) ? "green" : "red"} className={` btn btn-primary  ${(formType.o_type == OT.OBV) ? `btn-success` : `btn-danger`} `}>Loading .... </button> :
                                                                        <button type="submit" id={(formType.o_type == OT.OBV) ? "green" : "red"} className={` btn btn-primary  ${(formType.o_type == OT.OBV) ? `btn-success` : `btn-danger`} `}>PLACE {(formType.o_type == OT.OBV) ? pair_with : currency} ORDER</button>}
                                                                </div>
                                                            </div> :
                                                            <div className="col-md-12 col-lg-12 col-xl-12">
                                                                <div className="submit-btn">
                                                                    <button className={`btn border-0 w-100 rounded-0 text-capitalize py-2 btn_log_first text-white`} style={{ color: 'var(--ch-black)' }}>
                                                                        <a onClick={() => nav("/login")} >  Login </a>
                                                                        <span> or</span>
                                                                        <a onClick={() => nav("/signup")}> Register </a>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                    }
                                                    {/* {(IsLogin) ?
                                                        <div className="col-md-12 col-lg-12 col-xl-12">
                                                            <div className="submit-btn">
                                                                <button type="submit"  id={(formType.o_type == OT.OBV) ?"green":"red"} className={` btn btn-primary  ${(formType.o_type == OT.OBV) ? `btn-success` : `btn-danger`} `}>PLACE {(formType.o_type == OT.OBV) ? pair_with : currency} ORDER</button>
                                                            </div>
                                                        </div>
                                                        : <div className="col-md-12 col-lg-12 col-xl-12">
                                                            <div className="submit-btn">
                                                                <button type="button"  className={(formType.o_type == OT.OBV) ? " btn btn-success" : " btn btn-danger"} >Login</button>
                                                            </div>
                                                        </div>
                                                    } */}
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
        </>
    )
}
export default BuyForm;