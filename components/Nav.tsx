"use client";
import { useState, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

const SearchOverlay = lazy(() => import("./SearchOverlay"));

export default function Nav({ dark }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <>
      <nav id="mainNav" role="navigation" aria-label="Navigation principale" className={dark ? "nav--dark" : ""}>
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
          <li><Link href="/process" onClick={closeMenu}>Process</Link></li>
          <li><Link href="/faq" onClick={closeMenu}>FAQ</Link></li>
          <li><Link href="/blog" onClick={closeMenu}>Blog</Link></li>
          <li><a href="/contact" onClick={closeMenu}>Contact</a></li>
        </ul>

        <div className="nav-right">
          <button
            className="nav-search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Rechercher une voiture"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>

          <button
            className={`nav-burger${open ? " open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {searchOpen && (
        <Suspense>
          <SearchOverlay onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
