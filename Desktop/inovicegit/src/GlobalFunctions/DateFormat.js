
export const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date?.getDate())?.padStart(2, '0'); // Ensure two digits for the day
    const monthAbbreviation = date?.toLocaleString('default', { month: 'short' });
    const year = String(date?.getFullYear())?.slice(-2); // Get the last two digits of the year

    return `${day}${monthAbbreviation}${year}`;
}