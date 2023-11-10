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
       
//     switch (true) {
//       case (printName === "summary 4" && etpType === "print"):
//              importComponent('Summary4'); break;
//       case (printName === "summary 12" && etpType === "print"):
//              importComponent('Summary12'); break;
//       case (printName === "tax invoice 1" && etpType === "print"):
//              importComponent('TaxInvoice1'); break;
//       case (printName === "packing list 3" && etpType === "print"):
//              importComponent('PackingList3'); break;
//       case (printName === "misc print 1" && etpType === "print"):
//              importComponent('MiscPrint1'); break;
//       case (printName === "estimate print" && etpType === "print"):
//              importComponent('EstimatePrint'); break;
//       case ((printName === "retail" || printName === "retail1 print" || printName === "retail print 1") && etpType === "print"):
//              importComponent('RetailPrint'); break;
//       case (printName === "detail print 11" && etpType === "print"):
//              importComponent('DetailPrint11'); break;
//       case (printName === "invoice print" && etpType === "print"):
//              importComponent('InvoicePrint'); break;
//       case ((printName === "item wise print" || printName === "item wise print1" || printName === "item wise print2")  && etpType === "print"):
//              importComponent('ItemWisePrint'); break;
//       case (printName === "jewellery item wise" && etpType === "print"):
//              importComponent('HallmarkItemWisePrint'); break;
//       case ((printName === "jewellary invoice print" || printName === "labour print") && etpType === "print"):
//              importComponent('JewelleryInvoicePrint'); break;
//       case (printName === "detail print 12" && etpType === "print"):
//              importComponent('DetailPrint12'); break;
//       case (printName === "export declaration form" && etpType === "print"):
//              importComponent('ExportDeclarationForm'); break;
//       case (printName === "packing list" && etpType === "print"):
//              importComponent('PackingList'); break;
//       case (printName === "summary 1" && etpType === "print"):
//              importComponent('Summary1'); break;
//       case (printName === "jewellery invoice" && etpType === "print"):
//              importComponent('JewelleryInvoice'); break;
//       case (printName === "invoice print 2" && etpType === "print"):
//              importComponent('InvoicePrint2'); break;
//       case (printName === "invoice print3" && etpType === "print"):
//              importComponent('InvoicePrint3'); break;
//       case (printName === "tax invoice" && etpType === "print"):
//              importComponent('TaxInvoice'); break;
//       case (printName === "rough estimate" && etpType === "print"):
//              importComponent('RoughEstimate'); break;
//       case (printName === "export" && etpType === "print"):
//              importComponent('Export'); break;
//       case (printName === "export print" && etpType === "print"):
//              importComponent('ExportPrint'); break;
//       case (printName === "export print 1" && etpType === "print"):
//              importComponent('ExportPrint1'); break;
//       case (printName === "summary 13" && etpType === "print"):
//              importComponent('Summary13'); break;
//       case (printName === "jewellery retail invoice c" && etpType === "print"):
//              importComponent('JewelleryRetailInvoicePrintc'); break;
//       case (printName === "retail invoice print 4" && etpType === "print"):
//              importComponent('RetailInvoicePrint4'); break;
//       case (printName === "invoice print r" && etpType === "print"):
//              importComponent('InvoicePrint4Clone'); break;
//       case (printName === "manufacture mgt" && etpType === "print"):
//              importComponent('ManufactureMgt'); break;
//       case (printName === "retail tax invoice" && etpType === "print"):
//              importComponent('RetailTaxInvoice'); break;
//       case (printName === "summary print s" && etpType === "print"):
//              importComponent('Summarys'); break;
//       case (printName === "summary 11" && etpType === "print"):
//              importComponent('Summary11'); break;
//       case ((printName === "retail invoice 2" || printName === "retail invoice 3") && etpType === "print"):
//              importComponent('RetailInvoice2_3'); break;
//       case (printName === "sale format b" && etpType === "excel"):
//              importComponent('ExcelToJsonDownload'); break;
//       case (printName === "sale format s" && etpType === "excel"):
//              importComponent('ExcelToJsonDownloads'); break;
//       case (printName === "sale format a" && etpType === "excel"):
//              importComponent('ExcelToJsonDownloadA'); break;
//       case (printName === "sale format j1" && etpType === "excel"):
//              importComponent('ExcelToJsonDownloadJ1'); break;
//       default:
//         break;
//     }
  }

  useEffect(() => {
    takePrint();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>{importedComponent}
      {/* {(printName === "manufacture mgt" && etpType === "print") && <ManufactureMgt billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "retail tax invoice" && etpType === "print") && <RetailTaxInvoice billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {((printName === "retail invoice 2" || printName === "retail invoice 3") && etpType === "print") && <RetailInvoice2_3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "summary print s" && etpType === "print") && <Summarys billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "summary 11" && etpType === "print") && <Summary11 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "summary 4" && etpType === "print") && <Summary4 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "summary 12" && etpType === "print") && <Summary12 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "tax invoice 1" && etpType === "print") && <TaxInvoice1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "packing list 3" && etpType === "print") && <PackingList3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "misc print 1" && etpType === "print") && <MiscPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {((printName === "estimate print") && etpType === "print") && <EstimatePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {((printName === "retail" || printName === "retail1 print" || printName === "retail print 1") && etpType === "print") && <RetailPrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "detail print 11" && etpType === "print") && <DetailPrint11 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {((printName === "detail print1 (l)" || printName === "detail print1 (p)"  || printName === "detail print r") && etpType === "print") && <DetailPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "invoice print" && etpType === "print") && <InvoicePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {((printName === "item wise print" || printName === "item wise print1" || printName === "item wise print2") && etpType === "print") && <ItemWisePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} /> } */}
      {/* {(printName === "jewellery item wise" && etpType === "print") && <HallmarkItemWisePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {((printName === "jewellary invoice print" || printName === "labour print") && etpType === "print") && <JewelleryInvoicePrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "detail print 12" && etpType === "print") && <DetailPrint12 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "export declaration form" && etpType === "print") && <ExportDeclarationForm billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "packing list" && etpType === "print") && <PackingList billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "summary 1" && etpType === "print") && <Summary1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "jewellery invoice" && etpType === "print") && <JewelleryInvoice billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "invoice print 2" && etpType === "print") && <InvoicePrint2 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "invoice print3" && etpType === "print") && <InvoicePrint3 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "tax invoice" && etpType === "print") && <TaxInvoice billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "rough estimate" && etpType === "print") && <RoughEstimate billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "export" && etpType === "print") && <Export billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "export print" && etpType === "print") && <ExportPrint billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "export print 1" && etpType === "print") && <ExportPrint1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "summary 13" && etpType === "print") && <Summary13 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "jewellery retail invoice c" && etpType === "print") && <JewelleryRetailInvoicePrintc billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "retail invoice print 4" && etpType === "print") && <RetailInvoicePrint4 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "invoice print r" && etpType === "print") && <InvoicePrint4Clone billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "sale format b" && etpType === "excel") && <ExcelToJsonDownload billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "sale format s" && etpType === "excel") && <ExcelToJsonDownloads billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "sale format a" && etpType === "excel") && <ExcelToJsonDownloadA billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
      {/* {(printName === "sale format j1" && etpType === "excel") && <ExcelToJsonDownloadJ1 billNumber={billNum} urls={atob(urls)} token={token} invoiceNo={invoiceno} printName={printname} evn={evn} />} */}
    </>
  );
};

export default AllDesignPrint;