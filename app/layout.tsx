// Root layout. Wraps every route and wires up:
//   1. the four web fonts we load (via next/font/google so Google CSS never
//      ships to the client and layout-shift is avoided)
//   2. the <html data-type-pair> attribute the font picker toggles on the
//      client to swap pairings in the future
//   3. the <body> shell that flex-columns the nav/hero + page content and
//      paints eigengrau as the ground color
import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { TypePairProvider } from "@/app/_components/context/TypePairProvider";

// Geist = display + body sans. `--font-geist-sans` is exposed through
// Tailwind v4's @theme block in globals.css so `font-sans` resolves to Geist.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono is kept around for `font-mono` but not used much — the eyebrow /
// meta voice uses IBM Plex Mono ("mono-editorial") instead.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Instrument Serif: the one display serif — reserved for the hero title and
// the drop cap at the start of each article body.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

// IBM Plex Mono: editorial mono voice. Used for eyebrows, date ledgers, and
// the `// comment`-style markers dotted across the site.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const satoshi = localFont({
  src: [
    {
      path: "../assets/font/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../assets/font/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Evgeniy Pimenov",
  description:
    "Essays, notes, and experiments from a small studio. The journal of Evgeniy Pimenov.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // `data-type-pair` is a hook for the font-picker client component —
      // swapping its value could one day remap --font-sans/--font-serif.
      data-type-pair="geist-instrumentserif"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${plexMono.variable} ${bodoniModa.variable} ${satoshi.variable} h-full antialiased`}
    >
      <head>
        <title></title>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: we do this here to avoid FOUC issues when the
          dangerouslySetInnerHTML={{
            __html: `
          try{var p=localStorage.getItem('type-pair');if(p)document.documentElement.dataset.typePair=p}catch(e){}
        `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-eigengrau text-titanium">
        <TypePairProvider>{children}</TypePairProvider>
      </body>
    </html>
  );
}
