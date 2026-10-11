# Carlinx — Project Overview

Carlinx is a full-stack car marketplace web app. It lets users browse and buy
vehicles, shop for car parts, book test drives, submit a vehicle for sale, and
check out with online payments — plus a built-in AI chat assistant and a
password-protected admin dashboard for managing all of it.

- **Framework:** Next.js 14 (Pages Router)
- **Language:** JavaScript (React 18, no TypeScript)
- **Styling:** Tailwind CSS 3 + global CSS
- **Database:** MongoDB Atlas (raw `mongodb` driver + some `mongoose`)
- **Media:** Cloudinary (image uploads)
- **Payments:** Razorpay
- **Email:** Nodemailer (SMTP) with PDFKit receipts
- **AI:** Google Gemini API
- **Auth:** Cookie-based (js-cookie) + Next.js middleware
- **State:** Redux Toolkit (cart)

---

## 1. Tech Stack

### Frontend
| Concern | Library |
|---|---|
| UI framework | `next` 14.2 (Pages Router), `react` 18, `react-dom` 18 |
| Styling | `tailwindcss` 3.4, PostCSS, custom `globals.css` |
| State management | `@reduxjs/toolkit`, `react-redux` |
| Carousels / sliders | `embla-carousel-react`, `embla-carousel-autoplay`, `swiper` |
| Animation / scroll | `react-scroll-trigger`, `react-countup` |
| Charts (admin) | `recharts` |
| Icons | `react-icons`, `lucide-react`, `@mui/icons-material`, `@heroicons/react` |
| HTTP | `axios`, native `fetch` |
| Auth (client) | `js-cookie`, `firebase` (Auth SDK) |
| Analytics | `@vercel/speed-insights` |

### Backend (Next.js API routes — serverless functions)
| Concern | Library |
|---|---|
| Database | `mongodb` (native driver), `mongoose` (vehicle sell schema) |
| Password hashing | `bcryptjs` |
| Form/multipart parsing | `formidable`, `multer` |
| File upload | `cloudinary` |
| Payments | `razorpay` |
| Email + PDF | `nodemailer`, `pdfkit` |
| Routing helpers | `next-connect` |
| Tokens | `jsonwebtoken`, `jose` |

### Tooling
- ESLint (`eslint-config-next`), PostCSS (`postcss.config.mjs`), `sharp` (image optimization), `dotenv`.

---

## 2. Features

### Customer-facing
- **Home / landing page** — hero carousel, about section, stats counters, new arrivals, dealers, "why choose us", popular brands, testimonials, blog previews, Gemini chat widget, back-to-top button. (`/`, `/home`)
- **Inventory** — filterable list of cars (condition, brand, model, year, price) with car detail page. (`/inventory`, `/detailsCar/[id]`)
- **Shop** — car parts store with search and price filtering, item detail page, add-to-cart. (`/shop`, `/details/[id]`)
- **Cart & Checkout** — Redux-powered cart, quantity control, Razorpay payment with shipping form, payment success/failure pages. (`/cart`, `/payment-success`, `/payment-failed`)
- **Test Drive booking** — name, phone, city, brand, model, transmission, location, date. (`/testdrive`)
- **Sell your vehicle** — multi-field form with image upload to Cloudinary. (`/sell`, `/successpage`)
- **About / Blog / Dealers / Contact** — static + form pages. (`/about`, `/blog`, `/dealers`, `/contactus`)
- **Auth** — register (with profile photo), login, forgot-password (email + DOB verification), profile management (edit details, change photo/password, view notifications). (`/register`, `/login`, `/forgotpassword`, `/profile`)
- **AI assistant** — floating Gemini chat widget grounded with Carlinx context.

### Admin dashboard (protected)
Single-page dashboard (`/dashboard`) with a sidebar (mobile drawer) and sections:
- **Dashboard** — payment/orders table + sales line chart.
- **Inventory** — full CRUD for cars (image upload).
- **Shop** — full CRUD for parts (image upload, stock/status).
- **Test Drive** — list + inline status updates (Pending → Confirmed → In Progress → Completed → Cancelled).
- **Sell Request** — review submitted vehicles, approve/reject with a message (emails the user), delete.
- **Customer Contact** — customer CRUD.
- **Back to Application** — return to the storefront.

---

## 3. How It Works

### Rendering & layout
- `pages/_app.js` wraps every page in the Redux `Provider` and injects a global
  `Layout` (Navbar + Footer + Gemini chat). Routes listed in `noLayoutRoutes`
  (`/login`, `/register`, `/dashboard`, `/forgotpassword`) render **without** the
  storefront chrome.
- A top loading bar is shown on `routeChangeStart` and hidden on
  `routeChangeComplete` / `routeChangeError`.
- `pages/_document.js` sets up the document shell, favicons, PWA manifest and Vercel
  Speed Insights.

### Authentication & authorization
1. Login posts to `/api/login`. The app treats an email containing the word
   `admin` as an admin account, querying the `Admin` collection (plaintext
   password); all other emails hit the `Registration` collection (bcrypt hash).
2. On success the client stores `{ email, isAdmin }` in a `user` cookie (7 days)
   and redirects admins to `/dashboard`, others to `/home`.
3. `src/middleware.js` guards protected routes (`/dashboard`, `/cart`, `/profile`,
   `/testdrive`, `/sell`, `/payment-success`, `/payment-failed`):
   - no cookie → redirect to `/login`
   - non-admin hitting an admin route → redirect to `/home`
4. `src/utils/cookies.js` provides a namespaced cookie helper
   (`carlinx_user_auth`) used by newer auth flows.

> Note: route protection is client/middleware-level. API routes themselves are not
> individually authorized — review before production.

### Image uploads
- `src/config/cloudinary.js` configures the Cloudinary SDK from env vars.
- API routes parse multipart via **formidable** (or **multer** for `/api/sell`)
  and stream/upload the file to Cloudinary, storing only the returned secure URL
  in MongoDB. Folders: `profile_pictures`, `cars`, `uploads`.

### Payments (Razorpay)
1. Cart subtotal is computed client-side (Redux `cartSlice`).
2. `RazorpayPayment` loads `checkout.razorpay.com/v1/checkout.js`, POSTs to
   `/api/create-order` (creates a Razorpay order in paise and stores it in the
   `Orders` collection), then opens the Razorpay modal.
3. On success the handler POSTs to `/api/verify-payment`, which recomputes the
   HMAC-SHA256 signature and compares it to Razorpay's signature.
4. Verified orders trigger an **order-confirmation email** (HTML body + a PDF
   receipt generated with PDFKit) via Nodemailer; the user is routed to
   `/payment-success` or `/payment-failed`.

### AI chat
- `GeminiChat` widget POSTs the user's message to `/api/gemini`.
- The API wraps the message with a Carlinx system prompt and calls the Google
  Gemini `generateContent` endpoint, returning the model's text reply.

---

## 4. Project Structure

```
Carlinx/
├── Assets/                     # Source images (imported by components)
│   ├── jpgs/                   # cars, blog posters, testimonials, team, parts
│   ├── pngs/                   # hero, brands, dealers, icons
│   └── svgs/                   # small UI icons
├── public/                     # Static assets served as-is
│   ├── Assets/jpgs/            # parts & car images (public copies)
│   ├── slider-1bg.jpg, slider-2bg.jpg, breadcrumbbg.jpg, ...
│   ├── favicon*, apple-touch-icon, android-chrome*, site.webmanifest
├── firebase/
│   └── config.js               # Firebase client init (Auth)
├── src/
│   ├── Components/
│   │   ├── GeminiChat.js               # Floating AI chat widget
│   │   ├── HomeContent.js              # Shared landing page content
│   │   ├── VehicleSellSection.js       # Admin: sell-request table/modals
│   │   └── layouts/
│   │       ├── Layout.js               # Navbar + main + Footer shell
│   │       ├── Navbar.js               # Responsive header + mobile menu
│   │       ├── Footer.js               # Site footer
│   │       ├── BreadCrumb.js           # Reusable page title/breadcrumb
│   │       ├── EmblaCarousel.js        # Home hero slider
│   │       ├── counter.js              # Animated stats
│   │       ├── products.js             # Car cards grid
│   │       ├── dealers.js              # Dealer cards
│   │       ├── testimonal.js           # Swiper testimonials
│   │       ├── blogComponent.js        # Blog preview cards
│   │       ├── InventoryComponent.js   # Admin inventory CRUD
│   │       ├── ShopComponent.js        # Admin shop CRUD
│   │       ├── customersection.js      # Admin customers CRUD
│   │       ├── RazorpayPayment.js      # Checkout + shipping form
│   │       └── loader.js               # Route-change loader
│   ├── Redux/
│   │   ├── store.js                    # configureStore (cart reducer)
│   │   └── counter/counterSlice.js     # cart add/remove/clear + quantity
│   ├── config/
│   │   └── cloudinary.js               # Cloudinary SDK config
│   ├── utils/
│   │   ├── cookies.js                  # Namespaced auth cookie helpers
│   │   └── emailService.js             # Nodemailer + PDFKit receipt
│   ├── middleware.js                   # Route protection
│   ├── styles/
│   │   └── globals.css                 # Base styles, carousel, utilities
│   └── pages/
│       ├── _app.js                     # Providers, Layout, route loader
│       ├── _document.js                # HTML shell, favicons, Speed Insights
│       ├── index.js, home/index.js     # Landing (render HomeContent)
│       ├── about/, blog/, cart/, contactus/, dealers/, inventory/,
│       │   profile/, register/, login/, forgotpassword/, sell/, shop/,
│       │   testdrive/, dashboard/, successpage/,
│       │   payment-success/, payment-failed/, details/[id], detailsCar/[id]
│       └── api/                         # Serverless backend (see §5)
├── next.config.mjs             # remote image patterns (Cloudinary)
├── tailwind.config.js          # theme, container, custom tokens
├── jsconfig.json               # "@/*" -> "./src/*" path alias
├── postcss.config.mjs
├── .eslintrc.json
├── package.json
└── .env.local                 # secrets (NOT committed)
```

---

## 5. API Routes

| Route | Methods | Purpose |
|---|---|---|
| `/api/register` | POST | Register user (formidable multipart + Cloudinary profile pic, bcrypt) |
| `/api/login` | POST | Authenticate (admin vs user collection) |
| `/api/forgotpassword/verify-Email` | POST | Verify email (+ DOB) for password reset |
| `/api/forgotpassword/reset-password` | POST | Reset password |
| `/api/user/user` | GET, POST | Get profile by email / change password |
| `/api/user/userupdate` | PUT | Update profile fields + photo |
| `/api/inventory` | GET | Public car list with filters (condition, brand, model, year, price, id) |
| `/api/inventoryadmin` | GET, POST, PUT, DELETE | Admin car CRUD (Cloudinary images) |
| `/api/parts` | GET | Public shop-parts list with search/price filters |
| `/api/shopadmin` | GET, POST, PUT, DELETE | Admin shop-parts CRUD |
| `/api/customeradmin` | GET, PUT, DELETE | Admin customers CRUD |
| `/api/testdrive` | POST | Create a test-drive booking |
| `/api/dashboard` | GET, PUT | Admin: payment & test-drive lists; update test-drive status |
| `/api/sell` | POST | Submit vehicle to sell (multer + Cloudinary, Mongoose) |
| `/api/selladmin` | GET, PUT, DELETE | Admin: list/respond/delete sell requests (emails user) |
| `/api/sellsucess` | GET | Latest vehicle-sell request (success page) |
| `/api/contact` | POST | Save contact-form message |
| `/api/create-order` | POST | Create Razorpay order + store in `Orders` |
| `/api/verify-payment` | POST | Verify Razorpay signature + email receipt |
| `/api/gemini` | POST | Proxy to Google Gemini chat |

---

## 6. Database Collections (MongoDB — `Carlinx`)

| Collection | Used by | Notes |
|---|---|---|
| `Registration` | register/login/profile | user accounts, bcrypt password, `profileImage` |
| `Admin` | login/reset | admin accounts (plaintext password) |
| `InventoryCar` | inventory/inventoryadmin | cars for sale |
| `ShopPartsData` | parts/shopadmin | shop parts |
| `VehicleSellRequests` | sell/selladmin | user-submitted vehicles to sell |
| `TestDrive` | testdrive/dashboard | test-drive bookings + status |
| `Orders` | create-order/dashboard | Razorpay orders |
| `Contactus` | contact | contact messages |

---

## 7. Environment Variables

Create a `.env.local` at the project root. Variable **names** (values omitted —
this project's real `.env.local` must never be committed):

```dotenv
# MongoDB
MONGODB_URI=
MONGODB_URI1=
DB_NAME=

# Firebase (public, client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Email (SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

# Auth
JWT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Google Gemini
GEMINI_API_KEY=
```

> **Security warning:** never print or commit real secrets. If any key in
> `.env.local` was ever exposed, rotate it and add `.env.local` to `.gitignore`.

---

## 8. Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string
- Cloudinary, Razorpay, SMTP and Gemini credentials (as above)

### Install
```bash
npm install
```

### Run (development)
```bash
npm run dev          # http://localhost:3000
```

To test on a phone on the same network, bind to all interfaces and use your LAN IP:
```bash
npx next dev -H 0.0.0.0
# then open http://<your-lan-ip>:3000 on the phone
```

### Build / production
```bash
npm run build
npm run start
```

### Lint
```bash
npm run lint
```

### Scripts (`package.json`)
| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve the production build |
| `lint` | `next lint` | ESLint |
| `export` | `next export` | Static export (not compatible with API routes) |

---

## 9. Responsive Design

The UI is mobile-first with standard Tailwind breakpoints
(`sm 640`, `md 768`, `lg 1024`, `xl 1280`). Key patterns:

- **Navbar** — fixed desktop header; on mobile a red contact bar + hamburger menu.
- **Wide tables** (admin, cart) — wrapped in `overflow-x-auto` with a `min-w-[…]`
  so they scroll horizontally instead of overflowing the viewport.
- **Admin dashboard** — sidebar collapses into a slide-in drawer with overlay
  below `lg`.
- **Modals** — scrollable, capped height (`max-h-[90vh]` / `overflow-y-auto`).
- **Images** — fluid (`w-full h-auto object-contain`) instead of fixed sizes.

---

## 10. Notes & Known Issues

- Pre-existing ESLint **warnings** (non-blocking):
  - `@next/next/no-img-element` in `InventoryComponent`, `ShopComponent`,
    `VehicleSellSection`, `profile`, `register`.
  - `react-hooks/exhaustive-deps` in `dashboard`.
- Admin accounts are identified by `email.includes('admin')` and store
  plaintext passwords — consider hardening for production.
- API routes have no per-endpoint authorization; protection currently lives in
  client code and `middleware.js`.
- `npm run export` exists but is incompatible with the API routes used here.
- `caniuse-lite` is outdated; run `npx update-browserslist-db@latest` when convenient.
```
