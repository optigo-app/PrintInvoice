import React from 'react';
import img from "../../assets/img/error/error.webp";

const ErrorPage = () => {
  return (
    <div style={{background: "#5ce1e7", width: "100%", height: "100%", minHeight: "100vh"}}>
        <img src={img} alt='error-page' className='object-fit-contain' style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}/>
        </div>
  )
}

export default ErrorPage