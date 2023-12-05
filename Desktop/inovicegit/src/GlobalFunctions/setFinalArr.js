export const setFinalArr = (resultArr) => {
    // const groupedByGroupJob = resultArr.reduce((acc, obj) => {
    //     const key = obj.GroupJob || ''; // Use 'Unknown' if GroupJob is undefined or empty
    //     if (!acc[key]) {
    //       acc[key] = [];
    //     }
    //     acc[key].push(obj);
    //     return acc;
    //   }, {});
      
    //   const groupedArray = Object.values(groupedByGroupJob);
      
    //   console.log(groupedArray);
      
    //   groupedArray?.forEach((innerloop) => {
        
    //       console.log("hello");
    //       let diaarr = [];
    //       let clsarr = [];
    //       let miscarr = [];
    //       let metalarr = [];
    //       let findingarr = [];
    //       let blankArr = [];

    //         innerloop?.forEach((a, i) => {
    //             console.log(a);
    //             if(a?.SrJobno === a?.GroupJob){
    //                 console.log("same");
    //             }else{
    //                 a.SrJobno = a?.GroupJob;
                    
    //             }
    //             // a.SrJobno = a?.GroupJob;
    //             // console.log(a);
    //             diaarr.push(...a.diamonds)
    //             clsarr.push(...a.colorstone)
    //         })
            
    //         innerloop.forEach((ele) => {
    //             ele.diamonds = diaarr;
    //             ele.colorstone = clsarr;
    //         })
    //   })
    //   console.log(groupedArray);





    // let semiFinalArr = [];
    // let arr = [];
    // resultArr?.forEach((e) => {
    //     if(e?.GroupJob === ''){
    //         semiFinalArr?.push(e)
    //     }else{
    //         arr.push(e);
    //         let obj = {...e};
    //         let findRecord = semiFinalArr.findIndex((e) => e.GroupJob === obj?.GroupJob);
    //         if(findRecord === -1){
    //             //eno matlab k nthi mlto record to
    //             semiFinalArr.push(obj);
    //         }else{
    //             //etle k jo semiFinalArr ma record mli jaay GroupJob same hoy evo to 
    //             if(semiFinalArr[findRecord]?.GroupJob !== semiFinalArr[findRecord].SrJobno){
    //                   semiFinalArr[findRecord].SrJobno = obj.GroupJob;
    //                   semiFinalArr[findRecord].HUID =  obj.HUID;
    //                   semiFinalArr[findRecord].CertificateNo = obj.CertificateNo ;
    //                   semiFinalArr[findRecord].DesignImage = obj.DesignImage;
    //                   semiFinalArr[findRecord].JewelCodePrefix = obj.JewelCodePrefix ;
    //                   semiFinalArr[findRecord].designno = obj.designno ;
    //             }
    //             let diamonds = [obj.diamonds, semiFinalArr[findRecord].diamonds]?.flat();
    //             let colorstone = [obj.colorstone, semiFinalArr[findRecord].colorstone]?.flat();
    //             let blankArrDia = [];
    //             let blankArrCls = [];
    //             // console.log(diamonds);
    //             diamonds?.forEach((ele) => {
    //                 let findRecord = blankArrDia?.findIndex((a) => a?.ShapeName === ele?.ShapeName && a?.QualityName === ele?.QualityName && a?.Colorname === ele?.Colorname && a?.Rate)    
    //                 if(findRecord === -1){
    //                     blankArrDia.push(ele);
    //                 }else{
    //                     blankArrDia[findRecord].Wt += ele?.Wt;
    //                     blankArrDia[findRecord].Pcs += ele?.Pcs;
    //                     blankArrDia[findRecord].Amount += ele?.Amount;
    //                 }
    //             })
    //             colorstone?.forEach((ele) => {
    //                 let findRecord = blankArrCls?.findIndex((a) => a?.ShapeName === ele?.ShapeName && a?.QualityName === ele?.QualityName && a?.Colorname === ele?.Colorname && a?.Rate)    
    //                 if(findRecord === -1){
    //                     blankArrCls.push(ele);
    //                 }else{
    //                     blankArrCls[findRecord].Wt += ele?.Wt;
    //                     blankArrCls[findRecord].Pcs += ele?.Pcs;
    //                     blankArrCls[findRecord].Amount += ele?.Amount;
    //                 }
    //             })
    //             obj.diamonds = diamonds;
    //             obj.colorstone = colorstone;
    //         }
    //     }   
    // })

    // console.log(semiFinalArr);
}

