import React from "react";
import SettingLayout from "../Layout/SettingLayout.jsx";
import SettingWrapper from "../utilites/SettingWrapper.jsx";
const Fees = () =>{
    return(
        <>
        <SettingLayout>
            <SettingWrapper heading="fees detail">
                <div className="fee_detail d-md-flex justify-content-between p-3">
                    <div className="fee_content">
                        <h5 className="mb-2 text-capitalize">pay trading fees with OTX exchange.</h5>
                        <p className="mb-2">Enable this option to pay trading fees with:</p>
                        <p className="mb-0">1. OTX  you buy from the exchange.</p>
                        <p className="mb-2">2. Unlocked OTX Exchange balance reserved for trading fees.</p>
                        <p className="mb-0"><span>Note: </span>You'll get 50% discount if you pay fees via OTX.</p>
                    </div>
                    <div className="fee_check">
                        <div className="form-check form-switch text-end">
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                        </div>
                    </div>
                </div>
            </SettingWrapper>
        </SettingLayout>
            
        </>
    )
}
export default Fees;