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
  const eventName = queryParams.get("evn");
  let etp = queryParams.get("etp");
  const [faviconIcon, setFaviconIcon] = useState(null);
  const [isFaviconLoaded, setIsFaviconLoaded] = useState(true);

  useEffect(() => {
      setFaviconIcon(atob(queryParams?.get("Fv")))
  }, [faviconIcon])
    
  if (etp === null) {
    etp = "cHJpbnQ=";
  }

  let printName = atob(printname)?.toLowerCase();
  let etpType = atob(etp)?.toLowerCase();
  let evnname = atob(eventName).toLowerCase();

  const importComponent = async (name) => {
    try {
      const module = await import(`./prints/${name}`);
      // const module = await import(`./SalesPrint/SalePrint1`);
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
          invoiceNo={invoiceno}
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
    switch (etpType) {
      case "excel":
        conditions = module.excelConditions;
        break;
      case "print":
        conditions = checkEvName(etpType, evnname, module);
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

    let findPrint = conditions.find((e) => printName?.toLowerCase() === e?.printName?.toLowerCase());
    if (findPrint) {
      const component = await importComponent(findPrint.componentName);
      setImportedComponent(component);
    }
  };
  // const checkEvName = (etpType, evnname, module) => {
  //     if(etpType === 'print' && evnname === 'sale'){
  //       return module.printConditions || []
  //     }
  //     if(etpType === 'print' && evnname === 'sale return'){
  //       return module.SaleReturn || []
  //     }
  //     if(etpType === 'print' && evnname === 'quote'){
  //       return module.QuotationPrints || []
  //     }
  //     if(etpType === 'print' && evnname === 'alteration receive'){
  //       return module.alterationArray || []
  //     }
  //     if(etpType === 'print' && evnname === 'alteration'){
  //       return module.alterationArray || []
  //     }
  //     if(etpType === 'print' && evnname === 'memo'){
  //       return module.MemoPrints || []
  //     }
  //     if(etpType === 'print' && evnname === 'memo return'){
  //       return module.MemoReturnPrints || []
  //     }
  //     if(etpType === 'print' && evnname === 'estimate'){
  //       return module.EstimatePrints || []
  //     }
  //     if(etpType === 'print' && evnname === 'hallmark'){
  //       return module.HallMarkPrints || []
  //     }
  //     if(etpType === 'print' && evnname === 'shipment'){
  //       return module.ShipmentArray || []
  //     }
  //     if(etpType === 'print' && evnname === 'material sale'){
  //       return module.MaterialSale || []
  //     }
  //     if(etpType === 'print' && evnname === 'orders'){
  //       return module.ordersArray || []
  //     }
  //     if(etpType === 'print' && evnname === 'fgpurchase'){
  //       return module.fgPurchase || []
  //     }
  //     if(etpType === 'print' && evnname === 'fgpurchase return'){
  //       return module.fgPurchaseReturn || []
  //     }
  // }
  const checkEvName = (etpType, evnname, module) => {
    if (etpType !== 'print') return [];
    const eventMappings = {
      'sale': module?.printConditions || [],
      // 'sale': module?.Sales || [],
      'sale return': module?.SaleReturn || [],
      'quote': module?.QuotationPrints || [],
      'alteration receive': module?.alterationArray || [],
      'alteration': module?.alterationArray || [],
      'memo': module?.MemoPrints || [],
      'memo return': module?.MemoReturnPrints || [],
      'estimate': module?.EstimatePrints || [],
      'hallmark': module?.HallMarkPrints || [],
      'shipment': module?.ShipmentArray || [],
      'material sale': module?.MaterialSale || [],
      'orders': module?.ordersArray || [],
      'fg purchase': module?.fgPurchase || [],
      'fg purchase return': module?.fgPurchaseReturn || []
    };
  
    return eventMappings[evnname] || [];
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
        setIsFaviconLoaded(false);
      }
    } catch (error) {
      handleFaviconError();
      setIsFaviconLoaded(false);
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