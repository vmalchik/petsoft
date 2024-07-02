import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.svg";
import { Routes } from "@/lib/constants";

export default function Logo() {
  return (
    <Link href={Routes.Home}>
      <Image src={logo} alt="PetSoft logo" width={45} height={45} />
    </Link>
  );
}
