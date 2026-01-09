import React from "react";

export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={
        "bg-white rounded-2xl border border-gray-100 shadow-sm " + className
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={"p-4 md:p-6 " + className} {...props}>
      {children}
    </div>
  );
}
