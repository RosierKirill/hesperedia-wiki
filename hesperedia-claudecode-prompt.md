# PROMPT CLAUDE CODE — HESPEREDIA WIKI

Copie-colle ce prompt dans Claude Code (CLI) depuis la racine du dossier projet.

---

```
Tu vas construire un wiki web complet pour l'univers imaginaire "Hesperedia" — un projet full-stack production-ready de type Fandom wiki personnalisé.

Construis le projet entier de façon méthodique, phase par phase, en créant tous les fichiers nécessaires. Ne génère pas de mocks ou de placeholders vides : chaque fichier doit être fonctionnel et complet.

---

## STACK TECHNIQUE — RESPECTE-LA EXACTEMENT

**Monorepo npm workspaces** à la racine.

**apps/web/** — Next.js 14 App Router, TypeScript strict, Tailwind CSS, Framer Motion, Leaflet.js, Zustand, TanStack Query (React Query v5).

**apps/api/** — Node.js + Express, TypeScript strict, Prisma ORM, PostgreSQL, JWT + bcrypt, Multer + Cloudinary SDK, Zod pour la validation, express-rate-limit.

**packages/shared-types/** — Types TypeScript partagés entre web et api.

---

## PHASE 1 — SETUP MONOREPO & FONDATIONS

### 1.1 Structure racine
Crée la structure de monorepo suivante :

```
hesperedia-wiki/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── shared-types/
├── package.json          (workspaces root)
├── turbo.json            (turborepo config)
├── .gitignore
├── .env.example
└── README.md
```

`package.json` racine avec workspaces `["apps/*", "packages/*"]` et turborepo pour les scripts `dev`, `build`, `lint`.

### 1.2 Shared Types (`packages/shared-types/`)
Crée `src/index.ts` avec tous les types TypeScript partagés :

```typescript
// Enums
export enum MagicForce { LUMEN = 'LUMEN', VESPER = 'VESPER', AETHER = 'AETHER', HUMUS = 'HUMUS', SANGUIS = 'SANGUIS', NIHIL = 'NIHIL' }
export enum UserRole { ADMIN = 'ADMIN', EDITOR = 'EDITOR', SUBSCRIBER = 'SUBSCRIBER' }
export enum CharacterStatus { ALIVE = 'ALIVE', DECEASED = 'DECEASED', UNDEAD = 'UNDEAD', UNKNOWN = 'UNKNOWN', TRANSFORMED = 'TRANSFORMED' }
export enum CreatureCategory { SANGUIS_CORRUPTION = 'SANGUIS_CORRUPTION', NIHIL_CORRUPTION = 'NIHIL_CORRUPTION', MONSTER = 'MONSTER', DEMON = 'DEMON', ORLA_ENTITY = 'ORLA_ENTITY', TRANSFORMED_ANIMAL = 'TRANSFORMED_ANIMAL', HYBRID = 'HYBRID', DEEP_CREATURE = 'DEEP_CREATURE' }
export enum LocationType { CITY = 'CITY', VILLAGE = 'VILLAGE', FORTRESS = 'FORTRESS', RUIN = 'RUIN', DUNGEON = 'DUNGEON', LANDMARK = 'LANDMARK', SACRED_SITE = 'SACRED_SITE', CAMP = 'CAMP' }
export enum ArticleCategory { HISTORY = 'HISTORY', MAGIC_SYSTEM = 'MAGIC_SYSTEM', CULTURE = 'CULTURE', RELIGION = 'RELIGION', GEOGRAPHY = 'GEOGRAPHY', POLITICS = 'POLITICS', EVENT = 'EVENT', MYTHOLOGY = 'MYTHOLOGY' }
export enum ProjectType { VIDEO_GAME = 'VIDEO_GAME', TABLETOP_GAME = 'TABLETOP_GAME', COMIC = 'COMIC', MANGA = 'MANGA', ANIMATION = 'ANIMATION', NOVEL = 'NOVEL' }
export enum ProjectStatus { ANNOUNCED = 'ANNOUNCED', IN_DEVELOPMENT = 'IN_DEVELOPMENT', DEMO_AVAILABLE = 'DEMO_AVAILABLE', RELEASED = 'RELEASED', ON_HOLD = 'ON_HOLD' }
export enum FactionType { KINGDOM = 'KINGDOM', EMPIRE = 'EMPIRE', CITY_STATE = 'CITY_STATE', CULT = 'CULT', ORDER = 'ORDER', GUILD = 'GUILD', CLAN = 'CLAN', CHURCH = 'CHURCH', SECRET_SOCIETY = 'SECRET_SOCIETY' }

// Interfaces principales
export interface User { id: string; email: string; username: string; role: UserRole; avatarUrl?: string; createdAt: string }
export interface Realm { id: string; name: string; slug: string; description?: string; mapImageUrl?: string; color?: string; order: number }
export interface Region { id: string; name: string; slug: string; realmId: string; realm?: Realm; description?: string; biome?: string; dominantForce?: MagicForce; mapCoords?: MapCoords; imageUrl?: string }
export interface Location { id: string; name: string; slug: string; type: LocationType; realmId: string; regionId?: string; region?: Region; description?: string; mapCoords?: { x: number; y: number }; imageUrl?: string; isCapital: boolean }
export interface Faction { id: string; name: string; slug: string; type: FactionType; description?: string; logoUrl?: string; dominantForce?: MagicForce; alignment?: string }
export interface Character { id: string; name: string; slug: string; titles: string[]; species: string; gender?: string; age?: string; status: CharacterStatus; affiliations: Faction[]; homeLocation?: Location; portraitUrl?: string; bannerUrl?: string; primaryForce?: MagicForce; secondaryForce?: MagicForce; magicLevel?: number; biography: string; personality?: string; abilities?: string; isMainCharacter: boolean; publishedAt?: string }
export interface Creature { id: string; name: string; slug: string; category: CreatureCategory; subcategory?: string; origin: string; primaryForce?: MagicForce; dangerLevel?: number; description: string; abilities?: string; weaknesses?: string; habitat?: string; portraitUrl?: string; publishedAt?: string }
export interface Article { id: string; title: string; slug: string; category: ArticleCategory; excerpt?: string; content: string; coverImageUrl?: string; tags: string[]; magicForces: MagicForce[]; featured: boolean; publishedAt?: string; avgRating?: number; ratingCount?: number }
export interface Project { id: string; title: string; slug: string; type: ProjectType; status: ProjectStatus; description: string; coverImageUrl?: string; releaseDate?: string; links?: Record<string, string>; tags: string[] }
export interface MapCoords { x: number; y: number; polygon?: [number, number][] }

// API Response types
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; pageSize: number; totalPages: number }
export interface ApiError { message: string; code?: string; details?: Record<string, string[]> }
export interface AuthTokens { accessToken: string; refreshToken: string }
```

### 1.3 API Backend (`apps/api/`)

**`prisma/schema.prisma`** — Schéma complet :

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  username     String   @unique
  passwordHash String
  role         UserRole @default(SUBSCRIBER)
  avatarUrl    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  comments     Comment[]
  votes        Vote[]
  donations    Donation[]
  ratings      ArticleRating[]
  articles     Article[]
}

enum UserRole { ADMIN EDITOR SUBSCRIBER }

model Realm {
  id          String     @id @default(cuid())
  name        String     @unique
  slug        String     @unique
  description String?
  mapImageUrl String?
  color       String?
  order       Int        @default(0)
  regions     Region[]
  locations   Location[]
}

model Region {
  id            String      @id @default(cuid())
  name          String
  slug          String      @unique
  realmId       String
  realm         Realm       @relation(fields: [realmId], references: [id])
  description   String?
  biome         String?
  dominantForce MagicForce?
  mapCoords     Json?
  imageUrl      String?
  publishedAt   DateTime?
  createdAt     DateTime    @default(now())
  locations     Location[]
  factions      FactionsOnRegions[]
  articles      ArticlesOnRegions[]
}

model Location {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  type        LocationType
  realmId     String
  realm       Realm        @relation(fields: [realmId], references: [id])
  regionId    String?
  region      Region?      @relation(fields: [regionId], references: [id])
  description String?
  mapCoords   Json?
  imageUrl    String?
  isCapital   Boolean      @default(false)
  publishedAt DateTime?
  createdAt   DateTime     @default(now())
  characters  CharactersOnLocations[]
  articles    ArticlesOnLocations[]
}

enum LocationType { CITY VILLAGE FORTRESS RUIN DUNGEON LANDMARK SACRED_SITE CAMP }

enum MagicForce { LUMEN VESPER AETHER HUMUS SANGUIS NIHIL }

model Faction {
  id            String      @id @default(cuid())
  name          String
  slug          String      @unique
  type          FactionType
  description   String?
  logoUrl       String?
  bannerUrl     String?
  dominantForce MagicForce?
  alignment     String?
  publishedAt   DateTime?
  createdAt     DateTime    @default(now())
  characters    CharactersOnFactions[]
  regions       FactionsOnRegions[]
  articles      ArticlesOnFactions[]
}

enum FactionType { KINGDOM EMPIRE CITY_STATE CULT ORDER GUILD CLAN CHURCH SECRET_SOCIETY }

model Character {
  id              String          @id @default(cuid())
  name            String
  slug            String          @unique
  titles          String[]
  species         String
  gender          String?
  age             String?
  status          CharacterStatus
  portraitUrl     String?
  bannerUrl       String?
  primaryForce    MagicForce?
  secondaryForce  MagicForce?
  magicLevel      Int?
  biography       String          @db.Text
  personality     String?         @db.Text
  abilities       String?         @db.Text
  history         String?         @db.Text
  isMainCharacter Boolean         @default(false)
  publishedAt     DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  homeLocationId  String?
  homeLocation    Location?
  affiliations    CharactersOnFactions[]
  locations       CharactersOnLocations[]
  articles        ArticlesOnCharacters[]
}

enum CharacterStatus { ALIVE DECEASED UNDEAD UNKNOWN TRANSFORMED }

model Creature {
  id           String          @id @default(cuid())
  name         String
  slug         String          @unique
  category     CreatureCategory
  subcategory  String?
  origin       CreatureOrigin
  primaryForce MagicForce?
  dangerLevel  Int?
  description  String          @db.Text
  abilities    String?         @db.Text
  weaknesses   String?         @db.Text
  habitat      String?
  portraitUrl  String?
  imageUrl     String?
  publishedAt  DateTime?
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  articles     ArticlesOnCreatures[]
}

enum CreatureCategory { SANGUIS_CORRUPTION NIHIL_CORRUPTION MONSTER DEMON ORLA_ENTITY TRANSFORMED_ANIMAL HYBRID DEEP_CREATURE }
enum CreatureOrigin { NATURAL SANGUIS NIHIL UNDERWORLD ORLA ANCIENT_MAGIC UNKNOWN }

model Article {
  id            String          @id @default(cuid())
  title         String
  slug          String          @unique
  category      ArticleCategory
  excerpt       String?
  content       String          @db.Text
  coverImageUrl String?
  tags          String[]
  magicForces   MagicForce[]
  featured      Boolean         @default(false)
  authorId      String?
  author        User?           @relation(fields: [authorId], references: [id])
  publishedAt   DateTime?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  characters    ArticlesOnCharacters[]
  creatures     ArticlesOnCreatures[]
  factions      ArticlesOnFactions[]
  locations     ArticlesOnLocations[]
  regions       ArticlesOnRegions[]
  ratings       ArticleRating[]
  comments      Comment[]
}

enum ArticleCategory { HISTORY MAGIC_SYSTEM CULTURE RELIGION GEOGRAPHY POLITICS EVENT MYTHOLOGY }

// Tables de jonction
model CharactersOnFactions { character Character @relation(fields: [characterId], references: [id]); characterId String; faction Faction @relation(fields: [factionId], references: [id]); factionId String; @@id([characterId, factionId]) }
model CharactersOnLocations { character Character @relation(fields: [characterId], references: [id]); characterId String; location Location @relation(fields: [locationId], references: [id]); locationId String; @@id([characterId, locationId]) }
model ArticlesOnCharacters { article Article @relation(fields: [articleId], references: [id]); articleId String; character Character @relation(fields: [characterId], references: [id]); characterId String; @@id([articleId, characterId]) }
model ArticlesOnCreatures { article Article @relation(fields: [articleId], references: [id]); articleId String; creature Creature @relation(fields: [creatureId], references: [id]); creatureId String; @@id([articleId, creatureId]) }
model ArticlesOnFactions { article Article @relation(fields: [articleId], references: [id]); articleId String; faction Faction @relation(fields: [factionId], references: [id]); factionId String; @@id([articleId, factionId]) }
model ArticlesOnLocations { article Article @relation(fields: [articleId], references: [id]); articleId String; location Location @relation(fields: [locationId], references: [id]); locationId String; @@id([articleId, locationId]) }
model ArticlesOnRegions { article Article @relation(fields: [articleId], references: [id]); articleId String; region Region @relation(fields: [regionId], references: [id]); regionId String; @@id([articleId, regionId]) }
model FactionsOnRegions { faction Faction @relation(fields: [factionId], references: [id]); factionId String; region Region @relation(fields: [regionId], references: [id]); regionId String; @@id([factionId, regionId]) }

model Project {
  id            String        @id @default(cuid())
  title         String
  slug          String        @unique
  type          ProjectType
  status        ProjectStatus
  description   String        @db.Text
  coverImageUrl String?
  bannerUrl     String?
  releaseDate   DateTime?
  links         Json?
  tags          String[]
  publishedAt   DateTime?
  createdAt     DateTime      @default(now())
}

enum ProjectType { VIDEO_GAME TABLETOP_GAME COMIC MANGA ANIMATION NOVEL SHORT_FILM OTHER }
enum ProjectStatus { ANNOUNCED IN_DEVELOPMENT DEMO_AVAILABLE RELEASED ON_HOLD CANCELLED }

model Comment {
  id         String   @id @default(cuid())
  content    String   @db.Text
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  articleId  String
  article    Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  parentId   String?
  parent     Comment? @relation("CommentThread", fields: [parentId], references: [id])
  replies    Comment[] @relation("CommentThread")
  isApproved Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model Vote {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  targetType String
  targetId   String
  value      Int
  createdAt  DateTime @default(now())
  @@unique([userId, targetType, targetId])
}

model ArticleRating {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  articleId String
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  score     Int
  createdAt DateTime @default(now())
  @@unique([userId, articleId])
}

model CommunityProposal {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  type        String
  submittedBy String?
  voteCount   Int      @default(0)
  status      String   @default("OPEN")
  createdAt   DateTime @default(now())
}

model Donation {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  amount    Int
  currency  String   @default("EUR")
  provider  String
  status    String
  createdAt DateTime @default(now())
}

model MediaAsset {
  id         String   @id @default(cuid())
  filename   String
  url        String
  type       String
  mimeType   String
  size       Int
  altText    String?
  tags       String[]
  uploadedBy String?
  createdAt  DateTime @default(now())
}
```

**Structure `apps/api/src/` :**

```
src/
├── index.ts               (point d'entrée Express)
├── app.ts                 (config Express, middlewares globaux)
├── prisma.ts              (singleton Prisma client)
├── middleware/
│   ├── auth.ts            (vérif JWT, attach req.user)
│   ├── requireRole.ts     (factory: requireRole('ADMIN'))
│   ├── upload.ts          (Multer + Cloudinary)
│   ├── errorHandler.ts    (handler global erreurs)
│   └── rateLimiter.ts
├── routes/
│   ├── index.ts           (monte tous les routers)
│   ├── auth.ts
│   ├── characters.ts
│   ├── bestiary.ts
│   ├── articles.ts
│   ├── factions.ts
│   ├── map.ts
│   ├── projects.ts
│   ├── community.ts
│   ├── search.ts
│   ├── media.ts
│   └── admin.ts
├── controllers/           (1 fichier par entité, logique métier)
├── services/              (services réutilisables : slug gen, upload, email...)
└── utils/
    ├── jwt.ts
    ├── password.ts
    ├── slug.ts
    └── pagination.ts
```

**`src/index.ts`** — Serveur Express sur PORT 4000, CORS configuré pour `http://localhost:3000` et le domaine de prod.

**`src/app.ts`** — Express app avec :
- `cors`, `helmet`, `compression`, `express.json()`
- Rate limiter global (100 req/15min pour routes publiques)
- Mount de `/api/v1` sur le router principal
- Error handler global en dernier middleware

**Routes complètes à implémenter :**

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
DELETE /api/v1/auth/logout

GET    /api/v1/map/realms
GET    /api/v1/map/realms/:slug
GET    /api/v1/map/locations?realmId=&regionId=&type=
GET    /api/v1/map/locations/:slug
GET    /api/v1/map/regions
GET    /api/v1/map/regions/:slug

GET    /api/v1/characters?force=&faction=&status=&page=&pageSize=
GET    /api/v1/characters/featured
GET    /api/v1/characters/:slug
POST   /api/v1/characters          [ADMIN/EDITOR]
PUT    /api/v1/characters/:id      [ADMIN/EDITOR]
DELETE /api/v1/characters/:id      [ADMIN]

GET    /api/v1/bestiary?category=&force=&danger=&page=&pageSize=
GET    /api/v1/bestiary/:slug
POST   /api/v1/bestiary            [ADMIN/EDITOR]
PUT    /api/v1/bestiary/:id        [ADMIN/EDITOR]
DELETE /api/v1/bestiary/:id        [ADMIN]

GET    /api/v1/articles?category=&tag=&force=&page=&pageSize=
GET    /api/v1/articles/featured
GET    /api/v1/articles/:slug
POST   /api/v1/articles            [ADMIN/EDITOR]
PUT    /api/v1/articles/:id        [ADMIN/EDITOR]
DELETE /api/v1/articles/:id        [ADMIN]
POST   /api/v1/articles/:id/rate   [SUBSCRIBER]

GET    /api/v1/factions
GET    /api/v1/factions/:slug

GET    /api/v1/projects
GET    /api/v1/projects/:slug
POST   /api/v1/projects            [ADMIN/EDITOR]
PUT    /api/v1/projects/:id        [ADMIN/EDITOR]
DELETE /api/v1/projects/:id        [ADMIN]

GET    /api/v1/community/proposals
POST   /api/v1/community/proposals          [auth]
POST   /api/v1/community/proposals/:id/vote [auth]
GET    /api/v1/articles/:id/comments
POST   /api/v1/articles/:id/comments        [SUBSCRIBER]
DELETE /api/v1/articles/:id/comments/:cid   [ADMIN ou author]

GET    /api/v1/search?q=&type=

POST   /api/v1/media/upload        [ADMIN/EDITOR]
GET    /api/v1/media               [ADMIN]
DELETE /api/v1/media/:id           [ADMIN]

GET    /api/v1/admin/stats         [ADMIN]
GET    /api/v1/admin/users         [ADMIN]
PUT    /api/v1/admin/users/:id/role [ADMIN]
GET    /api/v1/admin/comments/pending [ADMIN]
PUT    /api/v1/admin/comments/:id/approve [ADMIN]
```

---

## PHASE 2 — FRONTEND NEXT.JS

### 2.1 Configuration

**`tailwind.config.ts`** — Thème custom complet avec toutes les couleurs des 6 forces et la palette parchemin :

```typescript
const config = {
  theme: {
    extend: {
      colors: {
        parchment: {
          50:  '#FEFDFB',
          100: '#FDFBF0',
          200: '#F5EDD3',
          300: '#EDE0C4',
          400: '#D4BC8B',
          500: '#B09060',
          600: '#8B7050',
          700: '#6A5038',
          800: '#4A3020',
          900: '#2C1A0E',
        },
        ink: { DEFAULT: '#2C1A0E', dark: '#1A1209', medium: '#4A3020' },
        lumen: {
          100: '#FEFCE8', 200: '#FEF9C3', 300: '#FEF08A',
          400: '#F2D574', 500: '#EAB308', 600: '#D4A017',
          700: '#A37800', 800: '#7A5A00', 900: '#5A4000',
        },
        vesper: {
          100: '#F3E8FF', 200: '#E9D5FF', 300: '#D8B4FE',
          400: '#C084DC', 500: '#A855F7', 600: '#7B2FBE',
          700: '#6D28D9', 800: '#4C1D95', 900: '#3B0A6A',
        },
        aether: {
          100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC',
          400: '#7EC8E3', 500: '#38BDF8', 600: '#0284C7',
          700: '#0369A1', 800: '#075985', 900: '#0C3A6A',
        },
        humus: {
          100: '#F5F0E8', 200: '#E8D9C4', 300: '#D4BA96',
          400: '#A8895A', 500: '#8B6A3E', 600: '#78532A',
          700: '#5E3D1A', 800: '#4A2E10', 900: '#3D2510',
        },
        sanguis: {
          100: '#FFF0F0', 200: '#FFD7D7', 300: '#FFA8A8',
          400: '#F87171', 500: '#EF4444', 600: '#C41E3A',
          700: '#991B1B', 800: '#7F1D1D', 900: '#4A0010',
        },
        nihil: {
          100: '#F8F8F8', 200: '#E5E7EB', 300: '#D1D5DB',
          400: '#9CA3AF', 500: '#6B7280', 600: '#374151',
          700: '#1F2937', 800: '#111827', 900: '#0D0D0D',
        },
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],           // Titres fantasy
        body:    ['Crimson Text', 'serif'],      // Corps de texte
        ui:      ['Inter', 'sans-serif'],        // Interface
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'parchment-texture': "url('/textures/parchment.png')",
        'dark-texture':      "url('/textures/dark-paper.png')",
        'force-lumen':  'radial-gradient(ellipse, #F2D574 0%, #D4A017 100%)',
        'force-vesper': 'radial-gradient(ellipse, #C084DC 0%, #7B2FBE 100%)',
        'force-aether': 'radial-gradient(ellipse, #7EC8E3 0%, #0284C7 100%)',
        'force-humus':  'radial-gradient(ellipse, #A8895A 0%, #78532A 100%)',
        'force-sanguis':'radial-gradient(ellipse, #F87171 0%, #C41E3A 100%)',
        'force-nihil':  'radial-gradient(ellipse, #9CA3AF 0%, #374151 100%)',
      },
      animation: {
        'glow-lumen':   'glowLumen 2s ease-in-out infinite alternate',
        'glow-vesper':  'glowVesper 2s ease-in-out infinite alternate',
        'glow-sanguis': 'glowSanguis 2s ease-in-out infinite alternate',
        'float':        'float 3s ease-in-out infinite',
        'fade-in':      'fadeIn 0.5s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
      },
      keyframes: {
        glowLumen:   { '0%': { boxShadow: '0 0 5px #F2D574' }, '100%': { boxShadow: '0 0 20px #D4A017, 0 0 40px #D4A01744' } },
        glowVesper:  { '0%': { boxShadow: '0 0 5px #C084DC' }, '100%': { boxShadow: '0 0 20px #7B2FBE, 0 0 40px #7B2FBE44' } },
        glowSanguis: { '0%': { boxShadow: '0 0 5px #F87171' }, '100%': { boxShadow: '0 0 20px #C41E3A, 0 0 40px #C41E3A44' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
```

**`app/layout.tsx`** — Layout racine avec :
- Import Google Fonts : Cinzel, Crimson Text, Inter via `next/font/google`
- `ThemeProvider` (support dark/light mode, défaut dark)
- `QueryProvider` (TanStack Query)
- Navigation principale (`<NavBar />`)
- Footer (`<Footer />`)
- Fond parchment avec texture subtile

### 2.2 Composants UI (Design System)

Crée `components/ui/` avec ces composants tous fonctionnels :

**`Button.tsx`** — variantes: `primary` (doré lumen), `secondary` (parchemin), `danger` (sanguis), `ghost`. Tailles: `sm`, `md`, `lg`. Avec états hover/active/disabled + Framer Motion légère sur clic.

**`Card.tsx`** — Card avec `variant`: `parchment` (fond clair), `dark` (fond sombre), `force` (reçoit une `force: MagicForce` et applique bordure + glow couleur de la force). Hover animation : léger scale + glow.

**`Badge.tsx`** — Badge compact pour les forces magiques, statuts, catégories. Reçoit `force?: MagicForce` et applique couleur automatiquement. Ou `variant` custom.

**`ForceBadge.tsx`** — Badge spécialisé forces magiques avec icône SVG unique pour chaque force :
- Lumen : soleil/étoile ✦
- Vesper : lune croissante ☽
- Aether : spirale de vent ≋
- Humus : feuille/cristal ⬡
- Sanguis : goutte de sang ♦
- Nihil : cercle vide ○

**`MagicMeter.tsx`** — Jauge 1-10 avec couleur de la force associée. Affiche des segments lumineux.

**`Modal.tsx`** — Modal avec overlay, close on backdrop, animations Framer Motion (scale + fade). Accessible (focus trap, aria).

**`Tabs.tsx`** — Tabs avec animation de sliding indicator sous l'onglet actif.

**`Avatar.tsx`** — Image de profil avec fallback initiales + border couleur force.

**`Skeleton.tsx`** — Skeletons de chargement pour les cards, profils, articles.

**`Pagination.tsx`** — Navigation pages avec chevrons, numéros, état actif doré.

**`SearchBar.tsx`** — Barre de recherche avec icône loupe, debounce 300ms, dropdown de résultats multi-types.

**`DangerMeter.tsx`** — 10 crânes dont N remplis selon le niveau de danger d'une créature.

**`RealmSwitcher.tsx`** — Switcher entre les 4 realms (Hesperedia | Underworld | L'Orla | The Crimson) avec couleurs thématiques :
- Hesperedia : doré (#D4A017)
- Underworld : rouge sombre (#8B0000)
- L'Orla : violet void (#4C1D95)
- The Crimson : carmin (#C41E3A)

### 2.3 Composants métier

**`CharacterCard.tsx`** — Carte personnage :
- Portrait en aspect-ratio 3/4
- Overlay gradient bas avec nom + titre
- Badges force (primaire + secondaire)
- Badge statut (ALIVE/DECEASED/UNDEAD...)
- Hover : scale 1.02 + glow couleur force primaire
- Lien vers `/characters/[slug]`

**`CreatureCard.tsx`** — Carte créature :
- Portrait en aspect-ratio 4/3 ou carré
- Nom, catégorie, DangerMeter
- Badge origine (Sanguis/Nihil/Naturel...)
- Hover avec glow rouge/void selon l'origine
- Lien vers `/bestiary/[slug]`

**`ArticleCard.tsx`** — Carte article :
- Image de couverture
- Catégorie + badges forces
- Titre, excerpt
- Note moyenne (étoiles)
- Date de publication

**`ProjectCard.tsx`** — Carte projet avec image, type, statut, liens.

**`FactionBadge.tsx`** — Badge compact de faction avec logo miniature + nom.

**`MapMarker.tsx`** — Composant Leaflet marker custom avec icône selon LocationType :
- Ville : maison/tour
- Forteresse : château
- Ruine : pilier brisé
- Donjon : crâne
- Site Sacré : étoile
- Landmark : drapeau
Taille selon importance (capitale > ville > lieu).

**`ArticleRenderer.tsx`** — Rendu Markdown enrichi avec :
- Support des callouts custom `:::lore-note`, `:::warning`, `:::magic`
- Tables stylisées parchemin
- Citations avec style gothique
- Images centrées avec légende
- Infoboxes latérales
Utilise `react-markdown` + `remark-gfm` + plugin custom pour callouts.

**`NavBar.tsx`** — Navigation principale :
- Logo Hesperedia (SVG) + titre typographie Cinzel
- Liens : Carte | Personnages | Bestiaire | Lore | Projets | Communauté
- Barre de recherche globale (SearchBar)
- Bouton login / avatar utilisateur connecté
- Sticky top, backdrop-blur sur scroll
- Hamburger responsive mobile

**`Footer.tsx`** — Footer sombre avec :
- Logo + tagline
- Colonnes de navigation
- Badges des 6 forces avec leurs couleurs
- Liens sociaux

### 2.4 Pages publiques

**Homepage (`app/(public)/page.tsx`)**

Sections (de haut en bas) :
1. **Hero** — Titre "HESPEREDIA" en Cinzel large, sous-titre, CTA "Explorer la Carte" + "Découvrir l'Univers". Background : image panoramique ou SVG stylisé du continent avec couche de brume animée (Framer Motion).
2. **Les 6 Forces** — 6 cartes horizontales/grid, une par force, avec couleur, nom, description courte (15 mots). Hover glow animé. "Chaque mage du monde porte en lui l'empreinte d'une ou plusieurs de ces forces primordiales."
3. **Personnages Featured** — Carrousel ou grille de 4-6 CharacterCard des personnages `isMainCharacter: true`.
4. **Carte Interactive preview** — Aperçu statique de la carte avec bouton "Ouvrir la Carte Complète".
5. **Derniers Articles** — 3 ArticleCard des articles les plus récents publiés.
6. **Statistiques de l'Univers** — Compteurs animés (royaumes, personnages, créatures, articles). Fond sombre, chiffres dorés.
7. **Derniers Projets** — 2-3 ProjectCard.
8. **Call to action Communauté** — "Rejoins la communauté, vote pour les ajouts, soutiens le projet."

**Carte (`app/(public)/map/page.tsx`)**

- Composant `<InteractiveMap />` en plein écran (hauteur 100vh - navbar)
- Utilise `react-leaflet` avec une image de carte custom comme fond (via `L.imageOverlay` ou `L.CRS.Simple`)
- `<RealmSwitcher />` en overlay haut-gauche
- Panel latéral droit (300px) qui s'ouvre au clic sur un marker :
  ```tsx
  <LocationPanel location={selectedLocation} onClose={() => setSelected(null)} />
  ```
  Le panel affiche : image, nom, type, région, description, personnages liés (avatars cliquables), articles liés.
- Contrôles de filtre en overlay haut-droite : par type, par force ambiante
- Layer spécial "Contamination" : zones Sanguis en overlay rouge semi-transparent, zones Nihil en overlay gris-bleu
- Transitions entre realms : fondu avec changement de fond de carte
- Mobile : panel en bottom-sheet drawer

**Personnages (`app/(public)/characters/page.tsx`)**

- `<PageHero title="Personnages" />` avec fond parchemin + illustration
- Filtres : Toutes les forces | Par force (6 boutons colorés) | Par statut | Par faction
- Barre de recherche
- Grille responsive (4 cols desktop, 2 tablet, 1 mobile) de `<CharacterCard />`
- Pagination
- Compteur de résultats
- Fetch depuis `/api/v1/characters` avec les filtres actifs

**Profil Personnage (`app/(public)/characters/[slug]/page.tsx`)**

Layout 2 colonnes :
- **Colonne gauche (1/3)** : Portrait grand format, badges forces, MagicMeter, Infobox (espèce, statut, âge, affiliation, lieu d'origine)
- **Colonne droite (2/3)** : Nom en Cinzel, titres, Tabs [Biographie | Capacités | Histoire | Relations | Articles liés]
- En bas : "Apparaît dans" (projets) + "Articles connexes"
- Métadonnées Next.js générées dynamiquement (titre, description, Open Graph)
- ISR avec `revalidate: 3600`

**Bestiaire (`app/(public)/bestiary/page.tsx`)**

- Même structure que Personnages mais filtres adaptés : par catégorie (8 créatureCategories), par danger (1-3, 4-6, 7-10), par force, par origine
- DangerMeter visible sur les cartes
- Section intro avec explication des catégories de créatures

**Fiche Créature (`app/(public)/bestiary/[slug]/page.tsx`)**

- Layout similaire au profil personnage
- Section spéciale "Zones d'apparition" : mini-carte avec markers
- Section "Faiblesses & Résistances" avec icônes forces
- "Tableau de synthèse" si applicable

**Articles de Lore (`app/(public)/lore/page.tsx`)**

- 3 articles featured en hero (grand format)
- Filtre par catégorie (pills horizontales)
- Filtre par forces magiques
- Grille ArticleCard
- Pagination

**Article (`app/(public)/lore/[slug]/page.tsx`)**

Layout 3 colonnes :
- **Gauche (sidebar 220px)** : Table des matières auto-générée depuis les headings H2/H3, sticky
- **Centre** : Contenu article via `<ArticleRenderer />`, note de lecture en haut (rating moyen + nb votes), boutons de notation en bas si connecté
- **Droite (sidebar 220px)** : "Personnages mentionnés", "Lieux mentionnés", "Factions liées", "Articles connexes"
- Section commentaires en bas (uniquement si `publishedAt` non null et user SUBSCRIBER+)
- Share buttons (copy link, Twitter/X, Reddit)

**Projets (`app/(public)/projects/page.tsx`)**

- Header avec description de la vision créative
- Filtre par type + statut
- Grille ProjectCard

**Communauté (`app/(public)/community/page.tsx`)**

4 sections :
1. **Propositions en vote** — Liste des `CommunityProposal` avec boutons +1/-1, triables par votes
2. **Articles les mieux notés** — Top 10 articles de la semaine
3. **Jauge de dons** — Progression vers prochain palier avec description des récompenses (contenu débloqué)
4. **Règles & FAQ communauté**

### 2.5 Interface Admin

**Layout Admin (`app/(admin)/layout.tsx`)**

- Sidebar gauche 240px avec navigation admin
- Vérification JWT côté client + redirect si non-admin
- Header avec nom utilisateur + logout
- Breadcrumbs dynamiques

**Sidebar navigation admin :**
- Dashboard
- Contenu (Articles, Personnages, Bestiaire, Factions, Projets)
- Carte (Locations, Régions, Realms)
- Communauté (Commentaires à modérer, Propositions, Donations)
- Médias
- Utilisateurs
- Paramètres

**Dashboard (`app/(admin)/dashboard/page.tsx`)**

- Cards de stats : articles publiés / brouillons, personnages, créatures, commentaires en attente, donations ce mois
- Graphique barres des vues par page (7 derniers jours) — utilise Recharts
- Feed dernières actions (articles créés, commentaires en attente)
- Boutons actions rapides

**Éditeur Articles (`app/(admin)/articles/[id]/edit/page.tsx`)**

- Éditeur TipTap (rich text) avec extensions Markdown, code, tables, images
- Split view : éditeur gauche | preview droite (toggle)
- Sidebar droite de métadonnées : slug (auto-généré + éditable), catégorie, tags, forces liées, featured toggle, image de couverture (upload direct → Cloudinary), date de publication (date picker), relations (personnages, créatures, lieux)
- Auto-save toutes les 30 secondes avec indicateur
- Boutons : Sauvegarder brouillon | Publier | Dépublier | Supprimer

**Gestionnaire Personnages (`app/(admin)/characters/page.tsx`)**

- Tableau avec colonnes : portrait miniature, nom, force, statut, faction, publié/brouillon, actions
- Tri par colonnes
- Filtre rapide
- Bouton "Nouveau personnage" → formulaire complet

**Formulaire Personnage (`app/(admin)/characters/[id]/edit/page.tsx`)**

- Tous les champs du modèle Character
- Upload portrait + bannière vers Cloudinary
- Sélecteur de forces avec preview couleur
- Éditeur riche pour biographie, capacités, histoire
- Sélecteur multiple pour affiliations (factions) avec recherche
- Sélecteur lieu d'origine avec recherche

**Gestionnaire Carte (`app/(admin)/map/page.tsx`)**

- Interface en 2 panneaux : liste locations (gauche) + carte interactive éditable (droite)
- Sur la carte : clic pour ajouter un marker, drag pour déplacer
- Formulaire en modal pour chaque location

**Bibliothèque Médias (`app/(admin)/media/page.tsx`)**

- Grid d'assets avec miniatures
- Upload par drag & drop (zone dédiée)
- Filtres par type, tags
- Clic sur asset → modal avec URL, dimensions, bouton copier URL, tags éditables, suppression

**Modération (`app/(admin)/moderation/page.tsx`)**

- Tabs : Commentaires en attente | Propositions | Signalements
- Actions : approuver / rejeter avec 1 clic
- Fil de commentaires contextualisé (article + thread)

---

## PHASE 3 — AUTHENTIFICATION & SÉCURITÉ

**Middleware auth (`apps/api/src/middleware/auth.ts`)** :
- Extrait le Bearer token du header Authorization
- Vérifie avec `jwt.verify(token, process.env.JWT_SECRET)`
- Attache `req.user = { id, email, role }` si valide
- Retourne 401 si token manquant/invalide, 403 si expiré

**Route `POST /auth/login`** :
- Valide email + password avec Zod
- Récupère user par email, compare hash bcrypt
- Génère `accessToken` (expiry 15min) et `refreshToken` (expiry 7 jours, stocké en DB ou cookie httpOnly)
- Retourne les deux tokens + user sans passwordHash

**Route `POST /auth/refresh`** :
- Reçoit refreshToken
- Vérifie validité, génère nouveau accessToken
- Retourne nouveau accessToken

**Côté Next.js** :
- `lib/auth.ts` : helpers pour stocker tokens en localStorage (accessToken) + cookie httpOnly (refreshToken via API route Next.js)
- Intercepteur Axios/fetch pour renouveler automatiquement l'accessToken si 401
- `useAuth()` hook Zustand : `{ user, isAdmin, isSubscriber, login, logout }`
- HOC `withAdminAuth()` pour les pages admin côté client

---

## PHASE 4 — DONNÉES DE SEED

Crée `apps/api/prisma/seed.ts` avec des données initiales réalistes basées sur l'univers Hesperedia :

**Realms (4) :**
- Hesperedia (`color: '#D4A017'`) — le monde principal
- Underworld (`color: '#8B0000'`) — le monde infernal d'où viennent les démons
- L'Orla (`color: '#4C1D95'`) — espace cosmique entre les mondes
- The Crimson (`color: '#C41E3A'`) — les terres carmin du Dévoreur

**Régions (10+) :**
Issues de la géographie : Hwitland (archipel), Anthoresia (centre), Bonventaria/Belvento (sud), Einmark (nord), Bagrania (terres brisées), Hieria/Saint Trône (cité sacrée).

**Locations (15+) :**
Albrenfort, Bralorme, Cruceava, Kaiservorn, Pivograd, Hieria, Belvento, Valdrevorn (ruine), etc.

**Factions (8+) :**
Hwitland, Anthoresia, Einmark, Belvento (la Sérénissime), Saint Trône / Église du Zénith, Ordre des Paladins Rouges, Culte du Dévoreur des Mondes, Crépuscule des Dieux.

**Personnage (1 complet) :**
William O'Dubh — Chevalier Revenant, espèce "Humain/Revenant", status UNDEAD, primaryForce NIHIL, biographie complète issue des notes.

**Créatures (5) :**
Marcheurs de Peau (SANGUIS_CORRUPTION), Gorraks (MONSTER), Revenants (NIHIL_CORRUPTION), Vampires (NIHIL_CORRUPTION), Démons Liés (DEMON).

**Articles (3) :**
Un article sur les 6 Forces Magiques (catégorie MAGIC_SYSTEM), un sur la Contamination Sanguis (catégorie HISTORY), un sur Belvento (catégorie POLITICS).

**User admin par défaut :**
- email: `admin@hesperedia.wiki`
- password: `HespeAdmin2024!` (hashé)
- role: ADMIN

---

## PHASE 5 — FINITIONS & OPTIMISATIONS

**SEO :**
- `generateMetadata()` dynamique pour toutes les pages [slug] : title, description, openGraph (image = portrait/cover), twitter card
- `generateStaticParams()` pour pre-render les pages populaires
- `robots.ts` et `sitemap.ts` à la racine de `app/`
- Structured data JSON-LD pour les personnages (Person schema) et articles (Article schema)

**Performance :**
- `revalidate: 3600` sur toutes les pages de contenu (ISR)
- `next/image` pour toutes les images avec sizes optimisés
- Lazy load des composants lourds (éditeur TipTap, carte Leaflet) avec `dynamic(() => import(...), { ssr: false })`
- Skeleton loaders pendant le chargement

**Accessibilité :**
- Attributs `aria-label` sur tous les boutons icônes
- Focus visible sur tous les éléments interactifs
- Alt text sur toutes les images
- Contraste WCAG AA respecté sur les deux thèmes

**Variables d'environnement :**
Crée `.env.example` avec toutes les variables requises :
```
# API
DATABASE_URL=postgresql://user:password@localhost:5432/hesperedia
JWT_SECRET=your-secret-here-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-here
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=4000

# Web
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

**README.md** racine avec :
- Description du projet
- Prérequis (Node 18+, PostgreSQL 14+)
- Instructions d'installation et de démarrage
- Structure du projet
- Variables d'environnement
- Commandes utiles (`npm run dev`, `npm run build`, `npm run seed`, `npm run db:migrate`)

---

## INSTRUCTIONS IMPORTANTES POUR CLAUDE CODE

1. **Commence par le setup** : monorepo root, packages/shared-types, puis apps/api avec Prisma, puis apps/web.

2. **Installe toutes les dépendances** avec les bonnes versions. Pour l'API : `express`, `@prisma/client`, `prisma`, `bcryptjs`, `jsonwebtoken`, `zod`, `multer`, `cloudinary`, `multer-storage-cloudinary`, `cors`, `helmet`, `compression`, `express-rate-limit`. Pour le web : `next`, `react`, `typescript`, `tailwindcss`, `framer-motion`, `react-leaflet`, `leaflet`, `@tanstack/react-query`, `zustand`, `react-markdown`, `remark-gfm`, `@tiptap/react` et extensions TipTap, `recharts`, `@tailwindcss/typography`, `@tailwindcss/forms`.

3. **Tous les fichiers TypeScript doivent compiler sans erreur**. Utilise `"strict": true` dans tous les `tsconfig.json`.

4. **Le code doit être propre et complet** — pas de `// TODO` non résolu, pas de `any` sauf cas extrêmes justifiés, gestion des erreurs dans chaque route API.

5. **Chaque route API doit inclure** : validation Zod des inputs, gestion d'erreur try/catch, réponses JSON structurées `{ data: ..., error: ... }`, codes HTTP corrects (200/201/400/401/403/404/500).

6. **Génère le fichier `prisma/seed.ts`** et assure-toi qu'il peut s'exécuter avec `npx prisma db seed`.

7. **Les pages Next.js doivent être fonctionnelles** : fetch de données réel depuis l'API, états de chargement avec skeletons, gestion des erreurs (page not found si slug invalide), et responsive mobile.

8. **Le design system Tailwind doit être cohérent** : utilise uniquement les couleurs définies dans `tailwind.config.ts`, jamais de couleurs hardcodées.

9. **Pour la carte**, utilise `react-leaflet` avec `CRS.Simple` (pour une image custom non-géographique). Prépare un placeholder d'image de carte (`public/maps/hesperedia.jpg`) et génère des coordonnées de markers fictifs mais cohérents géographiquement.

10. Génère aussi un **`docker-compose.yml`** à la racine pour lancer PostgreSQL en local facilement.

Lance-toi. Construis ce projet de façon méthodique et complète.
```

---

## COMMENT UTILISER CE PROMPT

1. Crée un dossier vide `hesperedia-wiki/`
2. Ouvre un terminal dans ce dossier
3. Lance Claude Code : `claude`
4. Colle le contenu du bloc de code ci-dessus
5. Claude Code va scaffolder et construire l'intégralité du projet

**Durée estimée de génération** : 15-30 minutes selon la vitesse de la machine.

**Après génération :**
```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# → remplis DATABASE_URL, JWT_SECRET, etc.

# Lancer PostgreSQL
docker-compose up -d

# Migrations + seed
cd apps/api
npx prisma migrate dev
npx prisma db seed

# Lancer le projet
cd ../..
npm run dev
# → web sur http://localhost:3000
# → api sur http://localhost:4000
```
