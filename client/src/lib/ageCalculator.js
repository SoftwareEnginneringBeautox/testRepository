export const calculateAge = (birthDateInput) => {
    if (!birthDateInput) return null;

    // Parse the birth date
    let birthDate;
    try {
        // Handle string input
        if (typeof birthDateInput === 'string') {
            birthDate = new Date(birthDateInput);
        } else if (birthDateInput instanceof Date) {
            birthDate = new Date(birthDateInput);
        } else {
            console.error("Unsupported birth date format:", birthDateInput);
            return null;
        }

        // Validate the date
        if (isNaN(birthDate.getTime())) {
            console.error("Invalid birth date:", birthDateInput);
            return null;
        }

        const today = new Date();

        // Get raw difference in years
        let age = today.getFullYear() - birthDate.getFullYear();

        // The correct logic: Subtract a year only if birthday hasn't occurred yet this year
        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }


        return age;
    } catch (error) {
        console.error("Error calculating age:", error);
        return null;
    }
};