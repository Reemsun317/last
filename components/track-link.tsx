"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type MetricName = "whatsapp_clicks" | "call_clicks" | "direction_clicks";

type TrackLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  businessId: string;
  metric: MetricName;
  children: ReactNode;
};

export function TrackLink({ businessId, metric, onClick, children, ...props }: TrackLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        navigator.sendBeacon?.(
          "/api/metrics",
          new Blob([JSON.stringify({ business_id: businessId, metric })], { type: "application/json" })
        );
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
