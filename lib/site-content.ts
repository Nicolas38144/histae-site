import { locales, type Locale } from "./locales";

export { locales, type Locale } from "./locales";
export type PageName = "feature" | "safety" | "about" | "download";

type Block = { title: string; text: string };
type PageCopy = { eyebrow: string; title: string; intro: string; blocks: Block[]; footerNote?: string };

export type SiteCopy = {
  nav: Record<"home" | PageName, string>;
  common: { backHome: string; language: string; close: string; menu: string; skip: string };
  home: {
    eyebrow: string;
    title: string;
    intro: string;
    primary: string;
    secondary: string;
    principlesTitle: string;
    principles: Block[];
    rhythmEyebrow: string;
    rhythmTitle: string;
    rhythmIntro: string;
    steps: Block[];
    safetyEyebrow: string;
    safetyTitle: string;
    safetyText: string;
    safetyLink: string;
    closingTitle: string;
    closingText: string;
  };
  pages: Record<PageName, PageCopy>;
  footer: { line: string; madeFor: string };
};

export const languageNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  it: "Italiano",
};

export const content: Record<Locale, SiteCopy> = {
  fr: {
    nav: { home: "Accueil", feature: "Le principe", safety: "Sécurité", about: "À propos", download: "Télécharger" },
    common: { backHome: "Retour à l’accueil", language: "Langue", close: "Fermer", menu: "Ouvrir le menu", skip: "Aller au contenu" },
    home: {
      eyebrow: "Une autre façon de se rencontrer",
      title: "Prendre le temps de laisser une rencontre exister.",
      intro: "Histae est une application pensée pour celles et ceux qui préfèrent l’attention au réflexe, la curiosité au défilement, et le consentement à chaque étape.",
      primary: "Découvrir le lancement",
      secondary: "Comprendre le principe",
      principlesTitle: "Ce que nous voulons préserver",
      principles: [
        { title: "Le temps", text: "Pas de course au swipe. Chaque échange est conçu pour pouvoir respirer." },
        { title: "La réciprocité", text: "La suite d’un match ne se décide pas seul : elle se choisit à deux." },
        { title: "Le respect", text: "Des outils de signalement et une modération font partie du produit, pas d’une note de bas de page." },
      ],
      rhythmEyebrow: "Un rythme plus humain",
      rhythmTitle: "Une rencontre se construit en trois temps.",
      rhythmIntro: "Le produit privilégie l’échange et le consentement partagé avant d’ouvrir davantage la relation.",
      steps: [
        { title: "01 · Se découvrir", text: "Un match démarre avec une fenêtre d’échange de 24 heures, sans pression de tout révéler immédiatement." },
        { title: "02 · Choisir de continuer", text: "À la fin de cette première fenêtre, chacun indique s’il souhaite poursuivre. La suite exige l’accord des deux personnes." },
        { title: "03 · Révéler ensemble", text: "La révélation des photos suit elle aussi un consentement mutuel : personne n’est forcé d’aller plus vite." },
      ],
      safetyEyebrow: "Une attention concrète à la sécurité",
      safetyTitle: "Le respect ne devrait jamais être optionnel.",
      safetyText: "Histae intègre le signalement, la modération et la possibilité de reprendre le contrôle de ses informations. Les choix sensibles, comme la localisation ou les préférences, reposent sur un consentement explicite.",
      safetyLink: "Voir nos engagements de sécurité",
      closingTitle: "Moins de réflexes. Plus de vraies intentions.",
      closingText: "L’application est en préparation. Suivez son lancement pour découvrir Histae dès son arrivée.",
    },
    pages: {
      feature: { eyebrow: "Le principe", title: "Faire de la place à l’intention.", intro: "Histae ne promet pas une rencontre magique. Elle crée un cadre plus calme, où chacun peut choisir d’avancer à son rythme.", blocks: [
        { title: "Un début limité dans le temps", text: "Les premières conversations vivent dans une fenêtre claire de 24 heures. Cette limite donne un élan, sans transformer l’échange en performance." },
        { title: "Continuer est une décision commune", text: "Après cette première étape, le match se poursuit uniquement lorsque les deux personnes le souhaitent." },
        { title: "Des abonnements qui respectent le rythme", text: "Les plans peuvent encadrer le nombre de continuations hebdomadaires, afin de privilégier des conversations choisies plutôt qu’un flux infini." },
      ] },
      safety: { eyebrow: "Sécurité", title: "Un cadre clair pour mieux se rencontrer.", intro: "La confiance se construit aussi avec des règles lisibles, des protections techniques et la possibilité d’agir lorsqu’une situation ne convient pas.", blocks: [
        { title: "Signaler simplement", text: "Un membre peut signaler un comportement inapproprié, un faux profil, du harcèlement ou du spam. Les signalements sont traités par une équipe habilitée." },
        { title: "Garder la main sur ses données", text: "La suppression du compte désactive et anonymise les informations prévues à cet effet. Les consentements liés aux données sensibles et à la localisation peuvent être retirés." },
        { title: "Protéger les accès", text: "L’accès au compte s’appuie sur une vérification par téléphone et des sessions renouvelées. Le produit applique aussi des limites contre les abus." },
      ] },
      about: { eyebrow: "À propos", title: "Nous croyons aux rencontres qui prennent leur temps.", intro: "Histae part d’un constat simple : une application de rencontre peut encourager la curiosité sans réduire les personnes à une succession de choix instantanés.", blocks: [
        { title: "Une promesse modeste", text: "Nous ne décidons pas à la place des gens. Nous concevons les règles qui permettent une rencontre plus consciente et plus réciproque." },
        { title: "Un produit en construction", text: "Histae avance par étapes. Certaines fonctionnalités de découverte sont encore en développement, et nous préférons le dire clairement." },
        { title: "Un espace à améliorer avec vous", text: "La qualité d’une communauté dépend des personnes qui la composent, mais aussi des outils qui leur donnent le pouvoir de poser leurs limites." },
      ] },
      download: { eyebrow: "Lancement", title: "Histae arrive bientôt.", intro: "L’application iOS et Android est en préparation. Les liens de téléchargement seront publiés ici dès l’ouverture.", blocks: [
        { title: "Pas de faux bouton", text: "Nous préférons annoncer une disponibilité réelle plutôt que de vous envoyer vers une page vide." },
        { title: "Ce qui est déjà au cœur du produit", text: "Le rythme des matchs, le consentement partagé, la messagerie et les outils de signalement structurent déjà l’expérience." },
        { title: "Ce qui reste à venir", text: "La découverte et le feed font encore partie du chantier. Ils ne seront pas présentés comme disponibles avant de l’être." },
      ], footerNote: "Revenez prochainement pour les liens App Store et Google Play." },
    },
    footer: { line: "Histae — prendre le temps de se rencontrer.", madeFor: "Une vitrine en construction, pensée avec attention." },
  },
  en: {
    nav: { home: "Home", feature: "How it works", safety: "Safety", about: "About", download: "Download" },
    common: { backHome: "Back home", language: "Language", close: "Close", menu: "Open menu", skip: "Skip to content" },
    home: {
      eyebrow: "A different way to meet",
      title: "Give a connection the time to exist.",
      intro: "Histae is for people who prefer attention over reflexes, curiosity over endless scrolling, and consent at every step.",
      primary: "Discover the launch", secondary: "How it works", principlesTitle: "What we want to protect",
      principles: [
        { title: "Time", text: "No swiping race. Every conversation is given room to breathe." },
        { title: "Reciprocity", text: "A match never moves forward alone: both people choose what comes next." },
        { title: "Respect", text: "Reporting tools and moderation are part of the product, not a footnote." },
      ],
      rhythmEyebrow: "A more human pace", rhythmTitle: "A connection unfolds in three moments.", rhythmIntro: "The product prioritizes conversation and shared consent before opening up the relationship further.",
      steps: [
        { title: "01 · Get to know each other", text: "A match begins with a 24-hour conversation window, without pressure to reveal everything at once." },
        { title: "02 · Choose to continue", text: "When that first window ends, each person says whether they want to continue. Moving forward requires both people." },
        { title: "03 · Reveal together", text: "Photo reveal follows the same mutual consent: no one is pushed to move faster." },
      ],
      safetyEyebrow: "A practical approach to safety", safetyTitle: "Respect should never be optional.", safetyText: "Histae includes reporting, moderation and ways to regain control of personal information. Sensitive choices, such as location and preferences, rely on explicit consent.", safetyLink: "Read our safety commitments", closingTitle: "Fewer reflexes. More real intention.", closingText: "The app is being prepared. Follow the launch to discover Histae when it arrives.",
    },
    pages: {
      feature: { eyebrow: "How it works", title: "Make room for intention.", intro: "Histae does not promise a magical match. It creates a calmer framework where each person can choose their own pace.", blocks: [
        { title: "A time-bound beginning", text: "First conversations live in a clear 24-hour window. It creates momentum without turning connection into a performance." },
        { title: "Continuing is a shared choice", text: "After that first step, the match only continues when both people want it to." },
        { title: "Plans that respect attention", text: "Plans can frame weekly continuations, favouring chosen conversations over an endless feed." },
      ] },
      safety: { eyebrow: "Safety", title: "A clear framework for meeting better.", intro: "Trust also comes from understandable rules, technical safeguards and the ability to act when something feels wrong.", blocks: [
        { title: "Report with ease", text: "Members can report inappropriate content, fake profiles, harassment or spam. Reports are handled by authorised moderators." },
        { title: "Stay in control of your data", text: "Account deletion deactivates and anonymises the information intended for this purpose. Consent for sensitive data and location can be withdrawn." },
        { title: "Protect account access", text: "Account access relies on phone verification and renewed sessions. The product also applies limits against abuse." },
      ] },
      about: { eyebrow: "About", title: "We believe connections deserve time.", intro: "Histae starts from a simple idea: a dating app can encourage curiosity without reducing people to a stream of instant choices.", blocks: [
        { title: "A modest promise", text: "We do not decide for people. We design the rules that make a connection more conscious and reciprocal." },
        { title: "A product in progress", text: "Histae is built in stages. Some discovery features are still being developed, and we prefer to say so plainly." },
        { title: "A space to improve together", text: "A community’s quality depends on its members, and on tools that let them set their own boundaries." },
      ] },
      download: { eyebrow: "Launch", title: "Histae is coming soon.", intro: "The iOS and Android app is being prepared. Download links will be published here when the launch opens.", blocks: [
        { title: "No pretend button", text: "We would rather announce real availability than send you to an empty page." },
        { title: "Already at the product’s core", text: "Match pacing, mutual consent, messaging and reporting tools already structure the experience." },
        { title: "Still to come", text: "Discovery and the feed are still under development. They will not be presented as available before they are." },
      ], footerNote: "Come back soon for App Store and Google Play links." },
    },
    footer: { line: "Histae — give a connection the time to exist.", madeFor: "A considered product, still in the making." },
  },
  es: {
    nav: { home: "Inicio", feature: "El principio", safety: "Seguridad", about: "Nosotros", download: "Descargar" },
    common: { backHome: "Volver al inicio", language: "Idioma", close: "Cerrar", menu: "Abrir menú", skip: "Ir al contenido" },
    home: {
      eyebrow: "Otra manera de conocerse", title: "Dar a un encuentro el tiempo de existir.", intro: "Histae está pensada para quienes prefieren la atención al reflejo, la curiosidad al desplazamiento infinito y el consentimiento en cada etapa.", primary: "Descubrir el lanzamiento", secondary: "Entender el principio", principlesTitle: "Lo que queremos proteger",
      principles: [
        { title: "El tiempo", text: "Sin carrera de swipes. Cada conversación tiene espacio para respirar." },
        { title: "La reciprocidad", text: "Una conexión no avanza en solitario: ambas personas deciden qué viene después." },
        { title: "El respeto", text: "Las herramientas de denuncia y la moderación forman parte del producto, no de una nota al pie." },
      ],
      rhythmEyebrow: "Un ritmo más humano", rhythmTitle: "Un encuentro se construye en tres momentos.", rhythmIntro: "El producto prioriza la conversación y el consentimiento compartido antes de abrir más la relación.",
      steps: [
        { title: "01 · Descubrirse", text: "Una conexión comienza con una ventana de conversación de 24 horas, sin presión por mostrarlo todo de inmediato." },
        { title: "02 · Elegir continuar", text: "Al terminar esa primera ventana, cada persona indica si quiere seguir. Avanzar exige el acuerdo de ambas." },
        { title: "03 · Revelarse juntos", text: "La revelación de fotos sigue el mismo consentimiento mutuo: nadie tiene que ir más rápido." },
      ],
      safetyEyebrow: "Una atención práctica a la seguridad", safetyTitle: "El respeto nunca debería ser opcional.", safetyText: "Histae incluye denuncias, moderación y formas de recuperar el control de la información personal. Las elecciones sensibles, como la ubicación y las preferencias, requieren consentimiento explícito.", safetyLink: "Ver nuestros compromisos de seguridad", closingTitle: "Menos reflejos. Más intención real.", closingText: "La aplicación está en preparación. Sigue el lanzamiento para descubrir Histae cuando llegue.",
    },
    pages: {
      feature: { eyebrow: "El principio", title: "Dejar espacio para la intención.", intro: "Histae no promete un encuentro mágico. Crea un marco más tranquilo en el que cada persona puede elegir su ritmo.", blocks: [
        { title: "Un comienzo limitado", text: "Las primeras conversaciones viven en una ventana clara de 24 horas. Da impulso sin convertir el encuentro en una actuación." },
        { title: "Continuar es una decisión compartida", text: "Después de esa primera etapa, la conexión solo continúa cuando ambas personas lo desean." },
        { title: "Planes que respetan la atención", text: "Los planes pueden enmarcar las continuaciones semanales para privilegiar conversaciones elegidas." },
      ] },
      safety: { eyebrow: "Seguridad", title: "Un marco claro para conocerse mejor.", intro: "La confianza también nace de reglas comprensibles, protecciones técnicas y la posibilidad de actuar cuando algo no está bien.", blocks: [
        { title: "Denunciar con facilidad", text: "Se puede denunciar contenido inapropiado, perfiles falsos, acoso o spam. Las denuncias son tratadas por moderación autorizada." },
        { title: "Mantener el control de los datos", text: "Eliminar la cuenta desactiva y anonimiza la información prevista para ello. El consentimiento para datos sensibles y ubicación puede retirarse." },
        { title: "Proteger el acceso", text: "El acceso se apoya en la verificación telefónica y sesiones renovadas. El producto también aplica límites contra los abusos." },
      ] },
      about: { eyebrow: "Nosotros", title: "Creemos que los encuentros merecen tiempo.", intro: "Histae parte de una idea simple: una aplicación de citas puede fomentar la curiosidad sin reducir a las personas a una serie de elecciones instantáneas.", blocks: [
        { title: "Una promesa modesta", text: "No decidimos por las personas. Diseñamos reglas que hacen un encuentro más consciente y recíproco." },
        { title: "Un producto en construcción", text: "Histae avanza por etapas. Algunas funciones de descubrimiento siguen en desarrollo y preferimos decirlo claramente." },
        { title: "Un espacio para mejorar juntos", text: "La calidad de una comunidad depende de sus miembros y de las herramientas que les permiten poner límites." },
      ] },
      download: { eyebrow: "Lanzamiento", title: "Histae llega pronto.", intro: "La aplicación para iOS y Android está en preparación. Los enlaces de descarga se publicarán aquí cuando se abra el lanzamiento.", blocks: [
        { title: "Sin botón falso", text: "Preferimos anunciar una disponibilidad real antes que enviarte a una página vacía." },
        { title: "Ya en el corazón del producto", text: "El ritmo de las conexiones, el consentimiento mutuo, los mensajes y las denuncias ya estructuran la experiencia." },
        { title: "Lo que falta", text: "El descubrimiento y el feed siguen en desarrollo. No se presentarán como disponibles antes de estarlo." },
      ], footerNote: "Vuelve pronto para los enlaces de App Store y Google Play." },
    },
    footer: { line: "Histae — dar a un encuentro el tiempo de existir.", madeFor: "Un producto atento, todavía en construcción." },
  },
  it: {
    nav: { home: "Home", feature: "Il principio", safety: "Sicurezza", about: "Chi siamo", download: "Scarica" },
    common: { backHome: "Torna alla home", language: "Lingua", close: "Chiudi", menu: "Apri menu", skip: "Vai al contenuto" },
    home: {
      eyebrow: "Un altro modo di incontrarsi", title: "Dare a un incontro il tempo di esistere.", intro: "Histae è pensata per chi preferisce l’attenzione al riflesso, la curiosità allo scorrimento infinito e il consenso in ogni fase.", primary: "Scopri il lancio", secondary: "Capire il principio", principlesTitle: "Ciò che vogliamo proteggere",
      principles: [
        { title: "Il tempo", text: "Nessuna corsa agli swipe. Ogni conversazione ha spazio per respirare." },
        { title: "La reciprocità", text: "Un incontro non prosegue da solo: entrambe le persone scelgono cosa accade dopo." },
        { title: "Il rispetto", text: "Strumenti di segnalazione e moderazione fanno parte del prodotto, non di una nota a piè di pagina." },
      ],
      rhythmEyebrow: "Un ritmo più umano", rhythmTitle: "Un incontro si costruisce in tre tempi.", rhythmIntro: "Il prodotto privilegia lo scambio e il consenso condiviso prima di aprire ulteriormente la relazione.",
      steps: [
        { title: "01 · Conoscersi", text: "Un match inizia con una finestra di conversazione di 24 ore, senza pressione di rivelare tutto subito." },
        { title: "02 · Scegliere di continuare", text: "Alla fine della prima finestra, ciascuno indica se desidera proseguire. Andare avanti richiede l’accordo di entrambi." },
        { title: "03 · Rivelarsi insieme", text: "Anche la rivelazione delle foto segue il consenso reciproco: nessuno deve andare più veloce." },
      ],
      safetyEyebrow: "Un’attenzione concreta alla sicurezza", safetyTitle: "Il rispetto non dovrebbe mai essere opzionale.", safetyText: "Histae include segnalazioni, moderazione e modi per riprendere il controllo delle informazioni personali. Le scelte sensibili, come posizione e preferenze, richiedono consenso esplicito.", safetyLink: "Leggi i nostri impegni di sicurezza", closingTitle: "Meno riflessi. Più intenzioni reali.", closingText: "L’app è in preparazione. Segui il lancio per scoprire Histae quando arriverà.",
    },
    pages: {
      feature: { eyebrow: "Il principio", title: "Fare spazio all’intenzione.", intro: "Histae non promette un incontro magico. Crea un contesto più calmo, in cui ogni persona può scegliere il proprio ritmo.", blocks: [
        { title: "Un inizio a tempo", text: "Le prime conversazioni vivono in una finestra chiara di 24 ore. Dà slancio senza trasformare l’incontro in una prestazione." },
        { title: "Continuare è una scelta condivisa", text: "Dopo questo primo passo, il match prosegue solo quando entrambe le persone lo desiderano." },
        { title: "Piani che rispettano l’attenzione", text: "I piani possono inquadrare le continuazioni settimanali, privilegiando conversazioni scelte." },
      ] },
      safety: { eyebrow: "Sicurezza", title: "Un contesto chiaro per incontrarsi meglio.", intro: "La fiducia nasce anche da regole comprensibili, protezioni tecniche e dalla possibilità di agire quando qualcosa non va.", blocks: [
        { title: "Segnalare con semplicità", text: "Si possono segnalare contenuti inappropriati, profili falsi, molestie o spam. Le segnalazioni sono gestite da moderatori autorizzati." },
        { title: "Mantenere il controllo dei dati", text: "La cancellazione dell’account disattiva e anonimizza le informazioni previste. Il consenso per dati sensibili e posizione può essere ritirato." },
        { title: "Proteggere l’accesso", text: "L’accesso si basa sulla verifica telefonica e su sessioni rinnovate. Il prodotto applica anche limiti contro gli abusi." },
      ] },
      about: { eyebrow: "Chi siamo", title: "Crediamo che gli incontri meritino tempo.", intro: "Histae parte da un’idea semplice: un’app di incontri può incoraggiare la curiosità senza ridurre le persone a una sequenza di scelte istantanee.", blocks: [
        { title: "Una promessa modesta", text: "Non decidiamo al posto delle persone. Progettiamo regole che rendono un incontro più consapevole e reciproco." },
        { title: "Un prodotto in costruzione", text: "Histae procede per tappe. Alcune funzioni di scoperta sono ancora in sviluppo e preferiamo dirlo apertamente." },
        { title: "Uno spazio da migliorare insieme", text: "La qualità di una comunità dipende dai suoi membri e dagli strumenti che consentono di porre limiti." },
      ] },
      download: { eyebrow: "Lancio", title: "Histae arriva presto.", intro: "L’app per iOS e Android è in preparazione. I link per il download saranno pubblicati qui all’apertura del lancio.", blocks: [
        { title: "Nessun pulsante finto", text: "Preferiamo annunciare una disponibilità reale invece di mandarti a una pagina vuota." },
        { title: "Già al cuore del prodotto", text: "Il ritmo dei match, il consenso reciproco, i messaggi e gli strumenti di segnalazione strutturano già l’esperienza." },
        { title: "Ancora in arrivo", text: "La scoperta e il feed sono ancora in sviluppo. Non saranno presentati come disponibili prima di esserlo." },
      ], footerNote: "Torna presto per i link App Store e Google Play." },
    },
    footer: { line: "Histae — dare a un incontro il tempo di esistere.", madeFor: "Un prodotto attento, ancora in costruzione." },
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getContent(locale: string): SiteCopy {
  return content[isLocale(locale) ? locale : "fr"];
}
