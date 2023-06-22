import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function TrendTable({ dataa, tab }) {

    const IsLogin = useSelector((state) => {
        return state.user.token ? true : false;
      })
    return (
        <div>
            <div className="table-responsive">
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th scope="col" className="image">Image</th>
                            <th scope="col">coin</th>
                            <th scope="col">last price</th>
                            {tab == "hot" && <th scope="col"> Volume</th>}
                            {tab == "top" && <th scope="col">24H Change</th>}
                            {tab == "new" && <th scope="col">New</th>}

                            {/* <th scope="col">markets</th> */}
                            <th scope="col" className="trade-btn">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dataa?.slice(0, 8)?.map((val, i) => {
                            return (
                                <tr key={i}>
                                    <td scope="row">
                                        <div className="trend-box" id="trend-image">
                                            <img src={val?.image} alt="" className="img-fluid" loading="lazy" style={{ width: 25 + 'px', height: 25 + 'px' }} />
                                        </div>{/**trend-image**/}
                                    </td>

                                    <td>
                                        <div className="trend-box" id="trend-coin">
                                            <h6 className="text-uppercase">{val?.currency} /{val.pair_with}</h6>
                                        </div>{/**trend-coin**/}
                                    </td>

                                    <td>
                                        <div className="trend-box" id="trend-price">
                                            <h6> ${parseFloat(val?.price)}</h6>
                                        </div>{/**trend-price**/}
                                    </td>
                                    {tab == "hot" &&
                                        <td>
                                            <div className="trend-box" id="trend-change">
                                                <h6 >{parseFloat(val?.volume)}</h6>
                                            </div>{/**trend-change**/}
                                        </td>
                                    }
                                    {tab == "top" &&
                                        <td>
                                            <div className="trend-box" id="trend-change">
                                                <h6 style={val?.change > 0 ? { color: 'green' } : { color: 'red' }}>{val?.change}%</h6>
                                            </div>{/**trend-change**/}
                                        </td>
                                    }
                                    {tab == "new" &&
                                        <td>
                                            <div className="trend-box" id="trend-change">
                                                <h6 >{new Date(val?.created_at).toLocaleDateString('en-GB')}</h6>
                                            </div>{/**trend-change**/}
                                        </td>
                                    }


                                    {/* <td>
                                        <div className="trend-box" id="trend-chart">
                                        <img src={`/images/currency-image/${val.chart}`} alt="" className="img-fluid" loading="lazy" />
                                        </div>
                                    </td> */}

                                    <td>
                                        <div className="trend-box" id="trend-btn">
                                            <ul className="btn-list">
                                           {(IsLogin) ?
                                                <li>
                                                <Link to="/portfolio"><button className="btn btn-primary text-capitalie">Details</button></Link>
                                                </li>
                                                :
                                                <li>
                                                <Link to="/login"><button className="btn btn-primary text-capitalie">Details</button></Link>
                                                 </li>
                                          }
                                                <li>
                                                    <Link to = {`/exchange?s=${val?.symbol}`}><button className="btn btn-primary text-capitalie" id="trade-btn">Trade</button></Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>


                            )
                        })}
                        <tr>
                            <td className="text-center" colSpan={12}>
                                <div className="d-md-flex d-block gap-2 justify-content-center align-items-center">
                                    {/* <p className="mb-0" style={{ color: 'var(--white)' }}>Pin to Chrome</p>   */}
                                    <Link to="/exchange"><button type="button" className="btn_more p-0">View More
                                        <span> <svg xmlns="http://www.w3.org/2000/svg" height={14} width={14} style={{ fill: 'var(--green)' }} viewBox="0 0 384 512">
                                            <path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" /></svg></span></button></Link>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>{/**table-responsive**/}
        </div>
    )
}