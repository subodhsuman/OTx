import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function HowWorks() {
  
  const SwiperData = [
    {
      title:"protect your blockchain model",
      para:"Any given blockchain consists of a single chain of discrete blocks of information, arranged chronologically. In principle this information can be any string of 1s and 0s."
    },
  
    {
      title:"protect your blockchain model",
      para:"Any given blockchain consists of a single chain of discrete blocks of information, arranged chronologically. In principle this information can be any string of 1s and 0s."
    },
  
    {
      title:"protect your blockchain model",
      para:"Any given blockchain consists of a single chain of discrete blocks of information, arranged chronologically. In principle this information can be any string of 1s and 0s."
    },
  
    {
      title:"protect your blockchain model",
      para:"Any given blockchain consists of a single chain of discrete blocks of information, arranged chronologically. In principle this information can be any string of 1s and 0s."
    },
  
    {
      title:"protect your blockchain model",
      para:"Any given blockchain consists of a single chain of discrete blocks of information, arranged chronologically. In principle this information can be any string of 1s and 0s."
    }
    ]
  return (
    <div>
      <section className="how_works_outer">
      <div className="how_works">
          <div className="layer">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-md-12 col-lg-12 col-xl-12">
                    <div className="heading text-center mb-3">
                        <h5 className="mb-0 text-uppercase">how it works</h5>
                    </div>
                    <div className="description text-center m-auto">
                        <h2 className="mb-0">Our Ecosystem based on blockchain and we solved issues</h2>
                    </div>
                    <div className="swiper_toggler position-relative text-center d-none d-lg-block">
                        <div className="swiper-one">
                          <button className="btn rounded-pill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 66 66">
                                <path id="Icon_awesome-cloud-meatball" data-name="Icon awesome-cloud-meatball" d="M6.188,45.375a6.188,6.188,0,1,0,6.188,6.188A6.189,6.189,0,0,0,6.188,45.375Zm53.625,0A6.188,6.188,0,1,0,66,51.563,6.189,6.189,0,0,0,59.813,45.375Zm-15.34,1.431a5.3,5.3,0,0,0-6.716-6.729,5.3,5.3,0,0,0-9.513,0,5.31,5.31,0,0,0-6.729,6.729,5.3,5.3,0,0,0,0,9.513,5.351,5.351,0,0,0,5.1,7.038,5.055,5.055,0,0,0,1.624-.322,5.3,5.3,0,0,0,9.513,0,5.041,5.041,0,0,0,5.453-1.263,5.346,5.346,0,0,0,1.263-5.453,5.3,5.3,0,0,0,0-9.513ZM66,28.875A12.378,12.378,0,0,0,53.625,16.5c-.077,0-.142.026-.206.026a10.067,10.067,0,0,0,.206-2.088,10.271,10.271,0,0,0-18.176-6.6,14.389,14.389,0,0,0-27.2,6.6,14.66,14.66,0,0,0,.271,2.733,12.343,12.343,0,0,0,3.854,24.08H17.97a9.269,9.269,0,0,1,8.456-5.556,9.368,9.368,0,0,1,13.148,0,9.337,9.337,0,0,1,6.548,2.746,9.125,9.125,0,0,1,1.908,2.81h5.595A12.378,12.378,0,0,0,66,28.875Z"  fill="var(--light-green)" />
                            </svg>
                          </button>
                          <button className="btn rounded-pill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 76.308 65.826">
                                <g id="Group_11" data-name="Group 11" transform="translate(-705.203 -3504.621)">
                                  <path id="Icon_awesome-cube" data-name="Icon awesome-cube" d="M18.328.462,2.384,6.442A3.684,3.684,0,0,0,0,9.891V27.146a3.678,3.678,0,0,0,2.031,3.289l15.944,7.972a3.653,3.653,0,0,0,3.289,0l15.944-7.972a3.672,3.672,0,0,0,2.031-3.289V9.891a3.674,3.674,0,0,0-2.384-3.442L20.912.47A3.615,3.615,0,0,0,18.328.462Zm1.3,4.76,14.718,5.519v.084L19.624,16.805,4.906,10.826v-.084Zm2.453,27.29V21.1l12.265-4.983V26.38Z" transform="translate(724.823 3504.394)"  fill="var(--light-green)" />
                                  <path id="Icon_awesome-cube-2" data-name="Icon awesome-cube" d="M18.328.462,2.384,6.442A3.684,3.684,0,0,0,0,9.891V27.146a3.678,3.678,0,0,0,2.031,3.289l15.944,7.972a3.653,3.653,0,0,0,3.289,0l15.944-7.972a3.672,3.672,0,0,0,2.031-3.289V9.891a3.674,3.674,0,0,0-2.384-3.442L20.912.47A3.615,3.615,0,0,0,18.328.462Zm1.3,4.76,14.718,5.519v.084L19.624,16.805,4.906,10.826v-.084Zm2.453,27.29V21.1l12.265-4.983V26.38Z" transform="translate(705.203 3531.649)"  fill="var(--light-green)" />
                                  <path id="Icon_awesome-cube-3" data-name="Icon awesome-cube" d="M18.328.462,2.384,6.442A3.684,3.684,0,0,0,0,9.891V27.146a3.678,3.678,0,0,0,2.031,3.289l15.944,7.972a3.653,3.653,0,0,0,3.289,0l15.944-7.972a3.672,3.672,0,0,0,2.031-3.289V9.891a3.674,3.674,0,0,0-2.384-3.442L20.912.47A3.615,3.615,0,0,0,18.328.462Zm1.3,4.76,14.718,5.519v.084L19.624,16.805,4.906,10.826v-.084Zm2.453,27.29V21.1l12.265-4.983V26.38Z" transform="translate(742.27 3531.649)"  fill="var(--light-green)" />
                                </g>
                            </svg>
                          </button>
                          <button className="btn rounded-pill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 59.887 59.887">
                              <path id="Icon_awesome-dot-circle" data-name="Icon awesome-dot-circle" d="M30.506.563A29.943,29.943,0,1,0,60.449,30.506,29.943,29.943,0,0,0,30.506.563Zm9.659,29.943a9.659,9.659,0,1,1-9.659-9.659A9.67,9.67,0,0,1,40.165,30.506Z" transform="translate(-0.563 -0.563)" fill="var(--light-green)"/>
                            </svg>
                          </button>
                          <button className="btn rounded-pill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="55" viewBox="0 0 56.149 59.887">
                              <path id="Icon_awesome-shield-alt" data-name="Icon awesome-shield-alt" d="M53.823,9.79,31.364.432a5.632,5.632,0,0,0-4.316,0L4.588,9.79a5.609,5.609,0,0,0-3.463,5.182c0,23.22,13.394,39.269,25.911,44.487a5.633,5.633,0,0,0,4.316,0c10.025-4.176,25.922-18.6,25.922-44.487A5.616,5.616,0,0,0,53.823,9.79ZM29.211,52.206,29.2,7.637l20.576,8.574c-.386,17.71-9.6,30.543-20.565,35.994Z" transform="translate(-1.125 -0.002)" fill="var(--light-green)" />
                            </svg>
                          </button>
                          <button className="btn rounded-pill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="58.887" viewBox="0 0 81.209 58.887">
                              <g id="Group_12" data-name="Group 12" transform="translate(-1364.022 -3527.534)">
                                <path id="Icon_awesome-database" data-name="Icon awesome-database" d="M26.677,3.239V5.263C26.677,7.046,20.7,8.5,13.338,8.5S0,7.046,0,5.263V3.239C0,1.455,5.974,0,13.338,0S26.677,1.455,26.677,3.239Zm0,4.554v4.554c0,1.784-5.974,3.239-13.338,3.239S0,14.131,0,12.347V7.793C2.866,9.26,8.111,9.943,13.338,9.943S23.811,9.26,26.677,7.793Zm0,7.084v4.554c0,1.784-5.974,3.239-13.338,3.239S0,21.215,0,19.432V14.877c2.866,1.467,8.111,2.151,13.338,2.151S23.811,16.345,26.677,14.877Z" transform="translate(1418.554 3561.139)"  fill="var(--light-green)"/>
                                <path id="Icon_awesome-database-2" data-name="Icon awesome-database" d="M53.831,8.412V13.67c0,4.633-12.056,8.412-26.916,8.412S0,18.3,0,13.67V8.412C0,3.779,12.056,0,26.916,0S53.831,3.779,53.831,8.412Zm0,11.83v11.83c0,4.633-12.056,8.412-26.916,8.412S0,36.706,0,32.072V20.242c5.783,3.812,16.367,5.586,26.916,5.586S48.048,24.054,53.831,20.242Zm0,18.4v11.83c0,4.633-12.056,8.412-26.916,8.412S0,55.108,0,50.474V38.644c5.783,3.812,16.367,5.586,26.916,5.586S48.048,42.456,53.831,38.644Z" transform="translate(1364.022 3527.534)" fill="var(--light-green)"/>
                              </g>
                            </svg>
                          </button>
                        </div>
                    </div>
                    <div className="main_swiper">
                    <Swiper
slidesPerView={3}
spaceBetween={30}
pagination={{
  clickable: true,
}}

breakpoints={{
  320: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 40,
  },
}}
className="mySwiper"
>
{SwiperData.map((val,i) => {
  return (
    <SwiperSlide key={i}>
    <div className="swiper_content">
    <h5 className="text-uppercase">{val.title}</h5>
        <p className="mb-0">
        {val.para}
        </p>
  </div>
    </SwiperSlide>
  )
})}
</Swiper>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>
    </section>
    </div>
  );
}
