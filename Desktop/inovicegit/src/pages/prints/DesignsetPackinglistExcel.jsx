// http://localhost:3001/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U0syMTA0MjAyNA==&evn=c2FsZQ==&pnm=RGVzaWduc2V0IFBhY2tpbmdsaXN0&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
import React, { useEffect, useState } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  handleGlobalImgError,
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
                      <td colSpan={23} width={132} height={132}>
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
                      <td colSpan={23} style={{ ...txtCen }}>
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
                        style={{...coWdth,...brLeft,...brTop,...bgColor,}}
                      >
                        Sr
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brLeft,
                          ...brTop,
                          ...bgColor,
                        }}
                        colSpan={2}
                      >
                        Design
                      </th>
                      <th
                        style={{
                          ...brLeft,
                          ...brTop,
                          ...brBotm,
                          ...bgColor,
                        }}
                        colSpan={6}
                      >
                        Diamond
                      </th>
                      <th
                        style={{
                          ...brLeft,
                          ...brTop,
                          ...brBotm,
                          ...bgColor,
                        }}
                        colSpan={4}
                      >
                        Metal
                      </th>
                      <th
                        style={{
                          ...brLeft,
                          ...brTop,
                          ...brBotm,
                          ...bgColor,
                        }}
                        colSpan={6}
                      >
                        Stone
                      </th>
                      <th
                        style={{
                          ...brLeft,
                          ...brTop,
                          ...brBotm,
                          ...bgColor,
                        }}
                        colSpan={2}
                      >
                        Labour
                      </th>
                      <th
                        style={{
                          ...brLeft,
                          ...brTop,
                          ...brBotm,
                          ...bgColor,
                        }}
                        colSpan={2}
                      >
                        Other Amount
                      </th>
                      <th
                        style={{
                          ...brLeft,
                          ...brTop,
                          ...brRight,
                          ...bgColor,
                        }}
                        colSpan={1}
                      >
                        Total
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          ...brLeft,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      ></th>
                      <th
                        style={{
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                        colSpan={2}
                      ></th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Shape
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Size
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Pcs
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Wt
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Rate
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Quality
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Wt
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Rate
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Code
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Size
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Pcs
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Wt
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Rate
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Rate
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Code
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          ...coWdth,
                          ...brBotm,
                          ...brRight,
                          ...bgColor,
                        }}
                      >
                        Amount
                      </th>
                    </tr>

                    {result2?.map((e, i) => {
                      return (
                        <React.Fragment key={i}>
                          <tr>
                            {/* { e?.srflag && <td width={90} style={{borderRight:'1px solid #989898'}} align='center' rowSpan={e?.srRowSpan + 1} >&nbsp;{e?.sr}</td>} */}
                            <td
                              width={90}
                              style={{ borderRight: "1px solid #989898" }}
                              align="center"
                            >
                              &nbsp;{e?.sr}
                            </td>
                            <td width={120} style={{ wordBreak: "break-word" }}>
                              &nbsp;{e?.designno}
                            </td>
                            <td
                              width={120}
                              align="right"
                              style={{
                                ...brRight,
                                wordBreak: "break-word",
                                paddingRight: "5px",
                              }}
                            >
                              &nbsp;{e?.SrJobno}&nbsp;
                            </td>
                            <td width={140} align="left">
                              &nbsp;{e?.dia_code}
                            </td>
                            <td width={140} align="left">
                              &nbsp;{`${e?.dia_size}`}
                            </td>
                            <td width={90} align="right">
                              {e?.dia_pcs}
                            </td>
                            <td width={90} align="right">
                              {e?.dia_wt === "" ? "" : (+e?.dia_wt)?.toFixed(3)}
                            </td>
                            <td width={90} align="right">
                              {e?.dia_rate === ""
                                ? ""
                                : formatAmount(e?.dia_rate)}
                            </td>
                            <th
                              align="right"
                              width={90}
                              style={{ borderRight: "1px solid #989898" }}
                            >
                              {e?.dia_amt === ""
                                ? ""
                                : formatAmount(e?.dia_amt)}
                            </th>
                            <td
                              width={140}
                              style={{ wordBreak: "break-word" }}
                              align="left"
                            >
                              &nbsp;{`${e?.met_quality}`}
                            </td>
                            <td width={90} align="right">
                              {(+e?.met_wt)?.toFixed(3)}
                            </td>
                            <td width={90} align="right">
                              {formatAmount(e?.met_rate)}
                            </td>
                            <th
                              align="right"
                              width={90}
                              style={{ borderRight: "1px solid #989898" }}
                            >
                              {e?.met_amt}
                            </th>
                            <td width={140} align="left">
                              &nbsp;{e?.cls_code}
                            </td>
                            <td width={140} align="left">
                              &nbsp;{`${e?.cls_size}`}
                            </td>
                            <td width={90} align="right">
                              {e?.cls_pcs}
                            </td>
                            <td width={90} align="right">
                              {e?.cls_wt === "" ? "" : (+e?.cls_wt)?.toFixed(3)}
                            </td>
                            <td width={90} align="right">
                              {e?.cls_rate === ""
                                ? ""
                                : formatAmount(e?.cls_rate)}
                            </td>
                            <th
                              align="right"
                              width={90}
                              style={{ borderRight: "1px solid #989898" }}
                            >
                              {e?.cls_amt === "" ? "" : e?.cls_amt}
                            </th>
                            <td
                              width={90}
                              align="right"
                              style={{ borderRight: "1px solid #989898" }}
                            >
                              {e?.oth_amt === 0 ? "" : formatAmount(e?.oth_amt)}
                            </td>
                            <td
                              width={90}
                              align="right"
                              style={{ borderRight: "1px solid #989898" }}
                            >
                              {e?.labour_rate === 0
                                ? ""
                                : formatAmount(e?.labour_rate)}
                            </td>
                            <td
                              width={90}
                              align="right"
                              style={{ borderRight: "1px solid #989898" }}
                            >
                              {formatAmount(e?.labour_amt)}
                            </td>
                            <th
                              align="right"
                              width={90}
                              style={{ borderRight: "1px solid #989898" }}
                            >
                              {formatAmount(e?.total_amount)}
                            </th>
                          </tr>
                          {/* dia clr materail */}

                          {e?.matrialArr?.map((val, ind) => {
                            return (
                              <tr key={ind}>
                                <td
                                  width={90}
                                  style={{ borderRight: "1px solid #989898" }}
                                  align="center"
                                >
                                  &nbsp;
                                </td>
                                <td
                                  colSpan={2}
                                  style={{
                                    ...brRight,
                                    verticalAlign: "center",
                                  }}
                                  align="center"
                                >
                                  <span style={{ textAlign: "center" }}>
                                    {val?.imgflag && (
                                      <img
                                        src={val?.img}
                                        alt=""
                                        onError={(eve) =>
                                          handleGlobalImgError(
                                            eve,
                                            result?.header?.DefImage
                                          )
                                        }
                                        width={70}
                                        style={{
                                          paddingLeft: "10px",
                                          objectFit: "contain",
                                          verticalAlign: "center",
                                        }}
                                      />
                                    )}
                                  </span>
                                  <div style={{ textAlign: "center" }}>
                                    {val?.tunchflag && `Tunch : `}{" "}
                                    <b>{val?.tunchflag && val?.tunch}</b>
                                  </div>
                                  <div style={{ textAlign: "center" }}>
                                    <b>{val?.grosswetflag && val?.grosswt}</b>{" "}
                                    {val?.grosswetflag && (
                                      <span>
                                        <b>gm</b> Gross
                                      </span>
                                    )}
                                  </div>
                                </td>
                                {/* <td width={90}></td> */}
                                <td width={90} align="left">
                                  &nbsp;{val?.diaflag && `${val?.dia_code}`}
                                </td>
                                <td width={90} align="left">
                                  &nbsp;{val?.diaflag && `${val?.dia_size}`}
                                </td>
                                <td width={90} align="right">
                                  {val?.diaflag && val?.dia_pcs}
                                </td>
                                <td width={90} align="right">
                                  {val?.diaflag && (+val?.dia_wt)?.toFixed(3)}
                                </td>
                                <td width={90} align="right">
                                  {val?.diaflag &&
                                    (val?.dia_rate === ""
                                      ? ""
                                      : formatAmount(val?.dia_rate))}
                                </td>
                                <th
                                  width={90}
                                  style={{ borderRight: "1px solid #989898" }}
                                  align="right"
                                >
                                  {val?.diaflag && val?.dia_amt}
                                </th>
                                <th
                                  width={90}
                                  colSpan={val?.jobRemarkflag && 4}
                                  style={{
                                    borderRight: `${val?.jobRemarkflag && "1px solid #989898"
                                      }`,
                                  }}
                                  align="left"
                                >
                                  &nbsp;
                                  {val?.jobRemarkflag &&
                                    ` Remark :  ${val?.JobRemark}`}
                                </th>
                                {val?.jobRemarkflag ? "" : <td width={90}></td>}
                                {val?.jobRemarkflag ? "" : <td width={90}></td>}
                                {val?.jobRemarkflag ? (
                                  ""
                                ) : (
                                  <td
                                    width={90}
                                    style={{ borderRight: "1px solid #989898" }}
                                  ></td>
                                )}
                                <td width={90} align="left">
                                  &nbsp;{val?.clsflag && `${val?.cls_code}`}
                                </td>
                                <td width={90} align="left">
                                  &nbsp;{val?.clsflag && `${val?.cls_size}`}
                                </td>
                                <td width={90} align="right">
                                  {val?.clsflag && val?.cls_pcs}
                                </td>
                                <td width={90} align="right">
                                  {val?.clsflag && (+val?.cls_wt)?.toFixed(3)}
                                </td>
                                <td width={90} align="right">
                                  {val?.clsflag &&
                                    (val?.cls_rate === ""
                                      ? ""
                                      : formatAmount(val?.cls_rate))}
                                </td>
                                <th
                                  width={90}
                                  style={{ borderRight: "1px solid #989898" }}
                                  align="right"
                                >
                                  {val?.clsflag && formatAmount(val?.cls_amt)}
                                </th>
                                <td
                                  width={90}
                                  style={{ borderRight: "1px solid #989898" }}
                                ></td>
                                <td
                                  width={90}
                                  style={{ borderRight: "1px solid #989898" }}
                                ></td>
                                <td
                                  width={90}
                                  style={{ borderRight: "1px solid #989898" }}
                                ></td>
                                <td
                                  width={90}
                                  style={{ borderRight: "1px solid #989898" }}
                                ></td>
                              </tr>
                            );
                          })}
                          {/* job wise total */}
                          <tr>
                            <td
                              style={{
                                ...brRight,
                                ...brBotm,
                              }}
                            ></td>
                            <td
                              style={{
                                ...brRight,
                                ...brBotm,
                              }}
                              align="center"
                              colSpan={2}
                            >
                              {e?.values?.CertificateNo === "" ? "" : "Cert#"}
                              <b>
                                {e?.values?.CertificateNo === ""
                                  ? ""
                                  : e?.values?.CertificateNo}
                              </b>
                            </td>
                            {/* <td align='center' ><td></td></td> */}
                            {/* diamonds */}
                            <td
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            ></td>
                            <td
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            ></td>
                            <th
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.values?.totals?.diamonds?.Pcs === 0
                                ? ""
                                : e?.values?.totals?.diamonds?.Pcs}
                            </th>
                            <th
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.values?.totals?.diamonds?.Wt === 0
                                ? ""
                                : e?.values?.totals?.diamonds?.Wt?.toFixed(3)}
                            </th>
                            {/* <td>{((e?.values?.totals?.diamonds?.Amount / (e?.values?.totals?.diamonds?.Wt === 0 ? 1 : e?.values?.totals?.diamonds?.Wt)))}</td> */}
                            <th
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            ></th>
                            <th
                              align="right"
                              style={{
                                ...brRight,
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.values?.totals?.diamonds?.Amount === 0
                                ? ""
                                : formatAmount(
                                  e?.values?.totals?.diamonds?.Amount
                                )}
                            </th>
                            <th
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            ></th>
                            {/* <td>{e?.values?.totals?.metal?.IsPrimaryMetal}</td> */}
                            <th
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.met_wt === 0 ? "" : e?.met_wt?.toFixed(3)}
                            </th>
                            <td
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            ></td>
                            <th
                              align="right"
                              style={{
                                ...brRight,
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.met_amt === 0 ? "" : e?.met_amt}
                            </th>
                            <td
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            ></td>
                            <td
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            ></td>
                            <th
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.values?.totals?.colorstone?.Pcs +
                                e?.values?.totals?.misc?.onlyIsHSCODE0_Pcs ===
                                0
                                ? ""
                                : e?.values?.totals?.colorstone?.Pcs +
                                e?.values?.totals?.misc?.onlyIsHSCODE0_Pcs}
                            </th>
                            <th
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.values?.totals?.colorstone?.Wt +
                                e?.values?.totals?.misc?.onlyIsHSCODE0_Wt ===
                                0
                                ? ""
                                : (
                                  e?.values?.totals?.colorstone?.Wt +
                                  e?.values?.totals?.misc?.onlyIsHSCODE0_Wt
                                )?.toFixed(3)}
                            </th>
                            <td
                              align="right"
                              style={{
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            ></td>
                            <th
                              align="right"
                              style={{
                                ...brRight,
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.values?.totals?.colorstone?.Amount === 0
                                ? ""
                                : formatAmount(
                                  e?.values?.totals?.colorstone?.Amount +
                                  e?.values?.totals?.misc
                                    ?.onlyIsHSCODE0_Amount
                                )}
                            </th>
                            <th
                              align="right"
                              style={{
                                ...brRight,
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.oth_amt === 0 ? "" : formatAmount(e?.oth_amt)}
                            </th>
                            <td
                              align="right"
                              style={{
                                ...brRight,
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            ></td>
                            <th
                              align="right"
                              style={{
                                ...brRight,
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.labour_amt === 0
                                ? ""
                                : formatAmount(e?.labour_amt)}
                            </th>
                            <th
                              align="right"
                              style={{
                                ...brRight,
                                ...bgColor,
                                ...brTop,
                                ...brBotm,
                                borderLeft: "1px solid #e8e8e8",
                              }}
                            >
                              {e?.total_amount === 0
                                ? ""
                                : formatAmount(e?.total_amount)}
                            </th>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                    {/* Last Tax Total */}
                    <tr>
                      <td colSpan={20}></td>
                      <td colSpan={2}>Total Discount</td>
                      <td
                        align="right"
                        style={{ borderRight: "1px solid #989898" }}
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
                          <td colSpan={20}></td>
                          <td colSpan={2}>
                            {e?.name} @ {e?.per}
                          </td>
                          <td
                            align="right"
                            style={{ borderRight: "1px solid #989898" }}
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
                        <td colSpan={20}></td>
                        <td colSpan={2}>{result?.header?.ModeOfDel}</td>
                        <td
                          align="right"
                          style={{ borderRight: "1px solid #989898" }}
                        >
                          {formatAmount(
                            result?.header?.FreightCharges /
                            result?.header?.CurrencyExchRate
                          )}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={20}></td>
                      <td colSpan={2}>
                        {result?.header?.AddLess > 0 ? "Add" : "Less"}
                      </td>
                      <td
                        align="right"
                        style={{ borderRight: "1px solid #989898" }}
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
