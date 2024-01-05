import { otherAmountDetail, taxGenrator } from "../GlobalFunctions";
import { numberToWords } from "number-to-words";

export const OrganizeDataPrint = (header, json1, json2) => {
  let resultArray = [];

  let maintotal = {
    diamonds: {
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
    },
    colorstone: {
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
    },
    metal: {
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
    },
    finding: {
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
    },
    misc: {
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
    },
    stone_misc: {
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
    },
    total_labour: {
      labour_rate: 0,
      labour_amount: 0,
    },
    total_diamond_colorstone_misc_amount: 0,
    total_other: 0,
    grosswt: 0,
    netwt: 0,
    netwtWithLossWt: 0,
    convertednetwt: 0,
    MetalAmount: 0,
    lossWt: 0,
    total_Wastage: 0,
    total_FineWt: 0,
    total_amount: 0,
    total_unitcost: 0,
    total_discount_amount: 0,
    total_purenetwt: 0,
    total_Quantity: 0,
    total_Making_Amount: 0,
    total_discount: 0,
    total_diamondHandling: 0,
    total_csamount:0,
    total_Making_Amount_Other_Charges:0
  };

  //json1 array
  json1?.length > 0 &&
    json1?.forEach((j1) => {
      let diamond_colorstone_misc = [];
      let diamondList = [];
      let colorstoneList = [];
      let metalList = [];
      let findingList = [];
      let miscList = [];
      let stone_miscList = [];
      let blankArrDiamond = [];
      let blankArrColorstone = [];
      let blankArrMisc = [];
      let blankArrMetal = [];
      let blankArrFinding = [];
      let blankArrstone_misc = [];
      let diamondSettingGroup = [];
      let colorstoneSettingGroup = [];
      let diamondMetalPurityWise = [];
      let colorstoneMetalPurityWise = [];
      let diamondWtMetalPurityWise = 0;
      let colorstoneWtMetalPurityWise = 0;
      let jobwise_totals = {
        diamonds: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
          SettingAmount: 0,
          FineWt: 0,
          length: 0,
        },
        colorstone: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
          SettingAmount: 0,
          FineWt: 0,
          length: 0,
        },
        metal: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
          FineWt: 0,
          length: 0,
        },
        finding: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
          FineWt: 0,
          length: 0,
        },
        misc: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
          FineWt: 0,
          length: 0,
        },
        stone_misc: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
          FineWt: 0,
        },
        Making_Amount_Other_Charges:0,
      };

      let other_details = otherAmountDetail(j1?.OtherAmtDetail);
      maintotal.total_labour.labour_rate += j1?.MaKingCharge_Unit;
      maintotal.total_labour.labour_amount += j1?.MakingAmount;
      maintotal.total_other += j1?.OtherCharges;
      jobwise_totals.Making_Amount_Other_Charges += j1?.MakingAmount + j1?.OtherCharges;
      maintotal.total_Making_Amount_Other_Charges += j1?.MakingAmount + j1?.OtherCharges;
      maintotal.netwt += j1?.NetWt;
      maintotal.netwtWithLossWt =
       maintotal.netwtWithLossWt + (+j1?.NetWt + +j1?.LossWt);
      maintotal.lossWt += j1?.LossWt;
      maintotal.grosswt += j1?.grosswt;
      maintotal.total_amount += j1?.TotalAmount;
      maintotal.total_unitcost += j1?.UnitCost;
      maintotal.total_discount_amount += j1?.DiscountAmt;
      maintotal.total_purenetwt += j1?.PureNetWt;
      maintotal.total_Quantity += j1?.Quantity;
      maintotal.total_Making_Amount += j1?.MakingAmount;
      maintotal.MetalAmount += j1?.MetalAmount;
      maintotal.total_discount += j1?.Discount;
      maintotal.total_diamondHandling += j1?.TotalDiamondHandling;
      maintotal.total_Wastage += j1?.Wastage;
      maintotal.convertednetwt += j1?.convertednetwt;
      maintotal.total_csamount += j1?.CsAmount;
      //json2
      json2?.length > 0 &&
        json2?.forEach((j2, i) => {
          if (j1?.SrJobno === j2?.StockBarcode) {
            //for diamond
            if (j2?.MasterManagement_DiamondStoneTypeid === 1) {
              diamond_colorstone_misc?.push(j2);
              diamondList.push(j2);
              jobwise_totals.diamonds.Wt += j2?.Wt;
              jobwise_totals.diamonds.Pcs += j2?.Pcs;
              jobwise_totals.diamonds.Rate += j2?.Rate;
              jobwise_totals.diamonds.Amount += j2?.Amount;
              jobwise_totals.diamonds.FineWt += j2?.FineWt;
              jobwise_totals.diamonds.length += 1;
              maintotal.diamonds.Wt += j2?.Wt;
              maintotal.diamonds.total_FineWt += +j2?.FineWt;
              maintotal.diamonds.Pcs += j2?.Pcs;
              maintotal.diamonds.Rate += j2?.Rate;
              maintotal.diamonds.Amount += j2?.Amount;
              maintotal.diamonds.SettingAmount += +j2?.SettingAmount;
            }
            //for colorstone
            if (j2?.MasterManagement_DiamondStoneTypeid === 2) {
              colorstoneList.push(j2);
              diamond_colorstone_misc?.push(j2);
              jobwise_totals.colorstone.Wt += j2?.Wt;
              jobwise_totals.colorstone.Pcs += j2?.Pcs;
              jobwise_totals.colorstone.Rate += j2?.Rate;
              jobwise_totals.colorstone.Amount += j2?.Amount;
              jobwise_totals.colorstone.FineWt += j2?.FineWt;
              jobwise_totals.colorstone.length += 1;
              maintotal.colorstone.Wt += j2?.Wt;
              maintotal.colorstone.total_FineWt += +j2?.FineWt;
              maintotal.colorstone.Pcs += j2?.Pcs;
              maintotal.colorstone.Rate += j2?.Rate;
              maintotal.colorstone.Amount += j2?.Amount;
              maintotal.colorstone.SettingAmount += +j2?.SettingAmount;
            }
            //for misc
            if (j2?.MasterManagement_DiamondStoneTypeid === 4) {
              metalList.push(j2);
              
              jobwise_totals.metal.Wt += j2?.Wt;
              jobwise_totals.metal.Pcs += j2?.Pcs;
              jobwise_totals.metal.Rate += j2?.Rate;
              jobwise_totals.metal.Amount += j2?.Amount;
              jobwise_totals.metal.FineWt += j2?.FineWt;
              jobwise_totals.metal.length += 1;
              maintotal.metal.Wt += j2?.Wt;
              maintotal.metal.total_FineWt += +j2?.FineWt;
              maintotal.metal.Pcs += j2?.Pcs;
              maintotal.metal.Rate += j2?.Rate;
              maintotal.metal.Amount += j2?.Amount;
            }
            //for metal
            if (j2?.MasterManagement_DiamondStoneTypeid === 3) {
              miscList.push(j2);
              diamond_colorstone_misc?.push(j2);
              jobwise_totals.misc.Wt += j2?.Wt;
              jobwise_totals.misc.Pcs += j2?.Pcs;
              jobwise_totals.misc.Rate += j2?.Rate;
              jobwise_totals.misc.Amount += j2?.Amount;
              jobwise_totals.misc.FineWt += j2?.FineWt;
              jobwise_totals.misc.length += 1;
              maintotal.misc.Wt += j2?.Wt;
              maintotal.misc.total_FineWt += +j2?.FineWt;
              maintotal.misc.Pcs += j2?.Pcs;
              maintotal.misc.Rate += j2?.Rate;
              maintotal.misc.Amount += j2?.Amount;
            }
            //for finding
            if (j2?.MasterManagement_DiamondStoneTypeid === 5) {
              findingList.push(j2);
              jobwise_totals.finding.Wt += j2?.Wt;
              jobwise_totals.finding.Pcs += j2?.Pcs;
              jobwise_totals.finding.Rate += j2?.Rate;
              jobwise_totals.finding.Amount += j2?.Amount;
              jobwise_totals.finding.FineWt += j2?.FineWt;
              jobwise_totals.finding.length += 1;
              maintotal.finding.Wt += j2?.Wt;
              maintotal.finding.total_FineWt += +j2?.FineWt;
              maintotal.finding.Pcs += j2?.Pcs;
              maintotal.finding.Rate += j2?.Rate;
              maintotal.finding.Amount += j2?.Amount;
            }
            //for stone and misc
            if (
              j2?.MasterManagement_DiamondStoneTypeid === 2 ||
              j2?.MasterManagement_DiamondStoneTypeid === 3
            ) {
              stone_miscList.push(j2);
              jobwise_totals.stone_misc.Wt += j2?.Wt;
              jobwise_totals.stone_misc.Pcs += j2?.Pcs;
              jobwise_totals.stone_misc.Rate += j2?.Rate;
              jobwise_totals.stone_misc.Amount += j2?.Amount;
              maintotal.stone_misc.Wt += j2?.Wt;
              maintotal.stone_misc.total_FineWt += +j2?.FineWt;
              maintotal.stone_misc.Pcs += j2?.Pcs;
              maintotal.stone_misc.Rate += j2?.Rate;
              maintotal.stone_misc.Amount += j2?.Amount;
            }

            //ending of comparing of job no block
          }
        });
      json2?.forEach((j2, i) => {
        if (j1?.SrJobno === j2?.StockBarcode) {
          if (j2?.MasterManagement_DiamondStoneTypeid === 1) {
            let recordIs = blankArrDiamond?.findIndex(
              (e) =>
                e?.ShapeName === j2?.ShapeName &&
                e?.QualityName === j2?.QualityName &&
                e?.Colorname === j2?.Colorname
            );
            if (recordIs === -1) {
              blankArrDiamond.push(j2);
            } else {
              blankArrDiamond[recordIs].Wt += +j2?.Wt;
              blankArrDiamond[recordIs].Pcs += +j2?.Pcs;
              blankArrDiamond[recordIs].Rate += +j2?.Rate;
              blankArrDiamond[recordIs].Amount += +j2?.Amount;
            }

            let recordIs2 = diamondSettingGroup?.findIndex(
              (e) =>
                e?.ShapeName === j2?.ShapeName &&
                e?.QualityName === j2?.QualityName &&
                e?.Colorname === j2?.Colorname &&
                e?.SettingName === j2?.SettingName &&
                e?.SizeName === j2?.SizeName
            );
            if (recordIs2 === -1) {
              diamondSettingGroup.push(j2);
            } else {
              diamondSettingGroup[recordIs2].Wt += +j2?.Wt;
              diamondSettingGroup[recordIs2].Pcs += +j2?.Pcs;
              diamondSettingGroup[recordIs2].Rate += +j2?.Rate;
              diamondSettingGroup[recordIs2].Amount += +j2?.Amount;
              diamondSettingGroup[recordIs2].SettingAmount +=
                +j2?.SettingAmount;
            }

            let recordIs3 = diamondMetalPurityWise?.findIndex((e) => e?.QualityName === j2?.QualityName);
            // if(recordIs3 === -1){
            //   diamondMetalPurityWise.push(j2);
            //   diamondWtMetalPurityWise = (+j2?.Wt);
            // }else{
            //   diamondMetalPurityWise[recordIs3].Wt += +j2?.Wt;
            //   diamondMetalPurityWise[recordIs3].Pcs += +j2?.Pcs;
            //   diamondMetalPurityWise[recordIs3].Rate += +j2?.Rate;
            //   diamondMetalPurityWise[recordIs3].Amount += +j2?.Amount;
            //   diamondWtMetalPurityWise += +j2?.Wt;
            // }
          }
          if (j2?.MasterManagement_DiamondStoneTypeid === 2) {
            let recordIs = blankArrColorstone?.findIndex(
              (e) =>
                e?.ShapeName === j2?.ShapeName &&
                e?.QualityName === j2?.QualityName &&
                e?.Colorname === j2?.Colorname
            );
            if (recordIs === -1) {
              blankArrColorstone.push(j2);
            } else {
              blankArrColorstone[recordIs].Wt += +j2?.Wt;
              blankArrColorstone[recordIs].Pcs += +j2?.Pcs;
              blankArrColorstone[recordIs].Rate += +j2?.Rate;
              blankArrColorstone[recordIs].Amount += +j2?.Amount;
            }

            let recordIs2 = colorstoneSettingGroup?.findIndex(
              (e) =>
                e?.ShapeName === j2?.ShapeName &&
                e?.QualityName === j2?.QualityName &&
                e?.Colorname === j2?.Colorname &&
                e?.SizeName === j2?.colorstoneSettingGroup
            );
            if (recordIs2 === -1) {
              colorstoneSettingGroup.push(j2);
            } else {
              colorstoneSettingGroup[recordIs2].Wt += +j2?.Wt;
              colorstoneSettingGroup[recordIs2].Pcs += +j2?.Pcs;
              colorstoneSettingGroup[recordIs2].Rate += +j2?.Rate;
              colorstoneSettingGroup[recordIs2].Amount += +j2?.Amount;
              colorstoneSettingGroup[recordIs2].SettingAmount +=
                +j2?.SettingAmount;
            }

            // let recordIs3 = colorstoneMetalPurityWise?.findIndex((e) => e?.QualityName === j2?.QualityName);
            // if(recordIs3 === -1){
            //   colorstoneMetalPurityWise.push(j2);
            //   colorstoneWtMetalPurityWise = (+j2?.Wt);
            // }else{
            //   colorstoneMetalPurityWise[recordIs3].Wt += +j2?.Wt;
            //   colorstoneMetalPurityWise[recordIs3].Pcs += +j2?.Pcs;
            //   colorstoneMetalPurityWise[recordIs3].Rate += +j2?.Rate;
            //   colorstoneMetalPurityWise[recordIs3].Amount += +j2?.Amount;
            //   colorstoneWtMetalPurityWise += +j2?.Wt;
            // }
          }
          if (j2?.MasterManagement_DiamondStoneTypeid === 3) {
            let recordIs = blankArrMisc?.findIndex(
              (e) =>
                e?.ShapeName === j2?.ShapeName &&
                e?.QualityName === j2?.QualityName &&
                e?.Colorname === j2?.Colorname
            );
            if (recordIs === -1) {
              blankArrMisc.push(j2);
            } else {
              blankArrMisc[recordIs].Wt += +j2?.Wt;
              blankArrMisc[recordIs].Pcs += +j2?.Pcs;
              blankArrMisc[recordIs].Rate += +j2?.Rate;
              blankArrMisc[recordIs].Amount += +j2?.Amount;
            }
          }
          if (j2?.MasterManagement_DiamondStoneTypeid === 4) {
            let recordIs = blankArrMetal?.findIndex(
              (e) =>
                e?.ShapeName === j2?.ShapeName &&
                e?.QualityName === j2?.QualityName &&
                e?.Colorname === j2?.Colorname
            );
            if (recordIs === -1) {
              blankArrMetal.push(j2);
            } else {
              blankArrMetal[recordIs].Wt += +j2?.Wt;
              blankArrMetal[recordIs].Pcs += +j2?.Pcs;
              blankArrMetal[recordIs].Rate += +j2?.Rate;
              blankArrMetal[recordIs].Amount += +j2?.Amount;
            }
          }
          if (j2?.MasterManagement_DiamondStoneTypeid === 5) {
            let recordIs = blankArrFinding?.findIndex(
              (e) =>
                e?.ShapeName === j2?.ShapeName &&
                e?.QualityName === j2?.QualityName &&
                e?.Colorname === j2?.Colorname
            );
            if (recordIs === -1) {
              blankArrFinding.push(j2);
            } else {
              blankArrFinding[recordIs].Wt += +j2?.Wt;
              blankArrFinding[recordIs].Pcs += +j2?.Pcs;
              blankArrFinding[recordIs].Rate += +j2?.Rate;
              blankArrFinding[recordIs].Amount += +j2?.Amount;
            }
          }
          if (
            j2?.MasterManagement_DiamondStoneTypeid === 2 ||
            j2?.MasterManagement_DiamondStoneTypeid === 3
          ) {
            // blankArrstone_misc
            let recordIs = blankArrstone_misc?.findIndex(
              (e) =>
                e?.ShapeName === j2?.ShapeName &&
                e?.QualityName === j2?.QualityName &&
                e?.Colorname === j2?.Colorname
            );
            if (recordIs === -1) {
              blankArrstone_misc.push(j2);
            } else {
              blankArrstone_misc[recordIs].Wt += +j2?.Wt;
              blankArrstone_misc[recordIs].Pcs += +j2?.Pcs;
              blankArrstone_misc[recordIs].Rate += +j2?.Rate;
              blankArrstone_misc[recordIs].Amount += +j2?.Amount;
            }
          }
        }
      });
      diamond_colorstone_misc?.forEach((e) => {
        maintotal.total_diamond_colorstone_misc_amount += +e?.Amount;
      });
      // json2?.forEach((e) => {
      //   if(e?.QualityName === j1?.MetalPurity){
      //     diamondWtMetalPurityWise += 
      //   }
      // })
      let obj = { ...j1 };
      obj.diamond_colorstone_misc = diamond_colorstone_misc;
      obj.diamonds = diamondList;
      obj.colorstone = colorstoneList;
      obj.misc = miscList;
      obj.metal = metalList;
      obj.finding = findingList;
      obj.totals = jobwise_totals;
      obj.other_amount_details = other_details;
      obj.grouping_of_diamonds_sqc_jobwise = blankArrDiamond;
      obj.grouping_of_colorstone_sqc_jobwise = blankArrColorstone;
      obj.grouping_of_misc_sqc_jobwise = blankArrMisc;
      // obj.grouping_of_metal_sqc_jobwise = blankArrMetal;
      obj.grouping_of_finding_sqc_jobwise = blankArrFinding;
      obj.grouping_of_stone_misc_sqc_jobwise = blankArrstone_misc;
      obj.diamondSettingGroup = diamondSettingGroup;
      obj.colorstoneSettingGroup = colorstoneSettingGroup;
      obj.diamondMetalPurityWise = diamondMetalPurityWise;
      obj.colorstoneMetalPurityWise = colorstoneMetalPurityWise;
      obj.diamondWtMetalPurityWise = diamondWtMetalPurityWise;
      obj.colorstoneWtMetalPurityWise = colorstoneWtMetalPurityWise;
      obj.Making_Amount_Other_Charges = jobwise_totals.Making_Amount_Other_Charges;
      resultArray.push(obj);
    });

  //totalAmount
  let totalAmount = maintotal.total_amount + header?.AddLess;
  let allTax = taxGenrator(header, totalAmount);

  let brArr = [];
  if (header?.Brokerage?.length > 0) {
    let blankArr = header?.Brokerage?.split("@-@");
    let resultArr = [];
    blankArr.forEach((e, i) => {
      let obj = {};
      let arr = e?.split("#-#");
      obj.label = arr[0];
      obj.value = arr[1];
      resultArr.push(obj);
    });
    brArr = resultArr;
    // return resultArr;
  }

  allTax?.length > 0 &&
    allTax?.forEach((e) => {
      totalAmount += +e?.amount;
      const [dollars, cents] = e?.amount?.split(".");
      const amountInWords = [
        numberToWords.toWords(parseInt(dollars)),
        "point",
        numberToWords.toWords(parseInt(cents || "0")),
        "",
      ]
        .filter(Boolean)
        .join(" ");
      e.amountInWords = `TOTAL ${e.name} IN WORDS: ${
        amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1)
      }`;
    });
  totalAmount = (+totalAmount)?.toFixed(2);

  let headerObj = {...header};
  headerObj.BrokerageDetails = brArr; 
  const finalObject = {
    resultArray: resultArray,
    mainTotal: maintotal,
    finalAmount: +totalAmount,
    allTaxes: allTax,
    header: headerObj,
    json1: json1,
    json2: json2,
  };
  return finalObject;
};
