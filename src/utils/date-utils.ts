export function formatDateToYYYYMMDD(date: Date | undefined | null): string {
	if (!date) return "";
	return date.toISOString().substring(0, 10);
}
