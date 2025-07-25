// http://localhost:3001/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U0syMTA0MjAyNA==&evn=c2FsZQ==&pnm=RGVzaWduc2V0IFBhY2tpbmdsaXN0&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
import React, { useEffect, useState } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  handleGlobalImgError,
  handleImageError,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";
import sanitizeHtml from "sanitize-html";
import { htmlToText } from "html-to-text";
import { BorderBottom } from "@mui/icons-material";

const DesignsetPackinglistExcel = ({
  urls,
  token,
  invoiceNo,
  printName,
  evn,
  ApiVer,
}) => {
  const [result, setResult] = useState(null);
  const [result2, setResult2] = useState(null);
  const [result3, setResult3] = useState(null);
  const [diamondWise, setDiamondWise] = useState([]);
  const [responsejson, setResponsejson] = useState("");
  const [rowWise, setRowWise] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const [diaQlty, setDiaQlty] = useState(false);
  const [data, setData] = useState(null);

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(
          token,
          invoiceNo,
          printName,
          urls,
          evn,
          ApiVer
        );
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setResponsejson(data?.Data);
            setLoader(false);
          } else {
            setLoader(false);
            setMsg("Data Not Found");
          }
        } else {
          setLoader(false);
          const err = checkMsg(data?.Message);
          console.log(data?.Message);
          setMsg(err);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
  }, []);

  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    // Step 1: Sort resultArray by id
    datas?.resultArray?.sort((a, b) => a.SrNo - b.SrNo);

    // Step 2: Enhance each row (discount info)
    let enrichedArray = [];
    datas?.resultArray?.forEach((e) => {
      let obj = { ...e };
      let discountOn = [];

      if (e?.IsCriteriabasedAmount === 1) {
        if (e?.IsMetalAmount === 1) discountOn.push("Metal");
        if (e?.IsDiamondAmount === 1) discountOn.push("Diamond");
        if (e?.IsStoneAmount === 1) discountOn.push("Stone");
        if (e?.IsMiscAmount === 1) discountOn.push("Misc");
        if (e?.IsLabourAmount === 1) discountOn.push("Labour");
        if (e?.IsSolitaireAmount === 1) discountOn.push("Solitaire");
      } else {
        if (e?.Discount !== 0) discountOn.push("Total Amount");
      }

      obj.discountOn = discountOn;
      obj.str_discountOn = discountOn.join(", ") + "Amount";

      enrichedArray.push(obj);
    });

    // Step 3: Add designSetTotalAmount + DesigSetImage handling
    const finalArr = [];
    let i = 0;

    while (i < enrichedArray.length) {
      const current = enrichedArray[i];
      const { DesignSetGroup, DesignSetNo } = current;

      // 👇 Do not merge if DesignSetGroup === 0
      if (DesignSetGroup === 0) {
        finalArr.push({
          ...current,
          designSetTotalAmount: current.TotalAmount,
          DesigSetImage: "",
        });
        i++;
        continue;
      }

      let total = current.TotalAmount;
      let j = i + 1;

      // Check for consecutive duplicates
      while (
        j < enrichedArray.length &&
        enrichedArray[j].DesignSetGroup === DesignSetGroup &&
        enrichedArray[j].DesignSetNo === DesignSetNo &&
        enrichedArray[j].DesignSetGroup !== 0 // Avoid merging group 0
      ) {
        total += enrichedArray[j].TotalAmount;
        j++;
      }

      const isMerged = j - i > 1;

      finalArr.push({
        ...current,
        designSetTotalAmount: isMerged ? total : current.TotalAmount,
        DesigSetImage: isMerged ? current.DesigSetImage : "",
      });

      for (let k = i + 1; k < j; k++) {
        finalArr.push({
          ...enrichedArray[k],
          designSetTotalAmount: "",
          DesigSetImage: "",
        });
      }

      i = j;
    }

    // Step 4: Update result
    datas.resultArray = finalArr;

    console.log("datas: ", datas);
    setResult(datas);
    setData(datas);
    setLoader(false);

    setTimeout(() => {
      const button = document.getElementById("test-table-xls-button");
      button.click();
    }, 500);
  };

  useEffect(() => {
    if (diaQlty) {
      const updated = cloneDeep(result);

      updated.resultArray.forEach((e) => {
        // Merge duplicate diamonds
        const diaMap = new Map();
        e?.diamonds?.forEach((el) => {
          const key = el?.QualityName;
          if (!diaMap.has(key)) {
            diaMap.set(key, cloneDeep(el));
          } else {
            const existing = diaMap.get(key);
            existing.Wt += el.Wt;
            existing.Pcs += el.Pcs;
            existing.Amount += el.Amount;
          }
        });
        e.diamonds = Array.from(diaMap.values());

        // Merge duplicate colorstones
        const clrMap = new Map();
        e?.colorstone?.forEach((el) => {
          const key = `${el.ShapeName}|${el.SizeName}|${el.QualityName}|${el.Colorname}|${el.Rate}`;
          if (!clrMap.has(key)) {
            clrMap.set(key, cloneDeep(el));
          } else {
            const existing = clrMap.get(key);
            existing.Wt += el.Wt;
            existing.Pcs += el.Pcs;
            existing.Amount += el.Amount;
          }
        });
        e.colorstone = Array.from(clrMap.values());
      });

      setResult(updated);
    } else {
      setResult(data);
    }
  }, [diaQlty]);

  //styles and css
  const txtRt = {
    textAlign: "right",
  };
  const txtCen = {
    textAlign: "center",
  };
  const txtTop = {
    verticalAlign: "top",
  };
  const brRight = {
    borderRight: "1px solid #989898",
  };
  const brLeft = {
    borderLeft: "1px solid #989898",
  };
  const brTop = {
    borderTop: "1px solid #989898",
  };
  const brBotm = {
    borderBottom: "1px solid #989898",
  };
  const bgColor = {
    backgroundColor: "#F5F5F5",
  };
  const coWdth = {
    width: "80px",
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div style={{ paddingBottom: "5rem" }}>
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                  table="table-to-xls"
                  filename={`TaxInvoice_${result?.header?.InvoiceNo}_${Date.now()}`}
                  sheet="tablexls"
                  buttonText="Download as XLS"
                />
                <table id="table-to-xls">
                  <tbody>
                    <tr>
                      <td colSpan={22} width={132} height={132}>
                        {isImageWorking && result?.header?.PrintLogo !== "" && (
                          <div>
                            <img
                              src={result?.header?.PrintLogo}
                              alt=""
                              onError={handleImageErrors}
                              width={132}
                              height={132}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={22} style={{ ...txtCen }}>
                        <div>
                          {result?.header?.CompanyAddress}
                          {result?.header?.CompanyAddress2}
                          {result?.header?.CompanyCity} -{" "}
                          {result?.header?.CompanyPinCode}
                        </div>
                        <div>{result?.header?.PrintHeadLabel}</div>
                        {result?.header?.PrintRemark === "" ? (
                            ""
                          ) : (
                            <div>
                              <b dangerouslySetInnerHTML={{__html: result?.header?.PrintRemark?.replace(/<br\s*\/?>/gi," "),}}></b>
                            </div>
                          )}
                      </td>
                    </tr>

                    {/* table */}
                    <tr>
                      <th
                        style={{...brLeft,...brTop,...bgColor,}}
                      >
                        Sr
                      </th>
                      <th
                        style={{...brLeft,...brTop,...bgColor,}}>
                        Jewelcode
                      </th>
                      <th
                        style={{...brLeft,...brTop,...bgColor,}}
                      >
                        Design Set
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={5}
                      >
                        Diamond
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={5}
                      >
                        Metal
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={4}
                      >
                        Stone
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={2}
                      >
                        Labour
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={2}
                      >
                        Other Amount
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brRight,...bgColor,}}
                      >
                        Total
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{...coWdth,...brLeft,...brBotm,...brRight,...bgColor,}}
                      ></th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      ></th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      ></th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Shape
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Size
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Wt
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Rate
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        KT
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Gr Wt
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        NetWt
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Rate
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Shape
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Wt
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Rate
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Rate
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Code
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                    </tr>

                    {result?.resultArray?.map((e, i) => {
                      return ( 
                          <tr key={i}>
                            <td style={{ ...brRight, ...txtTop }} align="center">
                              {i + 1}
                            </td>
                            <td style={{ ...brRight, ...txtTop }} height={150}>
                              <div style={{ textAlign: "right" }}>
                                  {e?.JewelCodePrefix?.slice(0, 2) +
                                  e?.Category_Prefix?.slice(0, 2) +
                                  e?.SrJobno?.split("/")[1]}
                              </div>
                              <div>
                                <img
                                  src={`${e?.DesignImage}?resize=90x90`}
                                  alt="img"
                                  width="90"
                                  height="90"
                                  onError={(e) => handleImageError(e)}
                                />
                              </div>
                              <div>{e?.SrJobno}</div>
                              {e?.HUID === "" ? ( "" ) : (<div>HUID - {e?.HUID}</div>)}
                              {e?.lineid !== "" ? (<div>{e?.lineid}</div>) : ( "" )}
                            </td>
                            <td style={{ ...brRight, ...txtTop }} height={120}>
                              <div>
                                <img
                                  src={`e?.DesigSetImage?resize=90x90`}
                                  alt="packinglist"
                                  width="90"
                                  height="90"
                                  onError={(e) => handleImageError(e)}
                                />
                              </div>
                            </td>
                            {/* <td width={120} align="right" style={{ ...brRight, wordBreak: "break-word", paddingRight: "5px",}}>
                              &nbsp;{e?.SrJobno}&nbsp;
                            </td>
                            <td  align="left">
                              &nbsp;{e?.dia_code}
                            </td>
                            <td  align="left">
                              &nbsp;{`${e?.dia_size}`}
                            </td>
                            <td  align="right">
                              {e?.dia_pcs}
                            </td>
                            <td  align="right">
                              {e?.dia_wt === "" ? "" : (+e?.dia_wt)?.toFixed(3)}
                            </td>
                            <td  align="right">
                              {e?.dia_rate === ""
                                ? ""
                                : formatAmount(e?.dia_rate)}
                            </td>
                            <th
                              align="right"
                              
                              style={{ ...brRight }}
                            >
                              {e?.dia_amt === ""
                                ? ""
                                : formatAmount(e?.dia_amt)}
                            </th>
                            <td
                              
                              style={{ wordBreak: "break-word" }}
                              align="left"
                            >
                              &nbsp;{`${e?.met_quality}`}
                            </td>
                            <td  align="right">
                              {(+e?.met_wt)?.toFixed(3)}
                            </td>
                            <td  align="right">
                              {formatAmount(e?.met_rate)}
                            </td>
                            <th
                              align="right"
                              
                              style={{ ...brRight }}
                            >
                              {e?.met_amt}
                            </th>
                            <td  align="left">
                              &nbsp;{e?.cls_code}
                            </td>
                            <td  align="left">
                              &nbsp;{`${e?.cls_size}`}
                            </td>
                            <td  align="right">
                              {e?.cls_pcs}
                            </td>
                            <td  align="right">
                              {e?.cls_wt === "" ? "" : (+e?.cls_wt)?.toFixed(3)}
                            </td>
                            <td  align="right">
                              {e?.cls_rate === ""
                                ? ""
                                : formatAmount(e?.cls_rate)}
                            </td>
                            <th
                              align="right"
                              
                              style={{ ...brRight }}
                            >
                              {e?.cls_amt === "" ? "" : e?.cls_amt}
                            </th>
                            <td
                              
                              align="right"
                              style={{ ...brRight }}
                            >
                              {e?.oth_amt === 0 ? "" : formatAmount(e?.oth_amt)}
                            </td>
                            <td
                              
                              align="right"
                              style={{ ...brRight }}
                            >
                              {e?.labour_rate === 0
                                ? ""
                                : formatAmount(e?.labour_rate)}
                            </td>
                            <td
                              
                              align="right"
                              style={{ ...brRight }}
                            >
                              {formatAmount(e?.labour_amt)}
                            </td>
                            <th
                              align="right"
                              
                              style={{ ...brRight }}
                            >
                              {formatAmount(e?.total_amount)}
                            </th> */}
                          </tr>
                        )
                    })}
                    
                    {/* Last Tax Total */}
                    <tr>
                      <td colSpan={19}></td>
                      <td colSpan={2}>Total Discount</td>
                      <td
                        align="right" 
                        style={{ ...brRight }}
                      >
                        {formatAmount(
                          result?.mainTotal?.total_discount_amount /
                          result?.header?.CurrencyExchRate
                        )}
                      </td>
                    </tr>
                    {result?.allTaxes?.map((e, i) => {
                      return (
                        <tr key={i}>
                          <td colSpan={19}></td>
                          <td colSpan={2}>
                            {e?.name} @ {e?.per}
                          </td>
                          <td
                            align="right"
                            style={{ ...brRight }}
                          >
                            {formatAmount(
                              +e?.amount * result?.header?.CurrencyExchRate
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {result?.header?.FreightCharges === 0 ? (
                      ""
                    ) : (
                      <tr>
                        <td colSpan={19}></td>
                        <td colSpan={2}>{result?.header?.ModeOfDel}</td>
                        <td
                          align="right"
                          style={{ ...brRight }}
                        >
                          {formatAmount(
                            result?.header?.FreightCharges /
                            result?.header?.CurrencyExchRate
                          )}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={19}></td>
                      <td colSpan={2}>
                        {result?.header?.AddLess > 0 ? "Add" : "Less"}
                      </td>
                      <td
                        align="right"
                        style={{ ...brRight }}
                      >
                        {formatAmount(result?.header?.AddLess)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default DesignsetPackinglistExcel;
