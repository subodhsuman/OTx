import React from 'react'

const WithdrawModal = ({ portfolio_Data, withdraw_Data, formik, amountError, network_set, Submitloading, setAmountError, setSubmitLoading }) => {

    return (
        <div
            className="modal fade"
            id="withdrawModal"
            tabIndex="-1"
            aria-labelledby="withdrawModalLabel"
            aria-hidden="true"
        ><div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title m-auto text-uppercase" id="exampleModalLabel">withdraw {portfolio_Data.name}</h5>
                        <button type="button" id="closeModalWith" onClick={() => { formik.resetForm(), setAmountError(false), setSubmitLoading(false) }} className="btn-close border-0 shadow-none m-0" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    {portfolio_Data.withdraw_enable ? (

                        <div className="modal-body">
                            <div className="form_box">

                                <form onSubmit={formik.handleSubmit} className="row">

                                    <div className="col-md-12 col-lg-12 col-xl-12">
                                        <div className="mb-3 withdraw_box">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Destination</label>

                                            <input
                                                type="text"
                                                className="form-control shadow-none border-0" placeholder="Wallet Address"
                                                name="destination"
                                                id="destination"
                                                onChange={formik.handleChange}
                                                value={formik.values.destination}

                                            />
                                            {formik.errors.destination &&
                                                formik.touched.destination && (
                                                    <span style={{ color: "red" }}>
                                                        {formik.errors.destination}
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    {/* destination */}

                                    <div className="col-md-12 col-lg-12 col-xl-12">
                                        <div className="mb-3 withdraw_box">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Token</label>
                                            <select className="form-select shadow-none border-0" aria-label="Default select example" onChange={(e) => network_set(e)}>
                                                {portfolio_Data?.currency_networks?.map(
                                                    (network, i) => {
                                                        return network.withdraw_enable ? (
                                                            <option key={i} value={network.network_id}>
                                                                {network.token_type}
                                                            </option>
                                                        ) : (
                                                            ""
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    {/*token  */}

                                    <div className="col-md-12 col-lg-12 col-xl-12">
                                        <div className="mb-3 withdraw_box">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Amount</label>
                                            <input
                                                type="text"
                                                className="form-control shadow-none border-0" placeholder="Amount"
                                                name="amount"
                                                id="amount"
                                                onKeyPress={(event) => {
                                                    const regExp = /[^0-9\.]/g;
                                                    if (regExp.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                onChange={formik.handleChange}
                                                value={formik.values.amount}
                                            />
                                            {formik.errors.amount && formik.touched.amount && (
                                                <span style={{ color: "red" }}>
                                                    {formik.errors.amount}
                                                </span>
                                            )}

                                            {amountError ? (
                                                <div style={{ color: "red" }}>
                                                    Amount should be less or equal to your balance.
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                    {/* amount */}

                                    <div className="col-md-12 col-lg-12 col-xl-12">
                                        <div className="mb-3 withdraw_box d-flex align-items-center justify-content-between">
                                            <div className="fees_info"><p>Transaction Fees: {withdraw_Data?.withdraw_commission}{withdraw_Data?.type === "percentage" ? "%" : ""}</p></div>
                                            <div className="fees_amount"><p>{portfolio_Data?.quantity} {portfolio_Data?.symbol}</p></div>
                                        </div>
                                    </div>
                                    {/* details */}

                                    <div className="col-md-12 col-lg-12 col-xl-12">

                                        <div className="withdraw_box text-center">
                                            {Submitloading &&
                                                <button className="btn_proceed shadow-none w-50" type="button">
                                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                                    Loading...
                                                </button>}
                                            {!Submitloading && <button type="submit" className="btn_proceed shadow-none w-50">Proceed Withdraw</button>}
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    ) : (
                        <div className='my-3' style={{ color: "var(--tab-grey)", textAlign: "center" }}>

                            {portfolio_Data?.withdraw_desc}{" "}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WithdrawModal