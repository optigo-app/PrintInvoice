export const setFinalArr = (semiFinalArr, arr, arr1, arr2) => {
    let finalArr = [];
    semiFinalArr?.forEach((e, i) => {
        
        if(e?.GroupJob === ''){
            finalArr.push(e)
        }else{
            let obj = {...e};
            let findRecord = finalArr?.findIndex((elem) => elem?.GroupJob === elem?.SrJobno);
            if(findRecord === -1){
                finalArr.push(obj);
            }else{
                if(obj.GroupJob !== obj.SrJobno){

                    console.log(finalArr[findRecord]);
                    // obj.SrJobno = finalArr[findRecord].SrJobno;
                    // obj.DesignImage = finalArr[findRecord].DesignImage;
                    // obj.HUID = finalArr[findRecord].HUID;
                    // obj.designno = finalArr[findRecord].designno;
                    // obj.CertificateNo = finalArr[findRecord].CertificateNo;
                    // obj.JewelCodePrefix = finalArr[findRecord].JewelCodePrefix;
                }
            }
            
        }
    })



}