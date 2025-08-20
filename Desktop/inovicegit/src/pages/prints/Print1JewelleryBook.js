// http://localhost:3000/?tkn=...
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../../assets/css/prints/Print1JewelleryBook.css";
import {
  apiCallHopsCoach,
  checkMsg,
  isObjectEmpty,
  handlePrint,
  handleImageError,
  fixedValues,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";

export default function Print1JewelleryBook({
  token,
  SpNo,
  SpVer,
  SV,
  evn,
  printName,
  urls,
}) {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [withImage, setWithImage] = useState(true);
  const [checkedItems, setCheckedItems] = useState({
    "On Hand": true,
    "Sold": false,
    "In Memo": false,
    "Purchase Return": false,
    "In Repair": false,
  });
  console.log('checkedItems: ', checkedItems);

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCallHopsCoach({
          token,
          SpNo,
          SpVer,
          SV,
          evn,
          urls,
        });

        if (data?.Status === "200") {
          const isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setResult(data?.Data);
          } else {
            setMsg("Data Not Found");
          }
        } else {
          const err = checkMsg(data?.Message);
          setMsg(err || data?.Message || "Unexpected error");
        }
      } catch (error) {
        console.error("API call error:", error);
        setMsg("Something went wrong.");
      } finally {
        setLoader(false);
      }
    };

    sendData();
  }, [token, SpNo, SpVer, SV, evn, urls]);

  const loadData = (res) => {
    const statusPriority = {
      Sold: 1,
      "In Memo": 2,
      "On Hand": 3,
      "Purchase Return": 4,
      "In Repair": 5,
    };

    const extractPrefix = (str) => {
      const match = str?.match(/^[A-Za-z\-]+/); // prefix like "b-book"
      return match ? match[0].toUpperCase() : "ZZZ";
    };

    const extractNumber = (str) => {
      const match = str?.match(/\d+/); // numeric part
      return match ? parseInt(match[0], 10) : 0;
    };

    if (Array.isArray(res?.DT)) {
      res.DT.sort((a, b) => {
        const aPriority = statusPriority[a?.Status] || 99;
        const bPriority = statusPriority[b?.Status] || 99;

        if (aPriority !== bPriority) return aPriority - bPriority;

        const nameA = (a?.Customer || "").toUpperCase();
        const nameB = (b?.Customer || "").toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        const invoiceA = a?.InvoiceNo || "";
        const invoiceB = b?.InvoiceNo || "";

        const prefixA = extractPrefix(invoiceA);
        const prefixB = extractPrefix(invoiceB);

        if (prefixA < prefixB) return -1;
        if (prefixA > prefixB) return 1;

        const numA = extractNumber(invoiceA);
        const numB = extractNumber(invoiceB);

        return numA - numB;
      });
    }
    setResult(res);
  };

  const handlePrintWithAllData = () => {
    if (!result?.DT?.length) return;
    setVisibleCount(result.DT.length);
    let attempts = 0; const maxAttempts = 200; // ~200 frames (~3s @60fps) 
    const waitForDOM = () => {
      requestAnimationFrame(() => {
        attempts++; const items = document.querySelectorAll(".col1");
        if (items?.length >= result?.DT?.length || attempts > maxAttempts) { handlePrint(); }
        else { waitForDOM(); }
      });
    };
    waitForDOM();
  };

  // Incrementally load items in batches to avoid heavy rendering at once
  useEffect(() => {
    if (!result?.DT?.length) return;

    let currentCount = visibleCount;
    const batchSize = 2000; // larger batch for fewer updates
    const intervalDelay = 100; // smoother interval

    const interval = setInterval(() => {
      currentCount += batchSize;

      if (currentCount >= result.DT.length) {
        currentCount = result.DT.length;
        clearInterval(interval);
      }

      setVisibleCount(currentCount);
    }, intervalDelay);

    return () => clearInterval(interval);
  }, [result]);

  const handleImageHideShow = useCallback(() => {
    setWithImage(!withImage);
  }, [withImage])

  const handleCheckedChange = useCallback((e) => {
    setCheckedItems({
      ...checkedItems,
      [e.target.name]: e.target.checked,
    });
  }, [checkedItems]);

  const visibleItems = useMemo(() => {
    const filteredItems = result?.DT?.filter(item => {
      const status = item?.Status || "";
      return checkedItems[status] || (status === "On Hand" && checkedItems["On Hand"]);
    });
    return filteredItems?.slice(0, visibleCount) || [];
  }, [result, checkedItems, visibleCount]);

  const imgPath =
    result?.DT1?.[0]?.ImageUploadLogicalPath || "";

  return (
    loader ? (
      <Loader />
    ) : msg === "" ? (
      <>
        <div className="w-full fil_sec">
          <div className="w-full flex prnt_btn mb-1">
            <input
              type="button"
              className="btn_white blue mt-0"
              value="Print"
              onClick={(e) => handlePrintWithAllData(e)}
            />
          </div>
          <div className="w-full flex justify-center align-center gap-4 mb-2">
            <label htmlFor="checked" className="inline-flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={checkedItems["On Hand"]}
                onChange={handleCheckedChange}
                name="On Hand"
                id="StatusOnHand"
              />
              On Hand
            </label>
            <label htmlFor="checked" className="inline-flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={checkedItems["Sold"]}
                onChange={handleCheckedChange}
                name="Sold"
                id="StatusSold"
              />
              Sold
            </label>
            <label htmlFor="checked" className="inline-flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={checkedItems["In Memo"]}
                onChange={handleCheckedChange}
                name="In Memo"
                id="StatusInMemo"
              />
              In Memo
            </label>
            <label htmlFor="checked" className="inline-flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={checkedItems["Purchase Return"]}
                onChange={handleCheckedChange}
                name="Purchase Return"
                id="StatusPurchaseReturn"
              />
              Purchase Return
            </label>
            <label htmlFor="checked" className="inline-flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={checkedItems["In Repair"]}
                onChange={handleCheckedChange}
                name="In Repair"
                id="StatusInRepair"
              />
              In Repair
            </label>
            <label htmlFor="checked" className="inline-flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={withImage}
                onChange={handleImageHideShow}
                name="WithImage"
                id="WithImage"
              />
              with Image
            </label>
          </div>
        <p className="text-center">Total: {visibleItems?.length}</p>
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="container disflx">
            {visibleItems?.map((e, i) => (
              <div key={i} className="col1 brbxAll spfntbH pagBrkIns">
                <div className="w-100 brBtom spaclftTpm spacBtom spfntHead">{e?.Customer}</div>
                {withImage && (
                  <div className="w-100 brBtom imgwdtheit">
                    {e?.ImageName !== "" && (
                      <img
                        src={imgPath + "/" + e?.ImageName}
                        loading="lazy"
                        alt="Design_Image"
                        onError={handleImageError}
                      />
                    )}
                  </div>
                )}
                <div className="w-100 spaclftTpm">
                  <div className="w-100 spfntBld spbrWord spfntHead">{e?.DesNo}</div>
                </div>

                <div className="w-100 disflxCen spaclftTpm">
                  <div className="wdth_45 spbrWord">{e?.Status}</div>
                  {e?.JobNo !== "" ? (
                    <div className="spfntBld">|</div>
                  ) : null}
                  <div className="wdth_55 spacrighTpm spbrWord">{e?.JobNo}</div>
                </div>

                <div className="w-100 disflxCen spaclftTpm">
                  {e?.Metal_Type && (
                    <div className="wdth_45 spbrWord">{e?.Metal_Type}</div>
                  )}
                  {e?.Metal_Type ? (<div>|</div>) : null}
                  <div className={`${e?.Metal_Type !== "" ? "wdth_55 spacrighTpm" : "w-100 spfntlft"} spbrWord`}>
                    G.WT: {fixedValues(e?.Gross_Wt, 3)} gm
                  </div>
                </div>

                <div className="w-100 disflxCen spaclftTpm">
                  {e?.Metal_Color && (
                    <div className="wdth_45 spbrWord">{e?.Metal_Color}</div>
                  )}
                  {e?.Metal_Color ? (<div>|</div>) : null}
                  <div className={`${e?.Metal_Type !== "" ? "wdth_55 spacrighTpm" : "w-100 spfntlft"} spbrWord`}>
                    N.WT: {fixedValues(e?.Metal_Wt, 3)} gm
                  </div>
                </div>

                {(e?.Diam_Ctw || e?.CS_Ctw) ? (
                  <div className="w-100 disflxCen spaclftTpm">
                    <div className="wdth_45 spbrWord">
                      DIA: {e?.Diam_Ctw ? (`${fixedValues(e?.Diam_Ctw, 3)}`) : null}
                    </div>
                    {e?.CS_Ctw || e?.Misc_Ctw ? (<div>|</div>) : null}
                    <div className="wdth_55 spacrighTpm spbrWord">
                      {e?.CS_Ctw ? (`CS: ${fixedValues(e?.CS_Ctw, 3)}`) : e?.Misc_Ctw ? (`MISC: ${fixedValues(e?.Misc_Ctw, 3)}`) : null}
                    </div>
                  </div>
                ) : null}

                {e?.CS_Ctw && e?.Misc_Ctw ? (
                  <div className="w-100 disflx spaclftTpm spbrWord">
                    MISC: {fixedValues(e?.Misc_Ctw, 3)}
                  </div>
                ) : (null)}

                {e?.Inwardno ? (
                  <div className="w-100 disflx spaclftTpm spbrWord">
                    Inward: {e?.Inwardno}
                  </div>
                ) : (null)}

                {e?.Status === "Sold" && (
                  <div className="w-100 spbrWord disflx spaclftTpm">
                    Sale: {e?.InvoiceNo}
                  </div>
                )}

                {e?.Status === "In Memo" && (
                  <div className="w-100 disflx spbrWord spaclftTpm">
                    Memo: {e?.InvoiceNo}
                  </div>
                )}

                {e?.Status === "In Repair" && (
                  <div className="w-100 disflx spaclftTpm spbrWord">
                    Repair: {e?.InvoiceNo}
                  </div>
                )}

                {e?.Status === "Purchase Return" && (
                  <div className="w-100 disflx spaclftTpm spbrWord">
                    Pur. Return: {e?.InvoiceNo}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      </>
    ) : (
      <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
        {msg}
      </p>
    )
  )
}
