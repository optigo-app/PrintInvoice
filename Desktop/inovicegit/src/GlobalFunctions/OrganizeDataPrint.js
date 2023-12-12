import { otherAmountDetail, taxGenrator } from "../GlobalFunctions";

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
    total_other: 0,
    grosswt: 0,
    netwt: 0,
    total_amount: 0,
    total_unitcost: 0,
    total_discount_amount: 0,
    total_purenetwt: 0,
  };
  //json1 array
  json1?.length > 0 &&
    json1?.forEach((j1, i) => {
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
      let jobwise_totals = {
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
      };

      let other_details = otherAmountDetail(j1?.OtherAmtDetail);
      maintotal.total_labour.labour_rate += j1?.MaKingCharge_Unit;
      maintotal.total_labour.labour_amount += j1?.MakingAmount;
      maintotal.total_other += j1?.OtherCharges;
      maintotal.netwt += j1?.NetWt;
      maintotal.grosswt += j1?.grosswt;
      maintotal.total_amount += j1?.TotalAmount;
      maintotal.total_unitcost += j1?.UnitCost;
      maintotal.total_discount_amount += j1?.DiscountAmt;
      maintotal.total_purenetwt += j1?.PureNetWt;

      //json2
      json2?.length > 0 &&
        json2?.forEach((j2, i) => {
          if (j1?.SrJobno === j2?.StockBarcode) {
            //for diamond
            if (j2?.MasterManagement_DiamondStoneTypeid === 1) {
              diamondList.push(j2);
              jobwise_totals.diamonds.Wt += j2?.Wt;
              jobwise_totals.diamonds.Pcs += j2?.Pcs;
              jobwise_totals.diamonds.Rate += j2?.Rate;
              jobwise_totals.diamonds.Amount += j2?.Amount;
              maintotal.diamonds.Wt += j2?.Wt;
              maintotal.diamonds.Pcs += j2?.Pcs;
              maintotal.diamonds.Rate += j2?.Rate;
              maintotal.diamonds.Amount += j2?.Amount;
            }
            //for colorstone
            if (j2?.MasterManagement_DiamondStoneTypeid === 2) {
              colorstoneList.push(j2);
              jobwise_totals.colorstone.Wt += j2?.Wt;
              jobwise_totals.colorstone.Pcs += j2?.Pcs;
              jobwise_totals.colorstone.Rate += j2?.Rate;
              jobwise_totals.colorstone.Amount += j2?.Amount;
              maintotal.colorstone.Wt += j2?.Wt;
              maintotal.colorstone.Pcs += j2?.Pcs;
              maintotal.colorstone.Rate += j2?.Rate;
              maintotal.colorstone.Amount += j2?.Amount;
            }
            //for misc
            if (j2?.MasterManagement_DiamondStoneTypeid === 3) {
              miscList.push(j2);
              jobwise_totals.metal.Wt += j2?.Wt;
              jobwise_totals.metal.Pcs += j2?.Pcs;
              jobwise_totals.metal.Rate += j2?.Rate;
              jobwise_totals.metal.Amount += j2?.Amount;
              maintotal.metal.Wt += j2?.Wt;
              maintotal.metal.Pcs += j2?.Pcs;
              maintotal.metal.Rate += j2?.Rate;
              maintotal.metal.Amount += j2?.Amount;
            }
            //for metal
            if (j2?.MasterManagement_DiamondStoneTypeid === 4) {
              metalList.push(j2);
              jobwise_totals.misc.Wt += j2?.Wt;
              jobwise_totals.misc.Pcs += j2?.Pcs;
              jobwise_totals.misc.Rate += j2?.Rate;
              jobwise_totals.misc.Amount += j2?.Amount;
              maintotal.misc.Wt += j2?.Wt;
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
              maintotal.finding.Wt += j2?.Wt;
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
              console.log("hello", j2?.StockBarcode);
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
          if(j2?.MasterManagement_DiamondStoneTypeid === 2 || j2?.MasterManagement_DiamondStoneTypeid === 3){
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
      let obj = { ...j1 };
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
      resultArray.push(obj);
    });

  //totalAmount
  let totalAmount = maintotal.total_amount + header?.AddLess;
  let allTax = taxGenrator(header, totalAmount);

  allTax?.length > 0 &&
    allTax?.forEach((e) => {
      totalAmount += +e?.amount;
    });

  const finalObject = {
    resultArray: resultArray,
    mainTotal: maintotal,
    finalAmount: totalAmount,
    allTaxes: allTax,
  };
  return finalObject;
};
