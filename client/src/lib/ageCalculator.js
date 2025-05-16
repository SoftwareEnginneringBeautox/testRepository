export const calculateAge = (birthDateInput) => {
    if (!birthDateInput) return null;

    try {
        let birthDate;

        if (typeof birthDateInput === 'string') {
            // Split manually to avoid time zone issues
            const [year, month, day] = birthDateInput.split('-').map(Number);
            birthDate = new Date(year, month - 1, day); // month is 0-based
        } else if (birthDateInput instanceof Date) {
            birthDate = new Date(
                birthDateInput.getFullYear(),
                birthDateInput.getMonth(),
                birthDateInput.getDate()
            );
        } else {
            console.error("Unsupported birth date format:", birthDateInput);
            return null;
        }

        const today = new Date();
        const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        let age = currentDate.getFullYear() - birthDate.getFullYear();

        if (
            currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    } catch (error) {
        console.error("Error calculating age:", error);
        return null;
    }
};