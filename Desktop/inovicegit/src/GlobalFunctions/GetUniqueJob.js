export const GetUniquejob = (str_srjobno) => {
  let job = str_srjobno;
  const parts = job?.split(",");
  const revParts = parts?.reverse();
  const jobs = [...new Set(revParts)];
  const resultString = jobs?.map((part) => `'${part}'`)?.join(",");
  return resultString;
};
