export type Dictionary = {
  meta: {
    siteTitle: string;
    siteDescription: string;
    ogDescription: string;
    twitterDescription: string;
  };
  common: {
    brandName: string;
    backToHome: string;
    backToSeason1: string;
    min: string;
    seeSeason1: string;
    getAllAccess: string;
    emailUs: string;
  };
  localeSwitcher: {
    label: string;
  };
  home: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    seasonEyebrow: string;
    seasonTitle: string;
    seasonBody: string;
    seasonLink: string;
    browseAll: string;
  };
  signup: {
    emailLabel: string;
    placeholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successDefault: string;
    errorDefault: string;
    networkError: string;
    footnote: string;
    cantWait: string;
    allAccessImmediate: string;
  };
  socialProof: {
    heading: string;
    empty: string;
    subscribers: string;
    playbooksReady: string;
    playbookReady: string;
  };
  startHere: {
    heading: string;
    subtitle: string;
    cards: Array<{
      label: string;
      title: string;
      outcome: string;
      cta: string;
    }>;
  };
  recentPlaybooks: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  playbookCard: {
    sample: string;
    emailOnly: string;
    readSample: string;
    readFull: string;
    viewTeaser: string;
    viewTeaserSubscribe: string;
  };
  confirmed: {
    eyebrow: string;
    title: string;
    body: string;
    seasonLink: string;
    sampleLink: string;
    backHome: string;
  };
  issues: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    allAccessUnlocked: string;
    colWorkflow: string;
    colTime: string;
    colDifficulty: string;
    colOutcome: string;
    emailOnly: string;
    freeSample: string;
    empty: string;
    readTeaserSubscribe: string;
    readSample: string;
    readFull: string;
  };
  issue: {
    back: string;
    issuePrefix: string;
    allAccessBadge: string;
    emailBadge: string;
  };
  issueGate: {
    teaserLabel: string;
    setupTime: string;
    body: string;
    cantWait: string;
    title: string;
    subtitle: string;
  };
  season1: {
    metaTitle: string;
    metaDescription: string;
    progressLabel: string;
    progressCount: string;
    progressBody: string;
    arcTitle: string;
    arcBody: string;
    listTitle: string;
    paidAddon: string;
    freeDrip: string;
    crownTitle: string;
    crownTeaser: string;
    crownCta: string;
    signupTitle: string;
    signupBody: string;
    playbookLabel: string;
    live: string;
    comingSoon: string;
    published: string;
    planned: string;
    crownSectionTitle: string;
    crownSectionBody: string;
    crownSectionNote: string;
    crownSectionCta: string;
    crownSectionCompare: string;
    startFreeTitle: string;
    startFreeBody: string;
    startFreeCantWait: string;
    startFreeAllAccess: string;
    allAccessPrompt: string;
  };
  allAccess: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    freePathTitle: string;
    freePathBody: string;
    crownHintTitle: string;
    crownHintBody: string;
    crownLink: string;
    ctaEyebrow: string;
    price: string;
    ctaBody: string;
    ctaButton: string;
    checkoutSoon: string;
  };
  crown: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    unlocked: string;
    separateFromAllAccess: string;
    ctaEyebrow: string;
    price: string;
    ctaBody: string;
    ctaButton: string;
    checkoutSoon: string;
  };
  legal: {
    metaTitle: string;
    frameworkEyebrow: string;
    frameworkTitle: string;
    frameworkIntro: string;
    privacyTitle: string;
    privacyTag: string;
    cookiesTitle: string;
    dataProtectionTitle: string;
    termsTitle: string;
    deNotice: string;
    footerPrivacy: string;
    footerCookies: string;
    footerDataProtection: string;
    footerTerms: string;
    footerSeason1: string;
    footerAllAccess: string;
    footerPlaybooks: string;
  };
  cookies: {
    eyebrow: string;
    title: string;
    body: string;
    essentialLabel: string;
    essentialBody: string;
    acceptAll: string;
    savePreferences: string;
    manageCookies: string;
    analyticsLabel: string;
    analyticsDescription: string;
    marketingLabel: string;
    marketingDescription: string;
  };
  affiliate: {
    disclosure: string;
  };
};
