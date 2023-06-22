import React, {useState, useEffect, useRef} from "react";
import globe from "/images/home/banner.png";
import TrendTable from "../components/Landing/TrendTable";
import Heading from "../components/Landing/Heading";
import ChooseData from "../assets/json/WhyChoose.json";
import check from "/images/home/check.png";
import whitepaper from "/images/home/whitepaper.jpg";
import desktop from "/images/home/desktop.png";
import qr from "/images/home/sccaner.png";
import ios from "/images/home/ios.png";
import gplay from "/images/home/g-play.png";
import apple from "/images/home/apple.png";
import android from "/images/home/android.png";
import AccordionComponent from "../components/Landing/AccordionComponent";
// import faqleft from "/images/home/faq-left.png";
// import hud from "/images/home/HUD.mp4";
import HowWorks from "../components/Landing/HowWorks";
import Particles from "react-tsparticles";
import data from "../assets/json/data.json"; 
import { loadFull } from "tsparticles";
import ApiClass from "../api/api";
import {Link} from "react-router-dom";


// cyrpto list api
async function homegetList() {
  var response = await ApiClass.getNodeRequest("list-crypto/get", false);
  if (response == undefined) {
    return [];
  }
  if (response?.data?.status_code == 1) ;
  return response;
}
const resource = await homegetList();


let api = resource.data.data.BTC;
let api1 = resource.data.data.ETH;
let api2 = resource.data.data.TRX;
let api3 = resource.data.data.USDT;
let obj=[]
for (const x of api1){ obj.push(x); }
for (const x of api2){ obj.push(x); }
for (const x of api3){ obj.push(x); }
for (const x of api){ obj.push(x); }

export default function Home() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };



  const [dataa, setDataa] = useState([]);
const[tab,setTab]=useState("hot")
  useEffect(() => {
    obj ? setDataa(obj) : "";
    }, []);
  
      const ws = useRef(null);
      const getlist = async () => {
  
      const ticker_subs = resource?.data?.tickers?.map((v) => v.toLowerCase() + "@ticker");
      const req = {
          method: "SUBSCRIBE",
          params: ticker_subs,
          id: 1,
      };
  
      ws.current = new WebSocket(ApiClass.binanceWebsocket);
          ws.current.onopen = () => {
              ws.current.send(JSON.stringify(req));
          }
          ws.onclose = () => { }
      }
    
      useEffect(() => {
          if (dataa?.length == 0) {
              return;
          }
          ws.current.onmessage = (event) => {
              let dat = JSON.parse(event.data);
              (dataa?.filter(function (c, index) {
                  if (c.symbol == dat.s) {
                      c.change = dat.P;
                      c.price = dat.c;
                      c.volume = dat.v;
                      let newArr = [...dataa];
                      newArr[index] = c;
                      setDataa(newArr);
                  }
              } )) }
      }, [dataa])
  
      useEffect(()=>{
          getlist()
          return () => {
              ws.current.close()
            }
      },[])

      const changeHandle = () => {
        obj = obj.sort(function (a, b) {
          return b.change - a.change
    
        });
      }

      const volumeChange = () => {
        obj = obj.sort(function (a, b) {
          return b.volume - a.volume
    
        });
      }

      const createdChange = () => {
        obj = obj.sort(function (a, b) {
          return  Date.parse(new Date(b.created_at)) - Date.parse(new Date(a.created_at))
        });
      }

      useEffect(()=>{
       if( tab == "hot") {volumeChange();}
        if(tab == "top" ){ changeHandle()}
        if(tab == "new" ){ createdChange()}
      },[tab])

  return (
    <div className="main">
      <section className="banner-sec">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-6 col-lg-6 col-xl-6 order-2 order-md-1 text-center text-md-start">
              <div className="banner-info">
                <h1 className="mb-0 pb-0 pb-md-3">
                  We’ve built a platform to buy and sell shares.
                </h1>
                <hr className="banner_line text-center text-md-start" />
                <h2 className="mb-0 pb-4">
                  Lipsum as it is sometimes known, is <br /> dummy text used in
                  laying out print, <br /> graphic or web designs.
                </h2>
                <Link to="/exchange"><button className="btn btn-outline-success text-uppercase">
                  learn more
                </button></Link>
              </div>
              {/**banner-info**/}
            </div>
            {/**col-md-6 col-lg-6 col-xl-6**/}
            <div className="col-md-6 col-lg-6 col-xl-6 order-1 order-md-2">
              <div className="globe-image mb-5 mb-md-0">
                <img src={globe} alt="banner-image" className="img-fluid" />
              </div>
              {/**globe-image**/}
            </div>
            {/**col-md-6 col-lg-6 col-xl-6**/}
          </div>
          {/**row**/}
        </div>
        {/**container**/}
      </section>
      {/**banner-sec**/}

      <section className="trend-sec px-3">
        <div className="container">
          <div className="inner-wrapper">
            <div className="row">
              <div className="col-md-12 col-lg-12 col-xl-12">
                <div className="tab-box mb-5">
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="nav-home-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-hot"
                        type="button"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        onClick={()=>setTab("hot")}
                      >
                        hot list{" "}
                      </button>
                      <button
                        className="nav-link"
                        id="nav-profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-coins"
                        type="button"
                        role="tab"
                        aria-controls="nav-profile"
                        aria-selected="false"
                        onClick={()=>setTab("new")}

                      >
                        new coins
                      </button>
                      <button
                        className="nav-link"
                        id="nav-contact-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-gainers"
                        type="button"
                        role="tab"
                        aria-controls="nav-contact"
                        aria-selected="false"
                        onClick={()=>setTab("top")}

                      >
                        top gainers
                      </button>
                    </div>
                  </nav>
                </div>
                {/**tab-box**/}
{/* 
                <div className="tab-data">
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane show active"
                      id="nav-gainers"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                      tabIndex="0"
                    > */}
                      <TrendTable dataa={obj} tab={tab}/>
                    {/* </div> */}
                    {/* <div
                      className="tab-pane show active"
                      id="nav-hot"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                      tabIndex="0"
                    >
                      <TrendTable dataa={obj}/>
                    </div>
                    <div
                      className="tab-pane"
                      id="nav-coins"
                      role="tabpanel"
                      aria-labelledby="nav-profile-tab"
                      tabIndex="0"
                    >
                      <TrendTable dataa={obj}/>
                    </div> */}
                  {/* </div>
                </div> */}
                {/**tab-data**/}
              </div>
              {/**col-md-12 col-lg-12 col-xl-12**/}
            </div>
            {/**row**/}
          </div>
          {/**inner-wrapper**/}
        </div>
        {/**container**/}
      </section>
      {/**trend-sec**/}

      <section className="choose_sec">
        <div className="container">
          <div className="row heading-row mb-5">
            <div className="col-md-12 col-lg-12 col-xl-12">
              <Heading heading="why choose us" />
            </div>
            {/**col-md-12 col-lg-12 col-xl-12**/}
          </div>
          {/**row heading-row**/}

          <div className="row choose_row">
            {ChooseData.ChooseData.map((val, i) => {
              return (
                <div className="col-md-3 col-lg-3 col-xl-3" key={i}>
                  <div className="choose_box">
                    <div className="choose_icon mb-4">
                      <img
                        src={`/images/home/${val.icon}`}
                        alt="choose_icon"
                        className="img-fluid"
                        loading="lazy"
                      />
                    </div>
                    {/**choose_icon**/}

                    <div className="choose_info">
                      <h3 className="mb-0 pb-2 text-capitalize">{val.title}</h3>
                      <p className="mb-0">{val.para}</p>
                    </div>
                    {/**choose_info**/}
                  </div>
                  {/**choose_box**/}
                </div>
              );
            })}
          </div>
          {/**row choose_row**/}
        </div>
        {/**container**/}
      </section>
      {/**choose_sec**/}

      {/** How it Works Sec **/}
      <HowWorks />
      {/** How it Works Sec **/}

      <section className="whitepaper-sec">
        <div className="container">
          <div className="inner-wrapper p-5">
            <div className="row heading-row mb-5">
              <div className="col-md-12 col-lg-12 col-xl-6">
                <Heading heading="whitepaper" />
              </div>
              {/**col-md-12 col-lg-12 col-xl-12**/}
            </div>
            {/**row heading-row**/}

            <div className="row whitepaper-row align-items-center">
              <div className="col-md-6 col-lg-6 col-xl-6">
                <div className="white-content">
                  <h3 className="mb-0 pb-2 text-capitalize">
                    read our documents
                  </h3>
                  <p className="mb-0">
                    Here is our full documents that help you to understand{" "}
                    <br />
                    deeply about us and our operation
                  </p>

                  <div className="row text-row mt-5 mb-5">
                    <div className="col-md-6 col-lg-6 col-xl-6 mb-4">
                      <div className="text-box">
                        <span>
                          <img
                            src={check}
                            alt="check-icon"
                            className="img-fluid"
                          />
                          White Paper
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-6 col-xl-6 mb-4">
                      <div className="text-box">
                        <span>
                          {" "}
                          <img
                            src={check}
                            alt="check-icon"
                            className="img-fluid"
                          />{" "}
                          Terms Of Coin Sale
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-6 col-xl-6 mb-4">
                      <div className="text-box">
                        <span>
                          {" "}
                          <img
                            src={check}
                            alt="check-icon"
                            className="img-fluid"
                          />{" "}
                          Privacy & Policy
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-6 col-xl-6 mb-4">
                      <div className="text-box">
                        <span>
                          {" "}
                          <img
                            src={check}
                            alt="check-icon"
                            className="img-fluid"
                          />{" "}
                          One Pager
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary text-capitalize mb-5 mb-md-0">
                    download
                  </button>
                </div>
                {/**white-content**/}
              </div>
              {/**col-md-6 col-lg-6 col-xl-6**/}

              <div className="col-md-6 col-lg-6 col-xl-6 order-first order-sm-1">
                <div className="whitepaper-image text-center">
                  <img
                    src={whitepaper}
                    alt="whitepaper"
                    className="img-fluid"
                    loading="lazy"
                  />
                </div>
                {/**whitepaper-image**/}
              </div>
              {/**col-md-6 col-lg-6 col-xl-6**/}
            </div>
            {/**row whitepaper-row**/}
          </div>
          {/**inner-wrapper**/}
        </div>
        {/**container**/}
      </section>
      {/**whitepaper-sec**/}

      <section className="trade_anywhere">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-xl-5 text-center">
              <img
                src={desktop}
                alt="iamge"
                className="img-fluid"
                loading="lazy"
              />
            </div>
            <div className="col-xl-6">
              <div className="trade_box ms-4">
                <div className="head mb-5">
                  <h2>Trade Anytime, Anywhere</h2>
                  <p>
                    The OTX app and website allow you to start crypto trading
                    with ease.
                  </p>
                </div>
                <div className="content row align-items-center">
                  <div className="col-6 ">
                    <div className="start_crypto text-center  p-3">
                      <div className="d-flex justify-content-between">
                        <div className="mb-2 trade_img">
                          {" "}
                          <img
                            src={ios}
                            alt="image"
                            className="mb-2"
                            loading="lazy"
                          />
                          <p>App Store</p>
                        </div>
                        <div className="trade_img">
                          {" "}
                          <img
                            src={gplay}
                            alt="image"
                            className="mb-2"
                            loading="lazy"
                          />
                          <p>Google Play</p>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <div className="trade_img">
                          {" "}
                          <img
                            src={apple}
                            alt="image"
                            className="mb-2"
                            loading="lazy"
                          />
                          <p>iOS Store</p>
                        </div>
                        <div className="trade_img">
                          {" "}
                          <img
                            src={android}
                            alt="image"
                            className="mb-2"
                            loading="lazy"
                          />
                          <p>Android APK</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 text-center">
                    <div className="sccaner_img">
                      {" "}
                      <img
                        src={qr}
                        alt="image"
                        className="img-fluid"
                        style={{ width: "160px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/**trade_anywhere**/}

      <section className="faq_box">
        <div className="container">
          <div className="row heading-row mb-3">
            <div className="col-md-12 col-lg-12 col-xl-12">
              <Heading heading="FAQS" />
            </div>
            {/**col-md-12 col-lg-12 col-xl-12**/}
          </div>
          {/**row heading-row**/}
          <div className="row justify-content-between align-items-center position-relative">
            <div className="col-12">
              <h2 className="mb-0 pb-3" style={{ color: "var(--white)" }}>
                Frequently Questions
              </h2>
            </div>

            <div className="col-md-12 col-lg-7 col-xl-6 order-2 order-lg-1">
              <div className="faq_tabs">
                <ul
                  className="nav nav-pills mb-5"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-Grenral-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-Grenral"
                      type="button"
                      role="tab"
                      aria-controls="pills-Grenral"
                      aria-selected="true"
                    >
                      General
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-ico-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-ico"
                      type="button"
                      role="tab"
                      aria-controls="pills-ico"
                      aria-selected="false"
                    >
                      Pre-ICO & ICO
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-Tokens-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-Tokens"
                      type="button"
                      role="tab"
                      aria-controls="pills-Tokens"
                      aria-selected="false"
                    >
                      Tokens
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link"
                      id="pills-Client-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-Client"
                      type="button"
                      role="tab"
                      aria-controls="pills-Client"
                      aria-selected="true"
                    >
                      Client
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-Legal-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-Legal"
                      type="button"
                      role="tab"
                      aria-controls="pills-Legal"
                      aria-selected="false"
                    >
                      Legal
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      Contact
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-Grenral"
                    role="tabpanel"
                    aria-labelledby="pills-Grenral-tab"
                  >
                    <AccordionComponent />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-ico"
                    role="tabpanel"
                    aria-labelledby="pills-ico-tab"
                  >
                    <AccordionComponent />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-Tokens"
                    role="tabpanel"
                    aria-labelledby="pills-Tokens-tab"
                  >
                    <AccordionComponent />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-Client"
                    role="tabpanel"
                    aria-labelledby="pills-Client-tab"
                  >
                    <AccordionComponent />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-Legal"
                    role="tabpanel"
                    aria-labelledby="pills-Legal-tab"
                  >
                    <AccordionComponent />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-contact"
                    role="tabpanel"
                    aria-labelledby="pills-contact-tab"
                  >
                    <AccordionComponent />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-4 col-xl-6 order-1 order-lg-2 text-center">
              <div className="faq_image">
                {/* <img
                  src={faqleft}
                  alt="iamge"
                  className="img-fluid"
                  loading="lazy"
                /> */}

<video  width="100%" height="500" autoPlay={true} loop={true}  muted={true}  playsInline={true} >
      <source src="/images/home/HUD.mp4" type="video/mp4"/>
     </video>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/**FAQ-sec**/}

      <section className="sec_contact">
        <div className="particals">
          <Particles
            canvasclassName="example"
            id="tsparticles"
            init={particlesInit}
            options={data}
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-6 col-xl-6 mx-auto">
              <div className="contact_us text-center">
                <h2 className="mb-0 pb-4">Don't miss out, Stay updated</h2>
                <div className="contact_form m-auto mb-4">
                  <form className="mb-3">
                    <div className="form_box d-flex justify-content-between gap-4">
                      <input
                        type="text"
                        placeholder="Enter the email"
                        className="form-control border-0 rounded-pill px-4"
                      />
                      <button
                        type="button"
                        className="btn border-0 rounded-pill text-uppercase"
                      >
                        Subscribe
                      </button>
                    </div>
                  </form>
                  <p className="mb-0">
                    Don't hesitate to subscribe to latest news about ICO markets
                    as well as crucial financial knowledge to become successful
                    investors globally
                  </p>
                </div>
                <div className="social_links">
                  <ul className="list-group list-group-horizontal justify-content-center align-items-center">
                    <li className="list-group-item border-0 px-2 px-sm-3">
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 38.511 38.369"
                        >
                          <path
                            id="Icon_awesome-facebook"
                            data-name="Icon awesome-facebook"
                            d="M38.074,19.318A18.756,18.756,0,1,0,16.388,37.847V24.74H11.623V19.318h4.765V15.186c0-4.7,2.8-7.3,7.084-7.3a28.865,28.865,0,0,1,4.2.366v4.613H25.3A2.711,2.711,0,0,0,22.249,15.8v3.52h5.2l-.832,5.422h-4.37V37.847A18.762,18.762,0,0,0,38.074,19.318Z"
                            transform="translate(-0.063 -0.063)"
                            fill="var(--green)"
                            stroke="#000"
                            strokeWidth="1"
                          />
                        </svg>
                      </a>
                    </li>
                    <li className="list-group-item border-0 px-2 px-sm-3">
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 34.268 34.268"
                        >
                          <g
                            id="Icon_feather-instagram"
                            data-name="Icon feather-instagram"
                            transform="translate(1 1)"
                          >
                            <path
                              id="Path_71"
                              data-name="Path 71"
                              d="M11.067,3H27.2a8.067,8.067,0,0,1,8.067,8.067V27.2A8.067,8.067,0,0,1,27.2,35.268H11.067A8.067,8.067,0,0,1,3,27.2V11.067A8.067,8.067,0,0,1,11.067,3Z"
                              transform="translate(-3 -3)"
                              fill="none"
                              stroke="var(--green)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_72"
                              data-name="Path 72"
                              d="M24.9,17.442A6.454,6.454,0,1,1,19.465,12,6.453,6.453,0,0,1,24.9,17.442Z"
                              transform="translate(-2.315 -2.325)"
                              fill="none"
                              stroke="var(--green)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_73"
                              data-name="Path 73"
                              d="M26.25,9.75h0"
                              transform="translate(-1.242 -2.49)"
                              fill="none"
                              stroke="var(--green)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </g>
                        </svg>
                      </a>
                    </li>
                    <li className="list-group-item border-0 px-2 px-sm-3">
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 40.386 32.466"
                        >
                          <path
                            id="Icon_awesome-twitter"
                            data-name="Icon awesome-twitter"
                            d="M34.741,11.218c.025.344.025.688.025,1.032,0,10.491-7.985,22.579-22.579,22.579A22.426,22.426,0,0,1,0,31.267a16.417,16.417,0,0,0,1.916.1,15.893,15.893,0,0,0,9.852-3.391,7.95,7.95,0,0,1-7.42-5.5,10.008,10.008,0,0,0,1.5.123,8.393,8.393,0,0,0,2.088-.27,7.937,7.937,0,0,1-6.364-7.788v-.1a7.992,7.992,0,0,0,3.587,1.007A7.948,7.948,0,0,1,2.7,4.83a22.558,22.558,0,0,0,16.363,8.3,8.959,8.959,0,0,1-.2-1.818A7.943,7.943,0,0,1,32.6,5.887,15.624,15.624,0,0,0,37.64,3.97a7.914,7.914,0,0,1-3.489,4.373,15.909,15.909,0,0,0,4.57-1.228,17.059,17.059,0,0,1-3.98,4.1Z"
                            transform="translate(0.271 -2.863)"
                            fill="var(--green)"
                            stroke="#06ba78"
                            strokeWidth="1"
                          />
                        </svg>
                      </a>
                    </li>
                    <li className="list-group-item border-0 px-2 px-sm-3">
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 38.511 38.524"
                        >
                          <path
                            id="Icon_awesome-facebook-messenger"
                            data-name="Icon awesome-facebook-messenger"
                            d="M19.36.563C8.77.563.563,8.3.563,18.756a17.781,17.781,0,0,0,5.9,13.457c.631.568.5.9.609,4.4a1.507,1.507,0,0,0,2.108,1.329c4-1.762,4.053-1.9,4.731-1.717C25.508,39.42,38.074,32,38.074,18.756,38.074,8.3,29.951.563,19.36.563Zm11.287,14L25.126,23.3a2.826,2.826,0,0,1-4.077.751l-4.392-3.288a1.134,1.134,0,0,0-1.361,0l-5.927,4.5a.892.892,0,0,1-1.294-1.185l5.521-8.74a2.825,2.825,0,0,1,4.077-.751l4.391,3.287a1.134,1.134,0,0,0,1.361,0l5.93-4.491a.889.889,0,0,1,1.292,1.181Z"
                            transform="translate(-0.063 -0.063)"
                            fill="var(--green)"
                            stroke="#06ba78"
                            strokeWidth="1"
                          />
                        </svg>
                      </a>
                    </li>
                    <li className="list-group-item border-0 px-2 px-sm-3">
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 38.511 37.575"
                        >
                          <path
                            id="Icon_awesome-github"
                            data-name="Icon awesome-github"
                            d="M12.547,30.012c0,.151-.174.272-.393.272-.25.023-.424-.1-.424-.272,0-.151.174-.272.393-.272C12.35,29.717,12.547,29.838,12.547,30.012Zm-2.352-.34c-.053.151.1.325.325.371a.355.355,0,0,0,.469-.151c.045-.151-.1-.325-.325-.393A.388.388,0,0,0,10.195,29.671Zm3.343-.129c-.219.053-.371.2-.348.371.023.151.219.25.446.2s.371-.2.348-.348S13.757,29.52,13.537,29.543ZM18.514.563A18.135,18.135,0,0,0,0,19.016a18.96,18.96,0,0,0,12.819,18.09c.968.174,1.308-.424,1.308-.915,0-.469-.023-3.055-.023-4.644,0,0-5.294,1.134-6.406-2.254,0,0-.862-2.2-2.1-2.768,0,0-1.732-1.187.121-1.165a3.992,3.992,0,0,1,2.919,1.951,4,4,0,0,0,5.513,1.581,4.2,4.2,0,0,1,1.21-2.549c-4.228-.469-8.493-1.081-8.493-8.357a5.732,5.732,0,0,1,1.785-4.454,7.145,7.145,0,0,1,.2-5.135c1.581-.492,5.218,2.042,5.218,2.042a17.866,17.866,0,0,1,9.5,0S27.2,7.9,28.784,8.4a7.142,7.142,0,0,1,.2,5.135,5.879,5.879,0,0,1,1.951,4.454c0,7.3-4.454,7.88-8.682,8.357a4.472,4.472,0,0,1,1.286,3.509c0,2.549-.023,5.7-.023,6.322,0,.492.348,1.089,1.308.915a18.786,18.786,0,0,0,12.69-18.075C37.511,8.526,29,.563,18.514.563ZM7.351,26.646c-.1.076-.076.25.053.393.121.121.295.174.393.076.1-.076.076-.25-.053-.393C7.623,26.6,7.449,26.548,7.351,26.646Zm-.817-.613c-.053.1.023.219.174.295a.225.225,0,0,0,.325-.053c.053-.1-.023-.219-.174-.295C6.708,25.935,6.587,25.958,6.534,26.034Zm2.45,2.692c-.121.1-.076.325.1.469.174.174.393.2.492.076.1-.1.053-.325-.1-.469C9.31,28.628,9.083,28.605,8.985,28.726Zm-.862-1.112c-.121.076-.121.272,0,.446s.325.25.424.174a.345.345,0,0,0,0-.469C8.44,27.592,8.243,27.516,8.122,27.614Z"
                            transform="translate(0.5 -0.063)"
                            fill="var(--green)"
                            stroke="#06ba78"
                            strokeWidth="1"
                          />
                        </svg>
                      </a>
                    </li>
                    <li className="list-group-item border-0 px-2 px-sm-3">
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 35.172 35.157"
                        >
                          <path
                            id="Icon_ionic-logo-whatsapp"
                            data-name="Icon ionic-logo-whatsapp"
                            d="M19.5,2.25a16.569,16.569,0,0,0-16.633,16.5,16.334,16.334,0,0,0,2.387,8.522l-3,8.855,9.209-2.925A16.661,16.661,0,0,0,36.131,18.754,16.569,16.569,0,0,0,19.5,2.25Zm8.271,22.772a4.3,4.3,0,0,1-2.942,1.9c-.78.041-.8.6-5.055-1.243s-6.81-6.341-7.012-6.63a8.157,8.157,0,0,1-1.569-4.421,4.713,4.713,0,0,1,1.619-3.458,1.629,1.629,0,0,1,1.152-.485c.335-.005.552-.01.8,0s.62-.052.942.8,1.092,2.961,1.191,3.176a.771.771,0,0,1,.008.739,2.888,2.888,0,0,1-.451.687c-.222.238-.467.533-.665.715-.221.2-.451.421-.219.852a12.728,12.728,0,0,0,2.252,3.005,11.6,11.6,0,0,0,3.335,2.217c.417.227.666.2.925-.07s1.107-1.191,1.406-1.6.579-.331.964-.176S26.88,22.28,27.3,22.507s.7.343.795.522A3.493,3.493,0,0,1,27.769,25.022Z"
                            transform="translate(-1.459 -1.75)"
                            fill="var(--green)"
                            stroke="#06ba78"
                            strokeWidth="1"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
