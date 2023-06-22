import React from "react";
import { Link } from "react-router-dom";
import SettingWrapper from "../../utilites/SettingWrapper.jsx";
import SettingLayout from "../../Layout/SettingLayout.jsx";
export default function SupportPage(){
    return(
        <>
            <SettingLayout>
              <SettingWrapper heading="Contact Support">
                  <div className="support_content p-2 p-md-4">
                      <h5 className="mb-2">You control your data, and we respect that.</h5>
                        <h6>For requests regarding:</h6>
                      <div className="ps-3">
                        <ul className="list-unstyled">
                          <li>1. Copy of your data</li>
                          <li>2. Data export</li>
                          <li>3. Data correction</li>
                        </ul>
                        <p>Please reach out to us. Our team will be happy to help you out.</p>
                      </div>
                        <div className="btn_group">
                        <Link to="/contactus" className="text-uppercase btn_next me-md-3 text-center">contact us</Link>
                        <Link to="/ticketlist" className="text-uppercase btn_next  mt-2 text-center">view previous tickets</Link>
                        </div>
                  </div>
              </SettingWrapper>
            </SettingLayout>
        </>
    );
}
