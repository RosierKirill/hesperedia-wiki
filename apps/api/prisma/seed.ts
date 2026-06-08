import { PrismaClient, MagicForce, UserRole, FactionType, LocationType, CharacterStatus, CreatureCategory, CreatureOrigin, ArticleCategory, ProjectType, ProjectStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Hesperedia database...')

  // ─── ADMIN USER ───────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('HespeAdmin2024!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hesperedia.wiki' },
    update: {},
    create: {
      email: 'admin@hesperedia.wiki',
      username: 'HespeAdmin',
      passwordHash: adminHash,
      role: UserRole.ADMIN,
    },
  })
  console.log('✓ Admin user created')

  // ─── REALMS ───────────────────────────────────────────────────────────────
  const realmHesperedia = await prisma.realm.upsert({
    where: { slug: 'hesperedia' },
    update: {},
    create: {
      name: 'Hesperedia',
      slug: 'hesperedia',
      description: 'Le continent principal — façonné par des siècles de conflits magiques entre les Six Forces. Berceau de royaumes divers, de ruines anciennes et de la lutte contre la Contamination Sanguis.',
      color: '#D4A017',
      order: 1,
    },
  })

  const realmUnderworld = await prisma.realm.upsert({
    where: { slug: 'underworld' },
    update: {},
    create: {
      name: 'Le Monde Inférieur',
      slug: 'underworld',
      description: "Le royaume infernal sous Hesperedia — source des démons liés et des esprits enchaînés. Un lieu d'ombre éternelle où errent les âmes déchues et les entités du Beyond.",
      color: '#8B0000',
      order: 2,
    },
  })

  const realmOrla = await prisma.realm.upsert({
    where: { slug: 'orla' },
    update: {},
    create: {
      name: "L'Orla",
      slug: 'orla',
      description: "Le vide cosmique entre les mondes — un espace d'Aether pur et de chaos primordial où les frontières de la réalité se brouillent. Les Titans d'autrefois y auraient ouvert des passages.",
      color: '#4C1D95',
      order: 3,
    },
  })

  const realmCrimson = await prisma.realm.upsert({
    where: { slug: 'crimson' },
    update: {},
    create: {
      name: 'The Crimson',
      slug: 'crimson',
      description: "Les terres carmines touchées par le Dévoreur des Mondes — un royaume de corruption Sanguis où le sol lui-même saigne et où les lois naturelles se tordent.",
      color: '#C41E3A',
      order: 4,
    },
  })
  console.log('✓ 4 Realms created')

  // ─── REGIONS ──────────────────────────────────────────────────────────────
  const regionAlbarenon = await prisma.region.upsert({
    where: { slug: 'albarenon' },
    update: { name: 'Albarenon', dominantForce: MagicForce.NIHIL },
    create: {
      name: 'Albarenon',
      slug: 'albarenon',
      realmId: realmHesperedia.id,
      description: "L'archipel occidental — anciennement Hwitland, rebaptisé Albarenon depuis l'unification sous la reine Laurena. Des îles brumeuses au caractère insulaire fort, héritières de siècles de cohabitation avec les Dragons. Société pragmatique qui a été la première à abolir l'esclavage.",
      biome: 'Archipel atlantique',
      dominantForce: MagicForce.NIHIL,
      mapCoords: { x: 150, y: 80, polygon: [[100, 40], [200, 40], [220, 120], [130, 130], [90, 100]] },
    },
  })

  const regionAnthoresia = await prisma.region.upsert({
    where: { slug: 'anthoresia' },
    update: {},
    create: {
      name: 'Anthoresia',
      slug: 'anthoresia',
      realmId: realmHesperedia.id,
      description: "Le cœur fertile d'Hesperedia, béni par les forces Lumen et Humus. D'anciennes cités s'élèvent parmi les plaines dorées — centre culturel du continent sous le roi Lucius. Selon la légende, la lignée royale descend des Titans des plaines.",
      biome: 'Plaines tempérées',
      dominantForce: MagicForce.LUMEN,
      mapCoords: { x: 380, y: 280, polygon: [[300, 200], [500, 200], [520, 380], [290, 370]] },
    },
  })

  const regionCalanemora = await prisma.region.upsert({
    where: { slug: 'calanemora' },
    update: { name: 'Calanemora', description: "La Sérénissime — cité-État marchande construite sur un archipel de cent îles dans la Mer Auréenne. Sa devise : Per Ventum et Veritatem. Gouvernée par le Doge Serafino Caldanza et la Chambre des Sceaux.", dominantForce: MagicForce.AETHER },
    create: {
      name: 'Calanemora',
      slug: 'calanemora',
      realmId: realmHesperedia.id,
      description: "La Sérénissime — cité-État marchande construite sur un archipel de cent îles dans la Mer Auréenne. Sa devise : Per Ventum et Veritatem. Gouvernée par le Doge Serafino Caldanza et la Chambre des Sceaux.",
      biome: 'Côte méditerranéenne',
      dominantForce: MagicForce.AETHER,
      mapCoords: { x: 350, y: 520, polygon: [[280, 470], [450, 460], [460, 590], [270, 600]] },
    },
  })

  const regionSiderolon = await prisma.region.upsert({
    where: { slug: 'siderolon' },
    update: {},
    create: {
      name: 'Siderolon',
      slug: 'siderolon',
      realmId: realmHesperedia.id,
      description: "L'empire en construction de Wilfred von Hellström — né de l'unification forcée des régions nord-est. Sa magie est une triade tendue : Lumen, Aether, Humus poussés à leurs extrêmes, avec une infiltration croissante et non-reconnue de Nihil. Régions : Kaldbjarg, Eisenthal, Wisswald.",
      biome: 'Hauts plateaux nordiques et forêts primaires',
      dominantForce: MagicForce.LUMEN,
      mapCoords: { x: 560, y: 150, polygon: [[490, 80], [650, 90], [660, 250], [480, 240]] },
    },
  })

  const regionDargyreon = await prisma.region.upsert({
    where: { slug: 'dargyreon' },
    update: { name: 'Dargyreon', description: "Les terres brisées — autrefois un grand empire, aujourd'hui fragmenté par la Contamination Sanguis. Des hordes errantes patrouillent les ruines d'une civilisation perdue. La corruption progresse vers l'ouest, pressant les frontières de Siderolon et de l'alliance occidentale.", dominantForce: MagicForce.SANGUIS },
    create: {
      name: 'Dargyreon',
      slug: 'dargyreon',
      realmId: realmHesperedia.id,
      description: "Les terres brisées — autrefois un grand empire, aujourd'hui fragmenté par la Contamination Sanguis. Des hordes errantes patrouillent les ruines d'une civilisation perdue. La corruption progresse vers l'ouest.",
      biome: 'Steppe dévastée',
      dominantForce: MagicForce.SANGUIS,
      mapCoords: { x: 560, y: 350, polygon: [[500, 270], [660, 260], [670, 440], [510, 450]] },
    },
  })

  const regionSaintTrone = await prisma.region.upsert({
    where: { slug: 'saint-trone' },
    update: {},
    create: {
      name: 'Saint Trône',
      slug: 'saint-trone',
      realmId: realmHesperedia.id,
      description: "Le plateau sacré au centre géographique d'Hesperedia, où l'Église du Zénith a bâti la Cité Blanche. Un chef-d'œuvre d'architecture Lumen dont les cathédrales sont calculées selon des principes magiques précis. Gouverné conjointement par le Prince Leo-Angelo Aurel et le Cardinal Suprême Hadrian IX.",
      biome: 'Plateau sacré',
      dominantForce: MagicForce.LUMEN,
      mapCoords: { x: 400, y: 350, polygon: [[360, 310], [450, 305], [460, 400], [350, 405]] },
    },
  })
  console.log('✓ 6 Regions created')

  // ─── FACTIONS ─────────────────────────────────────────────────────────────
  const factionAlbarenon = await prisma.faction.upsert({
    where: { slug: 'royaume-albarenon' },
    update: {},
    create: {
      name: "Royaume d'Albarenon",
      slug: 'royaume-albarenon',
      type: FactionType.KINGDOM,
      description: "L'archipel occidental sous la reine Laurena — premier royaume d'Hesperedia à avoir aboli l'esclavage. Société pragmatique héritière des Dragons Vesper et des rites Nihil insulaires. Les Grandes Bibliothèques de Laurena attirent des érudits de tout le continent.",
      dominantForce: MagicForce.NIHIL,
      alignment: 'Neutral Good',
    },
  })

  const factionAnthoresia = await prisma.faction.upsert({
    where: { slug: 'empire-anthoresia' },
    update: {},
    create: {
      name: "Empire d'Anthoresia",
      slug: 'empire-anthoresia',
      type: FactionType.EMPIRE,
      description: "La puissance culturelle dominante du continent, gouvernée par le roi Lucius — héritier d'une lignée qui se dit descendante des Titans. Anthoresia est devenu le centre artistique et intellectuel d'Hesperedia. Lucius refuse la guerre et cherche une troisième voie dans les ruines de Thalassyris.",
      dominantForce: MagicForce.LUMEN,
      alignment: 'Neutral Good',
    },
  })

  const factionCalanemora = await prisma.faction.upsert({
    where: { slug: 'serenissima-calanemora' },
    update: {},
    create: {
      name: 'Sérénissime de Calanemora',
      slug: 'serenissima-calanemora',
      type: FactionType.CITY_STATE,
      description: "La grande république marchande gouvernée par un Doge — actuellement Serafino Caldanza — et la Chambre des Sceaux (douze grandes familles). Maîtresse des routes maritimes par sa technologie Aether. Officiellement neutre, divisée en secret : les Vespari ont trahi l'alliance au profit de Siderolon.",
      dominantForce: MagicForce.AETHER,
      alignment: 'True Neutral',
    },
  })

  const factionSiderolon = await prisma.faction.upsert({
    where: { slug: 'empire-siderolon' },
    update: {},
    create: {
      name: 'Empire de Siderolon',
      slug: 'empire-siderolon',
      type: FactionType.EMPIRE,
      description: "L'empire en expansion de Wilfred von Hellström — philosophe devenu autocrate par nécessité historique. Unifié par la constitution que Hellström a lui-même rédigée, contrôlé par les Commissaires de l'Unité. Son plan : unifier Hesperedia pour faire face à Sanguis. Son problème : le Nihil qui entre par les interstices.",
      dominantForce: MagicForce.LUMEN,
      alignment: 'Lawful Neutral',
    },
  })

  const factionChurch = await prisma.faction.upsert({
    where: { slug: 'eglise-zenith' },
    update: {},
    create: {
      name: 'Église du Zénith',
      slug: 'eglise-zenith',
      type: FactionType.CHURCH,
      description: "L'institution religieuse la plus puissante d'Hesperedia, basée à Saint Trône. Elle ne se définit pas comme une religion parmi d'autres mais comme la codification de la vérité magique fondamentale. Trois piliers : le Zénith, la Hiérarchie Sacrée, et la Lumière contre l'Ombre. Le Cardinal Suprême Hadrian IX en approche la fin de règne.",
      dominantForce: MagicForce.LUMEN,
      alignment: 'Lawful Good',
    },
  })

  const factionPaladins = await prisma.faction.upsert({
    where: { slug: 'ordre-paladins-rouges' },
    update: {},
    create: {
      name: 'Ordre des Paladins Rouges',
      slug: 'ordre-paladins-rouges',
      type: FactionType.ORDER,
      description: "L'anomalie de Saint Trône — dans une cité de blanc et de lumière, leur couleur est celle du sang et du feu. Doctrine : Lumen se maintient aussi par la destruction de ce qui le corrompt. Magiquement, ils combinent Lumen et Aether (l'ordre en mouvement). Dirigés par Sorel Vayne, qui a des projets pour Dargyreon que personne n'a officiellement approuvés.",
      dominantForce: MagicForce.LUMEN,
      alignment: 'Lawful Neutral',
    },
  })

  const factionCult = await prisma.faction.upsert({
    where: { slug: 'culte-devoreur' },
    update: {},
    create: {
      name: 'Culte du Dévoreur',
      slug: 'culte-devoreur',
      type: FactionType.CULT,
      description: "Les fanatiques qui vénèrent le Dévoreur des Mondes — une entité ancienne qui se nourrit de la réalité elle-même. Ce sont eux qui ont déclenché la Grande Tempête de Sang qui a détruit Dargyreon. Ils répandent la Contamination Sanguis délibérément, convaincus que la consommation totale est inévitable.",
      dominantForce: MagicForce.SANGUIS,
      alignment: 'Chaotic Evil',
    },
  })

  const factionTemoins = await prisma.faction.upsert({
    where: { slug: 'temoins-crepuscule-dieux' },
    update: {},
    create: {
      name: 'Témoins du Crépuscule des Dieux',
      slug: 'temoins-crepuscule-dieux',
      type: FactionType.SECRET_SOCIETY,
      description: "Un culte Nihil insulaire de l'archipel d'Albarenon, pratiquant des rites anciens liés aux Dragons disparus et aux puissances du vide. Ce sont eux qui ont retrouvé le corps de William O'Dubh sur un champ de bataille et l'ont réanimé par le rituel de la Danse de la Vie.",
      dominantForce: MagicForce.NIHIL,
      alignment: 'Neutral',
    },
  })
  console.log('✓ 8 Factions created')

  // ─── LOCATIONS ────────────────────────────────────────────────────────────
  const locationWitfog = await prisma.location.upsert({
    where: { slug: 'witfog' },
    update: {},
    create: {
      name: 'Witfog',
      slug: 'witfog',
      type: LocationType.CITY,
      realmId: realmHesperedia.id,
      regionId: regionAlbarenon.id,
      description: "Capitale d'Albarenon — taillée dans les falaises d'une île principale. Les bibliothèques royales de Laurena y occupent un niveau intermédiaire entre les quais marchands et les résidences nobles. Les ancres de cristaux Nihil dans ses fondations rappellent les rites des Témoins du Crépuscule.",
      mapCoords: { x: 155, y: 95 },
      isCapital: true,
    },
  })

  const locationAlbrenfort = await prisma.location.upsert({
    where: { slug: 'albrenfort' },
    update: {},
    create: {
      name: 'Albrenfort',
      slug: 'albrenfort',
      type: LocationType.CITY,
      realmId: realmHesperedia.id,
      regionId: regionAnthoresia.id,
      description: "Capitale de l'Empire d'Anthoresia — une cité de larges boulevards, de temples solaires et d'académies. Population : ~400 000 âmes. Le roi Lucius y règne depuis le Trône Lumen, quand il ne dirige pas lui-même ses expéditions vers les ruines de Thalassyris.",
      mapCoords: { x: 380, y: 285 },
      isCapital: true,
    },
  })

  const locationSaintTroneCity = await prisma.location.upsert({
    where: { slug: 'saint-trone-city' },
    update: {},
    create: {
      name: 'Saint Trône',
      slug: 'saint-trone-city',
      type: LocationType.SACRED_SITE,
      realmId: realmHesperedia.id,
      regionId: regionSaintTrone.id,
      description: "La Cité Blanche — chef-d'œuvre d'architecture Lumen dont les cathédrales blanches sont calculées selon des principes magiques précis. Sept cathédrales majeures, dont la Cathédrale du Premier Ordre (siège d'Hadrian IX) et la Cathédrale du Feu Blanc (sanctuaire des Paladins Rouges).",
      mapCoords: { x: 405, y: 355 },
      isCapital: true,
    },
  })

  const locationCalanemoraCity = await prisma.location.upsert({
    where: { slug: 'calanemora-city' },
    update: {},
    create: {
      name: 'Calanemora',
      slug: 'calanemora-city',
      type: LocationType.CITY,
      realmId: realmHesperedia.id,
      regionId: regionCalanemora.id,
      description: "La Sérénissime — construite sur cent îles reliées par ponts et aqueducs. Les navires Aether remplissent ses ports. Le palais du Doge domine la Grande Baie. Sous la surface policée des marchands : les tensions entre les grandes familles, la trahison Vespari, et les réfugiés de Dargyreon qui arrivent en nombre croissant.",
      mapCoords: { x: 355, y: 535 },
      isCapital: true,
    },
  })

  const locationEisenthal = await prisma.location.upsert({
    where: { slug: 'eisenthal' },
    update: {},
    create: {
      name: 'Eisenthal',
      slug: 'eisenthal',
      type: LocationType.CITY,
      realmId: realmHesperedia.id,
      regionId: regionSiderolon.id,
      description: "Le cerveau de Siderolon — haute vallée de montagne, siège de l'académie où Hellström enseignait autrefois. Aujourd'hui centre de recherche sur la magie appliquée, y compris des programmes classifiés sur les applications militaires du Nihil. Deux chercheurs ont disparu après avoir demandé à en être retirés.",
      mapCoords: { x: 565, y: 165 },
      isCapital: true,
    },
  })

  const locationRuinesThalassyris = await prisma.location.upsert({
    where: { slug: 'ruines-thalassyris' },
    update: {},
    create: {
      name: 'Ruines de Thalassyris',
      slug: 'ruines-thalassyris',
      type: LocationType.RUIN,
      realmId: realmHesperedia.id,
      regionId: regionAnthoresia.id,
      description: "Les ruines intactes de la civilisation-mère — à l'embouchure d'un fleuve aujourd'hui disparu. Thalassyris fut la première à codifier le langage magique. Elle n'a pas été conquise ; elle a été *abandonnée*. Personne ne l'a pillée pendant des siècles — parce que personne n'osait approcher. Lucius y cherche les grimoires fondateurs. Aurel y cherche les textes théologiques originaux.",
      mapCoords: { x: 320, y: 310 },
      isCapital: false,
    },
  })

  const locationValdrevorn = await prisma.location.upsert({
    where: { slug: 'valdrevorn' },
    update: {},
    create: {
      name: 'Valdrevorn',
      slug: 'valdrevorn',
      type: LocationType.RUIN,
      realmId: realmHesperedia.id,
      regionId: regionDargyreon.id,
      description: "Les ruines de l'ancienne capitale de Dargyreon — détruite lors de la Grande Tempête de Sang (an 243 AZ) quand le Culte du Dévoreur déchaîna un rituel Sanguis cataclysmique. Aujourd'hui hantée par des Revenants, des Marcheurs de Peau et des horreurs pires. C'est ici que William O'Dubh est mort — ou a cessé de vivre.",
      mapCoords: { x: 610, y: 360 },
      isCapital: false,
    },
  })

  const locationWisswald = await prisma.location.upsert({
    where: { slug: 'wisswald' },
    update: {},
    create: {
      name: 'Wisswald',
      slug: 'wisswald',
      type: LocationType.LANDMARK,
      realmId: realmHesperedia.id,
      regionId: regionSiderolon.id,
      description: "L'immense forêt primaire de Siderolon — si ancienne et dense que la lumière y est perpétuellement verte et dorée. Son Vesper ambiant altère la perception. À mesure que Sanguis progresse depuis Dargyreon, la forêt développe une réponse de Nihil défensif qui ne distingue pas toujours la corruption de l'humain ordinaire.",
      mapCoords: { x: 620, y: 200 },
      isCapital: false,
    },
  })
  console.log('✓ 8 Locations created')

  // ─── CHARACTERS ───────────────────────────────────────────────────────────

  // 1. William O'Dubh
  const william = await prisma.character.upsert({
    where: { slug: 'william-odubh' },
    update: {},
    create: {
      name: "William O'Dubh",
      slug: 'william-odubh',
      titles: ['Le Chevalier Revenant', 'La Lance Noire'],
      species: 'Humain / Revenant',
      gender: 'Masculin',
      age: 'Inconnu (corps : apparent 30 ans)',
      status: CharacterStatus.UNDEAD,
      primaryForce: MagicForce.NIHIL,
      magicLevel: 8,
      isMainCharacter: true,
      homeLocationId: locationWitfog.id,
      biography: `William O'Dubh est un Chevalier Revenant — son corps récupéré sur un champ de bataille dans le nord d'Albarenon, puis réanimé par le rituel de la Danse de la Vie pratiqué par Helga, une jeune sorcière des Témoins du Crépuscule des Dieux.

Ce rite Nihil a éveillé la volonté profonde de l'âme du chevalier. Désormais conscient mais perdu, William n'a aucun souvenir de sa vie passée. Un seul souvenir subsiste, gravé dans ce qui reste de sa mémoire : Helga — celle par qui il vit à nouveau.

Son unique objectif : retrouver Helga et comprendre ce qu'il est devenu.`,
      personality: `Désorienté mais déterminé. William O'Dubh porte le poids d'une existence entre deux mondes sans en connaître l'histoire. Il n'a pas deux siècles d'expérience à brandir — il a la volonté brute de celui qui refuse de se laisser effacer une seconde fois.

Silencieux face à ce qu'il ne comprend pas. Direct face à ce qu'il voit. Sa nature de Revenant lui confère un calme étrange que les vivants trouvent désettabilisant — la mort ne l'effraie pas, parce qu'il en vient.`,
      abilities: `**Résonance Nihil :** Affinité naturelle avec la force du vide, sans maîtrise consciente — elle s'exprime dans les moments critiques, suppressant la magie environnante ou renforçant sa résistance.

**Résistance de Revenant :** Guérison lente de blessures mortelles pour un vivant. Immunité aux maladies, aux poisons et à la plupart des effets mentaux. Lumen reste une faiblesse sévère.

**Perception des Morts :** Sensing passif des échos d'événements liés à la mort dans les environnements chargés de Nihil.`,
      history: `Trouvé mort sur un champ de bataille non identifié dans le nord d'Albarenon. Corps récupéré par les Témoins du Crépuscule des Dieux. Réanimé par Helga via la Danse de la Vie. Conscience éveillée, mémoire absente. Objectif : retrouver Helga.`,
      publishedAt: new Date(),
    },
  })

  // 2. Lucius d'Anthoresia
  const lucius = await prisma.character.upsert({
    where: { slug: 'lucius-anthoresia' },
    update: {},
    create: {
      name: "Lucius d'Anthoresia",
      slug: 'lucius-anthoresia',
      titles: ['Le Roi de Paix', 'Héritier des Titans'],
      species: 'Humain (lignée Titan)',
      gender: 'Masculin',
      age: 'La quarantaine',
      status: CharacterStatus.ALIVE,
      primaryForce: MagicForce.LUMEN,
      magicLevel: 9,
      isMainCharacter: false,
      homeLocationId: locationAlbrenfort.id,
      biography: `Lucius d'Anthoresia est l'héritier d'une longue lignée qui se dit descendante du Titan Valduren le Lumineux. Physiquement, il correspond à la légende — grand, une présence qui remplit une pièce, une voix dont les gens se souviennent. Ce qu'il a choisi d'en faire est inattendu pour un roi de sa puissance.

Il ne fait pas la guerre. Il *pourrait* — Anthoresia est la puissance militaire la plus importante de l'alliance sur le papier. Mais Lucius considère que son rôle est de faire *durer* ce que la guerre construirait, pas de conquérir.

Son projet personnel depuis dix ans : l'Expédition de Thalassyris. Il a financé plusieurs missions vers les ruines de la cité-mère, dirigé lui-même la troisième. Ce qu'ils ont trouvé et non publié est gardé dans une chambre scellée du palais. Lucius n'en parle pas.`,
      personality: `Charismatique et pacifique. Il gouverne par présence et par charme là où Laurena gouverne par structure et calcul. Sa cour est brillante, parfois décadente, toujours vivante. Il encourage toutes les traditions magiques légitimes, avec une seule ligne rouge : Sanguis et Nihil sont interdits.

Sa frustration secrète : il voit que le monde se prépare à une guerre qu'il ne peut pas empêcher, et qu'il cherche encore dans les ruines de Thalassyris une troisième voie que peut-être personne n'a jamais trouvée.`,
      abilities: `**Présence Titanesque :** Aura Lumen naturelle qui peut devenir écrasante à volonté — une présence physique et magique inexplicable par la biologie seule.

**Maîtrise Lumen avancée :** Guérison, détection, boucliers de lumière. Au niveau maximum : une manifestation de lumière solaire directe capable de purifier la corruption légère.

**Vision historique :** Capacité à percevoir les résonances magiques des lieux anciens — utile dans les ruines de Thalassyris, troublant dans les zones Sanguis.`,
      history: `Couronné jeune après la mort de son père. A immédiatement orienté Anthoresia vers la culture plutôt que la conquête. Fondateur de l'alliance informelle avec Albarenon — relation complexe et respectueuse avec Laurena. A rencontré Aurel de Saint Trône lors de la grande conférence d'alliance ; les deux hommes se respectent et se méfient en conséquence.`,
      publishedAt: new Date(),
    },
  })

  // 3. Laurena d'Albarenon
  const laurena = await prisma.character.upsert({
    where: { slug: 'laurena-albarenon' },
    update: {},
    create: {
      name: "Laurena d'Albarenon",
      slug: 'laurena-albarenon',
      titles: ['La Reine Sévère', 'Première Archiviste'],
      species: 'Humaine',
      gender: 'Féminin',
      age: 'La quarantaine',
      status: CharacterStatus.ALIVE,
      primaryForce: MagicForce.LUMEN,
      secondaryForce: MagicForce.NIHIL,
      magicLevel: 6,
      isMainCharacter: false,
      homeLocationId: locationWitfog.id,
      biography: `Laurena est montée sur le trône dans des circonstances difficiles — son père est mort sans héritier mâle dans une culture qui n'en avait pas l'habitude. Elle a dû s'imposer contre un conseil de lords qui la sous-estimait. Elle ne leur a pas pardonné cet affront initial — mais elle a choisi de les intégrer plutôt que de les écraser.

L'abolition de l'esclavage n'était pas seulement un geste moral — c'était un calcul politique. Une population libre produit davantage, combat mieux, est plus loyale. Elle a dédommagé les propriétaires pour éviter une rébellion des lords, et intégré les affranchis dans un système de travail salarié encadré par des guildes sous contrôle royal.

Les Grandes Bibliothèques sont son œuvre la plus visible — trois établissements majeurs ouverts aux marchands, artisans et étrangers, attirant des érudits de tout le continent.`,
      personality: `Froide en public, précise dans ses jugements, rarement affectueuse. Elle inspire le respect plus que l'amour. Elle dort peu. Elle lit tout. Elle se méfie des mages mais les utilise. Son rapport avec Lucius : ils s'admirent mutuellement à distance, mais leurs visions du pouvoir sont presque opposées. Quand ils se rencontrent, l'atmosphère est courtoise et légèrement électrique.`,
      abilities: `**Calcul politique :** Pas une force magique — une intelligence institutionnelle sans équivalent. Elle a restructuré un royaume en quelques années sans guerre civile.

**Magie Lumen disciplinée :** Usage défensif et de détection. Elle se méfie des manifestations spectaculaires et préfère les applications discrètes.

**Résilience Nihil passive :** Héritage insulaire — une résistance naturelle aux illusions Vesper et aux manipulations mentales.`,
      history: `Montée sur le trône après la mort de son père. A surmonté l'opposition du conseil des lords par la diplomatie et le calcul. A aboli l'esclavage, fondé les Grandes Bibliothèques, formalisé le Conseil des Lords. Prépare Albarenon à un conflit probable — pendant que Lucius cherche une troisième voie, Laurena a déjà sa réponse.`,
      publishedAt: new Date(),
    },
  })

  // 4. Wilfred von Hellström
  const hellstrom = await prisma.character.upsert({
    where: { slug: 'wilfred-hellstrom' },
    update: {},
    create: {
      name: 'Wilfred von Hellström',
      slug: 'wilfred-hellstrom',
      titles: ["Archonte de Siderolon", "L'Architecte"],
      species: 'Humain',
      gender: 'Masculin',
      age: '49 ans',
      status: CharacterStatus.ALIVE,
      primaryForce: MagicForce.LUMEN,
      secondaryForce: MagicForce.AETHER,
      magicLevel: 5,
      isMainCharacter: false,
      homeLocationId: locationEisenthal.id,
      biography: `Wilfred von Hellström n'a pas l'air de ce qu'il est devenu. Taille moyenne, légèrement voûté, des lunettes de lecture qu'il garde même lors des conseils militaires. Avant l'unification, il était historien et philosophe politique — auteur de trois traités sur la théorie de l'État, professeur à l'académie d'Eisenthal.

Ce passé n'a pas disparu. Il l'utilise.

L'unification de Siderolon n'est pas née d'une guerre de conquête classique. Elle est née d'une crise — une série de conflits entre régions menaçant de fragmenter définitivement le nord. Hellström a émergé comme médiateur, puis comme architecte d'un accord d'union. Il a écrit lui-même la constitution de l'empire unifié — un document brillant qui concentrait le pouvoir militaire et diplomatique dans une main centrale. La sienne.`,
      personality: `Il ne parle pas comme un général. Il parle comme quelqu'un qui a lu tous les généraux et en a tiré les leçons. Ses discours sont construits, référencés, habités d'une logique qui donne l'impression que ce qu'il fait est inévitable.

Il entretient son culte de personnalité avec une précision chirurgicale — des apparitions publiques rares mais mémorables, une accessibilité calculée. Les gens qui le rencontrent ont l'impression d'être *vus* par lui. C'est une technique, pas un sentiment.

Sa contradiction profonde : il sait ce qu'est le Nihil, il en a écrit les dangers. Et pourtant il commence à l'utiliser.`,
      abilities: `**Rhétorique et persuasion :** Sa vraie force — l'art de rendre l'inévitable acceptable et le nécessaire vertueux.

**Analyse stratégique :** Un esprit qui traite un champ de bataille (ou une carte politique) comme un problème mathématique.

**Magie Lumen académique :** Usage intellectuel plutôt que guerrier — détection, analyse des flux magiques, compréhension des interactions de forces.

**Contrôle administratif :** Les Commissaires de l'Unité, couches de surveillance superposées, un cercle intérieur dont on ne connaît pas les noms complets.`,
      history: `Professeur à Eisenthal. Médiateur de la crise de fragmentation du nord. Auteur de la constitution de l'empire unifié. Archonte depuis dix ans. Expansionniste vers l'ouest par calcul, pas par idéologie. Pression croissante de Sanguis à l'est de Wisswald. Infiltration progressive de Nihil dans ses méthodes de gouvernement, dont il nie ou minimise la réalité.`,
      publishedAt: new Date(),
    },
  })

  // 5. Eugène Tour
  const eugeneTour = await prisma.character.upsert({
    where: { slug: 'eugene-tour' },
    update: {},
    create: {
      name: 'Eugène Tour',
      slug: 'eugene-tour',
      titles: ['Général en Chef', 'Le Marteau d\'Anthoresia'],
      species: 'Humain',
      gender: 'Masculin',
      age: 'La cinquantaine',
      status: CharacterStatus.ALIVE,
      primaryForce: MagicForce.HUMUS,
      magicLevel: 3,
      isMainCharacter: false,
      homeLocationId: locationAlbrenfort.id,
      biography: `Eugène Tour est né dans une famille de la petite noblesse militaire — pas de sang titan, pas de magie notable. Ce qu'il a, c'est une capacité physique hors norme (sa force est documentée ; on parle de lui soulevant ce que quatre hommes peinent à déplacer) et un esprit qui traite un champ de bataille comme un problème mathématique.

Sa relation avec Lucius est de loyauté absolue — mais une loyauté qui s'accompagne d'une frustration contenue. Tour voit Siderolon grandir à l'est, voit les migrations de Dargyreon déstabiliser les frontières, voit l'alliance perdre de l'initiative — et son roi organise des festivals. Il ne le dit pas ouvertement. Mais ses généraux savent lire ses silences.`,
      personality: `Là où Lucius est paix, Tour est guerre. Pragmatique, direct, impatient de la diplomatie qu'il respecte mais ne comprend pas instinctivement. Sa loyauté à Lucius est totale mais sa vision du monde est celle d'un soldat : les problèmes se résolvent, pas s'accommodent.

Si Lucius mourait demain, Anthoresia deviendrait une puissance militaire active sous Tour. Laurena le sait. Siderolon le sait. Lucius probablement aussi.`,
      abilities: `**Force physique extraordinaire :** Documentée, inexplicable biologiquement — peut-être un écho lointain de la lignée Titan de la noblesse anthorésienne, peut-être juste Tour.

**Stratégie militaire :** L'esprit le plus redouté du continent occidental dans ce domaine.

**Humus passif :** Une endurance et une résistance physiques qui frôlent le surnaturel — il ne se blesse pas facilement et récupère vite.`,
      history: `Monté par le mérite dans l'armée d'Anthoresia. Nommé Général en chef par Lucius il y a quinze ans. A repoussé plusieurs incursions des avant-gardes de Siderolon sur les marches nord. Frustré par la politique de non-guerre de Lucius mais trop loyal pour agir contre elle.`,
      publishedAt: new Date(),
    },
  })

  // 6. Serafino Caldanza
  const serafino = await prisma.character.upsert({
    where: { slug: 'serafino-caldanza' },
    update: {},
    create: {
      name: 'Serafino Caldanza',
      slug: 'serafino-caldanza',
      titles: ['Doge de Calanemora', 'Sérénissime'],
      species: 'Humain',
      gender: 'Masculin',
      age: 'La cinquantaine',
      status: CharacterStatus.ALIVE,
      primaryForce: MagicForce.AETHER,
      magicLevel: 4,
      isMainCharacter: false,
      homeLocationId: locationCalanemoraCity.id,
      biography: `Serafino Caldanza est le Doge actuel de Calanemora — ni trop puissant, ni trop faible, choisi par les grandes familles précisément parce que chacune pensait pouvoir le contrôler. Elles ont toutes partiellement raison.

Son règne est celui d'un équilibriste : maintenir la neutralité traditionnelle de Belvento tout en cultivant des relations personnelles avec Lucius et Laurena. Il se méfie des Vespari sans avoir les preuves pour agir. Il sait que la trahison se prépare mais pas encore assez clairement pour la nommer.`,
      personality: `Diplomate né. Son outil principal est la compréhension — il sait ce que veut chacun et trouve les arrangements qui donnent à chacun juste assez pour ne pas briser la table. Pas la vertu : l'intelligence pratique du médiateur. Sa famille a une tradition de service public ; son pouvoir est leur plus grande réussite et leur plus grand risque.`,
      abilities: `**Navigation politique :** Sa vraie magie — orienter des courants contradictoires sans se noyer.

**Aether marchand :** Intuition des flux commerciaux, communication à distance via les courants aériens, lecture des conditions météo et maritimes.`,
      history: `Issu de la famille Caldanza — puissance moyenne mais forte présence institutionnelle. Élu Doge après une série de compromis entre les grandes familles. Règne sur une Calanemora sous pression triple : trahison Vespari, réfugiés de Dargyreon, menace de Siderolon sur les routes terrestres.`,
      publishedAt: new Date(),
    },
  })

  // 7. Leo-Angelo Aurel
  const aurel = await prisma.character.upsert({
    where: { slug: 'leo-angelo-aurel' },
    update: {},
    create: {
      name: 'Leo-Angelo Aurel',
      slug: 'leo-angelo-aurel',
      titles: ['Prince Sacré de Saint Trône', 'Gardien du Zénith'],
      species: 'Humain',
      gender: 'Masculin',
      age: '38 ans',
      status: CharacterStatus.ALIVE,
      primaryForce: MagicForce.LUMEN,
      magicLevel: 8,
      isMainCharacter: false,
      homeLocationId: locationSaintTroneCity.id,
      biography: `Leo-Angelo Aurel a grandi dans la lumière littérale et figurée de Saint Trône — beau, éduqué, profondément croyant mais pas fanatique. Il comprend que la foi sans pragmatisme est une épée sans main pour la tenir.

Il continue le projet de construction de sa cathédrale centrale entamé par son grand-père — dont les dimensions, quand elle sera achevée, formeront un nœud Lumen d'une puissance sans précédent. Les travaux avancent depuis quarante ans. Il estime vingt ans supplémentaires.

Il est convaincu que les archives de Thalassyris contiennent des textes fondateurs de la théologie Lumen. Il veut ce que Lucius cherche dans les ruines — pour des raisons complètement différentes. Les deux hommes se respectent et se méfient en conséquence.`,
      personality: `Habité par trois obsessions : l'architecture sacrée, la corruption de Dargyreon, et les archives de Thalassyris. Sa force est d'être sincèrement ce qu'il représente — il ne joue pas le Prince Sacré, il l'est. Ce qui le rend à la fois crédible et parfois inflexible là où la situation demanderait de la nuance.`,
      abilities: `**Magie Lumen de haut niveau :** La famille Leo-Angelo produit des mages Lumen exceptionnels à chaque génération. Aurel n'est pas une exception — purification, boucliers, vérité révélée.

**Autorité temporelle :** Administration de Saint Trône comme État, diplomatie, commandement de la flotte en temps de guerre.

**Financement d'opérations discrètes :** Il finance sans approbation officielle des opérations militaires et d'espionnage dans les zones grises de Dargyreon.`,
      history: `Prince depuis la mort de son père il y a douze ans. A maintenu l'équilibre fragile avec Hadrian IX. Poursuit la construction de la Grande Cathédrale. Tension croissante avec Sorel Vayne sur l'autorité des Paladins Rouges.`,
      publishedAt: new Date(),
    },
  })

  // 8. Hadrian IX
  const hadrian = await prisma.character.upsert({
    where: { slug: 'hadrian-ix' },
    update: {},
    create: {
      name: 'Hadrian IX',
      slug: 'hadrian-ix',
      titles: ['Cardinal Suprême', 'Voix du Zénith'],
      species: 'Humain',
      gender: 'Masculin',
      age: '75 ans',
      status: CharacterStatus.ALIVE,
      primaryForce: MagicForce.LUMEN,
      magicLevel: 7,
      isMainCharacter: false,
      homeLocationId: locationSaintTroneCity.id,
      biography: `Un vieillard de soixante-quinze ans dont la santé décline mais dont l'esprit reste d'une clarté redoutable. Hadrian IX a passé cinquante ans dans la hiérarchie de l'Église — il en connaît chaque secret, chaque tension, chaque ambition cachée.

Sa grande réalisation : unifier doctrinalement l'Église après un schisme interne il y a trente ans. Il a trouvé une troisième voie entre la théocratie agressive et le retrait spirituel : **influence sans domination directe**. L'Église conseille, bénit, légitime — mais ne gouverne pas en son nom propre.

Sa grande inquiétude : sa succession. Le Collège des Cardinaux est divisé entre trois factions, et il sait que sa mort pourrait déclencher une crise interne au pire moment possible.`,
      personality: `Sage épuisé. Il a vu assez de cycles pour ne plus s'étonner de grand-chose, mais il n'a pas perdu pour autant la conviction que ce qu'il protège vaut d'être protégé. Sa patience est légendaire. Sa mémoire des erreurs passées aussi.`,
      abilities: `**Magie Lumen de vieillesse :** Puissante mais coûteuse — il l'utilise avec parcimonie.

**Mémoire institutionnelle :** Il connaît les secrets de chaque faction, chaque famille, chaque noble sur le continent. C'est sa vraie puissance.

**Excommunication :** Dans un monde où Lumen est une force magique réelle, excommunier un souverain a des conséquences pratiques — pas seulement symboliques.`,
      history: `Cinquante ans dans la hiérarchie de l'Église du Zénith. Deux papes avant lui. Un schisme unifié. Maintenant vieillissant, il surveille sa succession avec l'inquiétude de celui qui a bâti quelque chose d'important et ne sait pas en qui le confier.`,
      publishedAt: new Date(),
    },
  })

  // 9. Sorel Vayne
  const vayne = await prisma.character.upsert({
    where: { slug: 'sorel-vayne' },
    update: {},
    create: {
      name: 'Sorel Vayne',
      slug: 'sorel-vayne',
      titles: ['Grand Maître des Paladins Rouges', 'Le Bras de Feu'],
      species: 'Humain',
      gender: 'Masculin',
      age: '50 ans',
      status: CharacterStatus.ALIVE,
      primaryForce: MagicForce.LUMEN,
      secondaryForce: MagicForce.AETHER,
      magicLevel: 9,
      isMainCharacter: false,
      homeLocationId: locationSaintTroneCity.id,
      biography: `Sorel Vayne a perdu sa main droite dans une opération contre un culte Sanguis à la frontière de Dargyreon il y a quinze ans. Elle est remplacée par un gantelet de métal imprégné de Lumen. Il n'en parle pas comme d'une perte — il en parle comme d'un baptême.

Vayne est un homme de convictions absolues dans un monde de compromis. Il voit la montée de Sanguis comme une guerre existentielle et perd patience face à la lenteur diplomatique de l'alliance occidentale. Il a des projets pour Dargyreon que ni Aurel ni Hadrian n'ont officiellement approuvés.`,
      personality: `Absolu et impatient. Pour Vayne, il n'y a pas de gris — il y a ce qui protège Lumen et ce qui le menace. Cette clarté fait de lui un Grand Maître exceptionnel et un partenaire difficile pour quiconque essaie de naviguer dans les nuances politiques.`,
      abilities: `**Lumen + Aether de combat :** Synthèse unique — l'ordre en mouvement, la purification par la force active. Résistance exceptionnelle aux effets Sanguis et Nihil.

**Gantelet Lumen :** La main perdue remplacée par un instrument de guerre et de purification — concentre et amplifie sa magie.

**Commandement des Paladins Rouges :** Trois cercles : les Lames (combat), les Veilleurs (enquête), les Ardents (théologiens-guerriers).`,
      history: `Entré jeune dans l'Ordre des Paladins Rouges. Monté rapidement par mérite de combat. Perdu une main à Dargyreon. Devenu Grand Maître il y a huit ans. Tension croissante avec Aurel sur l'autorité de l'Ordre. Projets non approuvés en cours.`,
      publishedAt: new Date(),
    },
  })

  console.log('✓ 9 Characters created')

  // ─── CHARACTER RELATIONS ──────────────────────────────────────────────────
  await prisma.charactersOnFactions.createMany({
    skipDuplicates: true,
    data: [
      { characterId: william.id, factionId: factionTemoins.id },
      { characterId: lucius.id, factionId: factionAnthoresia.id },
      { characterId: laurena.id, factionId: factionAlbarenon.id },
      { characterId: hellstrom.id, factionId: factionSiderolon.id },
      { characterId: eugeneTour.id, factionId: factionAnthoresia.id },
      { characterId: serafino.id, factionId: factionCalanemora.id },
      { characterId: aurel.id, factionId: factionChurch.id },
      { characterId: hadrian.id, factionId: factionChurch.id },
      { characterId: vayne.id, factionId: factionPaladins.id },
    ],
  })

  await prisma.charactersOnLocations.createMany({
    skipDuplicates: true,
    data: [
      { characterId: william.id, locationId: locationWitfog.id },
      { characterId: lucius.id, locationId: locationAlbrenfort.id },
      { characterId: lucius.id, locationId: locationRuinesThalassyris.id },
      { characterId: laurena.id, locationId: locationWitfog.id },
      { characterId: hellstrom.id, locationId: locationEisenthal.id },
      { characterId: eugeneTour.id, locationId: locationAlbrenfort.id },
      { characterId: serafino.id, locationId: locationCalanemoraCity.id },
      { characterId: aurel.id, locationId: locationSaintTroneCity.id },
      { characterId: hadrian.id, locationId: locationSaintTroneCity.id },
      { characterId: vayne.id, locationId: locationSaintTroneCity.id },
    ],
  })
  console.log('✓ Character relations created')

  // ─── CREATURES ────────────────────────────────────────────────────────────
  const creatureMarcheurPeau = await prisma.creature.upsert({
    where: { slug: 'marcheurs-de-peau' },
    update: {},
    create: {
      name: 'Marcheurs de Peau',
      slug: 'marcheurs-de-peau',
      category: CreatureCategory.SANGUIS_CORRUPTION,
      subcategory: 'Métamorphe',
      origin: CreatureOrigin.SANGUIS,
      primaryForce: MagicForce.SANGUIS,
      dangerLevel: 7,
      description: "Humains consumés par la Contamination Sanguis qui peuvent voler et porter la peau d'autrui. Ils infiltrent les communautés, portant des visages volés pendant que la corruption se propage de l'intérieur. Leur forme vraie — une masse de chair rouge en mouvement — n'est révélée que lorsque la peau volée se détériore après 3 jours.\n\nSix variantes documentées : Sangliers (brute, choc frontal), Taureaux (blindage naturel), Loups-Liés (meute), Ours-Forteresses (siège), Lézards-Rampants (infiltration), Lions de Sang (commandants).",
      abilities: "Vol de peau (contact physique requis), génération de miasme Sanguis, régénération rapide, détection du sang vivant dans un rayon de 30m.",
      weaknesses: "La force Nihil perturbe leur transformation. Le sel et l'eau bénie Lumen causent des douleurs extrêmes. Impossible de maintenir une forme volée plus de 3 jours.",
      habitat: "Environnements urbains, villes proches des régions corrompues par Sanguis. Particulièrement répandus à Dargyreon et dans les zones frontières de Siderolon.",
      publishedAt: new Date(),
    },
  })

  const creatureGorrak = await prisma.creature.upsert({
    where: { slug: 'gorraks' },
    update: {},
    create: {
      name: 'Gorraks (et Vulgars / Tronches)',
      slug: 'gorraks',
      category: CreatureCategory.MONSTER,
      subcategory: 'Mégafaune',
      origin: CreatureOrigin.NATURAL,
      primaryForce: MagicForce.HUMUS,
      dangerLevel: 5,
      description: "Prédateurs quadrupèdes massifs ressemblant à un croisement entre un ours et une créature des grands fonds, présents dans les forêts d'Anthoresia et de Siderolon. Leur peau absorbe l'énergie Humus de la terre, les rendant partiellement magiques. Les Gorraks ne sont pas malveillants — ils attaquent parce qu'ils doivent, pas parce qu'ils choisissent.\n\n**Vulgars :** variante plus petite, plus rapide, sociale — ils chassent en bandes de 4 à 8.\n**Tronches :** variante alpha, plus grande, solitaire. Certains vieux spécimens ont développé une intelligence basique et des rituels territoriaux.",
      abilities: "Sens de la terre (détection de vibrations jusqu'à 500m), peau armurée résistant aux armes tranchantes, rugissement Humus-chargé perturbant les sorts.",
      weaknesses: "Force Aether, hauteur (ils grimpent mal), sons aigus d'une certaine fréquence qui les désorientent.",
      habitat: "Forêts profondes, contreforts de montagne. Communs dans le nord d'Anthoresia et la lisière de Wisswald.",
      publishedAt: new Date(),
    },
  })

  const creatureRevenant = await prisma.creature.upsert({
    where: { slug: 'revenants' },
    update: {},
    create: {
      name: 'Revenants',
      slug: 'revenants',
      category: CreatureCategory.NIHIL_CORRUPTION,
      subcategory: 'Mort-vivant conscient',
      origin: CreatureOrigin.NIHIL,
      primaryForce: MagicForce.NIHIL,
      dangerLevel: 6,
      description: "Les morts-vivants nés quand un pratiquant Nihil puissant meurt avec une volonté inachevée — ou quand toute personne avec une forte affinité Nihil est tuée violemment près d'un nexus Nihil. Contrairement aux morts-vivants communs, les Revenants gardent leur pleine intelligence et personnalité. Ils existent dans un état de réalité partielle : ni dans le monde des vivants, ni dans le Monde Inférieur.\n\nWilliam O'Dubh est le Revenant le plus connu et le plus puissant des temps modernes.",
      abilities: "Champ de suppression magique (passif), marche dans l'ombre (téléportation courte distance), immunité aux effets de mort et à la domination mentale, résistance physique suprahumaine.",
      weaknesses: "La force Lumen est une vulnérabilité sévère — exposition prolongée cause douleur et dommages structurels. Ils ne peuvent pas facilement traverser les sols consacrés Lumen.",
      habitat: "Partout où la force Nihil est forte : champs de bataille, cryptes, ruines d'anciennes civilisations. Dargyreon et ses alentours en sont densément peuplés.",
      publishedAt: new Date(),
    },
  })

  const creatureVampire = await prisma.creature.upsert({
    where: { slug: 'vampires-nihil' },
    update: {},
    create: {
      name: 'Vampires (Nihil-touchés)',
      slug: 'vampires-nihil',
      category: CreatureCategory.NIHIL_CORRUPTION,
      subcategory: 'Prédateur vital',
      origin: CreatureOrigin.NIHIL,
      primaryForce: MagicForce.NIHIL,
      dangerLevel: 8,
      description: "Pas les créatures romantiques des légendes — des prédateurs façonnés par l'intersection de Nihil et Sanguis. Ils se nourrissent de la force vitale plutôt que du simple sang — drainant l'essence Nihil des vivants, laissant des enveloppes creuses. Les vampires anciens ont accumulé tellement d'essence volée qu'ils deviennent quelque chose d'autre entièrement.",
      abilities: "Drain Nihil (contact), regard hypnotique (contact oculaire soutenu), vol (spécimens anciens), régénération après nourrissage, détection de l'affinité Nihil chez les autres.",
      weaknesses: "La lumière solaire (Lumen) est douloureuse mais non-fatale pour les jeunes, létale pour les anciens. Armes bénites Sanguis. L'eau courante perturbe leur champ Nihil.",
      habitat: "Ruines, complexes souterrains, anciens domaines nobles à Dargyreon et Siderolon. Les spécimens anciens rôdent souvent dans les zones frontières du Monde Inférieur.",
      publishedAt: new Date(),
    },
  })

  const creatureDemon = await prisma.creature.upsert({
    where: { slug: 'demons-lies' },
    update: {},
    create: {
      name: 'Démons Liés',
      slug: 'demons-lies',
      category: CreatureCategory.DEMON,
      subcategory: 'Entité enchainée',
      origin: CreatureOrigin.UNDERWORLD,
      primaryForce: MagicForce.VESPER,
      dangerLevel: 9,
      description: "Démons liés au monde matériel par des rituels Vesper complexes, servant (malgré eux) ceux qui détiennent leur sigil de liaison. Ce sont des créatures de pure malveillance contraintes par des chaînes magiques — et les chaînes finissent toujours par s'affaiblir. Les Démons Liés manipulent leurs liants vers des actes qui les libéreront éventuellement.",
      abilities: "Manipulation Vesper (illusion, ombre, terreur), force physique dépassant de loin la norme humaine, résistance aux dommages non-magiques, pression télépathique sur les proches.",
      weaknesses: "Leur sigil de liaison est leur faiblesse ultime — le détruire les libère ou les anéantit. La lumière de l'aube (Lumen) affaiblit significativement les démons de type Vesper.",
      habitat: "Partout où quelqu'un a été assez fou pour effectuer un rituel de liaison. Les Témoins du Crépuscule des Dieux et certaines branches du Culte du Dévoreur en emploient plusieurs.",
      publishedAt: new Date(),
    },
  })

  const creatureLiche = await prisma.creature.upsert({
    where: { slug: 'liches' },
    update: {},
    create: {
      name: 'Liches',
      slug: 'liches',
      category: CreatureCategory.NIHIL_CORRUPTION,
      subcategory: 'Archimage mort-vivant',
      origin: CreatureOrigin.NIHIL,
      primaryForce: MagicForce.NIHIL,
      dangerLevel: 10,
      description: "Les Liches sont des mages qui ont volontairement traversé le seuil de la mort pour conserver leur pouvoir indéfiniment — en ancrant leur âme dans un objet physique (le *phylactère*) séparé de leur corps. Contrairement aux Revenants (mort involontaire), la Liche choisit sa transformation. Elle paie un prix différent : sa santé mentale se dégrade sur des décennies, sa vision du vivant devient celle d'un observateur d'une espèce inférieure.",
      abilities: "Magie Nihil et Vesper de niveau archimages, immunité à la mort physique (tant que le phylactère existe), capacité à contrôler des essaims de morts-vivants moindres, distorsion de la réalité locale dans leur zone de résidence.",
      weaknesses: "Détruire le phylactère est la seule mort permanente. Les Liches récentes peuvent encore être affectées par la lumière Lumen directe. Leur intelligence en déclin crée des angles morts.",
      habitat: "Tours isolées, donjons fortifiés dans les zones frontières de Dargyreon. Deux Liches identifiées actives — leurs noms ne sont pas publics.",
      publishedAt: new Date(),
    },
  })

  const creatureMleveque = await prisma.creature.upsert({
    where: { slug: 'mleveques-elfes' },
    update: {},
    create: {
      name: 'Mlévèques (Elfes de cour)',
      slug: 'mleveques-elfes',
      category: CreatureCategory.HYBRID,
      subcategory: 'Peuple non-humain',
      origin: CreatureOrigin.NATURAL,
      primaryForce: MagicForce.LUMEN,
      dangerLevel: 2,
      description: "Les Mlévèques — appelés Elfes de cour par les humains — sont un peuple non-humain d'une longévité exceptionnelle (plusieurs siècles) et d'une affinité naturelle avec Lumen et Vesper combinés. Ils ne forment pas de royaumes propres depuis des générations ; ils vivent intégrés dans les cours humaines, souvent comme conseillers, artisans ou gardes du corps d'élite.\n\nLeur culture valorise la mémoire longue et le changement lent. Ils ont tendance à voir les conflits humains comme des cycles qu'ils ont déjà vus — ce qui les rend sages aux yeux de certains et exaspérants aux yeux d'autres.",
      abilities: "Longévité et résistance naturelle aux maladies, perception Vesper passive (difficile à prendre par surprise), magie Lumen intuitive de niveau modéré, maîtrise rapide des langues.",
      weaknesses: "Vulnérables à la corruption Sanguis (leur Lumen naturel ne les protège pas mieux que les humains), faible taux de natalité, tendance au deuil paralysant des proches.",
      habitat: "Cours nobles de l'alliance occidentale, particulièrement Anthoresia et Albarenon. Quelques communautés isolées dans les vieilles forêts.",
      publishedAt: new Date(),
    },
  })

  const creatureNain = await prisma.creature.upsert({
    where: { slug: 'nains-humus' },
    update: {},
    create: {
      name: 'Nains (Enfants de la Terre)',
      slug: 'nains-humus',
      category: CreatureCategory.HYBRID,
      subcategory: 'Peuple non-humain',
      origin: CreatureOrigin.NATURAL,
      primaryForce: MagicForce.HUMUS,
      dangerLevel: 1,
      description: "Les Nains sont un peuple non-humain profondément lié à la force Humus — leur connexion à la terre n'est pas symbolique mais littérale : ils perçoivent les vibrations de la roche, communiquent avec les strates minérales, et leur magie de forge est inégalée sur le continent. Leurs cités sont souterraines par préférence culturelle, pas par nécessité.\n\nPlus rares en surface que les Mlévèques, les Nains traitent avec les royaumes humains principalement pour le commerce de métaux et d'artefacts. Ils restent politiquement neutres dans les conflits humains — une neutralité défendue avec une constance parfois mystérieuse.",
      abilities: "Connexion Humus profonde (sentir les strates, parler aux roches anciennes), endurance physique extrême, forge-magie (création d'artefacts Humus), résistance aux sorts de déplacement et de transformation.",
      weaknesses: "Aether fort perturbe leur sens de la terre. Vulnérables à la corruption Sanguis dans leurs mines profondes si les veines de roche sont atteintes. Politique insulaire qui les empêche d'aider même quand ils le pourraient.",
      habitat: "Réseaux de cités souterraines sous les massifs montagneux de Siderolon (Kaldbjarg, Eisenthal) et sous les vieilles montagnes d'Anthoresia.",
      publishedAt: new Date(),
    },
  })

  const creatureThalassyroi = await prisma.creature.upsert({
    where: { slug: 'thalassyroi-atlantes' },
    update: {},
    create: {
      name: 'Thalassyroï (Atlantes)',
      slug: 'thalassyroi-atlantes',
      category: CreatureCategory.HYBRID,
      subcategory: 'Peuple ancien',
      origin: CreatureOrigin.NATURAL,
      primaryForce: MagicForce.LUMEN,
      dangerLevel: 3,
      description: "Les Thalassyroï — appelés Atlantes dans les textes populaires — sont les descendants dispersés des habitants de Thalassyris. Ils ne forment pas de nation mais une diaspora : des individus ou de petits groupes portant l'héritage magique et culturel de la cité-mère disparue.\n\nLeur rareté les rend mystérieux. Leur affinité Lumen+Aether combinée est la marque de la civilisation de Thalassyris — la même combinaison qui a permis la codification du langage magique. Certains portent encore des fragments du savoir de la cité-mère, parfois sans en comprendre la provenance.",
      abilities: "Affinité Lumen+Aether naturelle (combinaison rare), accès intuitif à des fragments de langage magique ancien, résistance aux perturbations de réalité, mémoire ancestrale partielle.",
      weaknesses: "Isolés, sans organisation politique, souvent ignorants de leur héritage. Recherchés par plusieurs factions pour ce qu'ils portent — Lucius pour les savoirs, Aurel pour les textes théologiques, des collectionneurs moins scrupuleux pour autre chose.",
      habitat: "Dispersés sur tout Hesperedia. Quelques-uns vivent dans les ruines de Thalassyris elle-même — ce qui soulève des questions que personne n'a encore posées ouvertement.",
      publishedAt: new Date(),
    },
  })

  console.log('✓ 9 Creatures created')

  // ─── ARTICLES ─────────────────────────────────────────────────────────────
  const articleSixForces = await prisma.article.upsert({
    where: { slug: 'les-six-forces-magiques' },
    update: {},
    create: {
      title: 'Les Six Forces Magiques',
      slug: 'les-six-forces-magiques',
      category: ArticleCategory.MAGIC_SYSTEM,
      excerpt: "Au cœur de toute magie dans le monde d'Hesperedia se trouvent les Six Forces Primordiales — des énergies fondamentales qui imprègnent la réalité elle-même.",
      content: `# Les Six Forces Magiques

Au cœur de toute magie dans le monde d'Hesperedia se trouvent les **Six Forces Primordiales** — des énergies fondamentales qui imprègnent la réalité elle-même. Tout être vivant naît avec une affinité naturelle pour l'une ou plusieurs de ces forces.

## Lumen — La Force de Lumière
**Aspect primaire :** Lumière, vérité, guérison, soleil, feu sacré.

Lumen est la force associée à la clarté, à la révélation et à la vie. L'Église du Zénith enseigne que le Lumen était la première force — que l'univers lui-même a émergé d'un acte de pure lumière primordiale.

**Opposition :** Nihil. **Résonance :** Vesper.

## Vesper — La Force Crépusculaire
**Aspect primaire :** Ombre, illusion, rêve, lune, prophétie.

Vesper n'est pas l'obscurité absolue — c'est la lumière mourante, le crépuscule entre deux états. Ses praticiens travaillent dans l'espace entre vrai et faux. Ce n'est pas une force malveillante par nature, mais facilement corruptible.

**Opposition :** Aether. **Résonance :** Nihil.

## Aether — La Force des Vents
**Aspect primaire :** Vent, ciel, vitesse, mer, liberté.

L'Aether est la force du mouvement perpétuel. Calanemora a construit sa civilisation entière sur l'Aether — navires propulsés par des cristaux, corridors de vent, structures utilisant les courants d'air en lieu et place de colonnes.

**Opposition :** Humus. **Résonance :** Lumen.

## Humus — La Force de la Terre
**Aspect primaire :** Terre, croissance, patience, montagne, cycle naturel.

Humus est la force la plus abondante et la plus stable du monde. Les cultures rurales d'Anthoresia et les clans de Kaldbjarg pratiquent le Humus intuitif — pas comme magie formelle mais comme connexion profonde à la terre.

**Opposition :** Aether. **Résonance :** Sanguis.

## Sanguis — La Force du Sang
**Aspect primaire :** Sang, passion, guerre, sacrifice, transformation.

Sanguis n'est pas une force du mal en soi — c'est l'énergie vitale brute. Le problème : c'est la force que le **Dévoreur des Mondes** a corrompue. La Contamination Sanguis est une version tordue du Sanguis naturel qui se propage comme une maladie magique.

**Opposition :** Nihil. **Résonance :** Humus.

## Nihil — La Force du Vide
**Aspect primaire :** Vide, silence, mort naturelle, fin des cycles, paix absolue.

Le Nihil représente la fin naturelle des cycles — pas la destruction malveillante, mais l'inévitabilité apaisante du repos. Les Revenants sont sa manifestation la plus visible. L'Église du Zénith le diabolise ; en réalité, c'est l'opposé nécessaire de Lumen.

**Opposition :** Lumen. **Résonance :** Vesper.

---

## Les Oppositions et Résonances

| Force | Opposition | Résonance |
|-------|-----------|-----------|
| Lumen | Nihil | Vesper |
| Vesper | Aether | Nihil |
| Aether | Humus | Lumen |
| Humus | Aether | Sanguis |
| Sanguis | Nihil | Humus |
| Nihil | Lumen | Vesper |`,
      tags: ['magie', 'lore', 'forces', 'guide'],
      magicForces: [MagicForce.LUMEN, MagicForce.VESPER, MagicForce.AETHER, MagicForce.HUMUS, MagicForce.SANGUIS, MagicForce.NIHIL],
      featured: true,
      authorId: admin.id,
      publishedAt: new Date(),
    },
  })

  const articleThalassyris = await prisma.article.upsert({
    where: { slug: 'thalassyris-la-cite-mere' },
    update: {},
    create: {
      title: 'Thalassyris — La Cité-Mère',
      slug: 'thalassyris-la-cite-mere',
      category: ArticleCategory.HISTORY,
      excerpt: "Avant Anthoresia, avant Albarenon — il y avait Thalassyris. La première civilisation à codifier le langage magique, et la plus grande énigme de l'histoire d'Hesperedia.",
      content: `# Thalassyris — La Cité-Mère

## Origines

Avant les royaumes actuels, il y avait **Thalassyris** — une civilisation côtière et fluviale bâtie à l'embouchure d'un grand fleuve aujourd'hui disparu, là où les plaines de l'ouest rencontrent une mer intérieure.

Thalassyris maîtrisait une combinaison rare de **Lumen et Humus** — l'ordre structurant la matière. Ses monuments colossaux étaient orientés vers les astres. Sa bureaucratie de scribes et de prêtres-rois maintenait un ordre dont les fragments influencent encore le droit d'Anthoresia.

## La Grande Réalisation : Le Langage Magique

Leur héritage le plus profond : **la codification du langage magique**. Avant Thalassyris, la magie était intuitive, tribale, instable. Les scribes de Thalassyris ont produit les premiers grimoires, les premières classifications des forces — des fragments de ce savoir ont survécu dans des bibliothèques dispersées.

C'est précisément ce que Lucius d'Anthoresia cherche dans ses ruines. Et ce que Leo-Angelo Aurel de Saint Trône veut obtenir pour des raisons théologiques.

## La Disparition

Sa disparition reste débattue. Trois théories :

**La montée des eaux** — une perturbation cosmique liée au Beyond aurait modifié la géographie de la région.

**La guerre interne** — un conflit entre la caste des prêtres Lumen et une faction expérimentant avec des forces plus sombres.

**L'absorption par le Monde Inférieur** — similaire à ce qui a frappé Dargyreon plus tard, mais plus ancienne et plus complète.

Ce qui est certain : Thalassyris n'a pas été conquise. Elle a été *abandonnée*, ou *vidée*. Les ruines sont intactes — personne ne les a pillées pendant des siècles, parce que personne n'osait approcher.

## Les Thalassyroï

Les descendants dispersés des habitants de Thalassyris portent encore leur affinité Lumen+Aether naturelle — la même combinaison qui a permis la codification magique. Appelés Atlantes dans les textes populaires, ils errent sur le continent sans nation, parfois ignorants de leur propre héritage.`,
      tags: ['thalassyris', 'histoire', 'ancienne-civilisation', 'lumen', 'humus'],
      magicForces: [MagicForce.LUMEN, MagicForce.HUMUS, MagicForce.AETHER],
      featured: true,
      authorId: admin.id,
      publishedAt: new Date(),
    },
  })

  const articleSiderolon = await prisma.article.upsert({
    where: { slug: 'siderolon-hellstrom' },
    update: {},
    create: {
      title: "Siderolon — L'Empire qui Avance",
      slug: 'siderolon-hellstrom',
      category: ArticleCategory.POLITICS,
      excerpt: "Wilfred von Hellström n'est pas un conquérant classique. C'est un philosophe qui a prouvé que la cage la plus efficace est celle qu'on construit soi-même.",
      content: `# Siderolon — L'Empire qui Avance

## Nature

Siderolon n'est pas un empire ancien. C'est un empire **en train de se faire** — et c'est précisément ce qui le rend dangereux. Les vieux empires ont des routines, des bureaucraties, des compromis accumulés. Siderolon a encore la cohérence brutale d'une volonté unique qui n'a pas encore eu le temps de se contredire.

Sa magie officielle est une triade : **Lumen, Aether, Humus** — l'ordre, le mouvement, l'ancrage. Mais poussés chacun vers leurs extrêmes, ils frisent la déformation. Et sous tout ça, une infiltration croissante de **Nihil** que personne ne veut nommer officiellement.

## Wilfred von Hellström

Il ne ressemble pas à ce qu'il est devenu. De taille moyenne, légèrement voûté, lunettes de lecture. Avant l'unification : historien, philosophe politique, professeur à l'académie d'Eisenthal.

Il a émergé comme médiateur d'une crise de fragmentation, puis a écrit lui-même la constitution de l'empire unifié — un document brillant qui donnait à chaque région suffisamment d'autonomie pour accepter l'union, tout en concentrant le pouvoir dans une main centrale. La sienne.

**Sa contradiction profonde :** il est peut-être le seul à avoir le bon plan pour sauver le continent face à Sanguis. Et ce plan nécessite qu'il l'écrase d'abord.

## Les Trois Régions

**Kaldbjarg** — l'île polaire. Guerriers d'élite, Humus extrême. Loyauté personnelle à Hellström.

**Eisenthal** — les montagnes du sud. Cerveau de l'empire, académies, technologie. Et des laboratoires fermés qui cherchent des applications militaires du Nihil.

**Wisswald** — la forêt vierge. Vesper ambiant, Nihil défensif qui réagit à Sanguis depuis l'est de Dargyreon. La forêt commence à *oublier* ce qu'elle est.

## L'Armée

Trois corps : les Lances de Fer (infanterie Humus-renforcée), les Aigles d'Aether (cavalerie et mages de combat), les Veines Grises (opérations spéciales, armes non-conventionnelles, non documentées officiellement).`,
      tags: ['siderolon', 'hellstrom', 'politique', 'empire', 'lumen'],
      magicForces: [MagicForce.LUMEN, MagicForce.AETHER, MagicForce.HUMUS, MagicForce.NIHIL],
      featured: false,
      authorId: admin.id,
      publishedAt: new Date(),
    },
  })

  const articleSanguisContamination = await prisma.article.upsert({
    where: { slug: 'la-contamination-sanguis' },
    update: {},
    create: {
      title: 'La Contamination Sanguis',
      slug: 'la-contamination-sanguis',
      category: ArticleCategory.HISTORY,
      excerpt: "Il y a deux siècles, la première grande vague de Contamination Sanguis ravagea Dargyreon. Comprendre son origine reste vital pour survivre à la suivante.",
      content: `# La Contamination Sanguis

## Origines

La Contamination Sanguis n'est pas un phénomène naturel — c'est une *arme*. Créée par le Dévoreur des Mondes dans les âges anciens, le Sang Noir est une version corrompue et auto-réplicante de la force Sanguis naturelle.

## La Grande Tempête de Sang (243 AZ)

Le Culte du Dévoreur infiltra la cour impériale de Dargyreon pendant deux décennies. Leurs agents orchestrèrent le rituel de déchaînement lors du solstice d'été 243 AZ, quand les forces magiques sont à leur point d'équilibre le plus fragile.

La tempête dura sept jours. Elle contamina les rivières, les forêts, et les habitants. Valdrevorn fut détruite. Ceux qui survécurent furent souvent transformés en Marcheurs de Peau au cours des semaines suivantes.

## Les Trois Stades de Contamination

**Stade 1 — L'Ensemencement :** Contact direct avec du sang contaminé. Symptômes invisibles 3-7 jours. Indétectable sans magie Nihil ou Lumen spécialisée.

**Stade 2 — La Floraison :** Marques rouges sous la peau, fièvre, épisodes de furie Sanguis. La personne reste consciente mais perd le contrôle de ses émotions.

**Stade 3 — La Transformation :** Sans intervention, transformation progressive. La forme finale dépend de la nature de l'hôte. Marcheurs de Peau, bêtes de sang, ou dissolution en énergie Sanguis brute.

## Traitements

L'Église du Zénith dispose de rituels Lumen efficaces aux stades 1 et 2. Au stade 3, seul un pratiquant Nihil de niveau suffisant peut isoler la contamination — et les séquelles sont permanentes.`,
      tags: ['sanguis', 'contamination', 'histoire', 'dargyreon', 'dévoreur'],
      magicForces: [MagicForce.SANGUIS, MagicForce.NIHIL, MagicForce.LUMEN],
      featured: true,
      authorId: admin.id,
      publishedAt: new Date(),
    },
  })

  const articleCalanemora = await prisma.article.upsert({
    where: { slug: 'calanemora-la-serenissime' },
    update: {},
    create: {
      title: 'Calanemora — La Sérénissime',
      slug: 'calanemora-la-serenissime',
      category: ArticleCategory.POLITICS,
      excerpt: "La cité-état marchande qui contrôle les mers australes. Ni empire ni simple ville, Calanemora est une idée autant qu'un lieu : l'idée que le pouvoir s'accumule.",
      content: `# Calanemora — La Sérénissime

## Nature

Calanemora n'est pas un royaume au sens classique. C'est une **machine commerciale qui a pris la forme d'un État**. Son pouvoir n'est pas hérité ou conquis — il est *accumulé*. Sa magie dominante est **Aether dans sa version marchande** : le mouvement, la circulation, l'échange.

Sa devise : *"Per Ventum et Veritatem"* — Par le Vent et la Vérité.

## Gouvernement

Gouvernée par un **Doge** — titre à vie, élu par la Chambre des Sceaux (douze grandes familles). Le Doge actuel : **Serafino Caldanza** — homme de compromis, choisi parce que chaque famille pensait le contrôler.

## Les Grandes Familles

**Maison Alviori** — construction navale, pro-alliance occidentale. Tête : Donatella Alviori, soixante ans, veuve, acérée.

**Maison Ferrante** — banquiers, créateurs des lettres de crédit intercontinentales. Tête : Cosimo Ferrante — connaît les dettes de Lucius, de Laurena, probablement de généraux de Siderolon.

**Maison Vespari** — renseignement et information. Affinité Vesper naturelle. **Alignée secrètement sur Siderolon** — trahison probable non encore prouvée.

**Maison Caldanza** — service public, légitimité institutionnelle. La famille du Doge actuel.

**Maison Quarti** — flotte de pêche, approvisionnement alimentaire. Les frères Aldo et Benedetto : pragmatiques, veulent la neutralité et leurs profits.

## Les Tensions

Trois pressions simultanées : la trahison Vespari non prouvée, les réfugiés de Dargyreon (cultes, corruption, marchés noirs), et la pression de Siderolon sur les routes terrestres qui isolerait Calanemora sur son archipel.`,
      tags: ['calanemora', 'belvento', 'politique', 'cité-état', 'commerce', 'aether'],
      magicForces: [MagicForce.AETHER, MagicForce.VESPER],
      featured: false,
      authorId: admin.id,
      publishedAt: new Date(),
    },
  })

  const articleSaintTrone = await prisma.article.upsert({
    where: { slug: 'saint-trone-eglise-zenith' },
    update: {},
    create: {
      title: "Saint Trône — La Cité Blanche et l'Église du Zénith",
      slug: 'saint-trone-eglise-zenith',
      category: ArticleCategory.RELIGION,
      excerpt: "Saint Trône n'est pas un royaume. C'est une idée qui a pris la forme d'une cité — que l'ordre divin peut et doit s'incarner dans le monde physique.",
      content: `# Saint Trône — La Cité Blanche

## Nature

Saint Trône n'est pas un royaume. C'est **une idée qui a pris la forme d'une cité** : que Lumen n'est pas seulement une force magique parmi d'autres, mais la vérité fondamentale de l'univers.

La cité est un chef-d'œuvre d'architecture Lumen — des cathédrales blanches aux proportions calculées selon des principes magiques précis, des avenues tracées selon les alignements astraux.

## Deux Pouvoirs en Tension

**Le Prince Sacré** (Leo-Angelo Aurel, 38 ans) — autorité temporelle, héréditaire. Il gouverne Saint Trône comme État. Trois obsessions : la Grande Cathédrale en construction depuis quarante ans, la corruption de Dargyreon, les archives de Thalassyris.

**Le Cardinal Suprême** (Hadrian IX, 75 ans) — autorité spirituelle, élu à vie. A unifié l'Église après un schisme il y a trente ans. Sa grande inquiétude : sa succession, avec trois factions au Collège des Cardinaux qui se disputent déjà son siège.

## Les Paladins Rouges

L'anomalie de Saint Trône. Dans une cité de blanc et de lumière, leur couleur est celle du sang et du feu. Leur doctrine : Lumen se maintient aussi par la destruction de ce qui le corrompt.

Dirigés par **Sorel Vayne** (50 ans, une main remplacée par un gantelet Lumen). Ils répondent au Cardinal, pas au Prince — source de tension politique permanente. Vayne a des projets pour Dargyreon que ni Aurel ni Hadrian n'ont approuvés.

## Les Sept Cathédrales

La Cathédrale du Premier Ordre (siège d'Hadrian), la Cathédrale de la Clarté (bibliothèque théologique), la Cathédrale du Feu Blanc (sanctuaire des Paladins), et quatre cathédrales mineures couvrant la justice, le soin, la mémoire, et une quatrième dont les portes n'ouvrent qu'une fois par an lors du Zénith Céleste.`,
      tags: ['saint-trone', 'eglise', 'zenith', 'lumen', 'paladins', 'hadrian', 'aurel'],
      magicForces: [MagicForce.LUMEN, MagicForce.AETHER],
      featured: false,
      authorId: admin.id,
      publishedAt: new Date(),
    },
  })

  console.log('✓ 6 Articles created')

  // ─── ARTICLE RELATIONS ────────────────────────────────────────────────────
  await prisma.articlesOnCharacters.createMany({
    skipDuplicates: true,
    data: [
      { articleId: articleSanguisContamination.id, characterId: william.id },
      { articleId: articleThalassyris.id, characterId: lucius.id },
      { articleId: articleThalassyris.id, characterId: aurel.id },
      { articleId: articleSiderolon.id, characterId: hellstrom.id },
      { articleId: articleSaintTrone.id, characterId: aurel.id },
      { articleId: articleSaintTrone.id, characterId: hadrian.id },
      { articleId: articleSaintTrone.id, characterId: vayne.id },
      { articleId: articleCalanemora.id, characterId: serafino.id },
    ],
  })

  await prisma.articlesOnFactions.createMany({
    skipDuplicates: true,
    data: [
      { articleId: articleCalanemora.id, factionId: factionCalanemora.id },
      { articleId: articleSanguisContamination.id, factionId: factionCult.id },
      { articleId: articleSiderolon.id, factionId: factionSiderolon.id },
      { articleId: articleSaintTrone.id, factionId: factionChurch.id },
      { articleId: articleSaintTrone.id, factionId: factionPaladins.id },
    ],
  })

  await prisma.articlesOnLocations.createMany({
    skipDuplicates: true,
    data: [
      { articleId: articleCalanemora.id, locationId: locationCalanemoraCity.id },
      { articleId: articleSanguisContamination.id, locationId: locationValdrevorn.id },
      { articleId: articleThalassyris.id, locationId: locationRuinesThalassyris.id },
      { articleId: articleSaintTrone.id, locationId: locationSaintTroneCity.id },
      { articleId: articleSiderolon.id, locationId: locationEisenthal.id },
      { articleId: articleSiderolon.id, locationId: locationWisswald.id },
    ],
  })

  await prisma.articlesOnRegions.createMany({
    skipDuplicates: true,
    data: [
      { articleId: articleCalanemora.id, regionId: regionCalanemora.id },
      { articleId: articleSanguisContamination.id, regionId: regionDargyreon.id },
      { articleId: articleThalassyris.id, regionId: regionAnthoresia.id },
      { articleId: articleSiderolon.id, regionId: regionSiderolon.id },
      { articleId: articleSaintTrone.id, regionId: regionSaintTrone.id },
    ],
  })

  await prisma.articlesOnCreatures.createMany({
    skipDuplicates: true,
    data: [
      { articleId: articleSanguisContamination.id, creatureId: creatureMarcheurPeau.id },
      { articleId: articleSanguisContamination.id, creatureId: creatureRevenant.id },
    ],
  })

  // ─── PROJECTS ─────────────────────────────────────────────────────────────
  await prisma.project.upsert({
    where: { slug: 'hesperedia-chronicles-rpg' },
    update: {},
    create: {
      title: 'Hesperedia Chronicles',
      slug: 'hesperedia-chronicles-rpg',
      type: ProjectType.VIDEO_GAME,
      status: ProjectStatus.IN_DEVELOPMENT,
      description: "Un action-RPG se déroulant dans Hesperedia, suivant un protagoniste original naviguant le conflit entre les six forces pendant que la corruption du Dévoreur s'étend. Système de magie profond où votre affinité de force façonne vos capacités et vos choix narratifs.",
      tags: ['rpg', 'action', 'open-world', 'système-magique'],
      publishedAt: new Date(),
    },
  })

  await prisma.project.upsert({
    where: { slug: 'forces-tabletop' },
    update: {},
    create: {
      title: 'Forces — Le JDR sur Table',
      slug: 'forces-tabletop',
      type: ProjectType.TABLETOP_GAME,
      status: ProjectStatus.DEMO_AVAILABLE,
      description: "Un système de jeu de rôle sur table construit autour des Six Forces d'Hesperedia. Les joueurs choisissent une affinité de force qui détermine leurs capacités et leur relation aux factions. Inclut un toolkit MJ pour les scénarios politiques et de combat.",
      tags: ['ttrpg', 'tabletop', 'livret-de-règles', 'forces'],
      publishedAt: new Date(),
    },
  })

  await prisma.project.upsert({
    where: { slug: 'william-odubh-comic' },
    update: {},
    create: {
      title: "William O'Dubh — Le Revenant",
      slug: 'william-odubh-comic',
      type: ProjectType.COMIC,
      status: ProjectStatus.ANNOUNCED,
      description: "Une série de bande dessinée suivant William O'Dubh dans sa quête pour retrouver Helga et comprendre ce qu'il est devenu. Chaque arc explore un aspect différent d'Hesperedia tout en révélant progressivement la vérité sur les Témoins du Crépuscule des Dieux.",
      tags: ['bande-dessinée', 'william', 'revenant', 'quête'],
      publishedAt: new Date(),
    },
  })
  console.log('✓ 3 Projects created')

  console.log('\n✅ Seed complet ! Base de données Hesperedia peuplée.')
  console.log('   4 Royaumes | 6 Régions | 8 Factions | 8 Lieux | 9 Personnages | 9 Créatures | 6 Articles | 3 Projets')
  console.log('   Admin : admin@hesperedia.wiki / HespeAdmin2024!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
