"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, MoreVertical } from "lucide-react";
import "../Styles/Header.css";
import { tools } from "../../lib/toolsList";

export default function Header() {
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  const toggle = (menu) => {
    setActive(active === menu ? null : menu);
  };

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setActive(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* FILTER */
  const getTools = (type) => {
    return tools.filter((t) => t.slug.includes(type));
  };

  const menus = [
    { name: "IMAGE", key: "image" },
    { name: "PDF", key: "pdf" },
    { name: "DEV", key: "json" },
    { name: "UTILITY", key: "password" },
    { name: "CONVERTERS", key: "to" },
  ];

  return (
    <header className="header">
      <div className="header-container" ref={ref}>

        {/* LOGO */}
        <Link href="/" className="logo">
          ToolCenterHub
        </Link>

        {/* DESKTOP NAV */}
        <nav className="nav desktop-nav">
          {menus.map((m) => (
            <div key={m.key} className="nav-item">
              <button
                onClick={() => toggle(m.key)}
                className={active === m.key ? "active" : ""}
              >
                {m.name}
                <ChevronDown size={14} />
                <span className="underline"></span>
              </button>

              {active === m.key && (
                <div className="dropdown-grid">
                  {getTools(m.key).slice(0, 6).map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="dropdown-card">
                      <div className="dot"></div>
                      <div>
                        <p>{tool.name}</p>
                        {/* <span>Fast & free tool</span> */}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* TRENDING */}
          <div className="nav-item">
            <button
              onClick={() => toggle("trending")}
              className={active === "trending" ? "active" : ""}
            >
              🔥 Trending
              <ChevronDown size={14} />
              <span className="underline"></span>
            </button>

            {active === "trending" && (
              <div className="dropdown-grid">
                {tools.slice(0, 6).map((tool) => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="dropdown-card">
                    <div className="dot purple"></div>
                    <div>
                      <p>{tool.name}</p>
                      {/* <span>Popular tool</span> */}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* 3 DOT MENU */}
        <div className="menu-wrapper">
          <button onClick={() => setMenuOpen(!menuOpen)} className="menu-btn">
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className="menu-dropdown">

              {/* MOBILE NAV ITEMS */}
              <div className="mobile-nav">
                <p className="menu-title">Menu</p>

                {menus.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => toggle(m.key)}
                    className="mobile-item"
                  >
                    {m.name}
                  </button>
                ))}

                <button
                  onClick={() => toggle("trending")}
                  className="mobile-item"
                >
                  🔥 Trending
                </button>
              </div>

              {/* STATIC LINKS */}
              <div className="menu-divider"></div>

              <Link href="/about-us">About</Link>
              <Link href="/privacy-policy">Policy</Link>
              <Link href="/contact-us">Contact</Link>
              <Link href="/help">Help</Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}