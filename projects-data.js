/* =========================================================
   DEFAULT PROJECT DATA — the original 21 project cards.
   Loaded once into localStorage ("gt_projects") the first time
   any page runs, after which everything (including these) is
   fully editable/deletable from the Admin Panel — nothing here
   is hardcoded into the page HTML anymore.
========================================================= */
window.GT_DEFAULT_PROJECTS = [
  // ---- Web Development ----
  { id: 'p1', category: 'web', title: 'Photography Studio Booking', description: 'Full booking platform with studio listings, package selection, category browsing, and owner login/admin panel.', tags: ['HTML', 'CSS', 'JS'], image: 'assets/photography-studio.png', liveUrl: 'https://gulshantahzeeba-57.github.io/Photography-Studio_Booking-Website./', githubUrl: '' },
  { id: 'p2', category: 'web', title: 'Apex Marketing Systems LLC', description: 'Live business website built to showcase company branding and services.', tags: ['HTML', 'CSS'], image: 'assets/apexmarketing.png', liveUrl: 'https://apexmarketingsystemsllc.com/', githubUrl: '' },
  { id: 'p4', category: 'web', title: 'Your Heart Cardiac Clinic', description: 'Clinic website featuring services, doctor information, and appointment details.', tags: ['HTML', 'CSS', 'JS'], image: 'assets/cardiac-clinic.png', liveUrl: 'https://gulshantahzeeba-57.github.io/Your-Heart-Cardiac-Clinic-Website/', githubUrl: '' },
  { id: 'p5', category: 'web', title: 'Berry & Cream', description: 'Online ice cream shop with menu, cart, checkout, and admin login. Practice project.', tags: ['HTML', 'CSS', 'JS'], image: 'assets/berry-cream.png', liveUrl: 'https://gulshantahzeeba-57.github.io/Berry-Cream-Ice-Cream/', githubUrl: '' },
  { id: 'p6', category: 'web', title: 'Personal Portfolio Website', description: 'An earlier personal portfolio built entirely with HTML, CSS, and JavaScript.', tags: ['HTML', 'CSS', 'JS'], image: 'assets/portfolio.png', liveUrl: 'https://gulshantahzeeba-57.github.io/My_Portfolio/', githubUrl: '' },
  { id: 'p9', category: 'web', title: 'StreamVault', description: 'Streaming service landing page concept with pricing and live-preview sections.', tags: ['HTML', 'CSS'], image: 'assets/Stream Vault.png', liveUrl: '', githubUrl: '' },
  { id: 'p10', category: 'web', title: 'TrailNest Tour & Travels', description: 'Travel booking landing page concept — destinations, packages, and trip stats.', tags: ['HTML', 'CSS'], image: 'assets/Trainest tour and travels.png', liveUrl: '', githubUrl: '' },
  { id: 'p11', category: 'web', title: 'My First Code', description: 'Where it all started — the very first page I ever coded and shipped.', tags: ['HTML', 'CSS'], image: 'assets/MyFirstCode.png', liveUrl: '', githubUrl: '' },

  // ---- WordPress ----
  { id: 'p13', category: 'wordpress', title: "Coffee's For You", description: 'Coffee blog built with OceanWP, Elementor, and WPForms — recipes, brewing tips, and product features.', tags: ['Elementor', 'OceanWP'], image: 'assets/coffees-for-you.png', liveUrl: '', githubUrl: '' },
  { id: 'p13', category: 'wordpress', title: "FlexCore Gym", description: 'FlexCore E-commerce built with Storefront theme and WooCommerce plugins, featuring high-quality fitness gym machines and key product specs.', tags: ['StoreFront', 'Woocommerce'], image: 'assets/flexcore-gym.png', liveUrl: '', githubUrl: '' },
  // ---- Lead Generation ----
  { id: 'p15', category: 'leadgen', title: 'Sustainable', description: 'Comprehensive tracking sheet demonstrating open rates, responses, and booking metrics.', tags: ['Analytics'], image: 'assets/Sustaninable.png', liveUrl: 'https://docs.google.com/spreadsheets/d/1ZNH20TDuj7B2-sTszDJABdXMByt31d7xHr-MayFbwIM/edit?usp=sharing', githubUrl: '' },
  { id: 'p16', category: 'leadgen', title: 'Waste Management', description: 'Database of highly qualified prospects built using specialized search and verification workflows.', tags: ['Prospecting'], image: 'assets/Waste Management.png', liveUrl: 'https://docs.google.com/spreadsheets/d/1OJFpYMqNU1S4Lut3NaeDIhQMGjJMkJiWkcDm12C26jE/edit?usp=sharing', githubUrl: '' },
  { id: 'p17', category: 'leadgen', title: 'Gableci_Zagreb', description: 'Verified contact list directories extracted and compiled for targeted email outreach funnels.', tags: ['Web Scraping'], image: 'assets/Gableci_Zagreb.png', liveUrl: 'https://docs.google.com/spreadsheets/d/1AkSo61lilf_8dJU7Yk2N-O2Kx64-Tj_YqClYBhVWRpc/edit?usp=sharing', githubUrl: '' },
  { id: 'p18', category: 'leadgen', title: 'Supplier and Distributors', description: 'High-converting direct messaging sequences and profile-based target list setups.', tags: ['Social Leads'], image: 'assets/Supplier and Distributors.png', liveUrl: 'https://docs.google.com/spreadsheets/d/1mqz8ea2qPWcdTuET7SIdtjOvNX8EjxJ3vbkFRaq21hE/edit?usp=sharing', githubUrl: '' },
  { id: 'p19', category: 'leadgen', title: 'AI Talent Leads', description: 'Custom email list setups curated for small businesses to ensure maximum delivery and low bounce rates.', tags: ['Email Lists'], image: 'assets/AI Talent.png', liveUrl: 'https://docs.google.com/spreadsheets/d/1FZmrAuHsYMETZwP2pYwmiW1sX6Ae14SZrbXvsCb3pMc/edit?usp=sharing', githubUrl: '' },
  { id: 'p20', category: 'leadgen', title: 'Appleton Donor List', description: 'Detailed campaign metrics, prospect research data, and direct target audience engagement results.', tags: ['B2B Outreach'], image: 'assets/Appleton Donor List.png', liveUrl: 'https://docs.google.com/spreadsheets/d/1t0Ido8JaJRuZ8MsbTw97ZRdUFxhIv0JRQ4Ly7S3egjk/edit?gid=0#gid=0', githubUrl: '' },

  // ---- Content Writing ----
  { id: 'p21', category: 'content', title: 'Domestic Violence Against Men', description: 'A curated, SEO-friendly blog post with aesthetic brand copy and an engaging professional layout.', tags: ['SEO', 'Blog'], image: 'assets/Domestic Violence.png', liveUrl: 'https://docs.google.com/document/d/1jfXJzXIMsACFtcQc71ljbTHCF62taTG-nEIU-BxnJuE/edit?usp=sharing', githubUrl: '' }
];
