import { CapitalizeWords, otherAmountDetail, taxGenrator } from "../GlobalFunctions";
import { numberToWords } from "number-to-words";
import { cloneDeep } from 'lodash';
export const OrganizeDataPrint = (header2, json1_1, json2_1) => {

  let header = cloneDeep(header2);
  let json1 = cloneDeep(json1_1);
  let json2 = cloneDeep(json2_1);

  let resultArray = [];
  let jobnodup = [];
  let maintotal = {
    diamonds: {
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
      SettingAmount: 0
    },
    colorstone: {
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
      SettingAmount: 0
    },
    metal: {
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
      FineWt: 0,
      IsPrimaryMetal:0,
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
    diamond_colorstone_misc:{
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
    },
    diamond_colorstone_misc_2_new:{
      Wt: 0,
      Pcs: 0,
      Rate: 0,
      Amount: 0,
    },
    total_labour: {
      labour_rate: 0,
      labour_amount: 0,
    },
    total_other_charges: 0,
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
    total_csamount: 0,
    total_Making_Amount_Other_Charges: 0,
    total_fineWtByMetalWtCalculation: 0,
    totalMiscAmount: 0,
    total_otherChargesMiscHallStamp: 0,
    total_TotalCsSetcost: 0,
    total_TotalDiaSetcost: 0,
    total_MakingAmount_Setting_Amount: 0,
    total_otherCharge_Diamond_Handling: 0,
    
  };


  //json1 array
  json1?.length > 0 &&
    json1?.forEach((j1) => {
      let diamond_colorstone_misc = [];
      let diamond_colorstone_misc_2_new = [];
      let diamondList = [];
      let colorstoneList = [];
      let metalList = [];
      let findingList = [];
      let miscList = [];
      let stone_miscList = [];
      // let blankArrDiamond = [];
      // let blankArrColorstone = [];
      // let blankArrMisc = [];
      // let blankArrMetal = [];
      // let blankArrFinding = [];
      // let blankArrstone_misc = [];
      // let diamondSettingGroup = [];
      // let colorstoneSettingGroup = [];
      // let diamondMetalPurityWise = [];
      // let colorstoneMetalPurityWise = [];
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
        Making_Amount_Other_Charges: 0,
        fineWtByMetalWtCalculation: 0,
        otherChargesMiscHallStamp: 0,
        makingAmount_settingAmount: 0,
      };
      
      let other_details = otherAmountDetail(j1?.OtherAmtDetail);
      maintotal.total_labour.labour_rate += j1?.MaKingCharge_Unit;
      maintotal.total_labour.labour_amount += j1?.MakingAmount;
      maintotal.total_other += j1?.OtherCharges;
      jobwise_totals.Making_Amount_Other_Charges += j1?.MakingAmount + j1?.OtherCharges;
      maintotal.total_Making_Amount_Other_Charges += j1?.MakingAmount + j1?.OtherCharges;
      maintotal.netwt += j1?.NetWt;
      maintotal.netwtWithLossWt = maintotal.netwtWithLossWt + (+j1?.NetWt + +j1?.LossWt);
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
      maintotal.total_other_charges += j1?.OtherCharges;
      maintotal.total_csamount += j1?.CsAmount;
      maintotal.totalMiscAmount += j1?.MiscAmount;
      maintotal.total_TotalCsSetcost += j1?.TotalCsSetcost;
      maintotal.total_TotalDiaSetcost += j1?.TotalDiaSetcost;
      maintotal.total_otherCharge_Diamond_Handling += j1?.TotalDiamondHandling + j1?.OtherCharges + j1?.MiscAmount;



      //json2
      json2?.length > 0 &&
        json2?.forEach((j2, i) => {
          
          if (j1?.SrJobno === j2?.StockBarcode) {
            //for diamond
            if (j2?.MasterManagement_DiamondStoneTypeid === 1) {
              diamond_colorstone_misc?.push(j2);
              diamond_colorstone_misc_2_new?.push(j2);
              diamondList.push(j2);
              jobwise_totals.diamonds.Wt += j2?.Wt;
              jobwise_totals.diamonds.Pcs += j2?.Pcs;
              jobwise_totals.diamonds.Rate += j2?.Rate;
              jobwise_totals.diamonds.Amount += j2?.Amount;
              jobwise_totals.diamonds.FineWt += j2?.FineWt;
              jobwise_totals.diamonds.SettingAmount += j2?.SettingAmount;
              jobwise_totals.diamonds.length += 1;
              maintotal.diamonds.Wt += j2?.Wt;
              maintotal.diamonds.total_FineWt += j2?.FineWt;
              maintotal.diamonds.Pcs += j2?.Pcs;
              maintotal.diamonds.Rate += j2?.Rate;
              maintotal.diamonds.Amount += j2?.Amount;
              maintotal.diamonds.SettingAmount += +j2?.SettingAmount;
            }
            //for colorstone
            if (j2?.MasterManagement_DiamondStoneTypeid === 2) {
              colorstoneList.push(j2);
              diamond_colorstone_misc?.push(j2);
              diamond_colorstone_misc_2_new?.push(j2);
              jobwise_totals.colorstone.Wt += j2?.Wt;
              jobwise_totals.colorstone.Pcs += j2?.Pcs;
              jobwise_totals.colorstone.Rate += j2?.Rate;
              jobwise_totals.colorstone.Amount += j2?.Amount;
              jobwise_totals.colorstone.FineWt += j2?.FineWt;
              jobwise_totals.colorstone.SettingAmount += j2?.SettingAmount;
              jobwise_totals.colorstone.length += 1;
              maintotal.colorstone.Wt += j2?.Wt;
              maintotal.colorstone.total_FineWt += j2?.FineWt;
              maintotal.colorstone.Pcs += j2?.Pcs;
              maintotal.colorstone.Rate += j2?.Rate;
              maintotal.colorstone.Amount += j2?.Amount;
              maintotal.colorstone.SettingAmount += +j2?.SettingAmount;
            }
            //for metal
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
              maintotal.metal.FineWt += +j2?.FineWt;
              maintotal.metal.Pcs += j2?.Pcs;
              maintotal.metal.Rate += j2?.Rate;
              maintotal.metal.Amount += j2?.Amount;
              if(j2?.IsPrimaryMetal === 1){
                maintotal.metal.IsPrimaryMetal += j2?.Wt;
              }
            }
            //for misc
            if (j2?.MasterManagement_DiamondStoneTypeid === 3) {
              diamond_colorstone_misc_2_new?.push(j2);
              if (j2?.ShapeName === "Hallmark" || j2?.ShapeName === "Stamping") {
              } else {
                diamond_colorstone_misc?.push(j2);
              }
              miscList.push(j2);
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
              if (j2?.ShapeName === 'Hallmark' || j2?.ShapeName === 'Stamping' || j2?.ShapeName?.includes('Certification')) {
                jobwise_totals.otherChargesMiscHallStamp += j2?.Amount;
                maintotal.total_otherChargesMiscHallStamp += j2?.Amount;
              }

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
            // if(j1?.LossWt !== 0){
            //   if(j2?.MasterManagement_DiamondStoneTypeid === 5){
            //     console.log("sdfjhb",j2?.FineWt);
            //     jobwise_totals.fineWtByMetalWtCalculation = (((j1?.NetWt * (j1?.Tunch + j1?.Wastage))/100) + ((j2?.FineWt)))
            //     // (((j2?.Wt * (j1?.Tunch + j1?.Wastage))/100) + ((j1?.NetWt * (j1?.Tunch + j1?.Wastage))/100))
            //   }
            // }
            jobwise_totals.makingAmount_settingAmount += j2?.SettingAmount;

            //ending of comparing of job no block
          }
        });

      diamond_colorstone_misc?.forEach((e) => {
        maintotal.total_diamond_colorstone_misc_amount += +e?.Amount;
        maintotal.diamond_colorstone_misc.Amount += +e?.Amount;
        maintotal.diamond_colorstone_misc.Rate += +e?.Rate;
        maintotal.diamond_colorstone_misc.Wt += +e?.Wt;
        maintotal.diamond_colorstone_misc.Pcs += +e?.Pcs;
      });

      // diamond_colorstone_misc_2_new?.forEach((e) => {
      //   maintotal.total_diamond_colorstone_misc_amount += +e?.Amount;
      //   maintotal.diamond_colorstone_misc_2_new.Amount += +e?.Amount;
      //   maintotal.diamond_colorstone_misc_2_new.Rate += +e?.Rate;
      //   maintotal.diamond_colorstone_misc_2_new.Wt += +e?.Wt;
      //   maintotal.diamond_colorstone_misc_2_new.Pcs += +e?.Pcs;
      // });

      let obj = { ...j1 };

      diamond_colorstone_misc?.forEach((e) => {
        if (e?.ShapeName === "Certification_NM award") {
          jobnodup.push(e);
        }
      })
      let diawtdup = 0;
      diamond_colorstone_misc?.forEach((e) => {
        jobnodup?.forEach((a) => {
          if ((a?.StockBarcode === e?.StockBarcode) && e?.MasterManagement_DiamondStoneTypeid === 1) {
            diawtdup += e?.Wt;
          }
        })
      })
      jobwise_totals.makingAmount_settingAmount += j1?.MakingAmount;
      obj.diamond_colorstone_misc = diamond_colorstone_misc;
      // obj.diamond_colorstone_misc_2_new = diamond_colorstone_misc_2_new;
      obj.certificateWtDia = diawtdup;
      obj.diamonds = diamondList;
      obj.colorstone = colorstoneList;
      obj.stone_misc = stone_miscList;
      obj.misc = miscList;
      obj.metal = metalList;
      obj.finding = findingList;
      obj.totals = jobwise_totals;
      // obj.grouping_of_diamonds_sqc_jobwise = blankArrDiamond;
      // obj.grouping_of_colorstone_sqc_jobwise = blankArrColorstone;
      // obj.grouping_of_misc_sqc_jobwise = blankArrMisc;
      // obj.grouping_of_metal_sqc_jobwise = blankArrMetal;
      // obj.grouping_of_finding_sqc_jobwise = blankArrFinding;
      // obj.grouping_of_stone_misc_sqc_jobwise = blankArrstone_misc;
      // obj.diamondSettingGroup = diamondSettingGroup;
      // obj.colorstoneSettingGroup = colorstoneSettingGroup;
      // obj.diamondMetalPurityWise = diamondMetalPurityWise;
      // obj.colorstoneMetalPurityWise = colorstoneMetalPurityWise;
      obj.diamondWtMetalPurityWise = diamondWtMetalPurityWise;
      obj.colorstoneWtMetalPurityWise = colorstoneWtMetalPurityWise;
      obj.Making_Amount_Other_Charges = jobwise_totals.Making_Amount_Other_Charges;
      obj.other_details = other_details;
      obj.fineWtByMetalWtCalculation = jobwise_totals.fineWtByMetalWtCalculation;
      maintotal.total_MakingAmount_Setting_Amount += jobwise_totals.makingAmount_settingAmount;
      maintotal.total_fineWtByMetalWtCalculation += jobwise_totals.fineWtByMetalWtCalculation;

      resultArray.push(obj);
    });

  //totalAmount
  // let totalAmount = maintotal.total_amount + header?.AddLess + maintotal?.total_discount_amount ;
  // let totalAmount = maintotal.total_amount + header?.AddLess + header?.FreightCharges;
  let totalAmount = maintotal.total_amount;
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

  }

  //alltax
  allTax?.length > 0 &&
    allTax?.forEach((e) => {
      const [dollars, cents] = e?.amount?.split(".");
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
      let amtInWords = CapitalizeWords(amountInWords)
      e.amountInWords = `TOTAL ${e.name} IN WORDS: ${amtInWords}`;
    });
  allTax?.forEach((e) => {
    totalAmount += (+e?.amount);
  })
  totalAmount = (+totalAmount)?.toFixed(2);
  totalAmount = (+totalAmount) + (+header?.AddLess);
  // totalAmount = (+totalAmount) + (+header?.AddLess) + (+header?.FreightCharges);

  let headerObj = { ...header };

  headerObj.BrokerageDetails = brArr;

  // resultArray.sort((a, b) => a.designno - b.designno);
  const customSort = (a, b) => {

    if (isNaN(a?.designno) && isNaN(b?.designno)) {
      // If both are non-numeric, compare as strings
      return (a?.designno)?.localeCompare(b?.designno);
    } else if (isNaN(a?.designno)) {
      // If only 'a' is non-numeric, place it at the end
      return 1;
    } else if (isNaN(b?.designno)) {
      // If only 'b' is non-numeric, place it at the end
      return -1;
    } else {
      // If both are numeric, compare as numbers
      return a?.designno - b?.designno;
    }
  };

  resultArray?.sort(customSort);

  // organizeDiamonds.sort((a, b) => {
  //   if (a.shapeColorQuality === "OTHER") return 1; // "OTHER" values go to the end
  //   if (b.shapeColorQuality === "OTHER") return -1; // "OTHER" values go to the end
  //   return a.shapeColorQuality.localeCompare(b.shapeColorQuality); // Sort alphabetically
  // });

  const finalObject = {
    resultArray: resultArray,
    mainTotal: maintotal,
    finalAmount: +totalAmount,
    allTaxes: allTax,
    header: headerObj,
    json1: json1,
    json2: json2,
    // organizeDiamonds: organizeDiamonds,
  };
  return finalObject;
};
