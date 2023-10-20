import axios from "axios";

export const GetData = async (job) => {
<<<<<<< HEAD
    console.log(job);
=======
>>>>>>> e93a1ed2cf84bfbb8ec335172c1f3d33acb961c6
    // console.log(job);
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