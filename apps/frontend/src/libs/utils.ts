export function formatMemberCount(memberCount: number): string {
  if (memberCount === 1) {
    return "1 member";
  } else {
    return `${memberCount} members`;
  }
}