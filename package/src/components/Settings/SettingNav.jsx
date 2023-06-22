import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import Sidenavbar from "../Responsive/Sidenavbar.jsx";
const SettingNav = () => {
  let [select, setSelected] = useState(1);
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  const location = useLocation();
  let active = location.pathname;
  return (
    <>
      <Link to="/sidenavbar" className="btn back_btn  d-lg-none  d-xxl-none" role="button" style={{ color: 'var(--scroll-grey)' }}> <img src="../images/icons/back.svg" alt="text" /> BACK</Link>

      <ul className="list-group setting-ul rounded-0 d-none d-lg-block">
        <Link
          to="/profile"
          className="text-decoration-none"
          onClick={() => setSelected(1)}
        >
          <li className="list-group-item text-capitalize">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31387"
                data-name="Group 31387"
                transform="translate(-24 -133)"
              >
                <rect
                  id="Rectangle_3293"
                  data-name="Rectangle 3293"
                  width="28"
                  height="28"
                  rx="6"
                  transform="translate(24 133)"
                  style={
                    active == "/profile"
                      ? { fill: "var(--modal-head)" }
                      : { fill: "var(--stg-back)" }
                  }
                />
                <path
                  id="Icon_metro-user"
                  data-name="Icon metro-user"
                  d="M15.782,18.536V17.372A6.3,6.3,0,0,0,18.6,12.131c0-3.505,0-6.347-4.231-6.347s-4.231,2.842-4.231,6.347a6.3,6.3,0,0,0,2.821,5.241v1.163C8.177,18.927,4.5,21.278,4.5,24.12H24.245c0-2.842-3.678-5.193-8.463-5.584Z"
                  transform="translate(23.502 132.216)"
                  style={
                    active == "/profile"
                      ? { fill: "var(--stg-green)" }
                      : { fill: "var(--stg-gray)" }
                  }
                />
              </g>
            </svg>
            &nbsp;
            <span
              style={
                active == "/profile"
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              profile
            </span>
          </li>
        </Link>

        <Link
          to="/changepassword"
          className="text-decoration-none"
          onClick={() => setSelected(2)}
        >
          <li className="list-group-item text-capitalize">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31735"
                data-name="Group 31735"
                transform="translate(-25 -190)"
              >
                <g
                  id="Group_31389"
                  data-name="Group 31389"
                  transform="translate(3 -6)"
                >
                  <rect
                    id="Rectangle_3294"
                    data-name="Rectangle 3294"
                    width="28"
                    height="28"
                    rx="6"
                    transform="translate(22 196)"
                    style={
                      active == "/changepassword"
                        ? { fill: "var(--modal-head)" }
                        : { fill: "var(--stg-back)" }
                    }
                  />
                </g>
                <g
                  id="Group_31399"
                  data-name="Group 31399"
                  transform="translate(-19588.086 -2333)"
                >
                  <path
                    id="Path_7877"
                    data-name="Path 7877"
                    d="M180.648,385H166.57a.321.321,0,0,0-.32.32v3.2a.321.321,0,0,0,.32.32h14.078a.321.321,0,0,0,.32-.32v-3.2A.321.321,0,0,0,180.648,385ZM169.2,386.961a.321.321,0,0,1-.32.557l-.074-.045v.086a.32.32,0,0,1-.64,0v-.086l-.074.045a.321.321,0,1,1-.32-.557l.074-.042-.074-.042a.321.321,0,1,1,.32-.557l.074.045v-.086a.32.32,0,0,1,.64,0v.086l.074-.045a.321.321,0,0,1,.32.557l-.074.042Zm2.56,0a.321.321,0,0,1-.32.557l-.074-.045v.086a.32.32,0,0,1-.64,0v-.086l-.074.045a.321.321,0,1,1-.32-.557l.074-.042-.074-.042a.321.321,0,1,1,.32-.557l.074.045v-.086a.32.32,0,0,1,.64,0v.086l.074-.045a.321.321,0,0,1,.32.557l-.074.042Zm2.56,0a.321.321,0,0,1-.32.557l-.074-.045v.086a.32.32,0,0,1-.64,0v-.086l-.074.045a.321.321,0,0,1-.32-.557l.074-.042-.074-.042a.321.321,0,0,1,.32-.557l.074.045v-.086a.32.32,0,0,1,.64,0v.086l.074-.045a.321.321,0,1,1,.32.557l-.074.042Zm2.56,0a.321.321,0,0,1-.32.557l-.074-.045v.086a.32.32,0,0,1-.64,0v-.086l-.074.045a.321.321,0,0,1-.32-.557l.074-.042-.074-.042a.321.321,0,0,1,.32-.557l.074.045v-.086a.32.32,0,1,1,.64,0v.086l.074-.045a.321.321,0,1,1,.32.557l-.074.042Zm2.56,0a.321.321,0,0,1-.32.557l-.074-.045v.086a.32.32,0,0,1-.64,0v-.086l-.074.045a.321.321,0,1,1-.32-.557l.074-.042-.074-.042a.321.321,0,1,1,.32-.557l.074.045v-.086a.32.32,0,0,1,.64,0v.086l.074-.045a.321.321,0,1,1,.32.557l-.074.042Z"
                    transform="translate(19453.115 2156.118)"
                    style={
                      active == "/changepassword"
                        ? { fill: "var(--stg-green)" }
                        : { fill: "var(--stg-gray)" }
                    }
                  />
                  <path
                    id="Path_7878"
                    data-name="Path 7878"
                    d="M131.9,42.888v-3.2a.963.963,0,0,1,.96-.96h4.332l.147-.96a1.28,1.28,0,1,1,1.28,0l.147.96h5.932V34.889a1.28,1.28,0,0,0-1.28-1.28h-.96v-2.88a4.479,4.479,0,1,0-8.959,0v2.88h-.96a1.28,1.28,0,0,0-1.28,1.28v8.319a1.28,1.28,0,0,0,1.28,1.28h10.878a1.279,1.279,0,0,0,1.1-.64H132.857a.963.963,0,0,1-.96-.96Zm2.88-12.158a3.2,3.2,0,0,1,6.4,0v2.88h-6.4Z"
                    transform="translate(19486.828 2501.75)"
                    style={
                      active == "/changepassword"
                        ? { fill: "var(--stg-green)" }
                        : { fill: "var(--stg-gray)" }
                    }
                  />
                </g>
              </g>
            </svg>
            &nbsp;
            <span
              style={
                active == "/changepassword"
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              change password
            </span>
          </li>
        </Link>

        <Link
          to="/kyc"
          className="text-decoration-none"
          onClick={() => setSelected(3)}
        >
          <li className="list-group-item text-capitalize">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31388"
                data-name="Group 31388"
                transform="translate(-24 -185)"
              >
                <rect
                  id="Rectangle_3294"
                  data-name="Rectangle 3294"
                  width="28"
                  height="28"
                  rx="6"
                  transform="translate(24 185)"
                  style={
                    active == "/kyc"
                      ? { fill: "var(--modal-head)" }
                      : { fill: "var(--stg-back)" }
                  }
                />
                <path
                  id="Icon_metro-profile"
                  data-name="Icon metro-profile"
                  d="M21.579,9.683H20.293V7.753l-2.655-.041.014,1.971H9.672l.055-1.971-2.6.041V9.724L5.813,9.683A1.314,1.314,0,0,0,4.5,11v9.2a1.314,1.314,0,0,0,1.314,1.314H21.579a1.314,1.314,0,0,0,1.314-1.314V11A1.314,1.314,0,0,0,21.579,9.683ZM18.294,8.369h1.314V11H18.294Zm-8.54,4.475a1.71,1.71,0,0,1,1.437,1.889,1.71,1.71,0,0,1-1.437,1.889,1.71,1.71,0,0,1-1.437-1.889,1.71,1.71,0,0,1,1.437-1.889ZM7.783,8.369H9.1V11H7.783ZM6.908,18.846s.156-1.249.51-1.485a5.038,5.038,0,0,1,1.373-.393s.661.706.942.706.941-.706.941-.706a5.023,5.023,0,0,1,1.374.393c.416.277.52,1.485.52,1.485H6.908Zm13.357-.623H14.353v-.657h5.912Zm0-1.314H14.353v-.657h5.912Zm0-1.314H14.353v-.657h5.912Zm0-1.314H14.353v-.657h5.912Z"
                  transform="translate(24.502 184.288)"
                  style={
                    active == "/kyc"
                      ? { fill: "var(--stg-green)" }
                      : { fill: "var(--stg-gray)" }
                  }
                />
              </g>
            </svg>
            &nbsp;
            <span
              style={
                active == "/kyc"
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              KYC settings
            </span>
          </li>
        </Link>


        <Link
          to="/bankdetail"
          className="text-decoration-none"
          onClick={() => setSelected(3)}
        >
          <li className="list-group-item text-capitalize">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31388"
                data-name="Group 31388"
                transform="translate(-24 -185)"
              >
                <rect
                  id="Rectangle_3294"
                  data-name="Rectangle 3294"
                  width="28"
                  height="28"
                  rx="6"
                  transform="translate(24 185)"
                  style={
                    active == "/bankdetail"
                      ? { fill: "var(--modal-head)" }
                      : { fill: "var(--stg-back)" }
                  }
                />
                <path
                  id="Icon_metro-profile"
                  data-name="Icon metro-profile"
                  d="M21.579,9.683H20.293V7.753l-2.655-.041.014,1.971H9.672l.055-1.971-2.6.041V9.724L5.813,9.683A1.314,1.314,0,0,0,4.5,11v9.2a1.314,1.314,0,0,0,1.314,1.314H21.579a1.314,1.314,0,0,0,1.314-1.314V11A1.314,1.314,0,0,0,21.579,9.683ZM18.294,8.369h1.314V11H18.294Zm-8.54,4.475a1.71,1.71,0,0,1,1.437,1.889,1.71,1.71,0,0,1-1.437,1.889,1.71,1.71,0,0,1-1.437-1.889,1.71,1.71,0,0,1,1.437-1.889ZM7.783,8.369H9.1V11H7.783ZM6.908,18.846s.156-1.249.51-1.485a5.038,5.038,0,0,1,1.373-.393s.661.706.942.706.941-.706.941-.706a5.023,5.023,0,0,1,1.374.393c.416.277.52,1.485.52,1.485H6.908Zm13.357-.623H14.353v-.657h5.912Zm0-1.314H14.353v-.657h5.912Zm0-1.314H14.353v-.657h5.912Zm0-1.314H14.353v-.657h5.912Z"
                  transform="translate(24.502 184.288)"
                  style={
                    active == "/bankdetail"
                      ? { fill: "var(--stg-green)" }
                      : { fill: "var(--stg-gray)" }
                  }
                />
              </g>
            </svg>
            &nbsp;
            <span
              style={
                active == "/bankdetail"
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              Bank Detail
            </span>
          </li>
        </Link>
        <Link
          to="/Upi-detail"
          className="text-decoration-none"
          onClick={() => setSelected(10)}
        >
          <li className="list-group-item text-capitalize">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31388"
                data-name="Group 31388"
                transform="translate(-24 -185)"
              >
                <rect
                  id="Rectangle_3294"
                  data-name="Rectangle 3294"
                  width="28"
                  height="28"
                  rx="6"
                  transform="translate(24 185)"
                  style={
                    active == "/Upi-detail"
                      ? { fill: "var(--modal-head)" }
                      : { fill: "var(--stg-back)" }
                  }
                />
                <path
                  id="Icon_metro-profile"
                  data-name="Icon metro-profile"
                  d="M21.579,9.683H20.293V7.753l-2.655-.041.014,1.971H9.672l.055-1.971-2.6.041V9.724L5.813,9.683A1.314,1.314,0,0,0,4.5,11v9.2a1.314,1.314,0,0,0,1.314,1.314H21.579a1.314,1.314,0,0,0,1.314-1.314V11A1.314,1.314,0,0,0,21.579,9.683ZM18.294,8.369h1.314V11H18.294Zm-8.54,4.475a1.71,1.71,0,0,1,1.437,1.889,1.71,1.71,0,0,1-1.437,1.889,1.71,1.71,0,0,1-1.437-1.889,1.71,1.71,0,0,1,1.437-1.889ZM7.783,8.369H9.1V11H7.783ZM6.908,18.846s.156-1.249.51-1.485a5.038,5.038,0,0,1,1.373-.393s.661.706.942.706.941-.706.941-.706a5.023,5.023,0,0,1,1.374.393c.416.277.52,1.485.52,1.485H6.908Zm13.357-.623H14.353v-.657h5.912Zm0-1.314H14.353v-.657h5.912Zm0-1.314H14.353v-.657h5.912Zm0-1.314H14.353v-.657h5.912Z"
                  transform="translate(24.502 184.288)"
                  style={
                    active == "/Upi-detail"
                      ? { fill: "var(--stg-green)" }
                      : { fill: "var(--stg-gray)" }
                  }
                />
              </g>
            </svg>
            &nbsp;
            <span
              style={
                active == "/Upi-detail"
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              Upi Detail
            </span>
          </li>
        </Link>


        <Link to="/2fa" className="text-decoration-none">
          <li
            className="list-group-item text-capitalize"
            onClick={() => setSelected(4)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31400"
                data-name="Group 31400"
                transform="translate(-27 -295)"
              >
                <g
                  id="Group_31390"
                  data-name="Group 31390"
                  transform="translate(5 99)"
                >
                  <rect
                    id="Rectangle_3294"
                    data-name="Rectangle 3294"
                    width="28"
                    height="28"
                    rx="6"
                    transform="translate(22 196)"
                    style={
                      active == "/2fa"
                        ? { fill: "var(--modal-head)" }
                        : { fill: "var(--stg-back)" }
                    }
                  />
                </g>
                <g
                  id="Group_481"
                  data-name="Group 481"
                  transform="translate(-667 63.418)"
                >
                  <g
                    id="Icon_ionic-ios-qr-scanner"
                    data-name="Icon ionic-ios-qr-scanner"
                    transform="translate(699.813 237.582)"
                  >
                    <path
                      id="Path_162"
                      data-name="Path 162"
                      d="M8.628,4.5H6.177a2.8,2.8,0,0,0-2.8,2.8V9.753a.584.584,0,0,0,1.167,0V7.26A1.7,1.7,0,0,1,6.135,5.667H8.628a.584.584,0,0,0,0-1.167Z"
                      transform="translate(-3.375 -4.5)"
                      style={
                        active == "/2fa"
                          ? { fill: "var(--stg-green)" }
                          : { fill: "var(--stg-gray)" }
                      }
                    />
                    <path
                      id="Path_163"
                      data-name="Path 163"
                      d="M25.858,4.5H23.365a.584.584,0,1,0,0,1.167h2.493A1.7,1.7,0,0,1,27.451,7.26V9.753a.584.584,0,0,0,1.167,0V7.26A2.763,2.763,0,0,0,25.858,4.5Z"
                      transform="translate(-11.274 -4.5)"
                      style={
                        active == "/2fa"
                          ? { fill: "var(--stg-green)" }
                          : { fill: "var(--stg-gray)" }
                      }
                    />
                    <path
                      id="Path_164"
                      data-name="Path 164"
                      d="M8.628,26.326H6.135a1.7,1.7,0,0,1-1.593-1.593V22.24a.584.584,0,1,0-1.167,0v2.493a2.763,2.763,0,0,0,2.76,2.76H8.628a.584.584,0,0,0,0-1.167Z"
                      transform="translate(-3.375 -11.484)"
                      style={
                        active == "/2fa"
                          ? { fill: "var(--stg-green)" }
                          : { fill: "var(--stg-gray)" }
                      }
                    />
                    <path
                      id="Path_165"
                      data-name="Path 165"
                      d="M28.034,21.656a.585.585,0,0,0-.584.584v2.493a1.7,1.7,0,0,1-1.593,1.593H23.365a.584.584,0,1,0,0,1.167h2.451a2.805,2.805,0,0,0,2.8-2.8V22.24A.585.585,0,0,0,28.034,21.656Z"
                      transform="translate(-11.274 -11.484)"
                      style={
                        active == "/2fa"
                          ? { fill: "var(--stg-green)" }
                          : { fill: "var(--stg-gray)" }
                      }
                    />
                  </g>
                  <rect
                    id="Rectangle_406"
                    data-name="Rectangle 406"
                    width="22.688"
                    height="6.353"
                    transform="translate(697 245.221)"
                    style={
                      active == "/2fa"
                        ? { fill: "var(--stg-green)" }
                        : { fill: "var(--stg-gray)" }
                    }
                    opacity="0.2"
                  />
                  <rect
                    id="Rectangle_407"
                    data-name="Rectangle 407"
                    width="22.688"
                    height="0.454"
                    transform="translate(697 245.221)"
                    style={
                      active == "/2fa"
                        ? { fill: "var(--stg-green)" }
                        : { fill: "var(--stg-gray)" }
                    }
                  />
                </g>
              </g>
            </svg>
            &nbsp;
            <span
              style={
                active == "/2fa"
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              two-Factor authentication
            </span>
          </li>
        </Link>
        {/* <Link to="/fees" className="text-decoration-none">
          <li
            className="list-group-item text-capitalize"
            onClick={() => setSelected(5)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31735"
                data-name="Group 31735"
                transform="translate(-25 -352)"
              >
                <g
                  id="Group_31391"
                  data-name="Group 31391"
                  transform="translate(3 156)"
                >
                  <rect
                    id="Rectangle_3294"
                    data-name="Rectangle 3294"
                    width="28"
                    height="28"
                    rx="6"
                    transform="translate(22 196)"
                    style={
                      select == 5
                        ? { fill: "var(--modal-head)" }
                        : { fill: "var(--stg-back)" }
                    }
                  />
                </g>
                <path
                  id="Icon_map-bank"
                  data-name="Icon map-bank"
                  d="M16.989,11.425a7.22,7.22,0,0,0-2.795-1.173l-.953-.225V5.957l.129.053a2.407,2.407,0,0,1,1.3,2.048h3.244A4.753,4.753,0,0,0,16,4.152a6.616,6.616,0,0,0-2.763-1.179V.72H10.22V2.9A5.918,5.918,0,0,0,6.9,4.258,4.643,4.643,0,0,0,5.3,7.864a3.94,3.94,0,0,0,1.633,3.5,10.31,10.31,0,0,0,3.284,1.178v4.41a2.6,2.6,0,0,1-1.342-.8,2.734,2.734,0,0,1-.616-1.62H5.04a4.642,4.642,0,0,0,1.828,3.926,6.76,6.76,0,0,0,3.352,1.3v1.683h3.022V19.785a6.393,6.393,0,0,0,3.48-1.383,4.637,4.637,0,0,0,1.711-3.677A3.954,3.954,0,0,0,16.989,11.425ZM9.213,8.914A1.387,1.387,0,0,1,8.427,7.62a1.669,1.669,0,0,1,.8-1.471,3.056,3.056,0,0,1,1-.409v3.55A5.2,5.2,0,0,1,9.213,8.914Zm4.522,7.945a4.2,4.2,0,0,1-.493.132V13.238a5.391,5.391,0,0,1,1.229.5,1.385,1.385,0,0,1,.707,1.241A1.886,1.886,0,0,1,13.735,16.86Z"
                  transform="translate(26.961 355.28)"
                  style={
                    select == 5
                      ? { fill: "var(--stg-green)" }
                      : { fill: "var(--stg-gray)" }
                  }
                />
              </g>
            </svg>
            &nbsp;
            <span
              style={
                select == 5
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              fee
            </span>
          </li>
        </Link> */}
        <Link to="/activitylog" className="text-decoration-none">
          <li
            className="list-group-item text-capitalize"
            onClick={() => setSelected(6)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31736"
                data-name="Group 31736"
                transform="translate(-25 -406)"
              >
                <g
                  id="Group_31392"
                  data-name="Group 31392"
                  transform="translate(3 210)"
                >
                  <rect
                    id="Rectangle_3294"
                    data-name="Rectangle 3294"
                    width="28"
                    height="28"
                    rx="6"
                    transform="translate(22 196)"
                    style={
                      active == "/activitylog"
                        ? { fill: "var(--modal-head)" }
                        : { fill: "var(--stg-back)" }
                    }
                  />
                </g>
                <path
                  id="Icon_metro-video-camera"
                  data-name="Icon metro-video-camera"
                  d="M10.071,8.909A3.125,3.125,0,1,1,13.2,12.034a3.125,3.125,0,0,1-3.125-3.125Zm-7.5,0A3.125,3.125,0,1,1,5.7,12.034,3.125,3.125,0,0,1,2.571,8.909Zm15,6.25V13.284a1.254,1.254,0,0,0-1.25-1.25H3.821a1.254,1.254,0,0,0-1.25,1.25v6.25a1.254,1.254,0,0,0,1.25,1.25h12.5a1.254,1.254,0,0,0,1.25-1.25V17.66l5,3.125v-8.75Zm-2.5,3.125h-10v-3.75h10Z"
                  transform="translate(26.431 406.216)"
                  style={
                    active == "/activitylog"
                      ? { fill: "var(--stg-green)" }
                      : { fill: "var(--stg-gray)" }
                  }
                />
              </g>
            </svg>
            &nbsp;
            <span
              style={
                active == "/activitylog"
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              activity log
            </span>
          </li>
        </Link>
        <Link to="/referrallink" className="text-decoration-none">
          <li
            className="list-group-item text-capitalize"
            onClick={() => setSelected(7)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31737"
                data-name="Group 31737"
                transform="translate(-25 -463)"
              >
                <rect
                  id="Rectangle_3294"
                  data-name="Rectangle 3294"
                  width="28"
                  height="28"
                  rx="6"
                  transform="translate(25 463)"
                  style={
                    active == "/referrallink"
                      ? { fill: "var(--modal-head)" }
                      : { fill: "var(--stg-back)" }
                  }
                />
                <path
                  id="Icon_awesome-exchange-alt"
                  data-name="Icon awesome-exchange-alt"
                  d="M0,8.485v-.65a.975.975,0,0,1,.975-.975H15.6V4.912a.975.975,0,0,1,1.664-.689l3.249,3.249a.975.975,0,0,1,0,1.378L17.259,12.1A.975.975,0,0,1,15.6,11.41V9.46H.975A.975.975,0,0,1,0,8.485Zm19.819,6.173H5.2V12.709a.975.975,0,0,0-1.664-.689L.285,15.269a.975.975,0,0,0,0,1.378L3.535,19.9A.975.975,0,0,0,5.2,19.207V17.258H19.819a.975.975,0,0,0,.975-.975v-.65A.975.975,0,0,0,19.819,14.659Z"
                  transform="translate(29 461.846)"
                  style={
                    active == "/referrallink"
                      ? { fill: "var(--stg-green)" }
                      : { fill: "var(--stg-gray)" }
                  }
                />
              </g>
            </svg>
            &nbsp;
            <span
              style={
                active == "/referrallink"
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              referral-Link
            </span>
          </li>
        </Link>
        {/* <Link to="/tradingreport" className="text-decoration-none">
          <li
            className="list-group-item text-capitalize"
            onClick={() => setSelected(8)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31407"
                data-name="Group 31407"
                transform="translate(-25 -514)"
              >
                <g
                  id="Group_31394"
                  data-name="Group 31394"
                  transform="translate(3 318)"
                >
                  <rect
                    id="Rectangle_3294"
                    data-name="Rectangle 3294"
                    width="28"
                    height="28"
                    rx="6"
                    transform="translate(22 196)"
                    style={
                      select == 8
                        ? { fill: "var(--modal-head)" }
                        : { fill: "var(--stg-back)" }
                    }
                  />
                </g>
                <g
                  id="Group_31401"
                  data-name="Group 31401"
                  transform="translate(-19197.475 -1917)"
                >
                  <path
                    id="Path_7880"
                    data-name="Path 7880"
                    d="M112.159,28h-11.74a2.416,2.416,0,0,0-2.413,2.413v11.74a2.416,2.416,0,0,0,2.413,2.413h11.74a2.416,2.416,0,0,0,2.413-2.413V30.413A2.416,2.416,0,0,0,112.159,28Zm-9.692,7a.736.736,0,0,1,1.041,0l2.045,2.044V30.78a.736.736,0,1,1,1.472,0v6.268L109.07,35a.736.736,0,0,1,1.041,1.041l-3.3,3.3a.737.737,0,0,1-1.042,0l-3.3-3.3a.736.736,0,0,1,0-1.041Zm10.069,5.569a1.963,1.963,0,0,1-1.961,1.961H102a1.963,1.963,0,0,1-1.961-1.961V36.639a.736.736,0,1,1,1.472,0v3.934a.494.494,0,0,0,.488.488h8.572a.494.494,0,0,0,.488-.488V36.639a.736.736,0,1,1,1.472,0v3.934Z"
                    transform="translate(19130.469 2409)"
                    style={
                      select == 8
                        ? { fill: "var(--stg-green)" }
                        : { fill: "var(--stg-gray)" }
                    }
                  />
                  <path
                    id="Path_7881"
                    data-name="Path 7881"
                    d="M112.159,28h-11.74a2.416,2.416,0,0,0-2.413,2.413v11.74a2.416,2.416,0,0,0,2.413,2.413h11.74a2.416,2.416,0,0,0,2.413-2.413V30.413A2.416,2.416,0,0,0,112.159,28Zm-9.692,7a.736.736,0,0,1,1.041,0l2.045,2.044V30.78a.736.736,0,1,1,1.472,0v6.268L109.07,35a.736.736,0,0,1,1.041,1.041l-3.3,3.3a.737.737,0,0,1-1.042,0l-3.3-3.3a.736.736,0,0,1,0-1.041Zm10.069,5.569a1.963,1.963,0,0,1-1.961,1.961H102a1.963,1.963,0,0,1-1.961-1.961V36.639a.736.736,0,1,1,1.472,0v3.934a.494.494,0,0,0,.488.488h8.572a.494.494,0,0,0,.488-.488V36.639a.736.736,0,1,1,1.472,0v3.934Z"
                    transform="translate(19130.469 2409)"
                    style={
                      select == 8
                        ? { fill: "var(--stg-green)" }
                        : { fill: "var(--stg-gray)" }
                    }
                  />
                </g>
              </g>
            </svg>
            &nbsp;
            <span
              style={
                select == 8
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              download trading report{" "}
            </span>
          </li>
        </Link> */}
        <Link to="/support" className="text-decoration-none">
          <li
            className="list-group-item text-capitalize"
            onClick={() => setSelected(9)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <g
                id="Group_31738"
                data-name="Group 31738"
                transform="translate(-25 -568)"
              >
                <g
                  id="Group_31396"
                  data-name="Group 31396"
                  transform="translate(3 372)"
                >
                  <rect
                    id="Rectangle_3294"
                    data-name="Rectangle 3294"
                    width="28"
                    height="28"
                    rx="6"
                    transform="translate(22 196)"
                    style={
                      active == "/support"
                        ? { fill: "var(--modal-head)" }
                        : { fill: "var(--stg-back)" }
                    }
                  />
                </g>
                <path
                  id="Icon_awesome-headphones-alt"
                  data-name="Icon awesome-headphones-alt"
                  d="M5.783,11.5H5.2A2.315,2.315,0,0,0,2.891,13.82v2.3A2.315,2.315,0,0,0,5.2,18.441h.578a1.158,1.158,0,0,0,1.157-1.159V12.661A1.158,1.158,0,0,0,5.783,11.5Zm7.517,0h-.578a1.158,1.158,0,0,0-1.157,1.159v4.622a1.158,1.158,0,0,0,1.157,1.159H13.3a2.315,2.315,0,0,0,2.313-2.317v-2.3A2.315,2.315,0,0,0,13.3,11.5ZM9.252,2.25A9.428,9.428,0,0,0,0,11.5V15.55a.578.578,0,0,0,.578.578h.578a.578.578,0,0,0,.578-.578V11.5a7.517,7.517,0,0,1,15.035,0V15.55a.578.578,0,0,0,.578.578h.578a.578.578,0,0,0,.578-.578V11.5A9.428,9.428,0,0,0,9.252,2.25Z"
                  transform="translate(30 571.941)"
                  style={
                    active == "/support"
                      ? { fill: "var(--stg-green)" }
                      : { fill: "var(--stg-gray)" }
                  }
                />
              </g>
            </svg>
            &nbsp;
            <span
              style={
                active == "/support"
                  ? { color: "var(--stg-green)" }
                  : { color: "var(--stg-gray)" }
              }
            >
              support
            </span>
          </li>
        </Link>
      </ul>
    </>
  );
};

export default SettingNav;
