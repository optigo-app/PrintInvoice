import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import Loader from "../components/Loader";
import { Helmet } from "react-helmet-async";
// import "../assets/css/prints/commoncssprint.css";
// import { Helmet } from "react-helmet";
const AllDesignPrint = () => {
  const [importedComponent, setImportedComponent] = useState(null);
  const queryString = window.location.search;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryParams = new URLSearchParams(queryString);
  const printname = queryParams.get("pnm");
  let etp = queryParams.get("etp");
  const [faviconIcon, setFaviconIcon] = useState(null);

  useEffect(() => {
      setFaviconIcon(atob(queryParams?.get("Fv")))
    }, [faviconIcon])
    
  const [isFaviconLoaded, setIsFaviconLoaded] = useState(true);

  if (etp === null) {
    etp = "cHJpbnQ=";
  }

  let printName = atob(printname).toLowerCase();
  let etpType = atob(etp).toLowerCase();

  const importComponent = async (name) => {
    try {
      const module = await import(`./prints/${name}`);
      const AnotherComponent = module?.default;
      const billNum = queryParams.get("billNo");
      const urls = queryParams.get("up");
      const token = queryParams.get("tkn");
      const invoiceno = queryParams.get("invn");
      const evn = queryParams.get("evn");
      const fv = atob(queryParams.get("Fv"));
      const ApiVer = queryParams.get("ctv");
      return (
        <AnotherComponent
          billNumber={billNum}
          urls={atob(urls)}
          token={token}
          invoiceNo={invoiceno}c
          printName={printname}
          evn={evn}
          ApiVer = {ApiVer}
        />
      );
    } catch (error) {
      console.log(error);
    }
  };
  const takePrint = async () => {
    let module = await import(`../GlobalFunctions/PrintImports`);
    let conditions = [];
    // if (etpType === "print") {
    //   conditions = module.printConditions;
    // } else if (etpType === "excel") {
    //   conditions = module.excelConditions;
    // } else if (etpType === "alteration") {
    //   conditions = module.alterationConditions;
    // } else if (etpType === "alteration receive") {
    //   conditions = module.alterationReceiveConditions;
    // }
    switch (etpType) {
      case "print":
        conditions = module.printConditions;
        break;
      case "excel":
        conditions = module.excelConditions;
        break;
      case "alteration":
        conditions = module.alterationConditions;
        break;
      case "alteration receive":
        conditions = module.alterationReceiveConditions;
        break;
      default:
        break;
    }
    let findPrint = conditions.find((e) => printName === e?.printName);
    if (findPrint) {
      const component = await importComponent(findPrint.componentName);
      setImportedComponent(component);
    }
  };

  const checkFavicon = () => {
    setIsFaviconLoaded(true);
  };

  const handleFaviconError = () => {
    setIsFaviconLoaded(false);
  };

  const checkFaviconUrl = async () => {
    try {
      const response = await fetch(faviconIcon, { method: "HEAD" });
      if (!response.ok) {
        handleFaviconError();
      }
    } catch (error) {
      handleFaviconError();
    }
  };
  useEffect(() => {
    takePrint();
    checkFaviconUrl();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Suspense fallback={<Loader />}>{importedComponent}</Suspense>
      {faviconIcon && isFaviconLoaded && (
        <Helmet>
          <link
            rel="icon"
            href={faviconIcon}
            onLoad={checkFavicon}
            onError={handleFaviconError}
          />
        </Helmet>
      )}
    
    </>
  );
};
export default AllDesignPrint;
