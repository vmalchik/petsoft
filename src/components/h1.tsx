import React from "react";

type H1Props = {
  readonly children: React.ReactNode;
};

export default function H1({ children }: H1Props) {
  return <h1 className="text-2xl leading-6 font-medium">{children}</h1>;
}
