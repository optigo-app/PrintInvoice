import axios from "axios";

export const GetData = async (job) => {
    try {
        let p_tag = { "SerialJobno": `${job?.jobno}`, "customerid": `${job.custid}`, "BagPrintName": `${job.printname}` };
        let jsonString = JSON.stringify(p_tag);
        let base64String = btoa(jsonString);
        let Body = {
            "con": `{\"id\":\"\",\"mode\":\"${job.printname}\",\"appuserid\":\"${job.appuserid}\"}`,
            "p": `${base64String}`,
            "f": `${job.appuserid} ${job.printname}`
        };
        let urls = atob(job.url);
        const response = await axios.post(urls, Body, { headers: job.headers });
        let datas = JSON.parse(response.data.d);

        
        return datas;
    } catch (error) {
        console.log(error);
    }
    // try {
    //     let p_tag = { "SerialJobno": `${job?.jobno}`, "customerid": `${job.custid}`, "BagPrintName": `${job.printname}` };
    //     let jsonString = JSON.stringify(p_tag);
    //     let base64String = btoa(jsonString);
    //     let Body = {
    //         "con": `{\"id\":\"\",\"mode\":\"${job.printname}\",\"appuserid\":\"${job.appuserid}\"}`,
    //         "p": `${base64String}`,
    //         "f": `${job.appuserid} ${job.printname}`
    //     };
    //     let urls = atob(job.url);
    //     const response = await axios.post(urls, Body, { headers: job.headers });
    //     let datas = JSON.parse(response.data.d);
    //     return datas;
    // } catch (error) {
    //     console.log(error);
    // }

};