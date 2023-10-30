import { formatDate } from "./DateFormat";

export const organizeData = (rd, rd1) => {
    let newArr = [];
    rd?.forEach((e, i) => {
      let obj = {};
      obj.rd = { ...e };
      obj.rd.orderDatef = formatDate(obj?.rd?.OrderDate);
      obj.rd.promiseDatef = formatDate(obj?.rd?.promisedate);
      let arrs = rd1?.filter((ele, ind) => ele?.SerialJobno === e?.serialjobno);
      obj.rd1 = arrs;
      newArr?.push(obj);
    });
    // console.log(newArr);
    return newArr;
  };