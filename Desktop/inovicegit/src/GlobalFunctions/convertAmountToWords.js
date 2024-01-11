import numberToWords from "number-to-words";
import { CapitalizeWords } from "../GlobalFunctions";

export const convertAmountToWords = (num) => {
  let number1 = (+num);
  let number = String(number1);
  const [dollars, cents] = number?.split(".");
  const dollarsInWords = numberToWords.toWords(parseInt(dollars));
  const centsInWords = cents
    ? numberToWords.toWords(parseInt(cents.padEnd(2, '0')))
    : "Zero";
  const amountInWords = [
    dollarsInWords.charAt(0).toUpperCase() + dollarsInWords.slice(1),
    "point",
    centsInWords.charAt(0).toUpperCase() + centsInWords.slice(1),
  ]
    .filter(Boolean)
    .join(" ");
    let amtInWords = CapitalizeWords(amountInWords);
    console.log(amtInWords);
  // e.amountInWords = `TOTAL ${e.name} IN WORDS: ${amtInWords}`;
  // const numberString = String(number);
  // const [dollars, cents] = numberString.split(".");

  // const dollarsInWords = numberToWords.toWords(Number(dollars));
  // const centsInWords = cents
  //   ? `point ${numberToWords.toWords(Number(cents))}`
  //   : "only";
  
  // return `${dollarsInWords} ${centsInWords}`;
};
