export const setFinalArr = (semiFinalArr) => {
    console.log(semiFinalArr);
    let finalArr = [];
    semiFinalArr?.forEach((e, i) => {
            console.log(e);
            if(e?.GroupJob === ''){
                finalArr.push(e);
            }else{
                let obj = {...e};
                let findRecord =  finalArr?.findIndex((e) => e?.GroupJob === obj.SrJobno);
                if(findRecord === -1){
                    finalArr.push(obj);
                }else{
                    if(obj.GroupJob !== obj.SrJobno){
                        
                    }
                }
                console.log(finalArr[findRecord]);
            }
    })



}