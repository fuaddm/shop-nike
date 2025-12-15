export const isFutureExpirationDate = (value: string): boolean => {
  const [monthString, yearString] = value.split('/');
  const inputMonth = Number.parseInt(monthString, 10);
  const inputYear = 2000 + Number.parseInt(yearString, 10); // Assume 21st century

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed

  if (inputYear < currentYear) {
    return false;
  }
  if (inputYear === currentYear && inputMonth < currentMonth) {
    return false;
  }

  return true;
};

/**
 * Generates a human-readable, relative time string based on a past date.
 *
 * Implements custom logic:
 * - 1 to 7 days: "X days ago"
 * - 8 to 14 days: "1 week ago"
 * - 15 to 21 days: "2 weeks ago"
 * - 22 to 30 days: "3 weeks ago"
 * - 1 to 11 months: "X months ago"
 * - 12+ months: "X years ago"
 *
 * @param pastDate - The date in the past to compare against. Can be a Date object or a string/number that Date() can parse.
 * @returns The formatted relative time string.
 */
export function generateRelativeTime(pastDate: Date | string | number): string {
  const date = new Date(pastDate);
  const now = new Date();
  // Safety check for invalid dates
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const diffInMilliseconds = now.getTime() - date.getTime();

  // Define time constants in milliseconds (only used for short-term calculations)
  const MS_PER_MINUTE = 60_000;
  const MS_PER_HOUR = 3_600_000;
  const MS_PER_DAY = 86_400_000;

  // --- Short-term based on fixed duration (Seconds, Minutes, Hours) ---

  // 1. Seconds and Minutes
  if (diffInMilliseconds < MS_PER_HOUR) {
    const minutes = Math.floor(diffInMilliseconds / MS_PER_MINUTE);
    if (minutes < 1) return 'Just now';
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  // 2. Hours
  if (diffInMilliseconds < MS_PER_DAY) {
    const hours = Math.floor(diffInMilliseconds / MS_PER_HOUR);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  // Calculate days for the next set of logic
  const daysDiff = Math.floor(diffInMilliseconds / MS_PER_DAY);

  // 3. Days (1 to 7)
  if (daysDiff <= 7) {
    return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
  }

  // 4. Weeks (8 to 30 days) - Uses the custom 1, 2, 3 week logic
  if (daysDiff <= 30) {
    if (daysDiff <= 14) return '1 week ago';
    if (daysDiff <= 21) return '2 weeks ago';
    // daysDiff is between 22 and 30
    return '3 weeks ago';
  }

  // --- Long-term based on Calendar Difference (More than 30 days) ---
  // Use calendar calculations for accurate months and years.
  if (daysDiff > 30) {
    let years = now.getFullYear() - date.getFullYear();
    let months = now.getMonth() - date.getMonth();

    // 1. Adjust months (if current month is before past month, decrement year)
    if (months < 0) {
      years--;
      months += 12;
    }

    // 2. Adjust for day of the month (if full month hasn't passed yet)
    if (now.getDate() < date.getDate()) {
      months--;
    }

    // Calculate total months difference, ensuring it's not negative
    const totalMonths = Math.max(0, years * 12 + months);

    // 5. Years (12+ months)
    if (totalMonths >= 12) {
      // Calculate years based on floor of total months / 12 for accuracy
      const reportedYears = Math.floor(totalMonths / 12);
      return `${reportedYears} year${reportedYears > 1 ? 's' : ''} ago`;
    }

    // 6. Months (1 to 11 months)
    const reportedMonths = Math.max(1, totalMonths);
    return `${reportedMonths} month${reportedMonths > 1 ? 's' : ''} ago`;
  }

  // Default for future or near-zero dates
  return 'Just now';
}

// --- Example Usage (TypeScript friendly test harness) ---

// Helper functions for testing
function getPastDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function getPastDateMonths(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

function getPastDateYears(years: number): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d;
}
