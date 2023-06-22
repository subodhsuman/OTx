import React from "react";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <div>
      <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-xl-2 col-lg-2 col-md-4 col-6">
            <div className="footer-box">
              <h2 className="text-uppercase mb-0">About</h2>
              <ul className="links-list">
               {/* <li>
                  <Link :to="{ name: 'Legal', params: { slug: 'btx_token' } }">BTX Token</Link>
                </li>
                <li>
                  <Link :to="{ name: 'Legal', params: { slug: 'btx_api' } }">BTX API</Link>
                </li>
                <li>
                  <Link :to="{ name: 'Legal', params: { slug: 'blog' } }">Blog</Link>
                </li>
                <li>
                  <Link :to="{ name: 'Legal', params: { slug: 'careers' } }">Careers</Link>
                </li> */}

                <li>
                  <Link>OTX.io</Link>
                </li>

                <li>
                  <Link >Introduction to digital
                    assets</Link>
                </li>

                <li>
                  <Link to="/referralProgram">Referral Program
                  </Link>

                </li>

                <li>
                  <Link >Privacy Policy</Link>
                </li>

                <li>
                  <Link >anti money laundaring
                  </Link>
                </li>
              </ul>
            </div>
               {/* footer-box */}
            </div>
          {/* <!--col-xl-2 col-lg-2 col-md-4 col-6--> */}

          <div className="col-xl-2 col-lg-2 col-md-4 col-6">
            <div className="footer-box">
              <h2 className="text-uppercase mb-0">Products</h2>
              <ul className="links-list">
                <li>
                  <Link>Exchange</Link>
                </li>
              <li>
                  <Link >OTC Desk</Link>
                </li>
                <li>
                  <Link >NFT Marketplace
                  </Link>
                </li> 

                <li>
                  <Link>Spot Trading</Link>
                </li>

                <li>
                  <Link>Buy Crypto</Link>
                </li>

                <li>
                  <Link >IEO</Link>
                </li>

                <li>
                  <Link >
                    Fees</Link>
                </li>

                <li>
                  <Link > API</Link>
                </li>

                <li>
                  <Link >Mobile App</Link>
                </li>
              </ul>
            </div>
            {/* <!--footer-box--> */}
          </div>
          {/* <!--col-xl-2 col-lg-2 col-md-4 col-6--> */}

          <div className="col-xl-2 col-lg-2 col-md-4 col-6">
            <div className="footer-box">
              <h2 className="text-uppercase mb-0">Support</h2>
              <ul className="links-list">
             {/* <li>
                  <Link >Help Center</Link>
                </li>

                <li v-if="loggedIn">
                  <Link to="/request/token">List Your Token</Link>
                </li>

                <li>
                  <Link>Media Assets</Link>
                </li>
                <li>
                  <Link >
                    Fees</Link>
                </li>
                <li>
                  <Link >Security</Link>
                </li>  */}
                <li>
                  <Link >Blog</Link>
                </li>

                <li>
                  <Link>FAQ</Link>
                </li>



                {/* <li>
                   <Link >apply for listing/IEO
                  </Link> 
                  <Link>apply for listing/IEO
                  </Link>

                </li> */}

                <li>
                  <Link >user agreement
                  </Link>
                </li>

                <li>
                  <Link >Terms & Condition
                  </Link>
                </li>

                <li>
                  <Link >Disclaimer</Link>
                </li>

                <li>
                  <Link >contact us</Link>
                </li>
              </ul>
            </div>
            {/* <!--footer-box--> */}
          </div>
          {/* <!--col-xl-2 col-lg-2 col-md-4 col-6--> */}

            <div className="col-xl-2 col-lg-2 col-md-4 col-6">
            <div className="footer-box">
              <h2 className="text-uppercase mb-0">Socials</h2>
              <ul className="links-list">
                <li>
                  <a href="https://www.facebook.com/OTX-107438551892695"> <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
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
                    <span className="ms-3">Facebook</span></a>
                </li>
                <li>
                  <a href="https://twitter.comOTX">
                  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
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
                    <span className="ms-3">Instagram</span></a>
                </li>
                <li>
                  <a href="https://www.instagram.comOTX_official/">
                  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
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
                    <span className="ms-3">Twitter</span></a>
                </li>
                  <li>
                  <a to=""
                    >
                   <svg xmlns="http://www.w3.org/2000/svg" height="25px" width="25px" style={{fill:'var(--green)'}} viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
                      
                      <span className="ms-3">Youtube</span></a>
                   </li> 
                <li>
                  <a href="https://t.me/OTX">
                  <svg xmlns="http://www.w3.org/2000/svg" height="25px" width="25px" style={{fill:'var(--green)'}} viewBox="0 0 496 512"><path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"/></svg>
                     <span className="ms-3">Telegram</span></a>
                </li>
              </ul>
            </div>
            {/* <!--footer-box--> */}
            </div>
          {/* <!--col-xl-2 col-lg-2 col-md-4 col-6--> */}


          <div className="col-xl-4 col-lg-4 col-md-6 col-12">
            <div className="footer-box">
              <h2 className="pb-2 text-uppercase mb-0">News letter</h2>
              <p className="m-0 mb-2 text-white">Subscribe with OTX to get the latest coin listings, market data updates,
                contest alerts, news and more.</p>

              <div className="form-page">
                <form>

                  <div className="row form-row">
                    <div className="col-xl-12 col-lg-12 col-md-12 mb-3">
                      <div className="">
                        <input type="email" className="form-control input-control shadow-none" placeholder="Email" aria-label="Username"
                          aria-describedby="basic-addon1" v-model="email"/>

                      </div>

                      {/* <div className="error" v-if="submitted && !$v.email.required">
                        Email is required
                      </div>
                      <div className="error" v-if="submitted && !$v.email.email">
                        This must be an email
                      </div> */}
                    </div>
                    {/* <!--col-xl-12 col-lg-12 col-md-12--> */}

                    <div className="col-xl-12 col-lg-12 col-md-12">
                      <div className="submit_btn">
                        <button type="submit" className="btn submit-btn shadow-none">Submit</button>
                      </div>
                    </div>
                    {/* <!--col-xl-12 col-lg-12 col-md-12--> */}

                  </div>
                  {/* <!--row form-row--> */}
                </form>
              </div>

            </div>
            {/* <!--footer-box--> */}
          </div>
          {/* <!--col-xl-2 col-lg-2 col-md-4 col-6--> */}


        </div>
      </div>
      {/* <!--row--> */}
      {/* <!--container--> */}
      </footer>
       <div className="copy_right_box text-center p-3">
        <p className="mb-0 text-capitalize">Copyright © 2022.All Rights Reserved</p>

       </div>

    {/* <!--footer--> */}
      {/**footer**/}
    </div>
  );
}
