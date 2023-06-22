import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApiClass from "../../api/api";
import Emitter from "../../event/Emitter";

export default function DetailBarComponent({ active, favCoinsSymbols, setFavPairs }) {
  const [filled, setFilled] = useState(false);
  const [data, setData] = useState(active);


  const isLoggedIn = useSelector((state) => {
    return state.user.token ? true : false;
  });

  const onHandleFav = async (isStar) => {

    if (isStar) {
      setFilled(false)
      await setFavPairs('remove', active);
      if (isLoggedIn) {
        const deleteRes = await ApiClass.deleteRequest(`favourite/delete/${active.symbol}`, true)
        if (deleteRes === undefined) {
          SwalClass.error("404 NOT FOUND");
          return;
        }
        if (deleteRes?.data.status_code === 0) {
          SwalClass.error(deleteRes?.data?.message)
        }
      }
    }

    if (!isStar) {
      setFilled(true);
      await setFavPairs('push', active);
      if (isLoggedIn) {
        const postRes = await ApiClass.postRequest('favourite/create', true, { currency: active.currency, pair_with: active.pair_with })
        // console.log(postRes)
        if (postRes === undefined) {
          SwalClass.error("404 NOT FOUND");
          return;
        }
        if (postRes?.data.status_code === 0) {
          SwalClass.error(postRes?.data?.message)
        }
      }
    }

  }

  Emitter.on('EVENT_DETAIL_BAR', ({ image, price, changeC, flag, symbol, change, high, low, currency, pair_with }) => {
    setData({ image, price, changeC, flag, symbol, change, high, low, currency, pair_with })
  });

  useEffect(() => {
    favCoinsSymbols?.includes(active.symbol) ? setFilled(true) : setFilled(false);
  }, [active.symbol])

  let pair_with = active.symbol.slice(-3); // slice pair with
  pair_with = pair_with == "SDT" ? "USDT" : pair_with; // Original pair with

let price = data?.price
  return (
    <div>
      <div className="detailbar">
        <div className="detail-box" id="currency-name">
          <h6 className="text-uppercase">
            <span  >


              {filled ?
                <svg onClick={() => onHandleFav(true)} xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  width="18px"
                  height="18px"
                  style={{ fill: "var(--yellow)", marginRight: '10px', verticalAlign: 'bottom', cursor: 'pointer' }}
                >
                  <path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                </svg> :
                <svg onClick={() => onHandleFav(false)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  width="18px"
                  height="18px"
                  style={{ fill: "white", marginRight: '10px', verticalAlign: 'bottom', cursor: 'pointer' }}
                >
                  <path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                </svg>}

              {active.currency}/{pair_with}
            </span>
          </h6>
        </div>
        {/**currency-name**/}

        <div className="detail-box" id="price">
          <h6>
            price <span>{parseFloat(price)}</span>
          </h6>
        </div>
        {/**price**/}

        <div className="detail-box" id="change">
          <h6>
            24H change <span style={{ color: data.change > 0 ? "var(--ex-green)" : "var(--ex-red)" }}
            > {parseFloat(data.change)}%</span>
          </h6>
        </div>
        {/**change**/}

        <div className="detail-box" id="high">
          <h6>
            high <span style={{ color: "var(--ex-green)" }}>{parseFloat(data.high)}</span>
          </h6>
        </div>
        {/**high**/}

        <div className="detail-box" id="low">
          <h6>
            low <span style={{ color: "var(--ex-red)" }}>{parseFloat(data.low)}</span>
          </h6>
        </div>
        {/**low**/}
      </div>
      {/**detailbar**/}
    </div>
  );
}
