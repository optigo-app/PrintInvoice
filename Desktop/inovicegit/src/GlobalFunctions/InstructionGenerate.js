export const InstructionGenerate = (rd) => {
  let officeuse = rd?.officeuse;
  let productIns = rd?.ProductInstruction;
  let custIns = rd?.custInstruction;
  let instruction1 = "";
  let instruction2 = "";
  let instruction3 = "";
  let instruction = "";
  if((officeuse !== null && officeuse !== "null" && officeuse !== "undefined" && officeuse !== undefined)){
    instruction1 = officeuse;
  }
  if((productIns !== null && productIns !== "null" && productIns !== "undefined" && productIns !== undefined)){
    instruction2 = productIns;
  }
  if((custIns !== null && custIns !== "null" && custIns !== "undefined" && custIns !== undefined)){
    instruction3 = custIns;
  }
  instruction = (instruction1 + instruction2 + instruction3);
  return instruction;
};
