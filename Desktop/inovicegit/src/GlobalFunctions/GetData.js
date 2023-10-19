import axios from "axios";

export const GetData = async (job) => {
<<<<<<< HEAD
=======
    console.log(job);
    // console.log(job);
>>>>>>> 80a7e2f5bccab33f4816ef57b9a06cb1c5c0668a
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
        console.log(response);
        let datas = JSON.parse(response.data.d);
        console.log(datas);
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