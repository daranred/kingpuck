// Site hierarchy. Drives the header menus, the footer sitemap and each page's section index.
export const sections = [
  { href: "/story", label: "The Story", children: [
    ["what-is-puck-fair", "What Is Puck Fair?"], ["history", "History"], ["why-a-goat", "Why a Goat?"],
    ["legend", "Legend"], ["three-days", "The Three Days"] ] },
  { href: "/king-puck", label: "King Puck", children: [
    ["crowned-goat", "The Crowned Goat"], ["kings", "Kings Through the Years"], ["gallery", "Gallery"],
    ["coronation", "Coronation"], ["after-the-fair", "What Happens to the Goat?"] ] },
  { href: "/queen-puck", label: "Queen Puck", children: [
    ["tradition", "Tradition"], ["queens", "Queens Through the Years"], ["gallery", "Gallery"],
    ["queen-stories", "Queen Stories"], ["current-queen", "Current Queen"] ] },
  { href: "/archive", label: "The Archive", children: [
    ["photographs", "Historic Photos"], ["posters", "Posters"], ["ephemera", "Newspapers & Ephemera"],
    ["programs", "Programs"], ["film", "Video & Film"], ["audio", "Audio"], ["search", "Search"] ] },
  { href: "/stories", label: "Stories", children: [
    ["puck-stories", "Puck Stories"], ["people", "People of Puck"], ["where-are-they-now", "Where Are They Now?"],
    ["memories", "Memories"], ["legends-and-lore", "Legends & Lore"], ["photo-stories", "Photo Stories"] ] },
  { href: "/puck-fair", label: "Puck Fair", children: [
    ["three-days", "Three Days"], ["coronation", "Coronation"], ["schedule", "Schedule"],
    ["music", "Music & Entertainment"], ["traditions", "Traditions"], ["visit", "Visit Killorglin"], ["/stay", "Where to Stay"] ] },
  { href: "/shop", label: "Shop", children: [
    ["?c=apparel", "Apparel"], ["?c=books", "Books"], ["?c=prints", "Prints & Posters"],
    ["?c=archive", "Archive Collection"], ["?c=pins", "Pins & Patches"], ["?c=gifts", "Home & Gifts"],
    ["?c=limited", "Limited Editions"] ] },
  { href: "/support", label: "Support the Archive", children: [
    ["submit", "Submit a Story"], ["submit", "Submit a Photograph"], ["membership", "Membership"],
    ["sponsorship", "Sponsorship"], ["donate", "Donate"] ] },
  { href: "/about", label: "About", children: [
    ["mission", "Mission"], ["contact", "Contact"], ["rights", "Rights & Licensing"], ["press", "Press"] ] },
];

export const childHref = (s, [slug]) =>
  slug.startsWith("/") ? slug : slug.startsWith("?") ? `${s.href}${slug}` : `${s.href}#${slug}`;

// Line icons (24×24, stroke = currentColor) used by the sidebar and bottom bar.
export const icons = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  story: '<path d="M4 5h6a3 3 0 013 3v12a2 2 0 00-2-2H4z"/><path d="M20 5h-6a3 3 0 00-3 3v12a2 2 0 012-2h7z"/>',
  king: '<path d="M4 18l1.5-10 4.5 5 2-7 2 7 4.5-5L20 18z"/><path d="M4 21h16"/>',
  queen: '<path d="M6 16l1-7 3 3 2-5 2 5 3-3 1 7z"/><circle cx="12" cy="4" r="1"/><path d="M6 19h12"/>',
  archive: '<rect x="3" y="4" width="18" height="5"/><path d="M5 9v11h14V9"/><path d="M10 13h4"/>',
  stories: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  fair: '<path d="M3 20l9-15 9 15z"/><path d="M12 5v15M8.5 20l3.5-6 3.5 6"/>',
  shop: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  support: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
  about: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  cart: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
};
export const sectionIcon = {
  "/story": "story", "/king-puck": "king", "/queen-puck": "queen", "/archive": "archive", "/stories": "stories",
  "/puck-fair": "fair", "/shop": "shop", "/support": "support", "/about": "about",
};
// Bottom bar on phones: four destinations + Menu (opens the full hierarchy).
export const tabs = [["/", "Home", "home"], ["/story", "Story", "story"], ["/archive", "Archive", "archive"], ["/shop", "Shop", "shop"]];
