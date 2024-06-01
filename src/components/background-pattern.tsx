import React from "react";

export default function BackgroundPattern() {
  // position absolute to make sure it's behind main content and not affect the layout
  return <div className="bg-[#2C9676] h-[300px] w-full absolute top-0 -z-10" />;
}
