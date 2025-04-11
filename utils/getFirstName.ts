export default function getFirstName(userFullName: string) {
    const names = userFullName.split(" ");
    if (names.length > 1) {
        return names[0];
    } else {
        return userFullName;
    }
};
