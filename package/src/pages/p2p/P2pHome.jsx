import { Button } from "bootstrap";
import React from "react";
import { Link } from "react-router-dom";

// import P2pBuyComponent from "../../components/p2p/P2pBuyComponent";
// import P2pDashboard from "./P2pDashboard";
export default function P2pHome() {
  const HowWork = [
    {
      icon: "1.png",
      head: "Place an Order",
      para: " Once you place a P2P order, the crypto asset will be escrowed by OTX P2P.",
    },
    {
      icon: "2.png",
      head: "Pay the Seller",
      para: 'Send money to the seller via the suggested payment methods. Complete the fiat transaction and click  "Transferred, notify seller" on OTX P2P.',
    },
    {
      icon: "3.png",
      head: "Get your Crypto",
      para: "Once the seller confirms receipt of money, the escrowed crypto will be released to you.",
    },
  ];
  const SellData = [
    {
      icon: "1.png",
      head: "Place an Order",
      para: "After you place an order, your crypto will be escrowed by Binance P2P.",
    },
    {
      icon: "2.png",
      head: "Confirm the Payment",
      para: ' Complete the fiat transaction and click  "Transferred, notify seller" on OTX P2P.',
    },
    {
      icon: "3.png",
      head: "Release Crypto",
      para: "Once you confirm the receipt of money, release crypto to the buyer on Binance P2P.",
    },
  ];
  const P2pAdvantage =[
    {
      head:'Low cost transaction <br/> fees',
      icon:'advantage1.png',
      para:'As P2P exchange is a simple platform, the overhead costs are  negligible for buyers and sellers. On OTX P2P, takers are charged zero trading fees, while makers are charged a small amount of transaction fees upon every completed order. We pledge to apply the lowest P2P transaction fees in all markets.'
    },
    {
      head:'Protection for your <br/> privacy',
      icon:'advantage2.png',
      para:"Unlike credit card or bank transfers, peer-to-peer exchanges do not collect information about buyers and sellers. So you can buy Bitcoin with cash on Binance P2P and don't need to use any bank account or online wallet to make a crypto-fiat transaction."
    },
    {
      head:'Trade at your <br/> preferred',
      icon:'advantage3.png',
      para:"Peer-to-peer exchanges bring users freedom to trade crypto at the preferred prices.On Binance P2P, you can not just buy or sell crypto from the existing offers, but also create your trade advertisements to set your own prices."
    }
  ]
  return (
    <div className="p2p-home">
      <section className="p2p_home_sec d-flex align-items-center justyfy-content-center">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h1 className="mb-5">
                Buy and Sell Tether US (USDT) with Your <br />
                Preferred Payment Methods
              </h1>
              <Link to="/p2p"  className="text-decoration-none text-white rounded-5 px-4 py-2  get_start">GET STARTTED</Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* BANNER SEC END */}
      <section className="how_p2p_work">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="p2p_work_box d-sm-flex d-block justify-content-between mb-5">
                <h3 className="text-white mb-4 mb-md-0">HOW P2P WORKS</h3>
                {/* </div>
            
              <div className="p2p_work_box"> */}
                <ul
                  className="nav nav-pills mb-3"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item " role="presentation">
                    <button
                      className="nav-link active green"
                      id="pills-buy-crypto-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-buy-crypto"
                      type="button"
                      role="tab"
                      aria-controls="pills-buy-crypto"
                      aria-selected="true"
                    >
                      Buy crypto
                    </button>
                  </li>
                  <li className="nav-item " role="presentation">
                    <button
                      className="nav-link red"
                      id="pills-Sell-p2p-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-Sell-p2p"
                      type="button"
                      role="tab"
                      aria-controls="pills-Sell-p2p"
                      aria-selected="false"
                    >
                      Sell
                    </button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-buy-crypto"
                  role="tabpanel"
                  aria-labelledby="pills-buy-crypto-tab"
                >
                  <div className="steps_p2p_works">
                    <div className="row justify-content-between">
                      {HowWork.map((val, i) => {
                        return (
                          <div className="col-md-4 col-lg-3 col-xl-3 before_box" key={i}>
                            <div className="main_box ps-0 p-2">
                              <span className="rounded mb-3">
                                <img
                                  src={`/images/p2p-home/${val.icon}`}
                                  alt="img"
                                />
                              </span>
                              <h4 className="mb-3">{val.head}</h4>
                              <p>{val.para}</p>
                            </div>
                          </div>
                        );
                      })}
                     
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-Sell-p2p"
                  role="tabpanel"
                  aria-labelledby="pills-Sell-p2p-tab"
                >
                  <div className="steps_p2p_works">
                    <div className="row justify-content-between">
                      {SellData.map((val, i) => {
                        return (
                          <div className="col-md-3 before_box" key={i}>
                            <div className="main_box ps-0 p-2">
                              <span className="rounded mb-3">
                                <img
                                  src={`/images/p2p-home/${val.icon}`}
                                  alt="img"
                                />
                              </span>
                              <h4 className="mb-3">{val.head}</h4>
                              <p>{val.para}</p>
                            </div>
                          </div>
                        );
                      })}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* HOW P2P WORKS SEC END */}

    {/* p2p nuy sell component */}
            {/* <P2P /> */}
         

   

      <section className="p2p_advantages">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 mb-5">
              <h2 className="text-white text-uppercase text-center">
                Advantages of P2P Exchange
              </h2>
            </div>

           {P2pAdvantage.map((val,i) => {
            return(
              <div className="col-md-6 col-lg-6 col-xl-4 advantage_box_nth mb-4" key={i}>
              <div className="advantage_box p-4 text-center rounded-3">
              <h3
                className="text-white mb-4"
                  dangerouslySetInnerHTML={{
                    __html: val.head ,
                  }}
                ></h3>
              <img
                src={`/images/p2p-home/${val.icon}`}
                alt="img"
                className="img-fluid text-white mb-4"
                loading="lazy"
              />
             
              <p className="text-white">
                {val.para}
              </p>
              </div>
            </div>
            )
           })}
          </div>
        </div>
      </section>
      {/* Advantages of P2P Exchange sec End */}
<section className="faq">
  <div className="container">
    <div className="row">
      <div className="col-md-12 mb-5">
       <h2 className="text-white text-uppercase">Frequently asked questions</h2>
      </div>
      <div className="col-md-12">
      <div className="accordion" id="accordionExample">
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingOne">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
      1. What is P2P exchange?
      </button>
    </h2>
    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      P2P stands for peer-to-peer, and P2P exchanges are platforms that allow users to buy and sell crypto for fiat currency 
directly with other users. Learn more about What is P2P Trading and How Does a Local Bitcoin Exchange Work??      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingTwo">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
      2. How do I sell Bitcoin locally on OTX P2P?
            </button>
    </h2>
    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      P2P stands for peer-to-peer, and P2P exchanges are platforms that allow users to buy and sell crypto for fiat currency 
directly with other users. Learn more about What is P2P Trading and How Does a Local Bitcoin Exchange Work??
      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingThree">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
      3. Which cryptocurrencies are supported in the P2P trade zone?
      </button>
    </h2>
    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingFour">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
      4. Glossary of P2P trading terms
      </button>
    </h2>
    <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingFive">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
      5. How to add new payment methods on OTX P2P?      </button>
    </h2>
    <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  </div>
</section>
      {/* Frequently asked questions */}
    </div>
  );
}
