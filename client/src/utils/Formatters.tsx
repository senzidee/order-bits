/**
 * Formats an ISO date string to a localized date-time string
 *
 * @param isoString - ISO format date string
 * @returns Localized date and time string
 */
export const formatToLocalDateTime = (isoString: string): string => {
  return new Date(isoString).toLocaleString();
};
