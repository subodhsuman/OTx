import React, { useRef, useEffect, useState, memo } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";
import ApiClass from "../../api/api.js";
import ResetImg from "../../assets/svg/redo.svg";

var candleSeries;
var cal = null;
export default function ChartComponent({activeSym})  {

  let {symbol} = activeSym;

  const trading_chart = useRef(null);
  const chart = useRef(null);
  const candleData = useRef([]);
  const ws = useRef(null);
  const firstIndexTime = useRef("");
  const secondHit = useRef(false);
  const visibleLastFrom = useRef(null);
  const resizeObserver = useRef("");
  const [timeParam, setTimeParam] = useState("1m");
  let [cursorBool, setCursorBool] = useState(false);
  let [mouseMoveData, setMouseMoveData] = useState('');
  const [active, setActive] = useState("1m");
  const [loading, setLoading] = useState(false);
  const [time, setTime]=useState("1")
   cal = time;

  const TimelineButtons = [{
    val: "1m",
    num: 1,
},
{
    val: "5m",
    num: 5,
},
{
    val: "15m",
    num: 15,
},
{
    val: "30m",
    num: 30,
},
{
    val: "1h",
    num: 60,
},
{
    val: "12h",
    num: 720,
},
{
    val: "1d",
    num: 1440,
},
{
    val: "1w",
    num: 10080,
},
0]

  function createLightChart() {
    chart.current = createChart(trading_chart.current, {
 
      width: trading_chart.current.clientWidth,
      height: trading_chart.current.clientHeight,
      

      // width: 1190, height:330 ,      
      layout: { backgroundColor: "#000000", textColor: "#fff" },

      grid: { vertLines: { color: "#282828", },horzLines: { color: "#282828", }, },  

      crosshair: { mode: CrosshairMode.Normal, },

      priceScale: { borderColor: "#ffff", },

      timeScale: { barSpacing: 10, rightOffset: 20, borderColor: "#ffff", color: "#ffff", timeVisible: true, secondsVisible: true, }, });

      candleSeries = chart.current.addCandlestickSeries({

      upColor: "#006400", downColor: "#DC143C", borderDownColor: "#ff4976", borderUpColor: "#4bffb5", wickDownColor: "#ef5350", wickUpColor: "#26a69a",

      priceFormat: { type: "custom", formatter: (price) => {
          if (price < 0.000001) return parseFloat(price).toPrecision(5);
          else if (price >= 0.000001 && price < 1)
            return parseFloat(price).toPrecision(4);
          else if (parseInt(price) == 1 || parseInt(price) == 4)
            return parseFloat(price).toFixed(3);
          else return parseFloat(price).toFixed(2);
        },
        minMove: "0.000000001",
      },
    });

    candleSeries.setData(candleData.current);
    scalingChart();

    chartResponsiveSize();

    if (chart.current) {
      chart.current
        .timeScale()
        .subscribeVisibleTimeRangeChange(visibleTimeRangeChangeHandler);
    }
  }
  const initialApi = async (firstIndexTimeParam = "") => {
    if(activeSym.listed === false){
      const response = await ApiClass.getNodeRequest(`chart?symbol=${symbol}&interval=${timeParam}&end_time=` + firstIndexTimeParam);      
      if (response.data) {
        setLoading(false);
        firstIndexTime.current = response.data[0][0];
        if ((candleSeries || chart.current) && !secondHit.current && chart.current) {
          chart.current.remove();
        }
        if (!secondHit.current) { 
          candleData.current = modifiedata(response.data);
          createLightChart();        
        }
        if (secondHit.current) {
          response.data.splice(response.data.length - 1, 1);
          const newResponse = modifiedata(response.data);
          candleData.current = newResponse.concat(candleData.current);
          candleSeries.setData(candleData.current);
          secondHit.current = false;
        }
      }  
  }else {     
    let response = await ApiClass.getNodeRequest(`orders/getohlc?symbol=${symbol}&interval=${timeParam}&end_time=` + firstIndexTimeParam);
    if (response?.data) {
      setLoading(false);
      firstIndexTime.current = response.data?.data ? response.data?.data[0]['start_time'] : '';
      if ((candleSeries || chart.current) && !secondHit.current) {
        chart.current.remove();
      }
      
      if (!secondHit.current) { 
        candleData.current = response.data?.data ? modifiedata(response.data?.data) : [{time: Math.floor(Date.now() / 1000),open:0,high:0,low:0,close:0}] ;
        createLightChart();
      } }
    } };
  let modifiedata = (resdata) => {
    let getData = resdata.map((val) => {
      if(activeSym.listed === false){
        return {
          time: (val[0] + 19800000) / 1000,
          open: val[1],
          high: val[2],
          low: val[3],
          close: val[4],
          value: val[5],
        };
      }else {
        return {
          time: (val.start_time + 19800000) / 1000,
          open: val.ohlc.o,
          high: val.ohlc.h,
          low: val.ohlc.l,
          close: val.ohlc.c,
          value: val.ohlc.v,
        };   }  });
    return getData;
  };
  const socketHit = async () => {
    let socketUrl = (activeSym.listed) ? ApiClass.nodeWebsocket : ApiClass.binanceWebsocket;
    // connect socket
    ws.current = new WebSocket(socketUrl);
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        method: (activeSym.listed) ? "ADD" : "SUBSCRIBE",
        params: (activeSym.listed) ? [symbol.toLowerCase() + `@kline_1m`] : [symbol.toLowerCase() + `@kline_1m`],
        id: 3,
      }));
    }
    ws.current.onclose = () => { };
    ws.current.onmessage = (event) => {
      let msg = JSON.parse(event.data);

      if (symbol.toUpperCase() == msg.s) {
        let live_d = {
          time: (msg.k.t + 19800000) / 1000,
          open: msg.k.o,
          high: msg.k.h,
          low: msg.k.l,
          close: msg.k.c,
          value: msg.k.v,
        };
        if (candleSeries) { 
          candleSeries.update(live_d);
          setMouseMoveData(live_d)
        }
      }
    }
    // for closing the socket--->
    ws.current.off=()=>{};
  }
  useEffect(() => {
    if (ws.current != null && chart.current) {
      ws.current.close();
      chart.current.remove();
    }
    setLoading(true);
    initialApi()
    socketHit();

    return()=>{
      ws.current.close();
    }
  ;
  }, [symbol || "" , timeParam]);

  function chartResponsiveSize() {
    resizeObserver.current = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      chart.current.resize(cr.width, cr.height);
    });
    resizeObserver.current.observe(trading_chart.current);
    return () => resizeObserver.current.disconnect();
  }

  function visibleTimeRangeChangeHandler(newVisibleTimeRange) {
    chart.current.subscribeCrosshairMove((param) => {
      let moveData = param.seriesPrices.get(candleSeries);
      if (moveData !== undefined) {
        setMouseMoveData(moveData)
      }
    });
    document.onmousedown = function () {
      setCursorBool(true)
    };
    document.onmouseup = function () {
      setCursorBool(false)
    };
    if (newVisibleTimeRange.from != visibleLastFrom.current) {
      visibleLastFrom.current = newVisibleTimeRange.from;
      return;
    }
    if ( newVisibleTimeRange.from <= candleData.current[0].time && !secondHit.current ) 
    {
      secondHit.current = true;
      initialApi(firstIndexTime.current);
    }
  }
  function resetLines() {
       chart.current.timeScale().resetTimeScale();
       scalingChart()
   }
   function scalingChart() {
    chart.current.priceScale().applyOptions({ autoScale: true });
    var to = chart.current.timeScale().getVisibleRange().to;
    var from = to - 60 * 60 * cal;
    chart.current.timeScale().setVisibleRange({ from, to });
    chart.current.timeScale().applyOptions({
      rightOffset: 18,
    });
  }
  return (
    <>
        <div className="chart chrt_tkn_name mt-2 d-flex flex-wrap ps-3 ps-md-0">
              <div className="col-xl-11 col-lg-11 col-md-11 col-12">
                    {TimelineButtons.map((btn, index) => {
                      return (
                        <button className={active === btn.val ? 'text-light ': 'text-secondary'}
                        style={{backgroundColor:"black" , fontWeight:"bold"}}
                        onClick={()=>{setTimeParam(btn.val, btn.num); setActive(btn.val), setTime(btn.num);}}
                        key={index}
                        value={btn.val}>{btn.val}
                        </button>)
                    })}
              </div>
                <div >
                     <img color="white" src={ResetImg} onClick={resetLines}/>
                </div>
                       {/* <hr></hr> */}
                      <div className="chrt_time mb-2 ps-3 ps-md-0">
                        {mouseMoveData ? <h6 style={{color : "#FFFFFF", fontSize:"15px", padding:"4px"}}>
                            {`${symbol} - ${timeParam} `}
                            <span>
                                O
                                <span className={`${(mouseMoveData.open <= mouseMoveData?.close) ? 'green' : 'red'}`}>{' '} {parseFloat(mouseMoveData.open).toFixed(2)} {' '}</span>
                            </span>
                            <span>
                                H
                                <span className={`${(mouseMoveData.open <= mouseMoveData?.close) ? 'green' : 'red'}`}>{' '} {parseFloat(mouseMoveData.high).toFixed(2)} {' '}</span>
                            </span>
                            <span>
                                L
                                <span className={`${(mouseMoveData.open <= mouseMoveData?.close) ? 'green' : 'red'}`}>{' '} {parseFloat(mouseMoveData.low).toFixed(2)} {' '}</span>
                            </span>
                            <span>
                                C
                                <span className={`${(mouseMoveData.open <= mouseMoveData?.close) ? 'green' : 'red'}`}>{' '} {parseFloat(mouseMoveData.close).toFixed(2)} {' '}</span>
                            </span>

                            <span>
                                Change
                                <span className={`${(mouseMoveData.open <= mouseMoveData?.close) ? 'green' : 'red'}`}>
                                    {`${parseFloat(mouseMoveData.close - mouseMoveData.open).toFixed(2)} 
                                    (${parseFloat(((mouseMoveData.close - mouseMoveData.open) / mouseMoveData.open) * 100).toFixed(2)
                                        }%)`}
                                </span>
                            </span>   
                            {/* <img color="white" src={ResetImg} onClick={resetLines}/>  */}
                        </h6> : ""}
                      </div>
                      {/* <hr></hr> */}
                      <div className="parent">
                                <div id="chart" className="child"  style={{ cursor: `${cursorBool ? 'grab' : 'crosshair'}` }}
                                    ref={trading_chart}
                                     />

                                    {loading ?  
                                       <div className="chartloader">
                                         <div className="spinner-border" style={{color:"var(--ex-green)"}} role="status">
                                           {/* <span className="sr-only"></span> */}
                                         </div>
                                       </div>
                                    :''}
                      </div>
        </div>
    </>
  );
};
