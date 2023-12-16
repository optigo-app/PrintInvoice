import React from "react";
import { useState } from "react";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import {
  NumberWitdCommas,
  NumberWithCommas,
  apiCall,
  handleGlobalImgError,
  isObjectEmpty,
} from "../../GlobalFunctions";
import ReactdTMLTableToExcel from "react-html-table-to-excel";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";

const QuotationExcel = ({ urls, token, invoiceNo, printName, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [header, setdeader] = useState({});
  const [data, setData] = useState([]);

  const loadData = (data) => {
    let Mostly_Calculation = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let json0Data = data?.BillPrint_Json[0];
    let resultArr = [];
    Mostly_Calculation?.resultArray?.forEach((e, i) => {
      let settingDiamonds = [];
      let settingcolorStones = [];
      e?.diamonds.forEach((ele, ind) => {
        let findRecord = settingDiamonds.findIndex(
          (elem, index) =>
            elem?.ShapeName === ele?.ShapeName &&
            elem?.Colorname === ele?.Colorname &&
            elem?.QualityName === ele?.QualityName &&
            elem?.SizeName === ele?.SizeName &&
            elem?.SettingName === ele?.SettingName
        );
        if (findRecord === -1) {
          settingDiamonds.push(ele);
        } else {
          settingDiamonds[findRecord].Pcs += ele?.Pcs;
          settingDiamonds[findRecord].Wt += ele?.Wt;
          settingDiamonds[findRecord].Amount += ele?.Amount;
          if (ele?.SettingAmount !== null) {
            settingDiamonds[findRecord].SettingAmount += ele?.SettingAmount;
          }
        }
      });
      e?.colorstone.forEach((ele, ind) => {
        let findRecord = settingcolorStones.findIndex(
          (elem, index) =>
            elem?.ShapeName === ele?.ShapeName &&
            elem?.Colorname === ele?.Colorname &&
            elem?.QualityName === ele?.QualityName &&
            elem?.SizeName === ele?.SizeName &&
            elem?.SettingName === ele?.SettingName
        );
        if (findRecord === -1) {
          settingcolorStones.push(ele);
        } else {
          settingcolorStones[findRecord].Pcs += ele?.Pcs;
          settingcolorStones[findRecord].Wt += ele?.Wt;
          settingcolorStones[findRecord].Amount += ele?.Amount;
          if (ele?.SettingAmount !== null) {
            settingcolorStones[findRecord].SettingAmount += ele?.SettingAmount;
          }
        }
      });

      let miscs = [];

      e?.misc.forEach((ele, ind) => {
        let findRecord = miscs.findIndex(
          (elem, index) =>
            elem?.ShapeName === ele?.ShapeName &&
            elem?.Colorname === ele?.Colorname &&
            elem?.QualityName === ele?.QualityName &&
            elem?.SizeName === ele?.SizeName &&
            elem?.SettingName === ele?.SettingName
        );
        if (findRecord === -1) {
          miscs.push(ele);
        } else {
          miscs[findRecord].Pcs += ele?.Pcs;
          miscs[findRecord].Wt += ele?.Wt;
          miscs[findRecord].Amount += ele?.Amount;
          if (ele?.SettingAmount !== null) {
            miscs[findRecord].SettingAmount += ele?.SettingAmount;
          }
        }
      });

      settingDiamonds.sort((a, b) => {
        let nameA = a?.ShapeName;
        let nameB = b?.ShapeName;
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });

      settingcolorStones.sort((a, b) => {
        let nameA = a?.ShapeName;
        let nameB = b?.ShapeName;
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });

      miscs.sort((a, b) => {
        let nameA = a?.ShapeName;
        let nameB = b?.ShapeName;
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });

      let metalFinding = [...e?.metal, ...e?.finding].flat();
      let diamondColorStones = [
        ...settingDiamonds,
        ...settingcolorStones,
        ...miscs,
      ].flat();
      let length = 5;

      if (length < miscs.length) {
        length = miscs.length;
      }

      if (length < metalFinding.length) {
        length = metalFinding.length;
      }

      if (length < diamondColorStones.length) {
        length = diamondColorStones.length;
      }

      Array.from({ length: length }).forEach((elem, index) => {
        let obj = {
          srNo: index === 0 ? i + 1 : 0,
          designNo: index === 0 ? e?.designno : 0,
          category: index === 1 ? e?.Categoryname : 0,
          img: index === 2 ? e?.DesignImage : 0,
          metalQuality: metalFinding[index]
            ? `${metalFinding[index]?.ShapeName} ${metalFinding[index]?.QualityName} ${metalFinding[index]?.FindingTypename} ${metalFinding[index]?.FindingAccessories}`
            : "",
          color: metalFinding[index] ? metalFinding[index]?.Colorname : "",
          netWt: metalFinding[index] ? metalFinding[index]?.Wt : "",
          grossWt: metalFinding[index] ? e?.grosswt : "",
          metalRate: metalFinding[index] ? metalFinding[index]?.Rate : "",
          metalAmount: metalFinding[index] ? metalFinding[index]?.Amount : "",
          diamondCode: `${
            settingDiamonds[index]
              ? `${
                  settingDiamonds[index]
                    ?.MasterManagement_DiamondStoneTypeid === 1
                    ? "D"
                    : ""
                } 
          ${
            settingDiamonds[index]?.MasterManagement_DiamondStoneTypeid === 2
              ? "CS"
              : ""
          } 
          ${settingDiamonds[index]?.ShapeName}
          ${settingDiamonds[index]?.QualityName}
          ${settingDiamonds[index]?.Colorname}`
              : ""
          }`,
          diamondSize: settingDiamonds[index]
            ? settingDiamonds[index]?.SizeName
            : "",
          diamondPcs: settingDiamonds[index] ? settingDiamonds[index]?.Pcs : 0,
          diamondWt: settingDiamonds[index] ? settingDiamonds[index]?.Wt : 0,
          diamondRate: settingDiamonds[index]
            ? settingDiamonds[index]?.Rate
            : 0,
          diamondAmount: settingDiamonds[index]
            ? settingDiamonds[index]?.Amount
            : 0,

          designNoFlag: index === 0 ? true : false,
          categoryFlag: index === 1 ? true : false,
          imgFlag: index === 2 ? true : false,

          miscCode: ``,
          miscSize: ``,
          miscPcs: ``,
          miscWt: ``,
          miscRate: ``,
          miscAmount: ``,

          settingAmount: settingDiamonds[index]
            ? settingDiamonds[index]?.SettingAmount
            : 0,
          makingRate: index === 0 ? e?.MaKingCharge_Unit : 0,
          makingAmount: index === 0 ? e?.MakingAmount : 0,
          makingHeightRowWise: index === 0 ? length : 0,
          other: index === 0 ? e?.OtherCharges : 0,
          unitCost: index === 0 ? e?.UnitCost : 0,
          qty: index === 0 ? 1 : 0,
          totalAmount: index === 0 ? e?.TotalAmount : 0,
        };
        resultArr.push(obj);
      });
    });
    setData(resultArr);
    setdeader(json0Data);
    setTimeout(() => {
      const button = document.getElementById("test-table-xls-button");
      button.click();
    }, 0);
  };

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setLoader(false);
          } else {
            setLoader(false);
            setMsg("Data Not Found");
          }
        } else {
          setLoader(false);
          setMsg(data?.Message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="">
          <ReactdTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
            table="table-to-xls"
            filename={`Sale_Format_A_${header?.InvoiceNo}_${Date.now()}`}
            sheet="tablexls"
            buttonText="Download as XLS"
          />
          <table id="table-to-xls">
            <thead>
              <tr>
                <td width={20}></td>
                <td
                  colSpan={28}
                  align="left"
                  height={40}
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "1px",
                    fontWeight: "bold",
                  }}
                >
                  <p weig>CLASSMATE CORPORATION PVT LTD </p>
                </td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={5} align="left">
                  <p className="">TO</p>
                </td>
                <td colSpan={19} rowSpan={4}></td>
                <td>
                  <p className="fw-normal">Quotation#</p>
                </td>
                <td colSpan={3} align="left" style={{ fontWeight: "bold" }}>
                  <p className="fw-bold">: QT24347</p>
                </td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={5} align="left">
                  <p className="">Kamlesh Patil pvt ltd</p>
                </td>
                <td>
                  <p className="fw-normal">Date</p>
                </td>
                <td colSpan={3} align="left" style={{ fontWeight: "bold" }}>
                  <p className="fw-bold">: 09 Dec 2023</p>
                </td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={5} align="left">
                  <p className="">Near railway station, Vadodara</p>
                </td>
                <td></td>
                <td colSpan={3}></td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={5} align="left">
                  <p className="">VADODARA</p>
                </td>
                <td>
                  <p> </p>
                </td>
                <td colSpan={3}>
                  <p> </p>
                </td>
              </tr>

              {/* table header */}
              <tr>
                <td></td>
                <th
                  width={60}
                  rowSpan={2}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="center"
                >
                  <p>Sr</p>
                </th>

                <th
                  rowSpan={2}
                  width={150}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="center"
                >
                  <p>Design</p>
                </th>

                <th
                  colSpan={7}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="center"
                >
                  Metal
                </th>

                <th
                  width={80}
                  colSpan={6}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Diamond & Stones
                </th>

                <th
                  width={80}
                  colSpan={6}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Misc
                </th>

                <th
                  width={100}
                  rowSpan={2}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Setting Amt
                </th>

                <th
                  width={80}
                  colSpan={2}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Making
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  rowSpan={2}
                >
                  Other
                </th>

                <th
                  width={150}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  rowSpan={2}
                >
                  Unit Cost
                </th>

                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  rowSpan={2}
                >
                  Qty
                </th>

                <th
                  width={150}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  rowSpan={2}
                >
                  Total Amount
                </th>
              </tr>
              <tr>
                <td></td>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="center"
                >
                  Quality
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Color
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Wt (M+D)
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Net Wt
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Gross Wt
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Rate
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Amt.
                </th>

                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Code
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Size
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Pcs
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Wt
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Rate
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Amt .
                </th>

                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Code
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Size
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Pcs
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Wt
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Rate
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Amt .
                </th>

                <th
                  width={100}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Making Rate
                </th>
                <th
                  width={80}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {/* data */}
              {data.map((e, i) => {
                return (
                  <tr key={i}>
                    <td></td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.srNo !== 0 && e?.srNo}
                    </td>
{console.log(e?.designNoFlag, e?.categoryFlag, e?.imgFlag)}
                    {e?.designNoFlag && (
                      <td
                        style={{
                          borderBottom: `${
                            data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                          }`,
                          borderLeft: "1px solid #bdbdbd",
                          borderRight: "1px solid #bdbdbd",
                          padding: "0.5px",
                        }}
                      >
                        <p className="fw-bold" align="center">
                          {e?.designNo}
                        </p>
                      </td>
                    )}

                    {e?.categoryFlag && (
                      <td
                        style={{
                          borderBottom: `${
                            data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                          }`,
                          borderLeft: "1px solid #bdbdbd",
                          borderRight: "1px solid #bdbdbd",
                          padding: "0.5px",
                        }}
                      >
                        <p className="fw-bold" align="center">
                          {e?.category}
                        </p>
                      </td>
                    )}

                    {e?.imgFlag && (
                      <td
                        style={{
                          borderBottom: `${
                            data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                          }`,
                          borderLeft: "1px solid #bdbdbd",
                          borderRight: "1px solid #bdbdbd",
                          padding: "0.5px",
                        }}
                      >
                          <img
                        src={e?.img}
                        onError={(eve) =>
                          handleGlobalImgError(eve, header?.DefImage)
                        }
                        style={{
                          objectFit: "contain",
                        }}
                        height={50}
                      />
                      </td>
                    )}

                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.metalQuality}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.color}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    ></td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.netWt !== "" && NumberWithCommas(e?.netWt, 3)}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.grossWt !== "" && NumberWithCommas(e?.grossWt, 3)}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.metalRate !== "" && NumberWithCommas(e?.metalRate, 2)}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.metalAmount !== "" &&
                        NumberWithCommas(e?.metalAmount, 2)}
                    </td>

                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.diamondCode}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.diamondSize}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.diamondPcs !== 0 &&
                        NumberWithCommas(e?.diamondPcs, 0)}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.diamondWt !== 0 && NumberWithCommas(e?.diamondWt, 3)}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {console.log(e?.diamondRate)}
                      {e?.diamondRate !== 0 &&
                        NumberWithCommas(e?.diamondRate, 2)}
                    </td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.diamondAmount !== 0 &&
                        NumberWithCommas(e?.diamondAmount, 2)}
                    </td>

                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    ></td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    ></td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    ></td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    ></td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    ></td>
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    ></td>

                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                    >
                      {e?.settingAmount !== 0 &&
                        NumberWithCommas(e?.settingAmount, 2)}
                    </td>
                    {e?.makingHeightRowWise !== 0 && (
                      <td
                        style={{
                          borderBottom: `${
                            data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                          }`,
                          borderLeft: "1px solid #bdbdbd",
                          borderRight: "1px solid #bdbdbd",
                          padding: "0.5px",
                        }}
                        rowSpan={e?.makingHeightRowWise}
                      >
                        {e?.makingRate !== 0 &&
                          NumberWithCommas(e?.makingRate, 2)}
                      </td>
                    )}
                    {e?.makingHeightRowWise !== 0 && (
                      <td
                        style={{
                          borderBottom: `${
                            data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                          }`,
                          borderLeft: "1px solid #bdbdbd",
                          borderRight: "1px solid #bdbdbd",
                          padding: "0.5px",
                        }}
                        rowSpan={e?.makingHeightRowWise}
                      >
                        {e?.makingAmount !== 0 &&
                          NumberWithCommas(e?.makingAmount, 2)}
                      </td>
                    )}

                    {e?.makingHeightRowWise !== 0 && (
                      <td
                        style={{
                          borderBottom: `${
                            data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                          }`,
                          borderLeft: "1px solid #bdbdbd",
                          borderRight: "1px solid #bdbdbd",
                          padding: "0.5px",
                        }}
                        rowSpan={e?.makingHeightRowWise}
                      >
                        {e?.other !== 0 && NumberWithCommas(e?.other, 2)}
                      </td>
                    )}

                    {e?.makingHeightRowWise !== 0 && (
                      <td
                        style={{
                          borderBottom: `${
                            data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                          }`,
                          borderLeft: "1px solid #bdbdbd",
                          borderRight: "1px solid #bdbdbd",
                          padding: "0.5px",
                        }}
                        rowSpan={e?.makingHeightRowWise}
                      >
                        {" "}
                        {e?.unitCost !== 0 && NumberWithCommas(e?.unitCost, 2)}
                      </td>
                    )}

                    {e?.makingHeightRowWise !== 0 && (
                      <td
                        style={{
                          borderBottom: `${
                            data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                          }`,
                          borderLeft: "1px solid #bdbdbd",
                          borderRight: "1px solid #bdbdbd",
                          padding: "0.5px",
                        }}
                        rowSpan={e?.makingHeightRowWise}
                      >
                        {e?.qty !== 0 && NumberWithCommas(e?.qty, 0)}
                      </td>
                    )}
                    {/* height={21} */}
                    <td
                      style={{
                        borderBottom: `${
                          data[i + 1]?.srNo !== 0 && "1px solid #bdbdbd"
                        }`,
                        borderLeft: "1px solid #bdbdbd",
                        borderRight: "1px solid #bdbdbd",
                        padding: "0.5px",
                      }}
                      align="right"
                    >
                      {e?.totalAmount !== 0 &&
                        NumberWithCommas(e?.totalAmount, 2)}
                    </td>
                  </tr>
                );
              })}

              {/* tax */}
              <tr>
                <td></td>
                <td
                  colSpan={27}
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="right"
                >
                  CGST @ 0.13%
                </td>
                <td
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="right"
                >
                  18.67
                </td>
              </tr>

              {/* total */}
              <tr>
                <td></td>
                <td
                  colSpan={8}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                ></td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  6972
                </td>
                <td
                  colSpan={2}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                ></td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  12
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  11.1
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                ></td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  437.5
                </td>

                <td
                  colSpan={2}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                ></td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  12
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  11.1
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                ></td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  437.5
                </td>

                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  0
                </td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                ></td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  3500
                </td>

                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  0
                </td>

                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                ></td>
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                >
                  3
                </td>
                {/* height={21} */}
                <td
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    padding: "0.5px",
                  }}
                  align="right"
                >
                  ₹ 14,396.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default QuotationExcel;
