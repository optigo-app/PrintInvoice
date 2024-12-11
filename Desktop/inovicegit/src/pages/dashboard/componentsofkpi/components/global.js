export  const checkNullUndefined = (data) => {
    if(data === 'undefined' || data === 'null' || data === undefined || data === null || data === NaN || data === 'NaN' || data === (-Infinity) || data === '-Infinity' || data === "-infinity" || data === (Infinity) || data === "Infinity" || data === "infinity" ){
      return 0.00;
    }else{
      return data
    }
}
// export const checkNullUndefined = (data) => {
//   if (
//     data === 'undefined' ||
//     data === 'null' ||
//     data === undefined ||
//     data === null ||
//     isNaN(data) || // Check if data is NaN
//     data === (-Infinity) ||
//     data === '-Infinity' ||
//     data === 'Infinity' ||
//     data === Infinity ||
//     data === '-infinity' ||
//     data === 'infinity'
//   ) {
//     return 0.00;
//   } else {
//     return data;
//   }
// };
export const checkIsZero = (num) => {
    if(num === 0){
      return 1;
    }else{
      return num;
    }
}

export const checkDivByZero = (data) => {
  if(data === (-Infinity) || data === '-Infinity' || data === "-infinity" || data === (Infinity) || data === "Infinity" || data === "infinity" || data === NaN || data === 'NaN'){
    return 0;
  }else{
    return data;
  }
} 

export const makeWordShort = (val) => {
  // Check for null, undefined, or empty value
  if (val === null || val === undefined || val === 'null' || val === 'undefined' || val === '') {
    return '';
  } else {
    // Check for "customer" and "manufacturer" and return short form
    if (val.toLowerCase().includes('customer')) {
      return 'Cust.';
    }
    if (val.toLowerCase().includes('manufacturer')) {
      return 'MFG';
    }

    // If none of the conditions match, return the original value
    return val;
  }
};