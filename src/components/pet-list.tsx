import Image from "next/image";

export default function PetList() {
  return (
    <ul className="bg-white border-b border-black/[0.08]">
      <li className="h-[70px] flex items-center cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition">
        <Image
          src="https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
          alt="pet photo"
          width={45}
          height={45}
          //   cover to scale the image to fit the dimensions but maintain aspect ratio (may crop the image)
          className="rounded-full object-cover"
        />
        <p className="font-semibold">Jane</p>
      </li>
      <li className="h-[70px] flex items-center cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition">
        <Image
          src="https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
          alt="pet photo"
          width={45}
          height={45}
          //   cover to scale the image to fit the dimensions but maintain aspect ratio (may crop the image)
          className="rounded-full object-cover"
        />
        <p className="font-semibold">John</p>
      </li>
    </ul>
  );
}
