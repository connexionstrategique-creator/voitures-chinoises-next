"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <nav id="mainNav" role="navigation" aria-label="Navigation principale">
      <div className="nav-logo">
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/daol8mzeg/image/upload/v1772665987/LOGO_VOITURES_CHINOISE_ROUGE_600x_pfafuh.png"
            alt="Voitures Chinoises"
            width={200}
            height={54}
            style={{ height: "54px", width: "auto" }}
            priority
          />
        </Link>
      </div>
      <ul className={`nav-links${open ? " open" : ""}`} id="navLinks">
        <li><Link href="/catalogue" onClick={closeMenu}>Catalogue</Link></li>
        <li><Link href="/marques" onClick={closeMenu}>Marques</Link></li>
        <li><Link href="/a-propos" onClick={closeMenu}>Qui sommes-nous</Link></li>
        <li><Link href="/pourquoi" onClick={closeMenu}>Pourquoi nous</Link></li>
        <li><Link href="/process" onClick={closeMenu}>Process</Link></li>
        <li><Link href="/faq" onClick={closeMenu}>FAQ</Link></li>
        <li><a href="/#contact" onClick={closeMenu}>Contact</a></li>
        <li><Link href="/apporteurs" onClick={closeMenu}>Apporteurs</Link></li>
      </ul>
      <button
        className={`nav-burger${open ? " open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
