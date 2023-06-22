import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"; // navigation and params
import Emitter from '../../event/Emitter';

const Currency = (props) => {
    const navigate = useNavigate();
    const handleActive = (symbol) => { navigate(`/exchange?s=${symbol}`); }

    let { image, currency, pair_with, change, price, changeC, flag, symbol, decimal_pair } = props.data;

    let active = props.active
    useEffect(() => {
        if (props.s == symbol) {
            Emitter.emit('EVENT_DETAIL_BAR', props.data);
        }
    }, [props]);

    return (
        <>

            <div className={`ticker-item ${active?.symbol == symbol ? `ticker-active` : ``}`} onClick={() => { handleActive(symbol) }}  style={{ cursor: "pointer" }}>
                <div className="ticker-info">
                    <div className="ticker-image">
                        <img
                            src={image}
                            style={{ width: "20px" }}
                            className="img-fluid"
                            alt="currency-image"
                            loading="lazy"
                            onError={event => {
                                event.target.src = "./not-found.png"
                                event.onerror = null
                                }}
                        />
                    </div>
                    <div className="inner-info">
                        <h6 className="mb-0 text-uppercase">
                            {currency}/<span>{pair_with}</span>
                        </h6>
                        <p
                            className="mb-0"
                            style={(change > 0 ? { color: "var(--ex-green)" } : { color: "var(--ex-red)" })}
                        >
                            {change > 0 ? "▲" : "▼"} {change}%
                        </p>
                    </div>
                </div>

                <div className="ticker-change">
                    <p className="mb-0" style={change > 1 ? { color: "var(--ex-green)" } : { color: "var(--ex-red)" }}>

                        {parseFloat(price).toFixed(decimal_pair)}
                    </p>
                </div>
            </div>
        </>
    );
}

export default Currency
