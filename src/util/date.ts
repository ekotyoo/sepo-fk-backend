export const getDifferenceInDays = (date1: Date, date2: Date) => {
    console.log("Date: ", date1, date2);

    const timeInMilisec: number = date1.getTime() - date2.getTime();
    const daysBetweenDates: number = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
    return daysBetweenDates;
}