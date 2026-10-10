/**
 * Generates the concept artwork used for the before/after comparisons and the
 * portrait placeholder. These are intentionally hand-built vector compositions:
 * the "before" sides are deliberately plain, the "after" sides deliberately
 * refined — so the transformation always reads clearly.
 *
 * All comparisons are CONCEPT work (not client redesigns) — see src/data/beforeAfter.ts.
 *
 * Run: node scripts/make-concept-art.mjs   (requires sharp, bundled with Next.js)
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

mkdirSync(new URL("../public/before-after/", import.meta.url), { recursive: true });
mkdirSync(new URL("../public/about/", import.meta.url), { recursive: true });

const W = 1200;
const H = 750;

const noirLogoBefore = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#FFFFFF"/>
<rect x="40" y="40" width="1120" height="670" fill="none" stroke="#1D4ED8" stroke-width="6"/>
<rect x="58" y="58" width="1084" height="634" fill="none" stroke="#1D4ED8" stroke-width="2"/>
<text x="600" y="395" text-anchor="middle" font-family="Arial, sans-serif" font-size="150" font-weight="900" fill="#1D4ED8" letter-spacing="4">NOIR</text>
<path d="M 380 435 Q 600 505 820 435" fill="none" stroke="#9CA3AF" stroke-width="12" stroke-linecap="round"/>
<text x="600" y="515" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-style="italic" fill="#6B7280">fashion &amp; clothing</text>
<text x="600" y="625" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#1D4ED8">&#9733; www.noir-fashion.com &#9733;</text>
</svg>`;

const noirLogoAfter = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#F7F5F0"/>
<rect x="588" y="176" width="24" height="24" fill="#D7FF64"/>
<rect x="330" y="240" width="540" height="3" fill="#111111"/>
<rect x="330" y="512" width="540" height="3" fill="#111111"/>
<text x="613" y="425" text-anchor="middle" font-family="Georgia, 'DejaVu Serif', serif" font-size="128" fill="#111111" letter-spacing="26">NOIR</text>
<text x="605" y="472" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" fill="#8A8A8A" letter-spacing="10">EST. MMXXVI &#8212; PARIS</text>
</svg>`;

const socialBefore = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#1877F2"/>
<rect x="150" y="90" width="900" height="570" rx="24" fill="#FFFFFF"/>
<circle cx="945" cy="165" r="66" fill="#EF4444"/>
<text x="945" y="177" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="900" fill="#FFFFFF">HOT!</text>
<circle cx="255" cy="595" r="56" fill="#16A34A"/>
<text x="255" y="606" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#FFFFFF">NEW!</text>
<text x="600" y="235" text-anchor="middle" font-family="Arial, sans-serif" font-size="96" font-weight="900" fill="#E11D48">SALE!!!</text>
<rect x="330" y="272" width="540" height="92" fill="#FDE047"/>
<text x="600" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="62" font-weight="900" fill="#111111">50% OFF!!!</text>
<rect x="420" y="425" width="360" height="82" rx="8" fill="#16A34A"/>
<text x="600" y="481" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="#FFFFFF">BUY NOW</text>
<text x="600" y="565" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#7C3AED"><u>www.shop-now.com</u></text>
<text x="600" y="618" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#6B7280">*terms and conditions apply</text>
</svg>`;

const socialAfter = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#111111"/>
<rect x="90" y="110" width="14" height="530" fill="#D7FF64"/>
<text x="150" y="305" font-family="Arial, sans-serif" font-size="122" font-weight="900" fill="#FFFFFF" letter-spacing="2">NEW</text>
<text x="150" y="437" font-family="Arial, sans-serif" font-size="122" font-weight="900" fill="#FFFFFF" letter-spacing="2">DROP</text>
<text x="150" y="505" font-family="Arial, sans-serif" font-size="30" fill="#8A8A8A">Collection 02 &#8212; available now</text>
<rect x="770" y="170" width="330" height="410" rx="20" fill="#F7F5F0"/>
<circle cx="935" cy="330" r="90" fill="#D7FF64"/>
<rect x="850" y="470" width="170" height="14" rx="7" fill="#111111" opacity="0.85"/>
<rect x="850" y="500" width="120" height="14" rx="7" fill="#111111" opacity="0.35"/>
<text x="150" y="605" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#D7FF64">SHOP NOW &#8594;</text>
</svg>`;

const monoPackBefore = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#E5E5E5"/>
<ellipse cx="600" cy="662" rx="280" ry="26" fill="#000000" opacity="0.08"/>
<rect x="400" y="110" width="400" height="540" fill="#FFFFFF" stroke="#C9C9C9" stroke-width="2"/>
<rect x="400" y="270" width="400" height="120" fill="#111111"/>
<text x="600" y="348" text-anchor="middle" font-family="Arial, sans-serif" font-size="62" font-weight="700" fill="#FFFFFF">COFFEE</text>
<text x="600" y="452" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#111111">instant &#8226; ground &#8226; decaf</text>
<text x="600" y="502" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#555555">NET WT 12 OZ (340g)</text>
<g fill="#111111" transform="translate(660,552)">
<rect x="0" width="5" height="62"/><rect x="9" width="3" height="62"/><rect x="17" width="7" height="62"/><rect x="28" width="3" height="62"/><rect x="36" width="5" height="62"/><rect x="46" width="2" height="62"/><rect x="52" width="6" height="62"/><rect x="63" width="3" height="62"/><rect x="70" width="4" height="62"/><rect x="79" width="8" height="62"/><rect x="91" width="3" height="62"/><rect x="98" width="5" height="62"/>
</g>
</svg>`;

const monoPackAfter = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#F7F5F0"/>
<ellipse cx="600" cy="668" rx="300" ry="24" fill="#221A12" opacity="0.10"/>
<rect x="390" y="150" width="420" height="500" rx="20" fill="#C9A87C"/>
<rect x="390" y="120" width="420" height="58" rx="16" fill="#B08F63"/>
<rect x="390" y="172" width="420" height="4" fill="#8F7350"/>
<rect x="450" y="258" width="300" height="304" fill="#F7F5F0" stroke="#221A12" stroke-width="2"/>
<text x="607" y="376" text-anchor="middle" font-family="Georgia, 'DejaVu Serif', serif" font-size="66" letter-spacing="14" fill="#221A12">MONO</text>
<rect x="510" y="408" width="180" height="2" fill="#221A12"/>
<text x="604" y="456" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" letter-spacing="8" fill="#221A12">SINGLE ORIGIN</text>
<text x="602" y="492" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" letter-spacing="4" fill="#8A8A8A">ETHIOPIA &#183; WASHED</text>
<circle cx="600" cy="528" r="15" fill="none" stroke="#221A12" stroke-width="2"/>
</svg>`;

const culturePosterBefore = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#FFFFFF"/>
<rect x="30" y="30" width="1140" height="690" fill="none" stroke="#9CA3AF" stroke-width="4" stroke-dasharray="14 10"/>
<rect x="60" y="70" width="1080" height="110" fill="#FFD400"/>
<text x="600" y="146" text-anchor="middle" font-family="Arial, sans-serif" font-size="62" font-weight="900" fill="#E11D48">MUSIC FESTIVAL!!!</text>
<rect x="60" y="200" width="1080" height="70" fill="#16A34A"/>
<text x="600" y="248" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="#FFFFFF">LIVE BANDS &#8226; FOOD &#8226; FUN</text>
<text x="600" y="362" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="900" fill="#7C3AED">SAT JULY 12 &#183; 12PM</text>
<text x="600" y="442" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="900" fill="#EA580C">GET TICKETS NOW!!</text>
<text x="600" y="512" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#1D4ED8"><u>www.tickets-here.com</u></text>
<circle cx="180" cy="600" r="58" fill="#EF4444"/>
<text x="180" y="612" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">FREE</text>
<circle cx="1020" cy="600" r="58" fill="#0EA5E9"/>
<text x="1020" y="611" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#FFFFFF">$10</text>
<text x="600" y="662" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#6B7280">rain or shine &#8226; all ages welcome</text>
</svg>`;

const culturePosterAfter = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#6C3BF4"/>
<circle cx="960" cy="190" r="140" fill="#FF4D24"/>
<text x="80" y="305" font-family="Arial, sans-serif" font-size="168" font-weight="900" fill="#FFFFFF" letter-spacing="4">CUL</text>
<text x="80" y="473" font-family="Arial, sans-serif" font-size="168" font-weight="900" fill="#FFFFFF" letter-spacing="4">TURE</text>
<rect x="80" y="540" width="1040" height="3" fill="#FFFFFF" opacity="0.9"/>
<text x="80" y="612" font-family="Arial, sans-serif" font-size="30" letter-spacing="6" fill="#FFFFFF">3 DAYS &#183; 40 ARTISTS</text>
<text x="1120" y="612" text-anchor="end" font-family="Arial, sans-serif" font-size="30" letter-spacing="6" fill="#FFFFFF">JUL 12&#8211;14</text>
<text x="80" y="682" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#D7FF64">TICKETS &#8594;</text>
</svg>`;

const portrait = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125">
<rect width="900" height="1125" fill="#F7F5F0"/>
<circle cx="450" cy="470" r="310" fill="#D7FF64"/>
<path d="M 130 1125 L 130 1010 Q 450 880 770 1010 L 770 1125 Z" fill="#111111"/>
<rect x="395" y="720" width="110" height="190" rx="46" fill="#111111"/>
<ellipse cx="450" cy="560" rx="155" ry="185" fill="#111111"/>
<path d="M 395 905 L 450 990 L 505 905 Z" fill="#D7FF64"/>
<circle cx="392" cy="560" r="44" fill="none" stroke="#D7FF64" stroke-width="10"/>
<circle cx="508" cy="560" r="44" fill="none" stroke="#D7FF64" stroke-width="10"/>
<line x1="436" y1="560" x2="464" y2="560" stroke="#D7FF64" stroke-width="10"/>
</svg>`;

const assets = [
  { path: "../public/before-after/noir-logo-before.jpg", svg: noirLogoBefore },
  { path: "../public/before-after/noir-logo-after.jpg", svg: noirLogoAfter },
  { path: "../public/before-after/social-before.jpg", svg: socialBefore },
  { path: "../public/before-after/social-after.jpg", svg: socialAfter },
  { path: "../public/before-after/mono-pack-before.jpg", svg: monoPackBefore },
  { path: "../public/before-after/mono-pack-after.jpg", svg: monoPackAfter },
  { path: "../public/before-after/culture-poster-before.jpg", svg: culturePosterBefore },
  { path: "../public/before-after/culture-poster-after.jpg", svg: culturePosterAfter },
  { path: "../public/about/asim-portrait.jpg", svg: portrait },
];

for (const asset of assets) {
  const file = fileURLToPath(new URL(asset.path, import.meta.url));
  await sharp(Buffer.from(asset.svg)).jpeg({ quality: 90 }).toFile(file);
  console.log("wrote", asset.path);
}

console.log("done —", assets.length, "assets");
