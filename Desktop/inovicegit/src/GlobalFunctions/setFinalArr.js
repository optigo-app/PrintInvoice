export const setFinalArr = (resultArr) => {
    console.log(resultArr);
    let semiFinalArr = [];
    resultArr?.forEach((e) => {
        if(e?.GroupJob === ''){
            semiFinalArr?.push(e)
        }else{
            let obj = {...e};
            let findRecord = semiFinalArr.findIndex((e) => e.GroupJob === obj?.GroupJob);
            if(findRecord === -1){
                //eno matlab k nthi mlto record to
                semiFinalArr.push(obj);
            }else{
                //etle k jo semiFinalArr ma record mli jaay GroupJob same hoy evo to 
                if(semiFinalArr[findRecord]?.GroupJob !== semiFinalArr[findRecord].SrJobno){
                    console.log("g and s same",semiFinalArr[findRecord]);
                      semiFinalArr[findRecord].SrJobno = obj.SrJobno;
                      semiFinalArr[findRecord].HUID =  obj.HUID;
                      semiFinalArr[findRecord].CertificateNo = obj.CertificateNo ;
                      semiFinalArr[findRecord].DesignImage = obj.DesignImage;
                      semiFinalArr[findRecord].JewelCodePrefix = obj.JewelCodePrefix ;
                      semiFinalArr[findRecord].designno = obj.designno ;
                }

                let diamonds = [obj.diamonds, semiFinalArr[findRecord].diamonds]?.flat();
                console.log(diamonds);
                let blankArrDia = [];
                let blankArrCls = [];

                diamonds?.forEach((ele) => {
                    let findRecord = blankArrDia?.findIndex((a) => a?.ShapeName === ele?.ShapeName && a?.QualityName === ele?.QualityName && a?.Colorname === ele?.Colorname && a?.Rate)    
                    console.log(findRecord);
                    
                })

            }
        }   
    })


}