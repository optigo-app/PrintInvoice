import React, { useEffect, useState } from 'react';
const AllDesignPrint = () => {
  const [importedComponent, setImportedComponent] = useState(null);
  const queryString = window.location.search;
  const queryParams = new URLSearchParams(queryString);
  // const param = queryParams.get('bill');
  const billNum = queryParams.get('billNo');
  const urls = queryParams.get('up');
  const token = queryParams.get('tkn');
  const invoiceno = queryParams.get('invn');
  const printname = queryParams.get('pnm');
  const evn = queryParams.get('evn');
  let etp = queryParams.get('etp');
  if(etp === null) {
    etp = "cHJpbnQ="
  }
  let printName = atob(printname).toLowerCase();
  let etpType = atob(etp).toLowerCase();
  const importComponent = async (name) => {
       try {       
              console.log(name);
              const module = await import(`./prints/${name}`);
              console.log(module);
              console.log(module.default.name);
              console.log(module.default);
              const AnotherComponent = module.default;
              setImportedComponent(<AnotherComponent billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn}/>);
       } catch (error) {
              console.log(error);  
       }
  };

  const takePrint = () => {
       const printConditions = [
              { printName: "summary 4", etpType: "print", componentName: "Summary4" },
              { printName: "summary 12", etpType: "print", componentName: "Summary12" },
              { printName: "tax invoice 1", etpType: "print", componentName: "TaxInvoice1" },
              { printName: "packing list 3", etpType: "print", componentName: "PackingList3" },
              { printName: "misc print 1", etpType: "print", componentName: "MiscPrint1" },
              { printName: "estimate print", etpType: "print", componentName: "EstimatePrint" },
              { printName: "retail", etpType: "print", componentName: "RetailPrint" },
              { printName: "retail1 print", etpType: "print", componentName: "RetailPrint" },
              { printName: "retail print 1", etpType: "print", componentName: "RetailPrint" },
              { printName: "detail print 11", etpType: "print", componentName: "DetailPrint11" },
              { printName: "invoice print", etpType: "print", componentName: "InvoicePrint" },
              { printName: "item wise print", etpType: "print", componentName: "ItemWisePrint"},
              { printName: "item wise print1", etpType: "print", componentName: "ItemWisePrint"},
              { printName: "item wise print2", etpType: "print", componentName: "ItemWisePrint"},
              { printName: "jewellery item wise", etpType: "print", componentName: "HallmarkItemWisePrint"},
              { printName: "jewellary invoice print", etpType: "print", componentName: "JewelleryInvoicePrint"},
              { printName: "labour print", etpType: "print", componentName: "JewelleryInvoicePrint"},
              { printName: "detail print 12", etpType: "print", componentName: "DetailPrint12"},
              { printName: "export declaration form", etpType: "print", componentName: "ExportDeclarationForm"},
              { printName: "packing list", etpType: "print", componentName: "PackingList"},
              { printName: "summary 1", etpType: "print", componentName: "Summary1"},
              { printName: "jewellery invoice", etpType: "print", componentName: "JewelleryInvoice"},
              { printName: "invoice print 2", etpType: "print", componentName: "InvoicePrint2"},
              { printName: "invoice print3", etpType: "print", componentName: "InvoicePrint3"},
              { printName: "tax invoice", etpType: "print", componentName: "TaxInvoice"},
              { printName: "rough estimate", etpType: "print", componentName: "RoughEstimate"},
              { printName: "export", etpType: "print", componentName: "Export"},
              { printName: "export print", etpType: "print", componentName: "ExportPrint"},
              { printName: "export print 1", etpType: "print", componentName: "ExportPrint1"},
              { printName: "summary 13", etpType: "print", componentName: "Summary13"},
              { printName: "jewellery retail invoice c", etpType: "print", componentName: "JewelleryRetailInvoicePrintc"},
              { printName: "retail invoice print 4", etpType: "print", componentName: "RetailInvoicePrint4"},
              { printName: "invoice print r", etpType: "print", componentName: "InvoicePrint4Clone"},
              { printName: "manufacture mgt", etpType: "print", componentName: "ManufactureMgt"},
              { printName: "retail tax invoice", etpType: "print", componentName: "RetailTaxInvoice"},
              { printName: "summary print s", etpType: "print", componentName: "Summarys"},
              { printName: "summary 11", etpType: "print", componentName: "Summary11"},
              { printName: "retail invoice 2", etpType: "print", componentName: "RetailInvoice2_3"},
              { printName: "retail invoice 3", etpType: "print", componentName: "RetailInvoice2_3"},
              // Add more print conditions here
            ];
       const excelConditions = [
              { printName: "sale format b", etpType: "excel", componentName: "ExcelToJsonDownload" },
              { printName: "sale format s", etpType: "excel", componentName: "ExcelToJsonDownloads" },
              { printName: "sale format a", etpType: "excel", componentName: "ExcelToJsonDownloadA" },
              { printName: "sale format j1", etpType: "excel", componentName: "ExcelToJsonDownloadJ1" },
              // Add more excel conditions here
            ];

            const conditions = etpType === "print" ? printConditions : excelConditions;

       for (const condition of conditions) {
              if (printName === condition.printName && etpType === condition.etpType) {
                     importComponent(condition.componentName);
                     break; // Exit the loop after the first match
              }
       }

  }

  useEffect(() => {
    takePrint();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>{importedComponent}</>
  );
};

export default AllDesignPrint;