export const GetUniquejob = (str_srjobno) => {
  let job = str_srjobno;
  const parts = job?.split(",");
  const jobs = [...new Set(parts)];
  const resultString = jobs?.map((part) => `'${part}'`).join(",");
  return resultString;
};
