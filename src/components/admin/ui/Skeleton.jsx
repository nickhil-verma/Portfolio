"use client";

import React from "react";

export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-white/[0.06] ${className}`} />
  );
}
