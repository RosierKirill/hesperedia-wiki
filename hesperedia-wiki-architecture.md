# HESPEREDIA WIKI — PLAN D'ARCHITECTURE COMPLET

> Document de référence pour le développement du wiki web de l'univers Hesperedia.
> Stack : Next.js 14 + Node.js/Express + PostgreSQL + Prisma

---

## 1. VUE D'ENSEMBLE DU PROJET

Le wiki Hesperedia est une application web full-stack de type "Fandom wiki" entièrement personnalisée, construite autour de l'univers imaginaire d'Hesperedia. Il combine un front public riche (carte interactive, articles de lore, personnages, bestiaire) avec un back-office admin complet pour la rédaction et la gestion du contenu.

### Objectifs produit
- Wiki public accessible à tous, sans compte requis pour lire
- Carte interactive multi-realms (monde principal, Underworld, L'Orla, The Crimson)
- Pages Personnages et Bestiaire avec profils détaillés au clic
- Articles de lore richement mis en page
- Section Projets (jeux, BD, animations)
- Page Communauté (votes, notes, commentaires abonnés/donateurs)
- Interface Admin complète (CRUD sur tout le contenu, gestion users)
- Design thématique inspiré des 6 forces magiques + esthétique parchemin/livre ancien

---

## 2. STACK TECHNIQUE

### Frontend
- **Next.js 14** (App Router) — SSR/SSG pour le SEO et les performances
- **TypeScript** — typage complet
- **Tailwind CSS** — styling utilitaire, thème personnalisé
- **Framer Motion** — animations légères et fluides
- **Leaflet.js** ou **Pixi.js** — carte interactive (Leaflet pour carte image tuilée, Pixi si animations avancées)
- **Zustand** — state management global (session, panier de votes, etc.)
- **React Query (TanStack)** — fetching/caching des données API

### Backend
- **Node.js + Express** — API REST
- **TypeScript**
- **Prisma ORM** — gestion de la base de données
- **PostgreSQL** — base de données principale
- **JWT + bcrypt** — authentification admin/abonnés
- **Multer + Cloudinary** (ou AWS S3) — upload d'images (portraits, maps, artworks)
- **Zod** — validation des données entrantes
- **Express Rate Limiter** — protection des endpoints publics

### Infrastructure & Déploiement
- **Vercel** — hosting Next.js frontend (CI/CD automatique depuis GitHub)
- **Railway** ou **Render** — hosting API Express + PostgreSQL
- **Cloudinary** — CDN images et assets
- **GitHub** — monorepo avec workspaces
- **GitHub Actions** — pipeline CI/CD (lint, tests, deploy)

---

## 3. STRUCTURE DU PROJET (MONOREPO)

```
hesperedia-wiki/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/
│   │   │   ├── (public)/       # Routes publiques
│   │   │   │   ├── page.tsx              # Homepage
│   │   │   │   ├── map/page.tsx          # Carte interactive
│   │   │   │   ├── characters/
│   │   │   │   │   ├── page.tsx          # Liste personnages
│   │   │   │   │   └── [slug]/page.tsx   # Profil personnage
│   │   │   │   ├── bestiary/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   ├── lore/
│   │   │   │   │   ├── page.tsx          # Index articles
│   │   │   │   │   └── [slug]/page.tsx   # Article
│   │   │   │   ├── factions/[slug]/page.tsx
│   │   │   │   ├── projects/page.tsx
│   │   │   │   └── community/page.tsx
│   │   │   ├── (admin)/        # Routes admin (protégées)
│   │   │   │   ├── layout.tsx            # Layout admin avec sidebar
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── articles/
│   │   │   │   ├── characters/
│   │   │   │   ├── bestiary/
│   │   │   │   ├── map/
│   │   │   │   ├── media/
│   │   │   │   └── users/
│   │   │   └── api/            # Next.js API routes (proxy léger)
│   │   ├── components/
│   │   │   ├── ui/             # Design system (Button, Card, Badge, Modal...)
│   │   │   ├── map/            # Composants carte
│   │   │   ├── character/      # Composants personnages
│   │   │   ├── bestiary/       # Composants bestiaire
│   │   │   ├── lore/           # Composants articles
│   │   │   └── admin/          # Composants back-office
│   │   └── lib/
│   │       ├── api.ts          # Client API
│   │       ├── auth.ts         # Helpers auth
│   │       └── constants.ts    # Constantes (forces, royaumes...)
│   └── api/                    # Express backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── characters.ts
│       │   │   ├── bestiary.ts
│       │   │   ├── articles.ts
│       │   │   ├── map.ts
│       │   │   ├── factions.ts
│       │   │   ├── projects.ts
│       │   │   ├── community.ts
│       │   │   └── admin.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts       # Vérification JWT
│       │   │   ├── admin.ts      # Vérification rôle admin
│       │   │   └── upload.ts     # Multer config
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── prisma/
│       │   │   └── schema.prisma
│       │   └── utils/
│       └── tests/
└── packages/
    ├── shared-types/           # Types TypeScript partagés
    └── config/                 # Config ESLint, Prettier partagée
```

---

## 4. SCHÉMA DE BASE DE DONNÉES (PostgreSQL / Prisma)

```prisma
// ─── UTILISATEURS ───────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  passwordHash  String
  role          UserRole  @default(READER)
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  comments      Comment[]
  votes         Vote[]
  donations     Donation[]
  articleRatings ArticleRating[]
}

enum UserRole {
  ADMIN
  EDITOR
  SUBSCRIBER   // commentaires + votes
  READER       // lecture seule (pas de compte requis)
}

// ─── UNIVERS / REALMS ────────────────────────────────────────────

model Realm {
  id          String   @id @default(cuid())
  name        String   @unique   // "Hesperedia", "Underworld", "L'Orla", "The Crimson"
  slug        String   @unique
  description String?
  mapImageUrl String?
  color       String?  // couleur thématique hex
  order       Int      @default(0)

  regions     Region[]
  locations   Location[]
}

// ─── GÉOGRAPHIE ──────────────────────────────────────────────────

model Region {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  realmId       String
  realm         Realm    @relation(fields: [realmId], references: [id])
  description   String?
  biome         String?
  dominantForce MagicForce?
  mapCoords     Json?    // { x, y, polygon: [...] } pour la carte interactive
  imageUrl      String?
  publishedAt   DateTime?
  createdAt     DateTime @default(now())

  locations     Location[]
  factions      Faction[]
  articles      Article[]
}

model Location {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  type          LocationType    // CITY, RUIN, DUNGEON, LANDMARK...
  realmId       String
  realm         Realm    @relation(fields: [realmId], references: [id])
  regionId      String?
  region        Region?  @relation(fields: [regionId], references: [id])
  description   String?
  mapCoords     Json?    // { x, y } coordonnées sur la carte
  imageUrl      String?
  isCapital     Boolean  @default(false)
  publishedAt   DateTime?
  createdAt     DateTime @default(now())

  characters    Character[]
  articles      Article[]
}

enum LocationType {
  CITY
  VILLAGE
  FORTRESS
  RUIN
  DUNGEON
  LANDMARK
  SACRED_SITE
  CAMP
}

// ─── FORCES MAGIQUES ─────────────────────────────────────────────

enum MagicForce {
  LUMEN
  VESPER
  AETHER
  HUMUS
  SANGUIS
  NIHIL
}

// ─── FACTIONS ────────────────────────────────────────────────────

model Faction {
  id            String     @id @default(cuid())
  name          String
  slug          String     @unique
  type          FactionType  // KINGDOM, CULT, ORDER, GUILD, CLAN...
  description   String?
  logoUrl       String?
  bannerUrl     String?
  dominantForce MagicForce?
  alignment     String?    // "Bien", "Neutre", "Mal", "Complexe"
  regionId      String?
  region        Region?    @relation(fields: [regionId], references: [id])
  publishedAt   DateTime?
  createdAt     DateTime   @default(now())

  characters    Character[]
  articles      Article[]
}

enum FactionType {
  KINGDOM
  EMPIRE
  CITY_STATE
  CULT
  ORDER
  GUILD
  CLAN
  CHURCH
  SECRET_SOCIETY
}

// ─── PERSONNAGES ─────────────────────────────────────────────────

model Character {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  titles          String[]    // ["Chevalier Revenant", "Héros de Hwitland"]
  species         String      // "Humain", "Elfe de cour", "Revenant"...
  gender          String?
  age             String?     // peut être "Inconnu" ou "~300 ans"
  status          CharacterStatus
  affiliations    Faction[]
  homeLocationId  String?
  homeLocation    Location?   @relation(fields: [homeLocationId], references: [id])
  portraitUrl     String?
  bannerUrl       String?

  // Stats/attributs magiques
  primaryForce    MagicForce?
  secondaryForce  MagicForce?
  magicLevel      Int?        // 1-10
  
  // Biographie (format riche)
  biography       String      // Markdown/HTML riche
  personality     String?
  abilities       String?
  history         String?
  
  // Métadonnées
  isMainCharacter Boolean     @default(false)
  publishedAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  articles        Article[]
}

enum CharacterStatus {
  ALIVE
  DECEASED
  UNDEAD
  UNKNOWN
  TRANSFORMED
}

// ─── BESTIAIRE ───────────────────────────────────────────────────

model Creature {
  id              String        @id @default(cuid())
  name            String
  slug            String        @unique
  category        CreatureCategory
  subcategory     String?       // "Marcheur de Peau", "Mort-vivant"...
  origin          CreatureOrigin
  primaryForce    MagicForce?
  dangerLevel     Int?          // 1-10
  
  description     String
  abilities       String?
  weaknesses      String?
  habitat         String?
  
  portraitUrl     String?
  imageUrl        String?
  
  publishedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  articles        Article[]
}

enum CreatureCategory {
  SANGUIS_CORRUPTION    // Marcheurs de Peau, etc.
  NIHIL_CORRUPTION      // Morts-vivants, etc.
  MONSTER               // Mangeurs d'Hommes (Gorraks, Vulgars...)
  DEMON                 // Démons de l'Underworld
  ORLA_ENTITY           // Aberrations de l'Orla
  TRANSFORMED_ANIMAL    // Animaux transformés
  HYBRID                // Prédateurs hybrides
  DEEP_CREATURE         // Créatures du Monde Profond
}

enum CreatureOrigin {
  NATURAL
  SANGUIS
  NIHIL
  UNDERWORLD
  ORLA
  ANCIENT_MAGIC
  UNKNOWN
}

// ─── ARTICLES DE LORE ────────────────────────────────────────────

model Article {
  id            String        @id @default(cuid())
  title         String
  slug          String        @unique
  category      ArticleCategory
  excerpt       String?       // Résumé court pour les cartes
  content       String        // Markdown enrichi
  coverImageUrl String?
  
  // Relations
  authorId      String?
  author        User?         @relation(...)
  relatedCharacters  Character[]
  relatedCreatures   Creature[]
  relatedFactions    Faction[]
  relatedLocations   Location[]
  relatedArticles    Article[]   @relation("ArticleToArticle")
  
  // Tags
  tags          String[]
  magicForces   MagicForce[]  // Forces liées à l'article
  
  // Méta
  featured      Boolean       @default(false)
  publishedAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  ratings       ArticleRating[]
  comments      Comment[]
}

enum ArticleCategory {
  HISTORY          // Histoire du monde
  MAGIC_SYSTEM     // Système de magie
  CULTURE          // Culture et société
  RELIGION         // Religion et croyances
  GEOGRAPHY        // Géographie
  POLITICS         // Politique et factions
  EVENT            // Événements majeurs
  LANGUAGE         // Langues
  MYTHOLOGY        // Mythologie
  TECHNOLOGY       // Technologie et artisanat
}

// ─── PROJETS DANS L'UNIVERS ──────────────────────────────────────

model Project {
  id            String        @id @default(cuid())
  title         String
  slug          String        @unique
  type          ProjectType
  status        ProjectStatus
  description   String
  coverImageUrl String?
  bannerUrl     String?
  releaseDate   DateTime?
  links         Json?         // { website, steam, itch, youtube... }
  tags          String[]
  
  publishedAt   DateTime?
  createdAt     DateTime      @default(now())
}

enum ProjectType {
  VIDEO_GAME
  TABLETOP_GAME
  COMIC
  MANGA
  ANIMATION
  NOVEL
  SHORT_FILM
  OTHER
}

enum ProjectStatus {
  ANNOUNCED
  IN_DEVELOPMENT
  DEMO_AVAILABLE
  RELEASED
  ON_HOLD
  CANCELLED
}

// ─── COMMUNAUTÉ ──────────────────────────────────────────────────

model Comment {
  id          String    @id @default(cuid())
  content     String
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  articleId   String
  article     Article   @relation(fields: [articleId], references: [id])
  parentId    String?   // Pour les réponses
  parent      Comment?  @relation("CommentThread", fields: [parentId], references: [id])
  replies     Comment[] @relation("CommentThread")
  isApproved  Boolean   @default(false)
  createdAt   DateTime  @default(now())
}

model Vote {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  targetType  String    // "CHARACTER_IDEA", "CREATURE_IDEA", "FEATURE"
  targetId    String
  value       Int       // +1 ou -1
  createdAt   DateTime  @default(now())

  @@unique([userId, targetType, targetId])
}

model ArticleRating {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  articleId   String
  article     Article   @relation(fields: [articleId], references: [id])
  score       Int       // 1-5
  createdAt   DateTime  @default(now())

  @@unique([userId, articleId])
}

model CommunityProposal {
  id          String    @id @default(cuid())
  title       String
  description String
  type        String    // "CHARACTER", "LORE", "CREATURE", "FEATURE"
  submittedBy String?
  voteCount   Int       @default(0)
  status      String    @default("OPEN")  // OPEN, ACCEPTED, REJECTED
  createdAt   DateTime  @default(now())
}

model Donation {
  id          String    @id @default(cuid())
  userId      String?
  user        User?     @relation(fields: [userId], references: [id])
  amount      Int       // en centimes
  currency    String    @default("EUR")
  provider    String    // "stripe", "paypal"
  status      String    // "pending", "completed", "failed"
  createdAt   DateTime  @default(now())
}

// ─── MEDIA ───────────────────────────────────────────────────────

model MediaAsset {
  id          String    @id @default(cuid())
  filename    String
  url         String
  type        String    // "image", "video", "audio"
  mimeType    String
  size        Int
  altText     String?
  tags        String[]
  uploadedBy  String?
  createdAt   DateTime  @default(now())
}
```

---

## 5. API REST (Express)

### Structure des endpoints

```
BASE URL: /api/v1

── AUTH ─────────────────────────────────────────────────────────
POST   /auth/login               Login admin/subscriber
POST   /auth/register            Inscription abonné
POST   /auth/refresh             Refresh token
DELETE /auth/logout

── MAP ──────────────────────────────────────────────────────────
GET    /map/realms               Liste des realms avec métadonnées
GET    /map/realms/:slug         Détail realm + régions + locations
GET    /map/locations            Toutes les locations (filtrable)
GET    /map/locations/:slug      Détail d'une location

── CHARACTERS ───────────────────────────────────────────────────
GET    /characters               Liste (filtre: force, faction, status, realm)
GET    /characters/:slug         Profil complet
GET    /characters/featured      Personnages mis en avant
[ADMIN] POST/PUT/DELETE /characters

── BESTIARY ─────────────────────────────────────────────────────
GET    /bestiary                 Liste (filtre: catégorie, force, danger)
GET    /bestiary/:slug           Fiche créature complète
[ADMIN] POST/PUT/DELETE /bestiary

── ARTICLES ─────────────────────────────────────────────────────
GET    /articles                 Liste (filtre: catégorie, tag, force)
GET    /articles/:slug           Article complet
GET    /articles/featured        Articles mis en avant
POST   /articles/:id/rate        Notation (auth subscriber)
[ADMIN] POST/PUT/DELETE /articles

── FACTIONS ─────────────────────────────────────────────────────
GET    /factions                 Liste
GET    /factions/:slug           Détail faction

── PROJECTS ─────────────────────────────────────────────────────
GET    /projects                 Liste projets
GET    /projects/:slug           Détail projet

── COMMUNITY ────────────────────────────────────────────────────
GET    /community/proposals      Propositions communauté
POST   /community/proposals      Soumettre une proposition
POST   /community/proposals/:id/vote  Voter (auth)
GET    /articles/:id/comments    Commentaires
POST   /articles/:id/comments    Commenter (auth subscriber)
POST   /donations/create         Initier une donation (Stripe)
POST   /donations/webhook        Webhook Stripe

── SEARCH ───────────────────────────────────────────────────────
GET    /search?q=...             Recherche globale (personnages, créatures, articles, lieux)

── ADMIN ────────────────────────────────────────────────────────
GET    /admin/stats              Stats dashboard
GET    /admin/users              Gestion utilisateurs
PUT    /admin/users/:id/role     Changer le rôle
GET    /admin/media              Bibliothèque médias
POST   /admin/media/upload       Upload fichier
```

---

## 6. PAGES PUBLIQUES — DÉTAIL

### 6.1 Homepage (`/`)
- Hero banner animé avec titre Hesperedia + particules magiques
- Section "Univers en chiffres" (royaumes, personnages, créatures, articles)
- Mise en avant articles récents / personnages phares
- Aperçu de la carte interactive avec CTA
- Section "Les 6 Forces" avec les couleurs thématiques
- Derniers projets annoncés
- Footer avec navigation complète

### 6.2 Carte Interactive (`/map`)
- Canvas Leaflet avec image de la carte d'Hesperedia comme fond
- **Markers cliquables** sur chaque ville et lieu notable
- **Popup au survol** : nom, type, région
- **Panel latéral** au clic : image, description, personnages associés, articles liés
- **Switcher de Realms** en haut : Hesperedia | Underworld | L'Orla | The Crimson
  - Transition animée entre les cartes des différents realms
- **Filtres** : par type de lieu, par force magique dominante, zones contaminées
- **Layer de contamination** : heatmap rouge pour les zones Sanguis/Bagrania
- **Layer Nihil** : effet de dissolution sur les zones affectées
- Responsive : sur mobile, panel en bas en drawer

### 6.3 Personnages (`/characters`)
- Grille de cartes profil (portrait, nom, titre, force principale, faction)
- Filtres : par force magique, par faction, par statut (vivant/mort/mort-vivant), par race
- Barre de recherche
- Cartes avec hover animation (légère lueur couleur force)

### 6.4 Profil Personnage (`/characters/[slug]`)
- **Header** : portrait grand format, nom, titres, statut, badges forces magiques
- **Infobox latérale** : espèce, affiliation(s), lieu d'origine, niveau magique
- **Tabs** : Biographie | Capacités | Histoire | Relations | Articles liés
- **Section "Apparaît dans"** : projets liés
- **Galerie** d'artworks si disponibles
- Article connexes en bas de page

### 6.5 Bestiaire (`/bestiary`)
- Identique à Personnages mais avec badges catégorie (Sanguis, Nihil, Naturel, Démon...)
- Indicateur de dangerosité visuel (1-10 skulls)
- Filtre par zone géographique d'apparition

### 6.6 Fiche Créature (`/bestiary/[slug]`)
- Même structure que personnage
- Section spéciale : zones d'apparition sur mini-carte
- Section faiblesses / résistances avec icônes forces

### 6.7 Articles de Lore (`/lore`)
- Index par catégorie (Histoire, Magie, Culture, Géographie, Politique...)
- Articles featured en hero
- Grille articles avec image de couverture, catégorie, note moyenne
- Tags filtrables

### 6.8 Article (`/lore/[slug]`)
- Layout "livre ancien" : colonne de contenu centrale, table des matières latérale
- Contenu Markdown enrichi (callouts, citations, infoboxes)
- **Note de l'article** (étoiles) pour abonnés connectés
- Commentaires en bas (abonnés/donateurs)
- Articles connexes
- Encadrés "Personnages mentionnés", "Lieux mentionnés"

### 6.9 Projets (`/projects`)
- Grille de projets avec type, statut, date de sortie
- Filtres par type (jeu, BD, animation...)
- Badges de statut colorés (En développement, Sorti, Annoncé...)

### 6.10 Communauté (`/community`)
- **Section Votes** : propositions ouvertes au vote de la communauté
- **Section Notes** : articles les mieux notés cette semaine
- **Section Donations** : jauge de progression, paliers débloqués
- **Règles** de la communauté

---

## 7. INTERFACE ADMIN — DÉTAIL

### 7.1 Dashboard (`/admin/dashboard`)
- Stats temps réel : articles publiés, personnages, vues, commentaires en attente
- Actions rapides : "Nouvel article", "Nouveau personnage", etc.
- Feed d'activité récente

### 7.2 Éditeur d'Article (`/admin/articles/[id]/edit`)
- Éditeur Markdown enrichi (Monaco Editor ou TipTap)
- Prévisualisation en temps réel
- Sidebar : métadonnées (catégorie, tags, forces liées, featured)
- Upload d'image de couverture direct
- Gestion des relations (personnages, créatures, lieux liés)
- Bouton "Publier" / "Brouillon" / "Archiver"

### 7.3 Gestionnaire de Carte (`/admin/map`)
- Interface visuelle pour placer des markers sur la carte
- Formulaire pour chaque location (nom, type, description, image)
- Gestion des realms et des couches

### 7.4 Gestion Médias (`/admin/media`)
- Bibliothèque d'assets avec upload drag & drop
- Tagging et organisation par dossiers
- Intégration Cloudinary

### 7.5 Modération (`/admin/moderation`)
- File d'attente des commentaires à approuver
- Gestion des propositions communauté
- Gestion des utilisateurs et rôles

---

## 8. PALETTE DE COULEURS — PROPOSITION THÉMATIQUE

La palette combine les 6 forces magiques avec une base "parchemin/livre ancien".

### Couleurs de base
```css
--parchment-100: #FDFBF0;   /* Ivoire très clair */
--parchment-200: #F5EDD3;   /* Parchemin clair */
--parchment-300: #EDE0C4;   /* Parchemin */
--parchment-400: #D4BC8B;   /* Vieux papier */
--parchment-500: #B09060;   /* Parchemin foncé */
--ink-dark:      #2C1A0E;   /* Encre brune foncée */
--ink-black:     #1A1209;   /* Fond sombre (dark mode) */
--ink-medium:    #4A3020;   /* Texte courant */
--stone-gray:    #8B7A6A;   /* Gris chaud */
```

### Les 6 Forces
```css
/* LUMEN — Ordre, Lumière, Structure */
--lumen-100: #FEFCE8;
--lumen-400: #F2D574;
--lumen-600: #D4A017;   /* Or principal */
--lumen-900: #7A5A00;

/* VESPER — Transformation, Dualité, Altération */
--vesper-100: #F3E8FF;
--vesper-400: #C084DC;
--vesper-600: #7B2FBE;   /* Violet principal */
--vesper-900: #3B0A6A;

/* AETHER — Mouvement, Circulation, Échange */
--aether-100: #E0F2FE;
--aether-400: #7EC8E3;
--aether-600: #0284C7;   /* Bleu ciel principal */
--aether-900: #0C3A6A;

/* HUMUS — Terre, Ancrage, Biologique */
--humus-100: #F5F0E8;
--humus-400: #A8895A;
--humus-600: #78532A;   /* Brun terre principal */
--humus-900: #3D2510;

/* SANGUIS — Sang, Excès, Corruption */
--sanguis-100: #FFF0F0;
--sanguis-400: #F87171;
--sanguis-600: #C41E3A;   /* Carmin principal */
--sanguis-900: #4A0010;

/* NIHIL — Vide, Dissolution, Rupture */
--nihil-100:  #F8F8F8;
--nihil-400:  #9CA3AF;
--nihil-600:  #374151;   /* Ardoise foncée */
--nihil-900:  #0D0D0D;
```

### Thème général
- **Mode principal** : fond parchemin clair (`--parchment-200`) avec texte encre sombre
- **Dark mode** : fond nuit profonde (`#1A1209`) avec texte parchemin clair
- **Accents** : doré Lumen (`#D4A017`) pour les éléments actifs, CTAs, titres
- **Danger** : carmin Sanguis pour les zones corrompues, indicateurs de danger
- **Mystère** : violet Vesper pour les sections magiques / Orla

---

## 9. COMPOSANTS UI CLÉS

### ForcesBadge
Affiche une ou plusieurs forces magiques avec couleur et icône associées.
```tsx
<ForceBadge force="LUMEN" size="md" />
// → Badge doré "Lumen ✦"
```

### CharacterCard
Carte personnage avec portrait, hover glow couleur force, titre, affiliation.

### CreatureCard
Similaire + indicateur danger (crânes 1-10) + badge origine (Sanguis/Nihil/Naturel...).

### MapMarker
Marker Leaflet custom selon le type de lieu (ville, ruine, donjon, site sacré).

### ArticleCallout
Bloc mis en avant dans les articles : citation, avertissement, information lore.
```md
:::lore-note
Les archives de Thalassyris suggèrent que...
:::
```

### RealmSwitcher
Switcher animé entre les 4 realms de la carte.

### MagicMeter
Jauge visuelle du niveau magique d'un personnage ou créature (1-10).

---

## 10. ANIMATIONS (Framer Motion)

- **Page transitions** : fondu + léger déplacement vertical (100ms ease)
- **Carte** : zoom smooth sur clic, popup avec spring animation
- **Personnages/Créatures** : glow hover animé avec la couleur de la force
- **Homepage hero** : particules lentes flottantes (couleurs des 6 forces)
- **Articles** : fade-in progressif des sections au scroll
- **Admin** : transitions de sidebar et modals
- **Dark mode** : transition couleur fluide (300ms)

---

## 11. PLAN DE DÉPLOIEMENT

### Développement local
```bash
# Root
npm install
npm run dev          # Lance web (port 3000) + api (port 4000)
```

### Variables d'environnement
```env
# API
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLOUDINARY_URL=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
```

### Pipeline CI/CD (GitHub Actions)
1. Push sur `main` → lint + type-check + tests
2. Si OK → deploy frontend sur Vercel automatiquement
3. Si OK → deploy API sur Railway automatiquement
4. Migrations Prisma appliquées automatiquement avant déploiement API

### Environnements
- `development` : local
- `staging` : branch `develop` → déploiement automatique pour review
- `production` : branch `main` → déploiement après validation

---

## 12. ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

### Phase 1 — Fondations (2-3 semaines)
1. Setup monorepo, config TypeScript/ESLint/Prettier
2. Schéma Prisma + migrations
3. API Express de base (auth + CRUD personnages + articles)
4. Next.js : layout, design system de base, homepage statique

### Phase 2 — Pages publiques principales (3-4 semaines)
5. Carte interactive (Leaflet + données géo de base)
6. Pages Personnages + Profil
7. Pages Bestiaire + Fiche
8. Articles de Lore (rendu Markdown)

### Phase 3 — Admin & Contenu (2-3 semaines)
9. Interface admin : dashboard, éditeur articles, gestionnaire personnages
10. Upload médias (Cloudinary)
11. Gestionnaire de carte admin

### Phase 4 — Communauté & Finition (2 semaines)
12. Système de votes, notes, commentaires
13. Intégration Stripe (donations)
14. Animations et polish UI
15. Optimisations SEO (sitemap, métadonnées dynamiques)
16. Tests et déploiement production

---

## 13. CONSIDÉRATIONS SEO & PERFORMANCE

- **SSG** pour les articles, personnages, créatures (statique, rapide, indexable)
- **ISR** (Incremental Static Regeneration) pour le contenu mis à jour fréquemment
- **Métadonnées dynamiques** : Open Graph + Twitter Card générés depuis la BDD
- **Sitemap XML** auto-généré via next-sitemap
- **Images optimisées** via next/image + Cloudinary
- **Fonts** : Google Fonts — Cinzel (titres fantasy) + Crimson Text (corps de texte) + Inter (UI)

---

*Ce document est la référence de base du projet. Il sera mis à jour au fur et à mesure des développements.*
