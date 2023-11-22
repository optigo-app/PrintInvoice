import React, { useEffect, useState } from 'react';
const AllDesignPrint = () => {
  const [importedComponent, setImportedComponent] = useState(null);
  const queryString = window.location.search;
  const queryParams = new URLSearchParams(queryString);
  const printname = queryParams.get('pnm');
  let etp = queryParams.get('etp');
  if (etp === null) {
    etp = "cHJpbnQ="
  }
  let printName = atob(printname).toLowerCase();
  let etpType = atob(etp).toLowerCase();
  const importComponent = async (name) => {
    try {
      const module = await import(`./prints/${name}`);
      const AnotherComponent = module.default;
      const billNum = queryParams.get('billNo');
      const urls = queryParams.get('up');
      const token = queryParams.get('tkn');
      const invoiceno = queryParams.get('invn');
      const evn = queryParams.get('evn');
      setImportedComponent(<AnotherComponent billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />);
    } catch (error) {
      console.log(error);
    }
  };
  const takePrint = async () => {
    let module = await import(`../GlobalFunctions/PrintImports`);
    const conditions = etpType === "print" ? module.printConditions : module.excelConditions;
    let findPrint = conditions.find(e => printName === e?.printName);
    if (findPrint) {
      importComponent(findPrint.componentName);
    }
  }
  useEffect(() => {
    takePrint();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>{importedComponent} </>
  );
};
export default AllDesignPrint;