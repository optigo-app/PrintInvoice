// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=Mg==&evn=amV3ZWxsZXJ5Ym9vaw==&pnm=UHJpbnQ=&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvQ2VudHJhbEFwaQ==&sv=MA==&ctv=TGl2ZQ==
import React, { useEffect, useState } from "react";
import "../../assets/css/prints/PrintJewelleryBook.css";
import {
  apiCallHopsCoach,
  checkMsg,
  isObjectEmpty,
  handlePrint,
  handleImageError,
  fixedValues,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";

export default function PrintJewelleryBook({token, spNo, spVer, evn, sv, urls}) {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [visibleCount, setVisibleCount] = useState(100); // Load 100 items initially

  function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }
  
  const decodedToken  = atob(getParam("tkn"));
  const decodedSpNo   = atob(getParam("invn"));
  const decodedEvt    = atob(getParam("evn"));
  const decodedUrl    = atob(getParam("up"));
  const decodedSV     = atob(getParam("sv"));
  const decodedSpVer  = atob(getParam("ctv"));

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCallHopsCoach(decodedToken, decodedSpNo, decodedSpVer, decodedEvt, decodedSV, decodedUrl);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            setResult(data?.Data);
          } else {
            setMsg("Data Not Found");
          }
        } else {
          const err = checkMsg(data?.Message);
          setMsg(err || data?.Message);
        }
      } catch (error) {
        console.error("API call error:", error);
        setMsg("Something went wrong.");
      } finally {
        setLoader(false);
      }
    };

    sendData();
  }, []);



  const handlePrintWithAllData = () => {
    if (result?.DT?.length > visibleCount) {
      let current = visibleCount;
      const batchSize = 500;
  
      const interval = setInterval(() => {
        current += batchSize;
  
        if (current >= result.DT.length) {
          current = result.DT.length;
          clearInterval(interval);
  
          // Give time for DOM to render all data before printing
          setTimeout(() => {
            handlePrint();
          }, 3000);
        }
  
        setVisibleCount(current);
      }, 3000); // 1 second interval
    } else {
      handlePrint();
    }
  };
  
  
  // Automatically load the rest of the data after a short delay
  useEffect(() => {
    if (!result?.DT?.length) return;
  
    let currentCount = 100;
    const batchSize = 700;
  
    const interval = setInterval(() => {
      currentCount += batchSize;
  
      if (currentCount >= result.DT.length) {
        currentCount = result.DT.length;
        clearInterval(interval); // stop loading once done
      }
  
      setVisibleCount(currentCount);
    }, 1000); // load 700 per second
  
    return () => clearInterval(interval); // cleanup
  }, [result]);
  
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY || window.pageYOffset;
  //     const windowHeight = window.innerHeight;
  //     const fullHeight = document.documentElement.scrollHeight;

  //     if (scrollTop + windowHeight >= fullHeight - 1000) {
  //       setVisibleCount((prev) => {
  //         if (result && prev < result.DT.length) {
  //           return prev + 100;
  //         }
  //         return prev;
  //       });
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [result]);


  if (loader) return <Loader />;

  if (msg) return <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">{msg}</p>;

  const imgPath = result?.DT1?.map((e) => {return e?.ImageUploadLogicalPath})

  return (
    <>
      <div className="w-full flex">
        <div className="w-full flex prnt_btn">
          <input
            type="button"
            className="btn_white blue mt-0"
            value="Print"
            // onClick={(e) => handlePrint(e)}
            // onClick={handlePrintWithAllData}
            onClick={(e) => handlePrintWithAllData(e)}
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="container disflx">
          {result?.DT?.slice(0, visibleCount).map((e, i) => (
            <div key={i} className="col1 brbxAll spfntbH pagBrkIns">
              <div className="brBtom spaclftTpm">{e?.Customer}</div>
              <div className="w-100 brBtom imgwdtheit">
                {e?.ImageName !== "" && (<img
                  src={imgPath + "/" + e?.ImageName}
                  loading="eager"
                  alt={e?.Customer || "Image"}
                  onError={handleImageError} 
                />)}
              </div>
              <div className="w-100 spaclftTpm">
                <div className="wdth_50 spfntBld spbrWord">{e?.DesNo}</div>
                <div className="wdth_50"></div>
              </div>
              <div className="w-100 disflxCen spaclftTpm">
                <div className="wdth_50 spbrWord">{e?.Status}</div>
                {e?.JobNo !== "" && (<div className="spfntBld">|</div>)}
                <div className="wdth_50 spacrighTpm spbrWord">{e?.JobNo}</div>
              </div>
              <div className="w-100 disflxCen spaclftTpm">
                <div className="wdth_50 spbrWord">{e?.Metal_Type}</div>
                {e?.Gross_Wt && (<div>|</div>)}
                <div className="wdth_50 spacrighTpm spbrWord">G.WT: {fixedValues(e?.Gross_Wt,2)} gm</div>
              </div>
              <div className="w-100 disflxCen spaclftTpm">
                <div className="wdth_50 spbrWord">{e?.Metal_Color}</div>
                {e?.Metal_Wt && (<div>|</div>)}
                <div className="wdth_50 spacrighTpm spbrWord">N.WT: {fixedValues(e?.Metal_Wt,2)} gm</div>
              </div>
              <div className="w-100 disflxCen spaclftTpm">
                <div className="wdth_50 spbrWord">DIA: {fixedValues(e?.Diam_Ctw,3)}</div>
                {e?.CS_Ctw && (<div>|</div>)}
                <div className="wdth_50 spacrighTpm spbrWord">CS: {fixedValues(e?.CS_Ctw,3)}</div>
              </div>
              <div className="w-100 disflx spaclftTpm spbrWord">
                Inward: {e?.Inwardno}
              </div>
              {e?.Status === "Sold" && (<div className="w-100 spbrWord disflx spaclftTpm">
                Sale: {e?.InvoiceNo}
              </div>)}
              {e?.Status === "In Memo" && (<div className="w-100 disflx spbrWord spaclftTpm">
                Memo: {e?.InvoiceNo}
              </div>)}
              {e?.Status === "In Repair" && (<div className="w-100 disflx spaclftTpm spbrWord">
                Repair: {e?.InvoiceNo}
              </div>)}
              {e?.Status === "Purchase Return" && (<div className="w-100 disflx spaclftTpm spbrWord">
                Pur. Return: {e?.InvoiceNo}
              </div>)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
