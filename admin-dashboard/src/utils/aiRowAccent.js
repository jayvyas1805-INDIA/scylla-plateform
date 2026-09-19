// Returns extra classes for a table row so a pending item the AI flagged
// for reject/review stands out while scanning the list, not just when
// hovering the badge itself. Approved-by-AI rows get a much fainter
// treatment since they need less attention, not more.
export function aiRowAccentClasses(aiReview) {
  switch (aiReview?.suggestion) {
    case "reject":
      return "border-l-2 border-l-red-500/70 bg-red-500/[0.04]";
    case "review":
      return "border-l-2 border-l-yellow-500/70 bg-yellow-500/[0.03]";
    case "approve":
      return "border-l-2 border-l-green-500/40";
    default:
      return "";
  }
}
