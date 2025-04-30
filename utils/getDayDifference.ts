
export default function getDayDifference(d1: Date, d2: Date) {
    const date1 = new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()));
    const date2 = new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()));

    const msInDay = 24 * 60 * 60 * 1000;
    return Math.floor((date2.getTime() - date1.getTime()) / msInDay);
};
