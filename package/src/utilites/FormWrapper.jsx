import React from "react";

// { auth_heading }, { children }
// props
export default function FormWrapper({ auth_heading, children}) {
  return (
    <div>
      <div className="auth-inner-wrapper">
        <div className="auth-heading-box mb-3">
          <h3 className="mb-0 text-uppercase text-center">{auth_heading}</h3>
        </div>
        {/**auth-heading-box**/}

        <div className="auth-box">{children}</div>

      </div>
      {/**auth-inner-wrapper**/}

    </div>
  );
}
