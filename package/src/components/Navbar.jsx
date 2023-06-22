import React, { useState } from 'react';
import Logo from "/images/logo/logo.gif";


import { Link, useNavigate } from 'react-router-dom';
import SwalClass from '../Common/Swal';
import ApiClass from '../api/api';
import { useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clearState } from '../Redux/reducres/userReducer';


export default function Navbar() {
  const dispatch = useDispatch();

  const IsLogin = useSelector((state) => {
    return state.user.token ? true : false;
  })


  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleActive = (symbol) => {
    navigate(`/exchange?s=${symbol}`);
  }

  const ClearData = async (url) => {
    setLoading(true)
    const response = await ApiClass.deleteRequest(url, true);

    if (response === undefined) {
      setLoading(false)
      SwalClass.error("404 NOT FOUND");
      return;
    }
    if (response?.data?.status_code == 0) {
      setLoading(false)
      SwalClass.error(response?.data?.message);
      return;
    }

    if (response?.data?.status_code == 1) {
      dispatch(clearState());
      localStorage.clear();

      setLoading(false)
      document.getElementById('closeModal').click();
      SwalClass.success(response?.data?.message);
      navigate("/login");
      return;
    }
  };
  const location = useLocation()
  let Active = location.pathname
  return (
    <div>
      <header className="head">
        <nav className="navbar navbar-expand-lg p-0">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <img src={Logo} alt="logo" className="img-fluid" />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon">

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{fill: 'var(--white)'}}><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
              </span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-xl-center" id="left-nav">
                <li className="nav-item" >
                  <Link className="nav-link" to="/exchange">
                    Exchange
                  </Link>
                </li>

                {(IsLogin) ? <>
                  <li className="nav-item" >
                    <Link className="nav-link" to="/portfolio">
                      portfolio
                    </Link>
                  </li>
                  <li className="nav-item" >
                    <Link className="nav-link" to="/profile">
                      settings
                    </Link>
                  </li></>
                  : ""}

                {/* <li className="nav-item" >
                  <Link className="nav-link" to="/exchange">
                    Market
                  </Link>
                </li> */}
                <li className="nav-item" >
                  <Link className="nav-link" to="/Buy-Sell">
                    Buy/Sell
                  </Link>
                </li>
                <li className="nav-item" >
                  <Link className="nav-link" to="/p2p-home">
                    P2P
                  </Link>
                </li>
                {/* <li className="nav-item" >
                  <Link className="nav-link" to="/exchange">
                    Spot
                  </Link>
                </li> */}
                <li className="nav-item" >
                  <Link className="nav-link" to="/exchange">
                    <div className="dropdown">
                      <button className="btn_spot dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        SPOT
                      </button>
                      <ul className="dropdown-menu">
                        <Link to="/exchange?s=BTCUSDT" ><li><div className="dropdown-item" >USDT</div></li></Link>
                        <Link to="/exchange?s=XMRBTC" >   <li><div className="dropdown-item" >BTC</div></li></Link>
                        <Link to="/exchange?s=WINTRX" >  <li><div className="dropdown-item" >TRX</div></li></Link>
                        <Link to="/exchange?s=NEOETH" >  <li><div className="dropdown-item" >ETH</div></li></Link>

                      </ul>
                    </div>
                  </Link>
                </li>

              </ul>

              <div className="d-flex">
                <ul className="navbar-nav align-items-lg-center" id="right-nav">
                  {/* <li className="nav-item me-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'var(--white)' }}><path d="M19 13.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v3.586l-1.707 1.707A.996.996 0 0 0 3 16v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L19 13.586zM19 17H5v-.586l1.707-1.707A.996.996 0 0 0 7 14v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L19 16.414V17zm-7 5a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22z"></path></svg>
                  </li>
                  <li className="nav-item">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input mb-0"
                        type="checkbox"
                        role="switch"
                      />

                    </div>
                  </li> */}
                  {(!IsLogin) ? <>

                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        <button className="btn btn-primary">login</button>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/signup">
                        <button className="btn btn-primary" id="signup">
                          signup
                        </button>
                      </Link>
                    </li>
                  </> :
                    <li className="nav-item">
                      <Link className="nav-link" >
                        <button className="btn btn-primary" id="signup" data-bs-toggle="modal" data-bs-target="#logoutModal">
                          Logout
                        </button>
                      </Link>
                    </li>}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="modal fade" id="logoutModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content logout-content">
            <div className="modal-header border-bottom-0 ">
              <div className="w-100 text-center">
                <div className="close-btn-box">
                  <button type="button" className="btn shadow-none" id="closeModal" data-bs-dismiss="modal" aria-label="Close" v-html="close_btn"></button>
                </div>
                <h5 className='mb-0 text-capitalize'>please confirm</h5>
              </div>
            </div>
            {/* - Modal Body   */}
            <div className="modal-body text-center">
              <div className="mb-2" v-html="question_svg"></div>
              <p className="mb-0">Please Confirm you want to logout ?</p>

            </div>
            {/* <!-- Buttons  --> */}
            <div className="row justify-content-center pb-4 px-3">
              {
                loading ?
                  <div className="col mb-sm-0">
                    <button className="btn blue-ex-btn w-100" type="button" disabled>
                      <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                      Loading...</button>
                  </div>
                  :
                  <>  <div className="col-6 mb-sm-0">
                    <button className="btn blue-ex-btn w-100" type="submit" style={{ color: 'var(--white)', backgroundColor: 'var(--ex-buy-green)' }} onClick={() => ClearData("hardlogout")} >Logout from all devices</button>
                  </div>
                    <div className="col-6">

                      <button className="btn blue-ex-btn w-100" type="submit" style={{ color: 'var(--white)', backgroundColor: 'var(--ex-buy-green)' }} onClick={() => ClearData("logout")}>Logout from this devices</button>
                    </div></>
              }

            </div>
          </div>
        </div>
      </div>
      {/** head **/}
    </div>
  );
}
