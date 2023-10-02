import axios from "axios";

export const handlePrint = (e) => {
  window.print();
};

export const handleImageError = (e) => {
  e.target.src = "./pages/bagPrints/default.jpg";
};

export const CapitalizeWords = (text) => {
  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const wordsArray = text.split(" ");
  const capitalizedWordsArray = wordsArray.map((word) => {
    return word.split("-").map(capitalizeFirstLetter).join("-");
  });
  const capitalizedText = capitalizedWordsArray.join(" ");
  return capitalizedText + " " + "Only";
};

export const apiCall = async (token, invoiceNo, printName, urls) => {
  const body = {
    token: token,
    invoiceno: invoiceNo,
    printname: printName,
  };
  try {
    const response = await axios.post(urls, body);
    return response.data.Data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const taxGenrator = (headerData, totalAmount) => {
  let blankArr = [];

  if (headerData?.TaxProfileid !== 0 && headerData?.GSTProfileid === 0) {
    let taxTypes = ["tax1", "tax2", "tax3", "tax4", "tax5"];
    taxTypes.forEach((e, i) => {
      if (headerData[`${e}_taxname`] !== "") {
        if (headerData[`${e}_IsOnDiscount`] === 1) {
          let obj = {
            name: headerData[[`${e}_taxname`]],
            per: `${(headerData[`${e}_value`]).toFixed(3)}%`,
            amount: ((totalAmount * headerData[`${e}_value`]) / 100).toFixed(2),
          };
          blankArr.push(obj);
        } else {
          let obj = {
            name: headerData[`${e}_taxname`],
            per: (headerData[`${e}_value`]).toFixed(3),
            amount: (headerData[`${e}_value`]).toFixed(2),
          };
          blankArr.push(obj);
        }
      }
    });

    // if (headerData?.tax2_taxname !== "") {
    //   if (headerData?.tax2_IsOnDiscount === 1) {
    //     let obj = {
    //       name: headerData?.tax2_taxname,
    //       per: `${(headerData?.tax2_value).toFixed(3)}%`,
    //       amount: ((totalAmount * headerData?.tax2_value) / 100).toFixed(2),
    //     };
    //     blankArr.push(obj);
    //   } else {
    //     let obj = {
    //       name: headerData?.tax2_taxname,
    //       per: (headerData?.tax2_value).toFixed(3),
    //       amount: (headerData?.tax2_value).toFixed(2),
    //     };
    //     blankArr.push(obj);
    //   }
    // }

    // if (headerData?.tax3_taxname !== "") {
    //   if (headerData?.tax3_IsOnDiscount === 1) {
    //     let obj = {
    //       name: headerData?.tax3_taxname,
    //       per: `${(headerData?.tax3_value).toFixed(3)}%`,
    //       amount: ((totalAmount * headerData?.tax3_value) / 100).toFixed(2),
    //     };
    //     blankArr.push(obj);
    //   } else {
    //     let obj = {
    //       name: headerData?.tax3_taxname,
    //       per: (headerData?.tax3_value).toFixed(3),
    //       amount: (headerData?.tax3_value).toFixed(2),
    //     };
    //     blankArr.push(obj);
    //   }
    // }

    // if (headerData?.tax4_taxname !== "") {
    //   if (headerData?.tax4_IsOnDiscount === 1) {
    //     let obj = {
    //       name: headerData?.tax4_taxname,
    //       per: `${(headerData?.tax4_value).toFixed(3)}%`,
    //       amount: ((totalAmount * headerData?.tax4_value) / 100).toFixed(2),
    //     };
    //     blankArr.push(obj);
    //   } else {
    //     let obj = {
    //       name: headerData?.tax4_taxname,
    //       per: (headerData?.tax4_value).toFixed(3),
    //       amount: (headerData?.tax4_value).toFixed(2),
    //     };
    //     blankArr.push(obj);
    //   }
    // }

    // if (headerData?.tax5_taxname !== "") {
    //   if (headerData?.tax5_IsOnDiscount === 1) {
    //     let obj = {
    //       name: headerData?.tax5_taxname,
    //       per: `${(headerData?.tax5_value).toFixed(3)}%`,
    //       amount: ((totalAmount * headerData?.tax5_value) / 100).toFixed(2),
    //     };
    //     blankArr.push(obj);
    //   } else {
    //     let obj = {
    //       name: headerData?.tax5_taxname,
    //       per: (headerData?.tax5_value).toFixed(3),
    //       amount: (headerData?.tax5_value).toFixed(2),
    //     };
    //     blankArr.push(obj);
    //   }
    // }

  } else if (headerData?.TaxProfileid !== 0 && headerData?.GSTProfileid === 1) {
    let arr = ["CGST", "SGST"];
    arr.forEach((e, i) => {
      let obj = {
        name: e,
        per: `${headerData[e].toFixed(3)}%`,
        amount: ((totalAmount * headerData[e]) / 100).toFixed(2),
      };
      blankArr.push(obj);
    });
  } else if (headerData?.TaxProfileid !== 0 && headerData?.GSTProfileid === 2) {
    let obj = {
      name: headerData?.TaxProfilename,
      per: `${(headerData?.IGST).toFixed(2)}%`,
      amount: (headerData?.TotalIGSTAmount).toFixed(2),
    };
    blankArr.push(obj);
  }
  return blankArr;
};
