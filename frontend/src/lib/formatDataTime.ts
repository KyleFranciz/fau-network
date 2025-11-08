// NOTE: This file is to house the data time formatting function or other time formatting functions to make editting later easier

// formatter to change the date and time
export const formatDateTime = (
  d?: string | null,
  t?: string | null,
): string => {
  if (!d && !t) return "Date TBA";
  const dateObj = d ? new Date(d) : undefined;
  if (dateObj && !isNaN(dateObj.getTime())) {
    const datePart = dateObj.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timePart =
      t ??
      dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    return `${datePart} ${timePart}`;
  }
  return t ?? "Date TBA";
};
