import { useState } from "react";
import { createPortal } from "react-dom";

export default function ApprovalHoverValue({ value, className = "", children }) {
  const [tooltip, setTooltip] = useState(null);

  const showTooltip = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const showBelow = rect.top < 84;
    setTooltip({
      left: Math.max(12, Math.min(rect.left, window.innerWidth - 372)),
      top: showBelow ? rect.bottom + 10 : rect.top - 10,
      below: showBelow,
    });
  };

  return (
    <div
      className={`approval-hover-value ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={() => setTooltip(null)}
      onFocus={showTooltip}
      onBlur={() => setTooltip(null)}
      tabIndex="0"
    >
      {children ?? value}
      {tooltip && createPortal(
        <div
          className={`approval-hover-tooltip ${tooltip.below ? "approval-hover-tooltip--below" : ""}`}
          style={{ left: tooltip.left, top: tooltip.top }}
          role="tooltip"
        >
          {value}
        </div>,
        document.body
      )}
    </div>
  );
}
