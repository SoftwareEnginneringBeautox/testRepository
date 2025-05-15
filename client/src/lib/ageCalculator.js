export const calculateAge = (birthDate) => {
    if (!birthDate) return null;

    // Handle different date formats (string or Date object)
    const birthDateObj = birthDate instanceof Date ? birthDate : new Date(birthDate);

    // Validate date object
    if (isNaN(birthDateObj.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age;
};