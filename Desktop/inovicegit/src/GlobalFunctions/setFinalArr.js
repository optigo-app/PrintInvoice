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
                if(obj?.GroupJob === obj.SrJobno){
                    console.log("g and s same",semiFinalArr[findRecord]);
                    obj.SrJobno = semiFinalArr[findRecord].GroupJob;
                    obj.HUID = semiFinalArr[findRecord].HUID;
                    obj.CertificateNo = semiFinalArr[findRecord].CertificateNo;
                    obj.DesignImage = semiFinalArr[findRecord].DesignImage;
                    obj.JewelCodePrefix = semiFinalArr[findRecord].JewelCodePrefix;
                    obj.designno = semiFinalArr[findRecord].designno;
                }else{
                    console.log("g and s not same",semiFinalArr[findRecord]);
                }
            }
        }   
    })


}