import React from "react";

const SettingWrapper = ({ children, heading}) =>{
    return(
        <>
             <section className="setting-common-sec">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            <div className="common-set">
                                <div className="common-head py-4 text-center">
                                    <h5 className="mb-0 text-uppercase">{heading}</h5>
                                </div>
                                <div className="common-more">
                                    <main>{children}</main>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default SettingWrapper;