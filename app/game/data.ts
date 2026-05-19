export type ItemRarity = 'common' | 'rare' | 'legendary';
export type Difficulty = 'hardcore' | 'normal' | 'rookie';
export type ClientPatience = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type ClientBudget = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type ClientPersonality = 'aggressive' | 'skeptical' | 'friendly' | 'impulsive' | 'stubborn';

export interface Item {
  id: string;
  name: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  rarity: ItemRarity;
  emoji: string;
  category: 'goods' | 'luxury' | 'contraband' | 'tech';
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  avatar: string;
  personality: string;
  preferredItems: string[];
  reputationRequired: number;
  dialogues: { greeting: string; interested: string; rejected: string; deal: string };
}

export interface Client {
  id: string;
  name: string;
  title: string;
  avatar: string;
  patience: ClientPatience;
  budget: ClientBudget;
  personality: ClientPersonality;
  preferredItems: string[];
  pitchLines: string[];
}

export interface Scammer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  pitchText: string;
  tells: string[];
  targetItems: string[];
  offerMultiplier: number;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  value: number;
  requiredCharisma: number;
  emoji: string;
  category: string;
  negotiationText: string;
  signingText: string;
}

export interface Pitch {
  id: string;
  npcId: string;
  itemId: string;
  basePrice: number;
  negotiationRounds: number;
  successBonus: number;
  description: string;
}

export interface BossAbility {
  id: string;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
}

// ─── ITEMS (20 total) ───────────────────────────────────────────────────────

export const ITEMS: Item[] = [
  {
    id: 'samsung_tv',
    name: 'Samsung 65" TV',
    description: 'Pristine condition. Originally from Russia. No questions.',
    buyPrice: 150000, sellPrice: 220000, rarity: 'common', emoji: '📺', category: 'goods',
  },
  {
    id: 'kazakh_vodka',
    name: 'Nomad Gold Vodka',
    description: 'Premium blend, distilled on the steppe. Actual gold flakes inside.',
    buyPrice: 8000, sellPrice: 15000, rarity: 'common', emoji: '🍾', category: 'goods',
  },
  {
    id: 'iphone_grey',
    name: 'iPhone 16 Pro (Grey Market)',
    description: 'Came off a truck. Works perfectly. Probably.',
    buyPrice: 180000, sellPrice: 260000, rarity: 'rare', emoji: '📱', category: 'tech',
  },
  {
    id: 'designer_bag',
    name: 'Gucci Handbag (Parallel Import)',
    description: 'Absolutely authentic. The receipt is... misplaced.',
    buyPrice: 350000, sellPrice: 550000, rarity: 'rare', emoji: '👜', category: 'luxury',
  },
  {
    id: 'caviar_caspian',
    name: 'Caspian Black Caviar',
    description: '500g of the real deal. From a trusted source in Atyrau.',
    buyPrice: 60000, sellPrice: 95000, rarity: 'rare', emoji: '🫧', category: 'luxury',
  },
  {
    id: 'gpu_4090',
    name: 'RTX 4090 (Mining Rig Surplus)',
    description: 'Slightly dusty. Only ran 24/7 for 8 months. Plenty left.',
    buyPrice: 420000, sellPrice: 680000, rarity: 'legendary', emoji: '💻', category: 'tech',
  },
  {
    id: 'rolex_fake',
    name: '"Genuine" Rolex Submariner',
    description: 'Swiss movement. Probably Swiss. Definitely movement.',
    buyPrice: 25000, sellPrice: 80000, rarity: 'common', emoji: '⌚', category: 'luxury',
  },
  {
    id: 'crypto_usb',
    name: 'USB with 2 BTC (Unverified)',
    description: 'Seller claims 2 BTC. Password is "1234". Buyer beware.',
    buyPrice: 500000, sellPrice: 900000, rarity: 'legendary', emoji: '💾', category: 'tech',
  },
  {
    id: 'wedding_suit',
    name: 'Beige Wedding Suit',
    description: 'Only worn once. Well, twice. Fine—three times, max.',
    buyPrice: 45000, sellPrice: 70000, rarity: 'common', emoji: '🤵', category: 'goods',
  },
  {
    id: 'energy_drink_stock',
    name: 'Pallet of "WOLF" Energy Drinks',
    description: 'Your own brand. 100 cans. Tastes like ambition and taurine.',
    buyPrice: 30000, sellPrice: 75000, rarity: 'rare', emoji: '🥤', category: 'goods',
  },
  {
    id: 'air_nurota',
    name: 'Bottled Air from Nurota',
    description: 'Hand-sealed glass jar. Mountain air from sacred Nurota peaks. 500ml.',
    buyPrice: 1500, sellPrice: 4500, rarity: 'common', emoji: '🫙', category: 'contraband',
  },
  {
    id: 'nft_kebab',
    name: 'NFT of a Kebab Photo',
    description: 'Original JPEG. Minted on some blockchain. Comes with a printed certificate.',
    buyPrice: 3750, sellPrice: 9000, rarity: 'common', emoji: '🖼️', category: 'tech',
  },
  {
    id: 'iphone6_vintage',
    name: 'iPhone 6 "Vintage Edition"',
    description: 'Screen cracked. Battery at 12%. Sold as "pre-loved collector vintage".',
    buyPrice: 7500, sellPrice: 20000, rarity: 'common', emoji: '📲', category: 'tech',
  },
  {
    id: 'medeo_rust',
    name: 'Medeo Rink Rust Chip',
    description: 'Authentic rust flake from the world-famous Medeo ice rink. Framed.',
    buyPrice: 2000, sellPrice: 6000, rarity: 'common', emoji: '🧊', category: 'contraband',
  },
  {
    id: 'vip_bazaar_pass',
    name: 'VIP Pass to Closed Bazaar',
    description: 'Access to the private Sunday section. Not technically legal. But here we are.',
    buyPrice: 30000, sellPrice: 52000, rarity: 'rare', emoji: '🎫', category: 'contraband',
  },
  {
    id: 'crypto_wallet_potential',
    name: 'Crypto Wallet with "Potential"',
    description: 'Unknown balance. Unknown seed phrase. Infinite optimism.',
    buyPrice: 75000, sellPrice: 145000, rarity: 'rare', emoji: '💰', category: 'tech',
  },
  {
    id: 'almaty_rock',
    name: 'Certified Almaty Mountain Rock',
    description: 'Polished stone from the Tian Shan mountains. Certificate of origin included (printed at home).',
    buyPrice: 750, sellPrice: 3500, rarity: 'common', emoji: '🪨', category: 'contraband',
  },
  {
    id: 'dimash_photo',
    name: '"Signed" Dimash Kudaibergen Photo',
    description: 'Personally signed. By a cousin who has the same handwriting.',
    buyPrice: 10000, sellPrice: 28000, rarity: 'rare', emoji: '🎤', category: 'luxury',
  },
  {
    id: 'startup_equity',
    name: 'Failed Startup Equity Token',
    description: '"Just ₸15,000 for a founder stake!" The startup makes... nothing, currently.',
    buyPrice: 15000, sellPrice: 35000, rarity: 'rare', emoji: '📋', category: 'tech',
  },
  {
    id: 'shymkent_honey',
    name: 'Vintage Shymkent Honey',
    description: '"Best before 2019" but honey never expires, technically. Rich amber. Chunky.',
    buyPrice: 4000, sellPrice: 10000, rarity: 'common', emoji: '🍯', category: 'goods',
  },
];

// ─── EXISTING NPCs (for outgoing pitches) ──────────────────────────────────

export const NPCS: NPC[] = [
  {
    id: 'aibek', name: 'Aibek Dzhaksybekov', title: 'Bazaar King of Baraholka', avatar: '👴',
    personality: 'Shrewd, old-school, respects those who know their worth',
    preferredItems: ['kazakh_vodka', 'samsung_tv', 'wedding_suit'], reputationRequired: 0,
    dialogues: {
      greeting: 'Ata, young wolf. What do you bring to my bazaar today?',
      interested: 'Hmm. My nephew sells the same for 10% less. But I like your face.',
      rejected: 'Come back with something real. This is Baraholka, not an Instagram shop.',
      deal: 'Done. Tell no one what you paid. Seriously. NO ONE.',
    },
  },
  {
    id: 'gulnara', name: 'Gulnara Bekova', title: 'Instagram Influencer & Entrepreneur', avatar: '💁',
    personality: 'Flashy, status-conscious, obsessed with luxury brands',
    preferredItems: ['designer_bag', 'rolex_fake', 'iphone_grey'], reputationRequired: 10,
    dialogues: {
      greeting: 'OMG hi! Is that Gucci? My followers would DIE for this.',
      interested: 'I need this for my photoshoot tomorrow. How much? Is it authentic?',
      rejected: "If my followers find out it's fake, I'm cancelled. Hard pass.",
      deal: 'Perfect! Tag my page when you post. @GulnaraLux. Lowercase L.',
    },
  },
  {
    id: 'ruslan', name: 'Ruslan "The Consultant" Mamytov', title: 'Tech Broker & Crypto Evangelist', avatar: '🧔',
    personality: 'Hyperactive, tech-obsessed, speaks in buzzwords',
    preferredItems: ['gpu_4090', 'iphone_grey', 'crypto_usb'], reputationRequired: 25,
    dialogues: {
      greeting: 'Bro! Just got off a Zoom with Singapore. What do you have? Quick.',
      interested: 'The margins on this are INSANE. My farm needs exactly this.',
      rejected: "The ROI doesn't stack up. Come back with specs.",
      deal: "Transferred. Sending USDT. Ignore the gas fees.",
    },
  },
  {
    id: 'bakhyt', name: 'Bakhyt Omarov', title: 'Restaurant Mogul & Caviar Connoisseur', avatar: '👨‍🍳',
    personality: 'Refined, demanding, buys only top quality',
    preferredItems: ['caviar_caspian', 'kazakh_vodka', 'energy_drink_stock'], reputationRequired: 20,
    dialogues: {
      greeting: "My friend! Tables full of Astana's finest await the best.",
      interested: 'This could work for my new tasting menu. Presentation must be perfect.',
      rejected: 'My chef would quit if I served this. I have standards.',
      deal: 'Excellent. Delivered by Friday. We do not do late here.',
    },
  },
  {
    id: 'svetlana', name: 'Svetlana Kozlova', title: "Deputy Minister's Wife (Allegedly)", avatar: '👩‍💼',
    personality: 'Old money, connected, pays without flinching',
    preferredItems: ['designer_bag', 'caviar_caspian', 'rolex_fake'], reputationRequired: 40,
    dialogues: {
      greeting: 'My husband says I spend too much. What do you have to prove him right?',
      interested: 'I saw this same piece in Dubai for triple the price.',
      rejected: 'Bring me something worthy of my collection. This is below me.',
      deal: "Wonderful. Send the invoice to the ministry. They'll know which one.",
    },
  },
];

// ─── CLIENTS (15 total) – for incoming pitches ─────────────────────────────

export const CLIENTS: Client[] = [
  {
    id: 'startup_bro', name: 'Aslan Startup Bro', title: 'CEO/Founder/Visionary', avatar: '🧑‍💻',
    patience: 'high', budget: 'low', personality: 'impulsive',
    preferredItems: ['nft_kebab', 'startup_equity', 'energy_drink_stock', 'iphone6_vintage'],
    pitchLines: [
      "Hey! Love the hustle. We're pre-seed and tight on cash. Founder's rate? We'll give you equity once we raise. Disrupting the market here.",
      "Bro we're building the next Kaspi. Just need this for the office. Startup discount? Future unicorn, bro.",
    ],
  },
  {
    id: 'office_plankton', name: 'Erlan Office Plankton', title: 'Middle Manager, 3rd Floor', avatar: '👔',
    patience: 'medium', budget: 'medium', personality: 'skeptical',
    preferredItems: ['samsung_tv', 'iphone_grey', 'wedding_suit', 'kazakh_vodka'],
    pitchLines: [
      "Hello. I need this for my office. My accounting dept. approved the budget. Can you invoice it as 'IT consulting services'? My manager needs receipts.",
      "Good day. Our department needs this. Can you provide a proper tax invoice? Also do you have a legal entity registered? Procurement requires it.",
    ],
  },
  {
    id: 'aghashka', name: 'Aghashka Seitkali', title: 'Respected Elder, Alatau District', avatar: '🧓',
    patience: 'low', budget: 'high', personality: 'stubborn',
    preferredItems: ['kazakh_vodka', 'caviar_caspian', 'samsung_tv', 'shymkent_honey'],
    pitchLines: [
      "Come on, enough talk. Name your price. My driver is outside. I don't have all day for negotiations, bala.",
      "Less talking, more doing. Price? Final? Good. Wrap it up. My nephew is getting married. I need this today.",
    ],
  },
  {
    id: 'instagram_influencer', name: 'Ayana (@glamouralmaty)', title: 'Content Creator / Lifestyle Brand', avatar: '🤳',
    patience: 'very_low', budget: 'medium', personality: 'impulsive',
    preferredItems: ['designer_bag', 'rolex_fake', 'dimash_photo', 'iphone_grey'],
    pitchLines: [
      "This would be SO perfect for my Reels! I have 80K followers. That exposure is worth ₸200K easily. Tag deal? Or cost price?",
      "OMG I need this for a collab post. My engagement rate is 8%. Industry benchmark is 3%. You'd be crazy not to do a trade deal with me.",
    ],
  },
  {
    id: 'bai_market', name: 'Bai Yergebekov', title: 'Market Mogul of Almaty South', avatar: '🧔‍♂️',
    patience: 'high', budget: 'very_high', personality: 'aggressive',
    preferredItems: ['samsung_tv', 'gpu_4090', 'designer_bag', 'crypto_usb'],
    pitchLines: [
      "You have good stuff, I'll say that. My contact in Shymkent brings the same 15% cheaper. But you're local. Add delivery and I'll pay full price.",
      "Hmm. I know this market. Your margin is at least 30%. Let's be honest with each other and meet in the middle. I buy in volume.",
    ],
  },
  {
    id: 'expat_lost', name: 'Kevin (The Expat)', title: 'Software Engineer / Permanently Confused', avatar: '🌍',
    patience: 'medium', budget: 'medium', personality: 'friendly',
    preferredItems: ['kazakh_vodka', 'almaty_rock', 'air_nurota', 'medeo_rust'],
    pitchLines: [
      "Hi, sorry, my Russian isn't great. Is this the real price? In Germany this would cost triple. Do you accept card? What's the warranty?",
      "Oh wow, authentic Almaty souvenirs! My colleagues back home will love this. Is there a returns policy? And do you have an English receipt?",
    ],
  },
  {
    id: 'gov_worker', name: 'Darkhan (Gov. Employee)', title: 'Dept. of Procurement, Ministry #4', avatar: '🏛️',
    patience: 'high', budget: 'medium', personality: 'skeptical',
    preferredItems: ['samsung_tv', 'iphone_grey', 'kazakh_vodka', 'energy_drink_stock'],
    pitchLines: [
      "I need this, but my dept. won't approve a supplier without proper documentation. Can you be an official vendor? I'll buy 10 units next quarter.",
      "Official business. I need an invoice, a certificate of origin, and your business registration number. Then we can talk price.",
    ],
  },
  {
    id: 'wedding_planner', name: 'Aigul Wedding Planner', title: 'Events Director (Panicking)', avatar: '💒',
    patience: 'very_low', budget: 'very_high', personality: 'impulsive',
    preferredItems: ['designer_bag', 'rolex_fake', 'wedding_suit', 'caviar_caspian'],
    pitchLines: [
      "The wedding is in THREE DAYS. I need it NOW. Price is secondary. Can you deliver TODAY? Today! Not tomorrow. Today!",
      "Don't negotiate with me, I don't have time! Name a price, I'll pay it! The bride's mother is calling me every hour!",
    ],
  },
  {
    id: 'crypto_bek', name: 'Bekzat Cryptobek', title: 'DeFi Maximalist / Yield Farmer', avatar: '⛏️',
    patience: 'low', budget: 'high', personality: 'impulsive',
    preferredItems: ['gpu_4090', 'crypto_usb', 'crypto_wallet_potential', 'nft_kebab'],
    pitchLines: [
      "Bro, I'll pay in USDT, no bank involved. Market's up 40% this week. Perfect moment. You accept crypto, right? Please say yes.",
      "Cash is dead, bro. USDT? BNB? I've got everything. This item fits perfectly in my yield farming strategy. Quick deal?",
    ],
  },
  {
    id: 'biz_student', name: 'Nurlan (MBA Student)', title: 'Future Billionaire, Currently Broke', avatar: '📚',
    patience: 'high', budget: 'low', personality: 'friendly',
    preferredItems: ['startup_equity', 'nft_kebab', 'almaty_rock', 'air_nurota'],
    pitchLines: [
      "Um, I'm writing a business school case study. Could I buy this at academic discount? I'll mention you positively in the paper.",
      "For my marketing class I need to analyze this product. Student price? I'll give you a really positive review on 2GIS.",
    ],
  },
  {
    id: 'dubai_diaspora', name: 'Arman (Just Back from Dubai)', title: 'Kazakhstani Diaspora, Dubai Branch', avatar: '✈️',
    patience: 'very_low', budget: 'very_high', personality: 'aggressive',
    preferredItems: ['designer_bag', 'caviar_caspian', 'rolex_fake', 'kazakh_vodka'],
    pitchLines: [
      "In Dubai this costs triple. I'm visiting family and need to stock up. Best price for three? I fly back Sunday.",
      "Listen, I know the international prices. You're doing me a favor and I'm doing you a favor. Deal for five units, right now.",
    ],
  },
  {
    id: 'baraholka_veteran', name: 'Uncle Marat', title: 'Baraholka Legend Since 1993', avatar: '🛒',
    patience: 'very_high', budget: 'medium', personality: 'stubborn',
    preferredItems: ['wedding_suit', 'kazakh_vodka', 'samsung_tv', 'shymkent_honey'],
    pitchLines: [
      "I've been buying here since before you were born. My usual guy raised prices. Impress me and I'll bring steady business.",
      "Young man. I respect hard work. I'll pay fair price. Not a tenge more, not a tenge less. Fair is fair.",
    ],
  },
  {
    id: 'tech_officer', name: 'IT Manager Zhanar', title: 'Head of IT, Unnamed Corporation', avatar: '👩‍💼',
    patience: 'high', budget: 'high', personality: 'skeptical',
    preferredItems: ['iphone_grey', 'gpu_4090', 'samsung_tv', 'iphone6_vintage'],
    pitchLines: [
      "We need 5 units for the office. I have a purchase order. Please send specs, warranty, and tax invoice. Two weeks for procurement approval.",
      "Corporate purchasing. Needs to go through proper channels. Do you have ISO certification? No? Can you get one?",
    ],
  },
  {
    id: 'wedding_mom', name: 'Proud Mama Raushan', title: 'Mother of the Groom, Season One', avatar: '🤱',
    patience: 'low', budget: 'high', personality: 'impulsive',
    preferredItems: ['wedding_suit', 'designer_bag', 'rolex_fake', 'caviar_caspian'],
    pitchLines: [
      "My only son is getting married! He deserves the best! Money is not important! Is it the best? Good. I'll take two.",
      "The bride's family is very important. They must see we have class. The most expensive, please. Don't show me the cheap ones.",
    ],
  },
  {
    id: 'restaurant_owner', name: 'Serikbol (Small Restaurant)', title: 'Owner, "Dastarkhan Plus"', avatar: '🍽️',
    patience: 'medium', budget: 'medium', personality: 'friendly',
    preferredItems: ['caviar_caspian', 'kazakh_vodka', 'energy_drink_stock', 'shymkent_honey'],
    pitchLines: [
      "Business is slow this year. Half upfront, rest by Friday? I always pay - ask anyone at the market. Man of my word.",
      "I take good care of my suppliers. Steady orders, every week. Not big money now, but reliable. That's worth something, yes?",
    ],
  },

  // ─── 30 NEW CLIENTS ────────────────────────────────────────────────────────

  // AGGRESSIVE (6)
  {
    id: 'daniyar_dostyk', name: 'Daniyar (Dostyk Plaza)', title: 'Real Estate Developer', avatar: '💼',
    patience: 'low', budget: 'very_high', personality: 'aggressive',
    preferredItems: ['designer_bag', 'rolex_fake', 'gpu_4090', 'crypto_usb'],
    pitchLines: [
      "I've built three towers in this city. I don't negotiate — I acquire. Offer me your lowest, or don't waste my PA's time.",
      "My accountant has ₸2M earmarked for this quarter. Surprise me with a number that isn't an insult.",
    ],
  },
  {
    id: 'shady_bek', name: 'Shady Reseller Bek', title: 'Grey Market Operator', avatar: '🕶️',
    patience: 'low', budget: 'medium', personality: 'aggressive',
    preferredItems: ['samsung_tv', 'iphone_grey', 'kazakh_vodka', 'vip_bazaar_pass'],
    pitchLines: [
      "I know your supplier. I know your margins. Don't try to play me. Give me the real price, the one before the markup.",
      "I move 50 units a week. You give me a good price, I give you volume. You give me a bad price, I go to your competitor. Simple.",
    ],
  },
  {
    id: 'rustem_cars', name: 'Rustem Car Dealer', title: 'Pre-Owned Auto King', avatar: '🚗',
    patience: 'low', budget: 'high', personality: 'aggressive',
    preferredItems: ['samsung_tv', 'gpu_4090', 'iphone_grey', 'energy_drink_stock'],
    pitchLines: [
      "In my lot I have 40 cars. I sell them all by making buyers feel they're getting a deal. Don't try the same trick on me.",
      "Final offer means final offer. I'll say a number once. You think about it. I walk to my G-Wagon. You decide.",
    ],
  },
  {
    id: 'timur_club', name: 'Timur the Club Owner', title: 'Nightlife Entrepreneur', avatar: '🎵',
    patience: 'very_low', budget: 'very_high', personality: 'aggressive',
    preferredItems: ['designer_bag', 'caviar_caspian', 'energy_drink_stock', 'kazakh_vodka'],
    pitchLines: [
      "My club opens in 4 hours. I need this now and I pay cash. Don't mention delivery times or I find someone else in 5 minutes.",
      "Opening night. VIP table. Everything must be perfect. Price is not the issue. Speed is the issue. Can you deliver or not?",
    ],
  },
  {
    id: 'yermek_jewelry', name: 'Yermek the Jeweler', title: 'Owner, Zhetysu Gold & Gems', avatar: '💎',
    patience: 'medium', budget: 'high', personality: 'aggressive',
    preferredItems: ['rolex_fake', 'designer_bag', 'dimash_photo', 'caviar_caspian'],
    pitchLines: [
      "I have an eye trained by 20 years in the trade. I see what things are worth. Your price has exactly 30% markup. I'll pay cost plus 10.",
      "Every piece in my shop, I bought at the right price. I'm not starting a different tradition with you. Be realistic.",
    ],
  },
  {
    id: 'sergey_construction', name: 'Sergey (Construction)', title: 'Construction Mogul', avatar: '👷',
    patience: 'low', budget: 'very_high', personality: 'aggressive',
    preferredItems: ['samsung_tv', 'gpu_4090', 'wedding_suit', 'kazakh_vodka'],
    pitchLines: [
      "I build things. Big things. When I want something, I buy it. When someone wastes my time with games, I build my own.",
      "My site manager just told me you're the third stall today trying to sell this. So I know the market price. Come correct.",
    ],
  },

  // SKEPTICAL (6)
  {
    id: 'banker_kanat', name: 'Banker Kanat', title: 'Head of Corporate Credit, Halyk', avatar: '🏦',
    patience: 'high', budget: 'very_high', personality: 'skeptical',
    preferredItems: ['iphone_grey', 'samsung_tv', 'startup_equity', 'crypto_wallet_potential'],
    pitchLines: [
      "Before I decide, I need documentation. Origin, condition report, comparable market sales. I have a process. Let's follow it.",
      "I financed half the buildings in this district. Every deal I've ever done, I analyzed first. This one is no different.",
    ],
  },
  {
    id: 'accountant_zhuldyz', name: 'Accountant Zhuldyz', title: 'Head of Finance, SME Division', avatar: '📊',
    patience: 'high', budget: 'medium', personality: 'skeptical',
    preferredItems: ['iphone6_vintage', 'nft_kebab', 'almaty_rock', 'startup_equity'],
    pitchLines: [
      "I have a spreadsheet open right now showing the real market price of this item. Your number is... interesting. Explain it.",
      "Every tenge I spend has a justification column. Help me fill it in correctly, and we have a deal. Otherwise, I need a receipt.",
    ],
  },
  {
    id: 'dauren_customs', name: 'Customs Inspector Dauren', title: 'Senior Inspector, Almaty Checkpoint', avatar: '🔍',
    patience: 'high', budget: 'medium', personality: 'skeptical',
    preferredItems: ['kazakh_vodka', 'wedding_suit', 'shymkent_honey', 'samsung_tv'],
    pitchLines: [
      "In my job I see everything pass through. I know what's legitimate and what isn't. I'm buying, not inspecting. But old habits.",
      "I've seen 'authentic' and 'genuine' stamps on boxes that were printed the same morning. Impress me with facts, not adjectives.",
    ],
  },
  {
    id: 'askar_military', name: 'Retired Colonel Askar', title: 'Ex-Military, Now Consults', avatar: '🎖️',
    patience: 'high', budget: 'high', personality: 'skeptical',
    preferredItems: ['samsung_tv', 'kazakh_vodka', 'wedding_suit', 'caviar_caspian'],
    pitchLines: [
      "I spent 30 years evaluating intelligence reports. I can tell immediately when someone is padding information. Don't pad.",
      "State your specifications. State your price. Give me one reason to choose you over the man at the next stall. One reason only.",
    ],
  },
  {
    id: 'mira_trade', name: 'Trade Analyst Mira', title: 'Import/Export Market Intelligence', avatar: '📈',
    patience: 'high', budget: 'high', personality: 'skeptical',
    preferredItems: ['gpu_4090', 'iphone_grey', 'designer_bag', 'crypto_wallet_potential'],
    pitchLines: [
      "I track 200 SKUs across Kazakhstan, Russia, and China. I know what this costs landed in Almaty. Your margin is visible to me.",
      "I don't buy based on pitch. I buy based on value. Show me the value. Not the story. The value.",
    ],
  },
  {
    id: 'alisher_security', name: 'IT Security Expert Alisher', title: 'Cybersecurity Consultant', avatar: '🔐',
    patience: 'very_high', budget: 'high', personality: 'skeptical',
    preferredItems: ['gpu_4090', 'crypto_usb', 'crypto_wallet_potential', 'iphone_grey'],
    pitchLines: [
      "I verify everything before trusting it. Firmware, provenance, hash of the contents if digital. We can do this the fast way or the right way.",
      "Your pitch sounds good. That's actually a red flag. Good pitches are engineered. Give me the boring technical specs instead.",
    ],
  },

  // FRIENDLY (6)
  {
    id: 'dana_blogger', name: 'Dana (@danadreams)', title: 'Lifestyle Content Creator', avatar: '🌸',
    patience: 'medium', budget: 'medium', personality: 'friendly',
    preferredItems: ['designer_bag', 'rolex_fake', 'dimash_photo', 'iphone_grey'],
    pitchLines: [
      "Oh this is SO cute! My followers would honestly love this. I'm on a little budget this month but maybe we can work something out?",
      "I'm not rich or anything but I save up for things I really want. This is one of those. Can we find a price that works for both?",
    ],
  },
  {
    id: 'rakhmet_pensioner', name: 'Rakhmet-ata', title: 'Retired Schoolteacher, 38 Years', avatar: '👴',
    patience: 'high', budget: 'very_low', personality: 'friendly',
    preferredItems: ['kazakh_vodka', 'shymkent_honey', 'samsung_tv', 'wedding_suit'],
    pitchLines: [
      "My pension is small, but I always managed to find what I needed here in Baraholka. You remind me of my former students. Good face.",
      "My grandson's wedding is next month. I want to give something meaningful. I don't have much but what I have, I give honestly.",
    ],
  },
  {
    id: 'saltanat_teacher', name: 'Teacher Saltanat', title: 'Secondary School, Physics Dept.', avatar: '📚',
    patience: 'high', budget: 'low', personality: 'friendly',
    preferredItems: ['iphone6_vintage', 'almaty_rock', 'nft_kebab', 'air_nurota'],
    pitchLines: [
      "I know teachers don't earn much — you don't have to say it. But I saved three months for this. Is there any flexibility for a regular buyer?",
      "My students think I'm out of touch. I want to surprise them. Within a teacher's budget, obviously. Can you help?",
    ],
  },
  {
    id: 'aigerim_ngo', name: 'Aigerim (NGO)', title: 'Program Officer, Eco-Almaty Foundation', avatar: '🌱',
    patience: 'medium', budget: 'low', personality: 'friendly',
    preferredItems: ['air_nurota', 'almaty_rock', 'startup_equity', 'medeo_rust'],
    pitchLines: [
      "We're a nonprofit. Every tenge we spend on this comes from grant money that was meant for something else. But it's for a good cause!",
      "Our office has literally no budget for this. I'm buying it personally as a gift for our director. Please be kind with the price.",
    ],
  },
  {
    id: 'valentina_babushka', name: 'Valentina-apa', title: 'Retired, Building 14B, Micro-District 8', avatar: '👵',
    patience: 'very_high', budget: 'very_low', personality: 'friendly',
    preferredItems: ['shymkent_honey', 'kazakh_vodka', 'wedding_suit', 'samsung_tv'],
    pitchLines: [
      "I used to buy from your grandfather's stall, or someone like him. Good people here. I have a little saved. What can you do for me?",
      "My daughter told me not to come to the bazaar alone. But here I am! I know what things cost. I just want a fair price, like always.",
    ],
  },
  {
    id: 'gulzat_kinder', name: 'Director Gulzat', title: 'Head of Kindergarten No. 47', avatar: '🏫',
    patience: 'high', budget: 'medium', personality: 'friendly',
    preferredItems: ['energy_drink_stock', 'shymkent_honey', 'samsung_tv', 'almaty_rock'],
    pitchLines: [
      "We're buying for the staff room, not myself. The parents contributed. I want to make sure we get good value for their trust.",
      "Our kindergarten runs on goodwill. I try to pass that on when I shop. Honest price, honest deal, everyone happy. Yes?",
    ],
  },

  // IMPULSIVE (6)
  {
    id: 'arman_startup', name: 'Startup Arman', title: 'Co-Founder, Pivot #4', avatar: '🚀',
    patience: 'very_low', budget: 'low', personality: 'impulsive',
    preferredItems: ['startup_equity', 'nft_kebab', 'energy_drink_stock', 'iphone6_vintage'],
    pitchLines: [
      "I'm in fundraising mode. Need this for a demo. Yes, I want it. Yes, right now. What's the absolute final price, no games?",
      "Our runway is 3 weeks. Every decision has to be fast. I like this. I'm buying this. Just tell me the number.",
    ],
  },
  {
    id: 'zarina_expat', name: 'Zarina (Back from London)', title: 'Returned Expat, Culture Shock Mode', avatar: '✈️',
    patience: 'low', budget: 'high', personality: 'impulsive',
    preferredItems: ['almaty_rock', 'air_nurota', 'medeo_rust', 'kazakh_vodka'],
    pitchLines: [
      "Oh my god I missed everything here! This is SO Almaty! I'm buying it. Don't even negotiate, I'm buying it right now.",
      "Five years in London and nothing there had this soul. I want 3. For my flat, for my mum, for my old university friend.",
    ],
  },
  {
    id: 'kairat_miner', name: 'Kairat (Crypto Rich)', title: 'Former IT Technician, Now Investor', avatar: '🤑',
    patience: 'very_low', budget: 'very_high', personality: 'impulsive',
    preferredItems: ['gpu_4090', 'crypto_usb', 'crypto_wallet_potential', 'iphone_grey'],
    pitchLines: [
      "My portfolio just hit ₸50M. I buy things I want. I wanted this when I walked past your stall. I still want it. Price?",
      "Last month I missed a deal and regretted it for two weeks. Not doing that again. Final answer: yes. What's your number?",
    ],
  },
  {
    id: 'dina_planner', name: 'Event Planner Dina', title: 'Operations Manager, Panic Mode', avatar: '🎉',
    patience: 'very_low', budget: 'very_high', personality: 'impulsive',
    preferredItems: ['caviar_caspian', 'wedding_suit', 'designer_bag', 'kazakh_vodka'],
    pitchLines: [
      "The event is in 6 hours. Don't talk to me about delivery. I have a car outside. Name the price, I pay, I leave. Now please.",
      "I don't care about the price. My client cares about quality. Is it good? Yes? Take my card. I'm already calling the next supplier.",
    ],
  },
  {
    id: 'serik_husband', name: 'Instagram Husband Serik', title: 'Accompanying Spouse, Resigned to Fate', avatar: '😅',
    patience: 'very_low', budget: 'medium', personality: 'impulsive',
    preferredItems: ['designer_bag', 'rolex_fake', 'dimash_photo', 'iphone_grey'],
    pitchLines: [
      "My wife sent me here with a photo. This is the photo. Is this the item? Great. Price? She said max ₸X. What's your best?",
      "I have 20 minutes before she calls. I don't understand these things, I just pay. Is this the one she wants or not?",
    ],
  },
  {
    id: 'nurgul_telecom', name: 'Manager Nurgul (Telecoms)', title: 'Head of Procurement, Kazakhtelecom', avatar: '📱',
    patience: 'very_low', budget: 'high', personality: 'impulsive',
    preferredItems: ['iphone_grey', 'samsung_tv', 'gpu_4090', 'energy_drink_stock'],
    pitchLines: [
      "I have budget approval until end of quarter. That's 48 hours. I want this item. I am choosing to buy it. Final price?",
      "Corporate process usually takes 3 weeks. I am skipping the process. You benefit from that. Give me the good price.",
    ],
  },

  // STUBBORN (6)
  {
    id: 'aisha_bazaar_queen', name: 'Aisha-apa the Bazaar Queen', title: 'Baraholka Institution Since 1995', avatar: '👑',
    patience: 'very_high', budget: 'very_high', personality: 'stubborn',
    preferredItems: ['samsung_tv', 'designer_bag', 'caviar_caspian', 'kazakh_vodka'],
    pitchLines: [
      "I know this bazaar like my own kitchen. I know what you paid. I know what you need. I'm offering you fair. That's my only offer.",
      "Child, I sold here when your parents were your age. My price is my price. It has been since Tuesday. It will be on Friday.",
    ],
  },
  {
    id: 'alibek_merchant', name: 'Old Merchant Alibek', title: 'Baraholka Trader, Class of 1991', avatar: '🧳',
    patience: 'very_high', budget: 'medium', personality: 'stubborn',
    preferredItems: ['kazakh_vodka', 'wedding_suit', 'samsung_tv', 'shymkent_honey'],
    pitchLines: [
      "I've been buying and selling since before this bazaar had a roof. My offer is based on 30 years of price memory. It's correct.",
      "You can keep talking. I will keep listening. But my number won't change. It never does. This is not stubbornness. This is expertise.",
    ],
  },
  {
    id: 'saule_budget', name: 'Budget Manager Saule', title: 'Corporate Finance Controller', avatar: '📋',
    patience: 'very_high', budget: 'medium', personality: 'stubborn',
    preferredItems: ['iphone6_vintage', 'nft_kebab', 'startup_equity', 'almaty_rock'],
    pitchLines: [
      "The approved budget line for this purchase is ₸X. I cannot go above it. I have tried to go above it. Accounting said no. I say no.",
      "I submitted the purchase request 3 weeks ago. The amount was approved. That amount is what I am paying. Column A, Row 14.",
    ],
  },
  {
    id: 'vitaly_pawnshop', name: 'Pawnshop Owner Vitaly', title: 'Owner, 3 Locations Since 2003', avatar: '🏪',
    patience: 'very_high', budget: 'high', personality: 'stubborn',
    preferredItems: ['rolex_fake', 'crypto_usb', 'gpu_4090', 'designer_bag'],
    pitchLines: [
      "I buy distressed inventory for a living. I know exactly how to value things when someone needs to sell. This is that price.",
      "I've heard every pitch. I've seen every trick. I have a number in my head and it doesn't move. Think about it. I'll be here.",
    ],
  },
  {
    id: 'bolat_gov', name: 'State Buyer Bolat', title: 'Senior Procurement Officer, Ministry', avatar: '🏛️',
    patience: 'very_high', budget: 'medium', personality: 'stubborn',
    preferredItems: ['samsung_tv', 'iphone_grey', 'kazakh_vodka', 'wedding_suit'],
    pitchLines: [
      "Government procurement has a fixed price ceiling for this category. It's set by the committee. I did not set it. I follow it.",
      "The tender document specifies the maximum unit price. I am not authorized to exceed it. That is the price. Not 1 tenge more.",
    ],
  },
  {
    id: 'bakhtiyar_pension', name: 'Pension Fund Bakhtiyar', title: 'Asset Manager, UAPF Department 4', avatar: '📑',
    patience: 'very_high', budget: 'low', personality: 'stubborn',
    preferredItems: ['almaty_rock', 'air_nurota', 'medeo_rust', 'shymkent_honey'],
    pitchLines: [
      "We are a pension fund. Our investment committee approved this specific purchase at this specific amount. It has been documented.",
      "I presented this purchase proposal to the committee three weeks ago. The amount was voted on. Unanimously. That is my offer.",
    ],
  },
];

// ─── SCAMMERS (10 total) – for incoming pitches ────────────────────────────

export const SCAMMERS: Scammer[] = [
  {
    id: 'ali_bek_scammer', name: 'Ali Bek', title: 'Investment Advisor (Self-Proclaimed)', avatar: '🕴️',
    pitchText: "Friend! I have an important client in Moscow who wants exactly this. To secure the deal, I need you to send the item first to my verified delivery address. Payment arrives in 24 hours, guaranteed. Many sellers work with me. Send first, full trust.",
    tells: ['send the item first', 'Send first'],
    targetItems: ['iphone_grey', 'gpu_4090', 'crypto_usb'],
    offerMultiplier: 1.35,
  },
  {
    id: 'daniyar_guru', name: 'Daniyar', title: '"Investment Guru" & Returns Specialist', avatar: '📈',
    pitchText: "Brother, my research shows I can resell this for guaranteed 300% profit. I'll pay 40% above market right now. Zero risk for both of us — guaranteed return. My buyer flies in tonight. This deal expires at 8pm, no time to waste.",
    tells: ['guaranteed 300%', 'guaranteed return', 'Zero risk'],
    targetItems: ['samsung_tv', 'designer_bag', 'rolex_fake'],
    offerMultiplier: 1.4,
  },
  {
    id: 'serik_customs', name: 'Serik', title: 'Customs Agent (Allegedly)', avatar: '🚔',
    pitchText: "Listen, I move goods through customs every day. Great price for you. But I need a small processing fee upfront — just 5% of sale value to handle documentation. After that I pay full remaining amount. Pay the fee first, very standard in import.",
    tells: ['processing fee upfront', 'Pay the fee first'],
    targetItems: ['samsung_tv', 'gpu_4090', 'iphone_grey'],
    offerMultiplier: 1.3,
  },
  {
    id: 'aizat_luxury', name: 'Aizat', title: 'Luxury Reseller & Brand Authenticator', avatar: '💅',
    pitchText: "I run a luxury goods operation, big clients only. I'll pay 60% above market — my only condition: I need you to prepare a certificate of authenticity. You can create one yourself, any format, clients never check these things. Big money, easy job.",
    tells: ['create one yourself', "clients never check"],
    targetItems: ['designer_bag', 'rolex_fake', 'caviar_caspian'],
    offerMultiplier: 1.6,
  },
  {
    id: 'bolat_collector', name: 'Bolat', title: 'Rare Item Collector (Very Urgent)', avatar: '🏃',
    pitchText: "URGENT! I'm a serious collector and I NEED this immediately! I'll pay double — but you must decide THIS SECOND. My driver is outside. This offer disappears in 5 minutes! No time to think! My flight is tonight!",
    tells: ['you must decide THIS SECOND', 'No time to think', 'disappears in 5 minutes'],
    targetItems: ['crypto_usb', 'medeo_rust', 'air_nurota', 'almaty_rock'],
    offerMultiplier: 2.0,
  },
  {
    id: 'miras_blockchain', name: 'Miras', title: 'Blockchain Developer / Web3 Visionary', avatar: '⛓️',
    pitchText: "My smart contract system requires a small verification deposit before the purchase — just 3% of item value, returned automatically after blockchain confirmation. Totally standard Web3 protocol. No human involvement. Deposit first, instant return.",
    tells: ['verification deposit', 'Deposit first'],
    targetItems: ['crypto_wallet_potential', 'nft_kebab', 'startup_equity', 'crypto_usb'],
    offerMultiplier: 1.45,
  },
  {
    id: 'nurbek_broker', name: 'Nurbek', title: 'International Export Broker', avatar: '🌐',
    pitchText: "I export legally to UAE and Turkey, great prices. To process your international wire transfer, I need your bank account number and card details. Very secure, encrypted system of course. Standard procedure for international business. Totally safe.",
    tells: ['I need your bank account number', 'card details'],
    targetItems: ['designer_bag', 'caviar_caspian', 'kazakh_vodka'],
    offerMultiplier: 1.5,
  },
  {
    id: 'gulsanam_designer', name: 'Gulsanam', title: 'Interior Designer for Billionaires', avatar: '🎨',
    pitchText: "I'm staging a luxury apartment for an important client. This is PERFECT. Let me take it for a 3-day trial period to photograph in the space. If client approves, I pay immediately. If not, I return it in perfect condition. Interior design always works this way.",
    tells: ['3-day trial period', 'I return it'],
    targetItems: ['samsung_tv', 'designer_bag', 'rolex_fake'],
    offerMultiplier: 1.25,
  },
  {
    id: 'zhandos_agent', name: 'Zhandos', title: 'Celebrity Sports Agent', avatar: '🏆',
    pitchText: "My athlete client would love this item for personal branding. Instead of cash upfront, I propose a revenue sharing arrangement — 60% of future brand deal profits, no immediate payment needed. No cash needed today, huge upside later. Sign here.",
    tells: ['no immediate payment needed', 'No cash needed today', 'revenue sharing arrangement'],
    targetItems: ['rolex_fake', 'dimash_photo', 'energy_drink_stock'],
    offerMultiplier: 1.3,
  },
  {
    id: 'kamila_social', name: 'Kamila', title: 'Social Media Manager (2M Followers Combined)', avatar: '📱',
    pitchText: "I manage 12 influencer accounts, 2 million followers total. I'll give this item maximum exposure — 10 posts, 5 stories, one TikTok. That's worth ₸500K in advertising easy. You're basically making money. So can I have it at cost price? Or free would be better.",
    tells: ['at cost price', 'Or free would be better'],
    targetItems: ['iphone_grey', 'designer_bag', 'energy_drink_stock'],
    offerMultiplier: 1.2,
  },
];

// ─── CONTRACTS (8 total) ────────────────────────────────────────────────────

export const CONTRACTS: Contract[] = [
  {
    id: 'nft_platform', title: 'NFT Platform Co-Founder Deal',
    description: 'FakeArt.kz wants a "technical co-founder" who provides initial inventory. No coding required.',
    value: 300000, requiredCharisma: 10, emoji: '🎨', category: 'tech',
    negotiationText: '"Our platform launches next month. We need a co-founder who can supply unique items. Think of yourself as the inventory layer of a DAO."',
    signingText: 'You signed. FakeArt.kz is officially your company. Congratulations on owning 2% of nothing.',
  },
  {
    id: 'almaty_air_distribution', title: 'Exclusive Almaty Air Distribution',
    description: 'Distribute "Almaty Premium Air" to tourist shops across the city. 3-month exclusivity.',
    value: 750000, requiredCharisma: 20, emoji: '✈️', category: 'goods',
    negotiationText: '"The Japanese market pays €40 per jar. We need a distribution partner in Almaty who understands the premium air segment. That is you."',
    signingText: 'Signed. You are now the exclusive distributor of bottled mountain air. Your family has questions.',
  },
  {
    id: 'ministry_supplier', title: 'VIP Ministry Canteen Supplier',
    description: 'Supply premium goods to an unnamed government ministry canteen. High volume, zero questions asked.',
    value: 600000, requiredCharisma: 25, emoji: '🏛️', category: 'goods',
    negotiationText: '"We need a reliable supplier. Discretion is essential. The minister likes good vodka and the deputy likes caviar. You supply, we pay. Simple."',
    signingText: 'Contract signed in an unmarked envelope. You are now a government supplier. Do not tell your mother.',
  },
  {
    id: 'vodka_license', title: 'Exclusive Vodka Import License (Shadow)',
    description: 'Become the shadow importer for "Nomad Gold" across three oblasts. Parallel channels only.',
    value: 900000, requiredCharisma: 35, emoji: '🍾', category: 'goods',
    negotiationText: '"Official importers pay 40% in taxes. We pay zero. Our clients are discreet. You move the product, we handle logistics, you keep 60% margin. Deal?"',
    signingText: 'You are now in the vodka business. Three oblasts. Your accountant has gone quiet.',
  },
  {
    id: 'shady_bazaar', title: 'Silent Partner: Shady Sunday Bazaar',
    description: 'Become a 30% silent partner in the Shady Sunday Bazaar. Monthly dividends. Minimal questions.',
    value: 1200000, requiredCharisma: 40, emoji: '🏪', category: 'contraband',
    negotiationText: '"The bazaar generates ₸4M per month. We need a silent investor for the expansion. 30% equity. No name on the doors. Monthly envelope."',
    signingText: 'You are now a bazaar partner. An envelope arrives every first Sunday. Nobody asks whose money it was.',
  },
  {
    id: 'shymkent_franchise', title: 'Shymkent Shadow Franchise Rights',
    description: 'Exclusive trading franchise rights for the Shymkent underground market. 2-year term.',
    value: 800000, requiredCharisma: 45, emoji: '🏢', category: 'contraband',
    negotiationText: '"Shymkent is untapped. The right operator could make ₸3M a year. We\'re offering you the franchise. Non-refundable setup cost applies. Interested?"',
    signingText: 'You now have Shymkent rights. A contact there will call you from an unknown number. Answer it.',
  },
  {
    id: 'blockchain_partnership', title: '"FakeChain.kz" Blockchain Partnership',
    description: 'Be the "Official Kazakhstan Partner" for a Dubai-registered blockchain startup. Mostly involves attending launch events.',
    value: 450000, requiredCharisma: 15, emoji: '🔗', category: 'tech',
    negotiationText: '"We are disrupting Kazakhstan finance. We need a local face. You attend two events per month, hold some tokens, get paid. Very modern business."',
    signingText: 'You are the official Kazakhstan face of FakeChain.kz. Your LinkedIn has 200 new connections from Dubai.',
  },
  {
    id: 'dubai_alliance', title: 'Dubai Strategic Trading Alliance',
    description: 'Full alliance with a major Dubai trading house. Access to exclusive goods channels. 6-month exclusivity.',
    value: 1500000, requiredCharisma: 50, emoji: '🌴', category: 'luxury',
    negotiationText: '"Our group moves ₸100M per month across 7 countries. We want Kazakhstan covered. You are the face. We provide the goods. You keep 15% of all transactions. Deal?"',
    signingText: 'Alliance signed in Dubai (you were on a video call). A man named "Ali" will contact you. He is reliable. Mostly.',
  },
];

// ─── OUTGOING PITCHES (to NPCs) ────────────────────────────────────────────

export const PITCHES: Pitch[] = [
  {
    id: 'pitch_tv_aibek', npcId: 'aibek', itemId: 'samsung_tv',
    basePrice: 200000, negotiationRounds: 3, successBonus: 15000,
    description: 'Aibek wants a TV for the bazaar break room. Negotiate hard.',
  },
  {
    id: 'pitch_bag_gulnara', npcId: 'gulnara', itemId: 'designer_bag',
    basePrice: 520000, negotiationRounds: 2, successBonus: 30000,
    description: "Gulnara needs a bag for a sponsorship post. She'll pay—if she's impressed.",
  },
  {
    id: 'pitch_gpu_ruslan', npcId: 'ruslan', itemId: 'gpu_4090',
    basePrice: 650000, negotiationRounds: 4, successBonus: 50000,
    description: 'Ruslan wants GPUs for his mining op. He knows the market.',
  },
  {
    id: 'pitch_caviar_bakhyt', npcId: 'bakhyt', itemId: 'caviar_caspian',
    basePrice: 90000, negotiationRounds: 2, successBonus: 10000,
    description: 'Bakhyt needs caviar for his weekend menu. Quality is non-negotiable.',
  },
  {
    id: 'pitch_rolex_svetlana', npcId: 'svetlana', itemId: 'rolex_fake',
    basePrice: 75000, negotiationRounds: 1, successBonus: 20000,
    description: "Svetlana wants a watch as a gift. Don't mention it's not real.",
  },
  {
    id: 'pitch_crypto_ruslan', npcId: 'ruslan', itemId: 'crypto_usb',
    basePrice: 850000, negotiationRounds: 3, successBonus: 80000,
    description: 'The USB with mystery BTC. Ruslan is suspicious but tempted.',
  },
  {
    id: 'pitch_energy_bakhyt', npcId: 'bakhyt', itemId: 'energy_drink_stock',
    basePrice: 68000, negotiationRounds: 2, successBonus: 12000,
    description: 'Pitch your WOLF energy drink to Bakhyt for his late-night bar.',
  },
  {
    id: 'pitch_iphone_gulnara', npcId: 'gulnara', itemId: 'iphone_grey',
    basePrice: 245000, negotiationRounds: 2, successBonus: 18000,
    description: "Gulnara's phone 'broke' suspiciously. She needs an upgrade—now.",
  },
];

// ─── BOSS ───────────────────────────────────────────────────────────────────

export const BOSS = {
  id: 'yerlan_boss',
  name: 'Yerlan "The Godfather" Seitkali',
  title: 'King of Almaty Underground Market',
  avatar: '🦁',
  description: 'The man who controls all grey-market trade in Kazakhstan. He wants to shut you down—or buy you out.',
  maxHp: 100,
  abilities: [
    { id: 'market_manipulation', name: 'Market Manipulation', description: 'Floods the market. -20 HP.', damage: 20, cooldown: 3 },
    { id: 'reputation_attack', name: 'Slander Campaign', description: 'Spreads rumours. -15 HP.', damage: 15, cooldown: 2 },
    { id: 'intimidation', name: 'Personal Visit', description: 'Two large friends say hello. -25 HP.', damage: 25, cooldown: 4 },
  ] as BossAbility[],
  playerAbilities: [
    { id: 'charm', name: 'The Pitch', description: 'Your legendary sales pitch. 20 damage.', damage: 20, cooldown: 1 },
    { id: 'bribe', name: 'Cash Envelope', description: 'Everyone has a price. 35 damage. Costs ₸50k.', damage: 35, cooldown: 2 },
    { id: 'leverage', name: 'I Know People', description: 'Drop names. 30 damage.', damage: 30, cooldown: 2 },
    { id: 'wolf_howl', name: 'Wolf Howl', description: 'The crowd goes wild. 45 damage. Once per fight.', damage: 45, cooldown: 999 },
  ] as BossAbility[],
};

// ─── MISC ───────────────────────────────────────────────────────────────────

export const MARKET_TICKERS = [
  '📈 SAMSUNG_TV: +12% THIS WEEK',
  '📉 VODKA: -5% AFTER HOLIDAY',
  '🔥 IPHONE_GREY: HOT ITEM',
  '⚠️ GPU_SURPLUS: MARKET FLOODED',
  '💎 CAVIAR: PREMIUM DEMAND',
  '🚨 ROLEX_AUTHENTICITY: UNDER REVIEW',
  '🟢 WOLF_ENERGY: LOCAL BUZZ GROWING',
  '💰 DESIGNER_BAGS: GULNARA EFFECT',
  '⚡ BTC_PRICE: VOLATILE',
  '🌿 BARAHOLKA INDEX: STABLE',
  '🫙 NUROTA_AIR: TOURIST SEASON SPIKE',
  '🎨 NFT_KEBAB: DIGITAL ART OR LUNCH?',
  '📲 VINTAGE_IPHONE6: IRONY PREMIUM UP',
  '🧊 MEDEO_RUST: COLLECTORS ACTIVATED',
  '💰 CRYPTO_WALLETS: MYSTERY VALUE SURGES',
];

export const DIFFICULTY_SECONDS: Record<Difficulty, number> = {
  hardcore: 180,
  normal: 300,
  rookie: 600,
};

export const DIFFICULTY_HIGHLIGHTS: Record<Difficulty, number> = {
  hardcore: 0,
  normal: 1,
  rookie: 2,
};

export function getDailyRankTitle(earned: number): string {
  if (earned >= 1_500_000) return 'Wolf of Al-Farabi';
  if (earned >= 800_000) return 'Market Wolf';
  if (earned >= 400_000) return 'Almaty Shark';
  if (earned >= 150_000) return 'Street Operator';
  if (earned >= 50_000) return 'Baraholka Regular';
  return 'Rookie Hustler';
}

export function getLifetimeRankTitle(totalEarned: number): string {
  if (totalEarned >= 5_000_000) return '★★★ GODFATHER OF ALMATY';
  if (totalEarned >= 3_000_000) return '★★★ WOLF OF AL-FARABI';
  if (totalEarned >= 2_000_000) return '★★ ALMATY SHARK';
  if (totalEarned >= 1_000_000) return '★★ STREET WOLF';
  if (totalEarned >= 500_000) return '★ BAZAAR SHARK';
  if (totalEarned >= 200_000) return '★ MARKET HUSTLER';
  return '◦ ROOKIE PEDDLER';
}

// ─── Balance tuning ─────────────────────────────────────────────────────────

/** 0–5 tier based on lifetime earnings */
export function getPlayerRankTier(totalEarned: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (totalEarned >= 3_000_000) return 5;
  if (totalEarned >= 1_500_000) return 4;
  if (totalEarned >= 700_000)   return 3;
  if (totalEarned >= 300_000)   return 2;
  if (totalEarned >= 100_000)   return 1;
  return 0;
}

export interface BalanceConfig {
  scammerProbability: number;      // 0–1 chance per incoming pitch
  scammerOfferBonus: number;       // multiplier on top of scammer.offerMultiplier
  bonusHints: number;              // extra tell highlights regardless of difficulty
  clientPoolRestrictedToEasy: boolean;
  negotiationRejectionReduction: number; // subtracted from base 40% rejection chance
}

export const BALANCE_BY_RANK: Record<number, BalanceConfig> = {
  0: { scammerProbability: 0.15, scammerOfferBonus: 1.35, bonusHints: 2,  clientPoolRestrictedToEasy: true,  negotiationRejectionReduction: 0 },
  1: { scammerProbability: 0.20, scammerOfferBonus: 1.20, bonusHints: 1,  clientPoolRestrictedToEasy: true,  negotiationRejectionReduction: 0.05 },
  2: { scammerProbability: 0.28, scammerOfferBonus: 1.05, bonusHints: 0,  clientPoolRestrictedToEasy: false, negotiationRejectionReduction: 0.10 },
  3: { scammerProbability: 0.35, scammerOfferBonus: 1.00, bonusHints: 0,  clientPoolRestrictedToEasy: false, negotiationRejectionReduction: 0.15 },
  4: { scammerProbability: 0.40, scammerOfferBonus: 0.90, bonusHints: -1, clientPoolRestrictedToEasy: false, negotiationRejectionReduction: 0.20 },
  5: { scammerProbability: 0.45, scammerOfferBonus: 0.80, bonusHints: -1, clientPoolRestrictedToEasy: false, negotiationRejectionReduction: 0.25 },
};

/** Charisma effect: bonus tell highlights from charisma score */
export function charismaHintBonus(charisma: number): number {
  if (charisma >= 80) return 2;
  if (charisma >= 40) return 1;
  return 0;
}

/** Charisma effect: reduction to negotiation rejection probability */
export function charismaRejectionReduction(charisma: number): number {
  return Math.min(0.30, charisma * 0.003);
}

/** Simple clients suitable for early game */
export const EASY_CLIENT_IDS = new Set([
  'startup_bro', 'office_plankton', 'expat_lost', 'biz_student',
  'restaurant_owner', 'baraholka_veteran', 'gov_worker',
  'rakhmet_pensioner', 'valentina_babushka', 'gulzat_kinder',
]);

export const RAID_COST = 500; // ₸ to send a raid

// ─── Personality negotiation math ────────────────────────────────────────────

/** Opening offer as fraction of item.sellPrice (randomised per personality) */
export function getPersonalityOpening(personality: ClientPersonality, sellPrice: number): number {
  let mult: number;
  switch (personality) {
    case 'aggressive': mult = 0.30 + Math.random() * 0.10; break;
    case 'skeptical':  mult = 0.50 + Math.random() * 0.10; break;
    case 'friendly':   mult = 0.60 + Math.random() * 0.10; break;
    case 'impulsive':  mult = Math.random() < 0.40 ? 0.95 : 0.40 + Math.random() * 0.40; break;
    case 'stubborn':   mult = 0.45 + Math.random() * 0.10; break;
  }
  return Math.round(sellPrice * mult);
}

/** Maximum the client will ever agree to pay */
export function getPersonalityMax(personality: ClientPersonality, sellPrice: number): number {
  const mults: Record<ClientPersonality, number> = {
    aggressive: 0.92, skeptical: 0.80, friendly: 0.87, impulsive: 0.96, stubborn: 0.56,
  };
  return Math.round(sellPrice * mults[personality]);
}

/** Starting patience for each personality */
export const PERSONALITY_PATIENCE: Record<ClientPersonality, number> = {
  aggressive: 120, skeptical: 80, friendly: 90, impulsive: 50, stubborn: 200,
};

/** One-line label shown in the UI */
export const PERSONALITY_LABEL: Record<ClientPersonality, string> = {
  aggressive: '⚡ AGGRESSIVE', skeptical: '🔍 SKEPTICAL',
  friendly: '😊 FRIENDLY', impulsive: '🎲 IMPULSIVE', stubborn: '🪨 STUBBORN',
};

/** Colour for personality badge */
export const PERSONALITY_COLOR: Record<ClientPersonality, string> = {
  aggressive: '#ff0040', skeptical: '#0080ff',
  friendly: '#00ff41', impulsive: '#ffee00', stubborn: '#ff6600',
};

// ─── Day Scaling ──────────────────────────────────────────────────────────────

export interface DayProfile {
  /** Personalities allowed for incoming clients; null = all */
  allowedPersonalities: ClientPersonality[] | null;
  /** Hard cap on scammers spawned this day */
  maxScammers: number;
  /** Whether contracts panel is available */
  contractsUnlocked: boolean;
  /** Minimum daily profit to avoid a loss-streak tick */
  minProfitTarget: number;
}

export function getDayProfile(day: number): DayProfile {
  const minProfitTarget = Math.round(40000 * Math.pow(1.1, day - 1));
  if (day <= 3) {
    return { allowedPersonalities: ['friendly', 'impulsive'], maxScammers: 0, contractsUnlocked: false, minProfitTarget };
  }
  if (day <= 7) {
    return { allowedPersonalities: null, maxScammers: 2, contractsUnlocked: false, minProfitTarget };
  }
  return { allowedPersonalities: null, maxScammers: 4, contractsUnlocked: true, minProfitTarget };
}