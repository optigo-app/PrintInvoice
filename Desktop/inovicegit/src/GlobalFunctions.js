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
  const wordsArray = text.split(' ');
  const capitalizedWordsArray = wordsArray.map((word) => {
    return word.split('-').map(capitalizeFirstLetter).join('-');
  });
  const capitalizedText = capitalizedWordsArray.join(' ');
  return capitalizedText + " " + "Only";
};

export const apiCall = async (token, invoiceNo, printName, urls) => {
  const body = {
    "token": token,
    "invoiceno": invoiceNo,
    "printname": printName
  };
  try {
    const response = await axios.post(urls, body);
    return response.data.Data;
  } catch (error) {
    console.error(error);
    throw error;
  }

};