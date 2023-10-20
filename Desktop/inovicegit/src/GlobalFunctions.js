import axios from "axios";
import img from "./assets/img/default.jpg";
import Footer1 from "./components/footers/Footer1";
import Header1 from "./components/headers/Header1";
import Header2 from "./components/headers/Header2";

//print button function for print pop up
export const handlePrint = (e) => {
  window.print();
};

//handle image if api image not coming
export const handleImageError = (e) => {
  e.target.src = img;
};

//sentence words first char capital function
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

//global function of api calling
export const apiCall = async (token, invoiceNo, printName, urls, evn) => {
  const body = {
    token: token,
    invoiceno: invoiceNo,
    printname: printName,
    Eventname: evn,
  };

  try {
    const response = await axios.post(urls, body);
    console.log(response?.data?.Data);
    return response?.data;
  } catch (error) {
    console.error(error);
  }
};

//api response object checking is obj is empty or not
export function isObjectEmpty(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false; // If any property is found, the object is not empty
    }
  }
  return true; // If no properties are found, the object is empty
}

//tax value calculating function taxGenerator
export const taxGenrator = (headerData, totalAmount) => {
  let blankArr = [];

  if (headerData?.TaxProfileid !== 0 && headerData?.GSTProfileid === 0) {
    let taxTypes = ["tax1", "tax2", "tax3", "tax4", "tax5"];
    taxTypes.forEach((e, i) => {
      if (headerData[`${e}_taxname`] !== "") {
        if (headerData[`${e}_IsOnDiscount`] === 1) {
          let obj = {
            name: headerData[[`${e}_taxname`]],
            per: `${headerData[`${e}_value`].toFixed(2)}%`,
            amount: ((totalAmount * headerData[`${e}_value`]) / 100).toFixed(2),
          };
          blankArr.push(obj);
        } else {
          let obj = {
            name: headerData[`${e}_taxname`],
            per: headerData[`${e}_value`].toFixed(2),
            amount: headerData[`${e}_value`].toFixed(2),
          };
          blankArr.push(obj);
        }
      }
    });
  } else if (headerData?.TaxProfileid !== 0 && headerData?.GSTProfileid === 1) {
    let arr = ["CGST", "SGST"];
    arr.forEach((e, i) => {
      let obj = {
        name: e,
        per: `${headerData[e].toFixed(2)}%`,
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

//number with commas function
export const NumberWithCommas = (value, val) => {
  const formattedNumber = parseFloat(+value)?.toLocaleString(undefined, {
    minimumFractionDigits: val,
    maximumFractionDigits: val,
  });

  return formattedNumber;
};

//fixedValues
export const fixedValues = (value, zeroes) =>
  typeof value === "number" ? value.toFixed(zeroes) : (+value)?.toFixed(zeroes);

//call of header
export const HeaderComponent = (headNo, headerData) => {
  let headerComponent;

  switch (headNo) {
    case "1":
      headerComponent = <Header1 data={headerData} />;

      break;
    case "2":
      headerComponent = <Header2 data={headerData} />;
      break;

    default:
      headerComponent = <Header1 data={headerData} />;
      break;
  }

  return headerComponent;
};

//call of footer
export const FooterComponent = (footerNo, footerData) => {
  let footerComponent;

  switch (footerNo) {
    case "1":
      footerComponent = <Footer1 data={footerData} />;

      break;
    case "2":
      footerComponent = <Footer1 data={footerData} />;
      break;

    default:
      footerComponent = <Footer1 data={footerData} />;
      break;
  }

  return footerComponent;
};

export const ReceiveInBank = (BankPayDet) => {
  if(BankPayDet?.length > 0){
    let arr = BankPayDet.split('@-@');
    let blankArr = [];
    arr.forEach(e=> {
      let obj = {};
      let val = e.split('#-#');
      obj.BankName = val[0];
      obj.label = val[1];
      obj.amount = +val[2];
      blankArr.push(obj);
    });
    return blankArr;
  }else{
    return [];
  }
}

export const checkInstruction = (ins) => {
  if(ins !== "" && ins !== undefined && ins !== null && ins !== "null")  {
   return ins;
  }
}

export const GovernMentDocuments = (documents) => {
  if(documents?.length > 0){
    let arr = documents.split('#@#');
    let blankArr = [];
    arr.forEach(e=> {
      let obj = {};
      let val = e.split('#-#');
      obj.label = val[0];
      obj.value = val[1];
      blankArr.push(obj);
    });
    return blankArr;
  }else{
    return [];
  }
}

export const notZero = (val) => {
  if(val !== "" && val !== undefined && val !== null && val !== "null" && val !== 0)  {
    return val;
   }else{
    return ""
   }
}