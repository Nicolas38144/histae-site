import Image from "next/image";

/** The book is the logo; the outlined name is its accompanying signature. */
export function BrandSignature() {
  return <>
    <Image className="wordmark-logo" src="/branding/histae-signature.svg" width={440} height={108} alt="" aria-hidden="true" unoptimized draggable={false} />
    <Image className="wordmark-symbol" src="/branding/histae-logo.svg" width={40} height={40} alt="" aria-hidden="true" unoptimized draggable={false} />
  </>;
}
