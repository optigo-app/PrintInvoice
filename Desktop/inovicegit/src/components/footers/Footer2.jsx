
import React from "react";
import style from "../../assets/css/footers/footer2.module.css";
const Footer2 = ({data}) => {
  return (
    <div className={`${style.container} no_break`}>
      <div
        className={style.block1f3}
        style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
      >
        <div className={style.linesf3} style={{fontWeight:"bold"}}>Bank Detail</div>
        <div className={style.linesf3}>Bank Name: {data?.bankname}</div>
        <div className={style.linesf3}>Branch: {data?.bankaddress}</div>
        <div className={style.linesf3}>Account Name: {data?.accountname}</div>
        <div className={style.linesf3}>Account No. : {data?.accountnumber}</div>
        <div className={style.linesf3}>RTGS/NEFT IFSC: {data?.rtgs_neft_ifsc}</div>
      </div>
      <div
        className={style.block2f3}
        style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
      >
        <div className={style.linesf3}>Signature</div>
        <div className={style.linesf3}>{data?.customerfirmname}</div>
      </div>
      <div className={style.block2f3} style={{ width: "33.33%" }}>
        <div className={style.linesf3}>Signature</div>
        <div className={style.linesf3}>{data?.CompanyFullName}</div>
      </div>
    </div>
  );
};

export default Footer2;
