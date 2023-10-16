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
  let headerComponent;

  switch (footerNo) {
    case "1":
      headerComponent = <Footer1 data={footerData} />;

      break;
    case "2":
      headerComponent = <Footer1 data={footerData} />;
      break;

    default:
      headerComponent = <Footer1 data={footerData} />;
      break;
  }

  return headerComponent;
};
