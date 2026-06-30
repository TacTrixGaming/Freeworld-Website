/**
 * EDIT THIS FILE BEFORE YOUR FIRST DEPLOYMENT.
 *
 * This file controls the starter applications and starter rulebook inserted
 * into an empty database. Re-deploying is safe: application definitions are
 * updated by slug, while rules are inserted only when the rulebook is empty.
 */

export type ApplicationField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "checkbox";
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
};

export type StarterApplication = {
  slug: string;
  name: string;
  description: string;
  icon: "shield" | "badge" | "medical" | "building" | "clipboard";
  order: number;
  openByDefault: boolean;
  fields: ApplicationField[];
};

export type StarterRuleCategory = {
  title: string;
  description?: string;
  order: number;
  rules: Array<{
    code: string;
    title: string;
    body: string;
    order: number;
  }>;
};

export const starterApplications: StarterApplication[] = [
  {
    slug: "staff",
    name: "Staff Application",
    description: "Apply to help support and moderate the community.",
    icon: "shield",
    order: 10,
    openByDefault: true,
    fields: [
      { id: "age", label: "Age", type: "number", required: true, min: 16, max: 99 },
      { id: "timezone", label: "Timezone", type: "text", required: true, placeholder: "Example: Central Time" },
      { id: "experience", label: "Previous staff experience", type: "textarea", required: true, minLength: 50, maxLength: 1500 },
      { id: "why", label: "Why do you want to join the staff team?", type: "textarea", required: true, minLength: 100, maxLength: 2000 },
      { id: "availability", label: "Weekly availability", type: "textarea", required: true, maxLength: 1000 }
    ]
  },
  {
    slug: "law-enforcement",
    name: "Law Enforcement Application",
    description: "Apply for a position with a law enforcement department.",
    icon: "badge",
    order: 20,
    openByDefault: true,
    fields: [
      { id: "characterName", label: "Character name", type: "text", required: true, maxLength: 80 },
      { id: "age", label: "Real age", type: "number", required: true, min: 16, max: 99 },
      { id: "department", label: "Preferred department", type: "select", required: true, options: ["LSPD", "BCSO", "SAST", "No preference"] },
      { id: "experience", label: "Previous law enforcement RP experience", type: "textarea", required: true, maxLength: 1500 },
      { id: "scenario", label: "Explain how you would handle a high-risk traffic stop.", type: "textarea", required: true, minLength: 100, maxLength: 2000 }
    ]
  },
  {
    slug: "ems",
    name: "EMS Application",
    description: "Apply to join emergency medical services.",
    icon: "medical",
    order: 30,
    openByDefault: true,
    fields: [
      { id: "characterName", label: "Character name", type: "text", required: true, maxLength: 80 },
      { id: "age", label: "Real age", type: "number", required: true, min: 16, max: 99 },
      { id: "experience", label: "Previous medical RP experience", type: "textarea", required: true, maxLength: 1500 },
      { id: "scenario", label: "Explain how you would handle a multi-casualty scene.", type: "textarea", required: true, minLength: 100, maxLength: 2000 }
    ]
  },
  {
    slug: "business",
    name: "Business Application",
    description: "Pitch a player-owned business that adds meaningful roleplay to the city.",
    icon: "building",
    order: 40,
    openByDefault: true,
    fields: [
      { id: "characterName", label: "Character name", type: "text", required: true, maxLength: 80 },
      { id: "businessName", label: "Proposed business name", type: "text", required: true, maxLength: 100 },
      { id: "businessType", label: "Business type", type: "text", required: true, maxLength: 100 },
      { id: "concept", label: "Describe the business concept", type: "textarea", required: true, minLength: 150, maxLength: 2500 },
      { id: "rpValue", label: "How will this create roleplay for other players?", type: "textarea", required: true, minLength: 100, maxLength: 2000 }
    ]
  }
];

export const starterRuleCategories: StarterRuleCategory[] = [
  {
    title: "Community Standards",
    description: "Behavior expected from every community member.",
    order: 10,
    rules: [
      { code: "1.1", title: "Respect the Community", body: "Harassment, hate speech, targeted abuse, and discriminatory conduct are not permitted.", order: 10 },
      { code: "1.2", title: "No Exploiting", body: "Do not use bugs, cheats, unauthorized software, macros, or external tools to gain an unfair advantage.", order: 20 },
      { code: "1.3", title: "Staff Decisions", body: "Follow staff instructions during active situations. Appeals belong in the proper support channel, not in public arguments.", order: 30 }
    ]
  },
  {
    title: "Roleplay Rules",
    description: "Core standards for serious and fair roleplay.",
    order: 20,
    rules: [
      { code: "2.1", title: "Value of Life", body: "Treat your character's life as valuable and react realistically to danger, injuries, and threats.", order: 10 },
      { code: "2.2", title: "Metagaming", body: "Do not use information your character could not reasonably know in roleplay.", order: 20 },
      { code: "2.3", title: "Powergaming", body: "Do not force actions or outcomes on other players without a reasonable opportunity to respond.", order: 30 },
      { code: "2.4", title: "Random Deathmatch", body: "Violence must have valid roleplay initiation and escalation. Random or unsupported attacks are prohibited.", order: 40 }
    ]
  },
  {
    title: "Character & Economy",
    description: "Rules that protect character integrity and the server economy.",
    order: 30,
    rules: [
      { code: "3.1", title: "Character Separation", body: "Do not transfer knowledge, items, money, or relationships between characters without valid roleplay approval.", order: 10 },
      { code: "3.2", title: "Realistic Transactions", body: "Do not use alternate accounts or coordinated transfers to bypass economy limits or progression.", order: 20 }
    ]
  }
];
