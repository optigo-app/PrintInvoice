import React, { useEffect, useState } from "react";
import "../../assets/css/prints/PrintJewelleryBook.css";
import {
  apiCallHopsCoach,
  checkMsg,
  isObjectEmpty,
  handlePrint,
  handleImageError,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";

export default function PrintJewelleryBook() {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);

  function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  const token = atob(getParam("tkn"));
  const spNo = atob(getParam("invn"));
  const spVer = atob(getParam("ctv"));
  const urls = atob(getParam("up"));

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCallHopsCoach(token, spNo, spVer, urls);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
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

  const loadData = (data) => {
    setResult(data);
  };

  return (
    <div>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <>
        </>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </div>
  );
}
