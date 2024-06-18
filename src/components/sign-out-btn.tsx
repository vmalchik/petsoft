"use client";

import React from "react";
import { Button } from "./ui/button";
import { logout } from "@/actions/actions";

export default function SignOutBtn() {
  return <Button onClick={async () => await logout()}>Sign out</Button>;
}
