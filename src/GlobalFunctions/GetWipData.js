import axios from "axios";
 

 

export const GetWipData = async (queries,sp ) => {

    
    console.log("TCL: GetWipData ->queries ", queries)

    const header = {
      YearCode:  queries?.YearCode,
      version:    queries?.version,
      sv:    queries?.report_sv,
      sp: queries?.spno,
    };
  const body={
    "con": "{\"id\": \"\", \"mode\": \"WIPprint\", \"appuserid\": \""+queries?.appuserid+"\"}",
    "p": "{\"wip_id\": \""+queries?.rfbag+"\"}",
    "f": "DynamicReport ( get sp list )"
  }
  try {
    const response = await axios.post( queries?.url, body, { headers: header });
    
    // console.log("TCL: GetWipData -> ", response.data)
    return response?.data;
  } catch (error) {
    console.error("error is..", error);
  }
};

export default GetWipData;