export const GetUniquejob = (parts) => {
    const jobs = [...new Set(parts)];
    return jobs;
}