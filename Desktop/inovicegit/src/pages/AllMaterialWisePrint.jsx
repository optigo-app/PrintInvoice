import queryString from "query-string";
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
// import EngageMat from './bagPrints/jobBagStickers/EngageMat';

const AllMaterialWisePrint = () => {
  const location = useLocation();
  const [importedComponent, setImportedComponent] = useState(null);
  const queryParams = queryString?.parse(location.search);
  const printName = queryParams?.printname?.toLowerCase();
  const queries = {
    YearCode: queryParams.YearCode,
    appuserid: queryParams.appuserid,
    custid: queryParams.custid,
    ifid: queryParams.ifid,
    pid: queryParams.pid,
    printname: queryParams.printname,
    version: queryParams.version,
    url: queryParams.report_api_url,
    pageStart: +queryParams.start_page,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: "",
    YearCode: queries.YearCode,
    version: queries.version,
  };
  const ImportComponent = async (name) => {
    console.log(name);
    try {
      // const module = await import(`./bagPrints/${name}`);
      const module = await import(`./materialSale/MatPurchase`);
      console.log(module);
      const AnotherComponent = module?.default;
      console.log(AnotherComponent);
      return <AnotherComponent queries={queries} headers={headers} />;
    } catch (error) {
      console.log(error);
    }
  };

  const takeBagPrints = async () => {
    let module = await import("../GlobalFunctions/materialSaleConditions");
    console.log(module);
    let conditions = module?.materialSaleConditions;
    console.log(conditions);
    let findBagPrint = conditions?.find((e) => e?.printName === "bag print 10");
    if (findBagPrint) {
      const component = await ImportComponent(findBagPrint?.componentName);
      setImportedComponent(component);
    }
  };
  useEffect(() => {
    takeBagPrints();
  }, []);
  return <div>{importedComponent}</div>;
};


export default AllMaterialWisePrint;