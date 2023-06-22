import React, { useState, useEffect } from 'react'
import moment from "moment";
import ApiClass from '../../api/api';



export const OrderModal = ({ count }) => {


    let id = count;
    const [detailData, setDetailData] = useState([]);
    const [tradeData, setTradeData] = useState([]);
    const [loading, setLoading] = useState(true);


    const tradeDataGet = async () => {
        setLoading(true);
        let response = await ApiClass.getNodeRequest("orders/getOrderDetail?id=" + id, true);
        if (response.data.status_code == 1) {
            setDetailData(response?.data?.data?.order_data);
            setTradeData(response?.data?.data?.data);
            setLoading(false)

        }
    }
    useEffect(() => {
        if (count > 0)
            tradeDataGet()
    }, [id])
    return (
        <>
            <div className="modal fade" id="orderModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="orderModallabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content order-modal">
                        <div className="modal-header">
                            <h5 className="modal-title text-capitalize" id="orderModallabel">order details</h5>
                            <button type="button" className="btn-close border-0 shadow-none m-0 text-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                        {loading ?
                        <div className="d-flex spinner_border  justify-content-center" >
                          <div className="spinner-border" role="status" >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                         :
                                Object.keys(detailData).length > 0 ?
                                    <>
                                        <div>
                                            <div className="d-flex justify-content-between p-2">
                                                <div className="name">
                                                    <h5 className='mb-0 text-capitalize'>{detailData.currency}/{detailData?.with_currency}</h5>
                                                </div>
                                                <div className="type">
                                                    <h5 className='mb-0 text-capitalize'>{detailData?.order_type}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between p-2">
                                                <div className="name">
                                                    <h5 className='mb-0 text-capitalize'>Type</h5>
                                                </div>
                                                <div className="type">
                                                    <h5 className='mb-0 text-capitalize'>{detailData?.type}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between p-2">
                                                <div className="name">
                                                    <h5 className='mb-0 text-capitalize'>Created At</h5>
                                                </div>
                                                <div className="type">
                                                    <h5 className='mb-0 text-capitalize'>{new Date(detailData?.created_at).toLocaleDateString('en-GB')}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between p-2">
                                                <div className="name">
                                                    <h5 className='mb-0 text-capitalize'>Amount</h5>
                                                </div>
                                                <div className="type">
                                                    <h5 className='mb-0 text-capitalize'>{detailData?.quantity} {detailData?.currency}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between p-2">
                                                <div className="name">
                                                    <h5 className='mb-0 text-capitalize'>Price</h5>
                                                </div>
                                                <div className="type">
                                                    <h5 className='mb-0 text-capitalize'>{detailData?.at_price}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between p-2">
                                                <div className="name">
                                                    <h5 className='mb-0 text-capitalize'>Total</h5>
                                                </div>
                                                <div className="type">
                                                    <h5 className='mb-0 text-capitalize'>{detailData?.total}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div className="row">
                                        <div className="col-12">
                                            No Data Found
                                        </div>
                                    </div>
                            }
                        </div>
                        {loading == false
                             ?
                        <div className="modal-footer d-inline">
                            <div className="trd_dtl mb-2">
                                <p className='mb-0 text-capitalize text-start ' style={{color:'var(--ex-green)',fontWeight:'500'}}>trade details</p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="">
                                    <p className='mb-0 text-capitalize' style={{color:'var(--ex-green)',fontWeight:'500'}}>date/time</p>
                                </div>
                                <div className=" text-center">
                                    <p className='mb-0 text-capitalize' style={{color:'var(--ex-green)',fontWeight:'500'}}>filled</p>
                                </div>
                                <div className="text-center">
                                    <p className='mb-0 text-capitalize' style={{color:'var(--ex-green)',fontWeight:'500'}}>price</p>
                                </div>
                                <div className="text-center">
                                    <p className='mb-0 text-capitalize' style={{color:'var(--ex-green)',fontWeight:'500'}}>commission</p>
                                </div>
                            </div>  

                      <div className="outer-orders mb-3" style={{maxHeight:'70px',overflowY:'scroll'}}>
                            {tradeData?.length > 0 ?
                                    <>
                                        {tradeData != undefined && tradeData?.map((tradeData, i) => {
                                            return (
                                                <div className="d-flex justify-content-between px-2" key={i}>
                                                    <div className="date">
                                                        <p className='mb-0 text-capitalize'>{moment(tradeData?.created_at).format("DD-MMM, h:mm:ss")}</p>
                                                    </div>
                                                    <div className="filled text-center">
                                                        <p className='mb-0 text-capitalize'>{tradeData?.quantity} {tradeData?.currency}</p>
                                                    </div>
                                                    <div className="price text-center">
                                                        <p className='mb-0 text-capitalize'>{tradeData?.at_price}</p>
                                                    </div>
                                                    <div className="commission text-center">
                                                        <p className='mb-0 text-capitalize'>{tradeData?.commission}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                    :
                                    <div className="">
                                        <div className="text-center">
                                            No Data Found
                                        </div>
                                    </div>
                                  
                                }
                            </div>
                          
                        </div>
                          : "" }
                    </div>
                </div>
            </div>
        </>
    )
}
