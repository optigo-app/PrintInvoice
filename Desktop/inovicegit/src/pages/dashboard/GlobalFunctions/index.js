import axios from "axios";

export function formatAmount(amount) {
    const formattedAmount = parseFloat(+amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  
    return formattedAmount;
  }


  export const fetchDashboardData = async (token, fdate, tdate, event) => {
    try {
      const url = "http://zen/jo/api-lib/App/DashBoard";
      const body = JSON.stringify({
        "Token" : `${token}`  
        ,"ReqData":`[{\"Token\":\"${token}\",\"Evt\":\"${event}\",\"FDate\":\"${fdate}\",\"TDate\":\"${tdate}\"}]`
      });
  
      const response = await axios.post(url, body);
      if (response?.data?.Status === '200') {
        return response?.data?.Data?.DT?.length > 0 ? response.data.Data.DT : [];
      } else {
        return []; // Empty array if no data or status is not 200
      }
    } catch (error) {
      console.log("API Error:", error);
      return []; // Return empty array on error
    }
  };

  export const capitalizeFirstLetter = (str) => {
    if (typeof str === 'string' && str.length > 0) {
      return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase();
    }
    return str;
  };

  // export const formatAmountKWise = (amount) => {
  //   // Check if amount is a valid number
  //   if (isNaN(amount) || amount === null) return '0';
  
  //   // Convert the amount to a string for easier processing
  //   let formattedAmount = '';
  
  //   // Logic to handle different magnitudes
  //   if (amount >= 1000000) {
  //     formattedAmount = (amount / 1000000).toFixed(0) + 'M';  // Million (M)
  //   } else if (amount >= 1000) {
  //     formattedAmount = (amount / 1000).toFixed(0) + 'K';  // Thousand (K)
  //   } else {
  //     formattedAmount = amount.toString();  // Below 1000, just return the number as-is
  //   }
  
  //   return formattedAmount;
  // }
  // export const formatAmountKWise = (amount) => {
  //   // Check if amount is a valid number
  //   if (isNaN(amount) || amount === null) return '0';
    
  //   // Save the sign of the amount and work with the absolute value
  //   const isNegative = amount < 0;
  //   amount = Math.abs(amount);
  
  //   // Convert the amount to a string for easier processing
  //   let formattedAmount = '';
  
  //   // Logic to handle different magnitudes
  //   if (amount >= 1000000) {
  //     formattedAmount = (amount / 1000000).toFixed(0) + 'M';  // Million (M)
  //   } else if (amount >= 1000) {
  //     formattedAmount = (amount / 1000).toFixed(0) + 'K';  // Thousand (K)
  //   } else {
  //     formattedAmount = amount.toString();  // Below 1000, just return the number as-is
  //   }
  
  //   // If the amount was negative, add the negative sign back
  //   if (isNegative) {
  //     formattedAmount = '-' + formattedAmount;
  //   }
  
  //   return formattedAmount;
  // }

  export const formatAmountKWise = (amount) => {
    // Check if amount is a valid number
    if (isNaN(amount) || amount === null) return '0';
    
    // Save the sign of the amount and work with the absolute value
    const isNegative = amount < 0;
    amount = Math?.abs(amount);
    
    let formattedAmount = '';
  
    // Logic to handle different magnitudes
    if (amount >= 1000000) {
      formattedAmount = (amount / 1000000)?.toFixed(2);  // Use 2 decimal places for Million (M)
    } else if (amount >= 1000) {
      formattedAmount = (amount / 1000)?.toFixed(2);     // Use 2 decimal places for Thousand (K)
    } else {
      formattedAmount = amount?.toString();  // Below 1000, just return the number as-is
    }
  
    // Remove trailing zeros (optional)
    formattedAmount = parseFloat(formattedAmount)?.toString();
    
    // Append K or M suffix based on magnitude
    if (amount >= 1000000) {
      formattedAmount += 'M';
    } else if (amount >= 1000) {
      formattedAmount += 'K';
    }
  
    // If the amount was negative, add the negative sign back
    if (isNegative) {
      formattedAmount = '-' + formattedAmount;
    }
  
    return formattedAmount;
  };
  
  