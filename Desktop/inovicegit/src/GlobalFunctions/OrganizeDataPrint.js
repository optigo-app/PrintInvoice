import { otherAmountDetail } from "../GlobalFunctions";

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
    labour: {
      labour_rate: 0,
      labour_amount: 0,
    },
    other: 0,
    grosswt: 0,
    netwt: 0,
    total_amount: 0,
    total_unitcost: 0,
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
      maintotal.labour.labour_rate += j1?.MaKingCharge_Unit;
      maintotal.labour.labour_amount += j1?.MakingAmount;
      maintotal.other += j1?.OtherCharges;
      maintotal.netwt += j1?.NetWt;
      maintotal.grosswt += j1?.grosswt;
      maintotal.total_amount += j1?.TotalAmount;
      maintotal.total_unitcost += j1?.UnitCost; 

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
        let obj = {...j1};
        obj.diamonds = diamondList;
        obj.colorstone = colorstoneList;
        obj.misc = miscList;
        obj.metal = metalList;
        obj.finding = findingList;
        obj.maintotal = maintotal;
        obj.totals = jobwise_totals;
        obj.other_amount_details = other_details;
        resultArray.push(obj);
    });
    console.log(resultArray);
    return {resultArray, maintotal};
};
