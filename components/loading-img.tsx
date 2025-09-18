import Image from "next/image";

export default function LoadingImg() {
    return (
        <Image src='/loading.gif' alt='loading image' width={25} height={25} />
    )
}