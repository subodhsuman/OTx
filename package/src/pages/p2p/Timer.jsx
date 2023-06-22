import React from 'react'
import { useEffect, useState } from 'react';

function Timer({expiry,setorderStatus}) {
    const [time, setTime] = useState({min:"00", sec:"00"});

    useEffect(()=>{
        const interval = setInterval(function () {
            let now = new Date().getTime();
            let timer = Number(expiry);
            if (timer) {
                let Finalseconds = new Date((timer)).getTime();
                let distance = Finalseconds - now;
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    
                if (seconds < 0 && minutes < 0) {
                    seconds = 0;
                    minutes = 0;
                }
    
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (minutes == 0 && seconds == 0) {
                    setorderStatus(true)
                }
                setTime({min:minutes,sec:seconds});
                
            }
        }, 1000);
    
        return () => clearInterval(interval);
    },[expiry])

  return (
    <>
    <a href="#" className="text-decoration-none">{time.min}</a>&nbsp;:&nbsp;<a href="#" className="text-decoration-none">{time.sec}</a>
    </>
  )
}

export default Timer