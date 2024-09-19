export function formatDate(date: string | Date): string {
  const d =
    typeof date === "string" ? new Date(`${date}T00:00:00`) : new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}
