import React from "react";
import SettingNav from "../components/Settings/SettingNav.jsx";

const SettingLayout = ( {children} ) => {
    return(
        <>
            <section className="sec-setting">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 col-lg-4 col-xl-3 col-xxl-2 ps-md-0">
                            <SettingNav />
                        </div>
                        <div className="col-md-12 col-lg-8 col-xl-9 col-xxl-10">
                            <main>{children}</main>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SettingLayout;