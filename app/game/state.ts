import {
  ITEMS, NPCS, PITCHES, BOSS, CLIENTS, SCAMMERS, CONTRACTS,
  BALANCE_BY_RANK, EASY_CLIENT_IDS, getPlayerRankTier,
  charismaRejectionReduction,
  getPersonalityOpening, getPersonalityMax, PERSONALITY_PATIENCE,
  getDayProfile,
  type Item, type Pitch, type Difficulty, type Contract, type ClientPersonality,
} from './data';

// ─── Sub-interfaces ─────────────────────────────────────────────────────────

export interface InventoryItem {
  itemId: string;
  quantity: number;
  purchasePrice: number;
}

export interface LogEntry {
  id: string;
  type: 'success' | 'failure' | 'info' | 'warning' | 'boss';
  message: string;
  timestamp: number;
}

export interface PitchState {
  pitchId: string;
  currentOffer: number;
  round: number;
  maxRounds: number;
  npcMood: 'neutral' | 'interested' | 'annoyed';
  active: boolean;
  fakeScaricityUsed: boolean;
  nameDropUsed: boolean;
}

export interface BossState {
  active: boolean;
  playerHp: number;
  bossHp: number;
  playerMaxHp: number;
  bossMaxHp: number;
  turn: 'player' | 'boss';
  abilityCooldowns: Record<string, number>;
  bossAbilityCooldowns: Record<string, number>;
  bossNextAbility: string;
  wolfHowlUsed: boolean;
  log: string[];
}

export interface IncomingPitch {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceAvatar: string;
  sourceTitle: string;
  isScammer: boolean;
  itemId: string;
  itemName: string;
  offeredPrice: number;
  pitchText: string;
  tells: string[];
  status: 'pending' | 'negotiating' | 'accepted' | 'declined' | 'scammed' | 'callback_pending';
  // Negotiation state
  personality: ClientPersonality;
  clientCurrentOffer: number;
  clientMaxOffer: number;
  playerAskPrice: number;
  patience: number;
  maxPatience: number;
  negotiationRound: number;
  holdFirmCount: number;
}

export interface ContractSlot {
  contractId: string;
  step: 'available' | 'negotiating' | 'ready_to_sign' | 'completed';
  currentOffer: number;
  counterRound: number;
}

export interface DailyStats {
  earned: number;
  costOfGoods: number;
  dealsWon: number;
  dealsFailed: number;
  bestDeal: { amount: number; description: string } | null;
  scammersDetected: number;
  scammersFooled: number;
}

export interface LifetimeStats {
  totalDeals: number;
  totalEarned: number;
  daysPlayed: number;
  scammersDetected: number;
  scammersFooled: number;
  contractsSigned: number;
}

// ─── GameState ──────────────────────────────────────────────────────────────

export interface GameState {
  phase: 'intro' | 'day_start' | 'sales' | 'day_end' | 'boss' | 'victory' | 'defeat';
  tenge: number;
  reputation: number;
  charisma: number;
  day: number;
  maxDays: number;
  difficulty: Difficulty | null;
  inventory: InventoryItem[];
  activePitch: PitchState | null;
  activeContract: ContractSlot | null;
  boss: BossState;
  log: LogEntry[];
  incomingPitches: IncomingPitch[];
  availableContracts: ContractSlot[];
  completedContracts: string[];
  focus: number;
  lossStreak: number;
  minProfitTarget: number;
  salesCompleted: number;
  pitchesCompleted: number;
  totalEarned: number;
  selectedItemToBuy: string | null;
  selectedItemToSell: string | null;
  activeTab: 'market' | 'outgoing' | 'incoming' | 'contracts';
  dailyStats: DailyStats;
  lifetimeStats: LifetimeStats;
}

// ─── Generators (uses Math.random — intentionally impure for game logic) ────

function randomBossAbility(): string {
  return BOSS.abilities[Math.floor(Math.random() * BOSS.abilities.length)].id;
}

export function generateIncomingPitches(day: number, totalEarned = 0, charisma = 0): IncomingPitch[] {
  const tier = getPlayerRankTier(totalEarned);
  const balance = BALANCE_BY_RANK[tier];
  const profile = getDayProfile(day);

  const count = 3 + Math.floor(Math.random() * 3); // 3–5
  const pitches: IncomingPitch[] = [];
  const usedClientIds = new Set<string>();
  let scammerCount = 0;

  // Day 1-3: only allowed personalities; otherwise use rank-based pool
  const basePool = profile.allowedPersonalities
    ? CLIENTS.filter((c) => (profile.allowedPersonalities as ClientPersonality[]).includes(c.personality))
    : balance.clientPoolRestrictedToEasy
      ? CLIENTS.filter((c) => EASY_CLIENT_IDS.has(c.id))
      : CLIENTS;

  for (let i = 0; i < count; i++) {
    const canScam = scammerCount < profile.maxScammers;
    const isScammer = canScam && (Math.random() < balance.scammerProbability);
    if (isScammer) scammerCount++;
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];

    if (isScammer) {
      const scammer = SCAMMERS[Math.floor(Math.random() * SCAMMERS.length)];
      const offeredPrice = Math.round(item.sellPrice * scammer.offerMultiplier * balance.scammerOfferBonus);
      pitches.push({
        id: `incoming-${day}-${i}-${Date.now()}`,
        sourceId: scammer.id,
        sourceName: scammer.name,
        sourceAvatar: scammer.avatar,
        sourceTitle: scammer.title,
        isScammer: true,
        itemId: item.id,
        itemName: item.name,
        offeredPrice,
        pitchText: scammer.pitchText,
        tells: scammer.tells,
        status: 'pending',
        personality: 'impulsive' as ClientPersonality,
        clientCurrentOffer: offeredPrice,
        clientMaxOffer: offeredPrice,
        playerAskPrice: item.sellPrice,
        patience: 100,
        maxPatience: 100,
        negotiationRound: 0,
        holdFirmCount: 0,
      });
    } else {
      const available = basePool.filter((c) => !usedClientIds.has(c.id));
      if (available.length === 0) continue;
      const client = available[Math.floor(Math.random() * available.length)];
      usedClientIds.add(client.id);
      const personality = client.personality;
      const opening = getPersonalityOpening(personality, item.sellPrice);
      const maxOffer = getPersonalityMax(personality, item.sellPrice);
      const pat = PERSONALITY_PATIENCE[personality];
      const line = client.pitchLines[Math.floor(Math.random() * client.pitchLines.length)];
      pitches.push({
        id: `incoming-${day}-${i}-${Date.now()}`,
        sourceId: client.id,
        sourceName: client.name,
        sourceAvatar: client.avatar,
        sourceTitle: client.title,
        isScammer: false,
        itemId: item.id,
        itemName: item.name,
        offeredPrice: opening,
        pitchText: line,
        tells: [],
        status: 'pending',
        personality,
        clientCurrentOffer: opening,
        clientMaxOffer: maxOffer,
        playerAskPrice: item.sellPrice,
        patience: pat,
        maxPatience: pat,
        negotiationRound: 0,
        holdFirmCount: 0,
      });
    }
  }

  return pitches;
}

export function generateRaidScammer(day: number, raiderName: string): IncomingPitch {
  const scammer = SCAMMERS[Math.floor(Math.random() * SCAMMERS.length)];
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const offeredPrice = Math.round(item.sellPrice * scammer.offerMultiplier * 1.4); // extra enticing
  return {
    id: `raid-${Date.now()}-${Math.random()}`,
    sourceId: scammer.id,
    sourceName: scammer.name,
    sourceAvatar: scammer.avatar,
    sourceTitle: `⚔️ Sent by ${raiderName}`,
    isScammer: true,
    itemId: item.id,
    itemName: item.name,
    offeredPrice,
    pitchText: scammer.pitchText,
    tells: scammer.tells,
    status: 'pending',
    personality: 'impulsive' as ClientPersonality,
    clientCurrentOffer: offeredPrice,
    clientMaxOffer: offeredPrice,
    playerAskPrice: item.sellPrice,
    patience: 100,
    maxPatience: 100,
    negotiationRound: 0,
    holdFirmCount: 0,
  };
}

export function generateAvailableContracts(charisma: number, completedContracts: string[]): ContractSlot[] {
  const eligible = CONTRACTS.filter(
    (c) => c.requiredCharisma <= charisma + 5 && !completedContracts.includes(c.id)
  );
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((c) => ({
    contractId: c.id,
    step: 'available' as const,
    currentOffer: c.value,
    counterRound: 0,
  }));
}

// ─── Initial state ──────────────────────────────────────────────────────────

const emptyDailyStats: DailyStats = {
  earned: 0, costOfGoods: 0, dealsWon: 0, dealsFailed: 0,
  bestDeal: null, scammersDetected: 0, scammersFooled: 0,
};

const emptyLifetimeStats: LifetimeStats = {
  totalDeals: 0, totalEarned: 0, daysPlayed: 0,
  scammersDetected: 0, scammersFooled: 0, contractsSigned: 0,
};

export const initialState: GameState = {
  phase: 'intro',
  tenge: 500000,
  reputation: 0,
  charisma: 0,
  day: 1,
  maxDays: 10,
  difficulty: null,
  inventory: [],
  activePitch: null,
  activeContract: null,
  boss: {
    active: false,
    playerHp: 100, bossHp: BOSS.maxHp,
    playerMaxHp: 100, bossMaxHp: BOSS.maxHp,
    turn: 'player',
    abilityCooldowns: {}, bossAbilityCooldowns: {},
    bossNextAbility: randomBossAbility(),
    wolfHowlUsed: false, log: [],
  },
  log: [{ id: '0', type: 'info', message: "Welcome to Almaty. You have ₸500,000 and a dream. Don't blow it.", timestamp: Date.now() }],
  incomingPitches: [],
  availableContracts: [],
  completedContracts: [],
  focus: 100,
  lossStreak: 0,
  minProfitTarget: getDayProfile(1).minProfitTarget,
  salesCompleted: 0,
  pitchesCompleted: 0,
  totalEarned: 0,
  selectedItemToBuy: null,
  selectedItemToSell: null,
  activeTab: 'market',
  dailyStats: emptyDailyStats,
  lifetimeStats: emptyLifetimeStats,
};

// ─── Actions ─────────────────────────────────────────────────────────────────

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'BEGIN_DAY' }
  | { type: 'END_DAY' }
  | { type: 'NEXT_DAY' }
  | { type: 'LOAD_SAVE'; data: Partial<GameState> }
  | { type: 'BUY_ITEM'; itemId: string; quantity: number }
  | { type: 'SELL_ITEM'; itemId: string; quantity: number }
  | { type: 'SELECT_BUY'; itemId: string | null }
  | { type: 'SELECT_SELL'; itemId: string | null }
  | { type: 'START_PITCH'; pitchId: string }
  | { type: 'NEGOTIATE'; action: 'accept' | 'counter' | 'walk' | 'fake_scarcity' | 'name_drop' }
  | { type: 'DISMISS_PITCH' }
  | { type: 'RESPOND_INCOMING'; pitchId: string; action: 'accept' | 'decline' }
  | { type: 'START_NEGOTIATION'; pitchId: string }
  | { type: 'NEGOTIATE_INCOMING'; pitchId: string; action: 'hold_firm' | 'small_discount' | 'big_discount' | 'pitch_value' | 'walk_away' | 'accept' }
  | { type: 'ACCEPT_CALLBACK'; pitchId: string }
  | { type: 'COUNTER_PITCH'; pitchId: string }
  | { type: 'APPLY_RAID'; raiderName: string }
  | { type: 'PAY_RAID_COST' }
  | { type: 'PROPOSE_CONTRACT'; contractId: string }
  | { type: 'COUNTER_CONTRACT'; contractId: string }
  | { type: 'ACCEPT_CONTRACT_TERMS'; contractId: string }
  | { type: 'SIGN_CONTRACT'; contractId: string }
  | { type: 'DISMISS_CONTRACT' }
  | { type: 'START_BOSS' }
  | { type: 'BOSS_ACTION'; abilityId: string }
  | { type: 'SET_TAB'; tab: GameState['activeTab'] };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function addLog(log: LogEntry[], type: LogEntry['type'], message: string): LogEntry[] {
  return [{ id: String(Date.now() + Math.random()), type, message, timestamp: Date.now() }, ...log].slice(0, 60);
}

function getItemById(id: string): Item | undefined {
  return ITEMS.find((i) => i.id === id);
}

function getPitchById(id: string): Pitch | undefined {
  return PITCHES.find((p) => p.id === id);
}

function getNpcById(id: string) {
  return NPCS.find((n) => n.id === id);
}

function getContractById(id: string): Contract | undefined {
  return CONTRACTS.find((c) => c.id === id);
}

function hasSufficientItem(inventory: InventoryItem[], itemId: string, qty: number): boolean {
  const slot = inventory.find((i) => i.itemId === itemId);
  return !!slot && slot.quantity >= qty;
}

function counterOffer(price: number, round: number, maxRounds: number, mood: string): number {
  const discount = mood === 'interested' ? 0.05 : mood === 'annoyed' ? 0.02 : 0.04;
  return Math.round(price * (1 - discount * (round / maxRounds)));
}

function updateBestDeal(
  current: DailyStats['bestDeal'],
  amount: number,
  description: string
): DailyStats['bestDeal'] {
  if (!current || amount > current.amount) return { amount, description };
  return current;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'LOAD_SAVE': {
      const d = action.data;
      return {
        ...initialState,
        ...d,
        phase: 'day_start',
        activePitch: null,
        activeContract: null,
        incomingPitches: [],
        availableContracts: [],
        boss: initialState.boss,
        dailyStats: emptyDailyStats,
        minProfitTarget: getDayProfile(d.day ?? 1).minProfitTarget,
        log: [{ id: 'load', type: 'info', message: `Save loaded. Resuming Day ${d.day ?? 1}. Welcome back, Wolf.`, timestamp: Date.now() }],
      };
    }

    case 'START_GAME':
      return { ...state, phase: 'day_start' };

    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty };

    case 'BEGIN_DAY': {
      const profile = getDayProfile(state.day);
      const incoming = generateIncomingPitches(state.day, state.totalEarned, state.charisma);
      const contracts = profile.contractsUnlocked
        ? generateAvailableContracts(state.charisma, state.completedContracts)
        : [];
      const unlockMsg = profile.contractsUnlocked && state.day === 8
        ? ' Contracts are now unlocked!'
        : profile.allowedPersonalities
          ? ' Rookies only today — no scammers yet.'
          : '';
      return {
        ...state,
        phase: 'sales',
        incomingPitches: incoming,
        availableContracts: contracts,
        activeTab: 'market',
        dailyStats: emptyDailyStats,
        activePitch: null,
        activeContract: null,
        focus: 100,
        minProfitTarget: profile.minProfitTarget,
        log: addLog(state.log, 'info', `Day ${state.day} begins. Target: ₸${profile.minProfitTarget.toLocaleString()}.${unlockMsg}`),
      };
    }

    case 'END_DAY': {
      const ls = state.lifetimeStats;
      const newLs = {
        ...ls,
        totalDeals: ls.totalDeals + state.dailyStats.dealsWon,
        totalEarned: ls.totalEarned + state.dailyStats.earned,
        daysPlayed: ls.daysPlayed + 1,
        scammersDetected: ls.scammersDetected + state.dailyStats.scammersDetected,
        scammersFooled: ls.scammersFooled + state.dailyStats.scammersFooled,
      };
      const dailyProfit = state.dailyStats.earned - state.dailyStats.costOfGoods;
      const newLossStreak = dailyProfit < state.minProfitTarget ? state.lossStreak + 1 : 0;
      if (newLossStreak >= 3) {
        return {
          ...state,
          phase: 'defeat',
          lossStreak: newLossStreak,
          lifetimeStats: newLs,
          log: addLog(state.log, 'failure', '💀 THREE CONSECUTIVE LOSS DAYS. Your investors pulled out. The market has spoken. You\'re fired, Wolf.'),
        };
      }
      return {
        ...state,
        phase: 'day_end',
        lossStreak: newLossStreak,
        lifetimeStats: newLs,
      };
    }

    case 'NEXT_DAY': {
      const newDay = state.day + 1;
      if (newDay > state.maxDays) {
        return {
          ...state,
          day: newDay,
          phase: 'boss',
          log: addLog(state.log, 'boss', 'THE FINAL DAY. Yerlan awaits. This ends today.'),
        };
      }
      return {
        ...state,
        day: newDay,
        phase: 'day_start',
        log: addLog(state.log, 'info', `Day ${newDay} of ${state.maxDays}. New day, new deals.`),
      };
    }

    case 'SET_TAB':
      return { ...state, activeTab: action.tab };

    case 'SELECT_BUY':
      return { ...state, selectedItemToBuy: action.itemId };

    case 'SELECT_SELL':
      return { ...state, selectedItemToSell: action.itemId };

    case 'BUY_ITEM': {
      const item = getItemById(action.itemId);
      if (!item) return state;
      const totalCost = item.buyPrice * action.quantity;
      if (state.tenge < totalCost) {
        return { ...state, log: addLog(state.log, 'failure', `Can't afford ${item.name}. Need ₸${totalCost.toLocaleString()}.`) };
      }
      const existing = state.inventory.find((i) => i.itemId === action.itemId);
      const newInventory = existing
        ? state.inventory.map((i) => i.itemId === action.itemId ? { ...i, quantity: i.quantity + action.quantity } : i)
        : [...state.inventory, { itemId: action.itemId, quantity: action.quantity, purchasePrice: item.buyPrice }];
      return {
        ...state,
        tenge: state.tenge - totalCost,
        inventory: newInventory,
        log: addLog(state.log, 'success', `Bought ${action.quantity}x ${item.name} for ₸${totalCost.toLocaleString()}.`),
      };
    }

    case 'SELL_ITEM': {
      const item = getItemById(action.itemId);
      if (!item) return state;
      if (!hasSufficientItem(state.inventory, action.itemId, action.quantity)) {
        return { ...state, log: addLog(state.log, 'failure', `Not enough ${item.name} to sell.`) };
      }
      const revenue = item.sellPrice * action.quantity;
      const profit = (item.sellPrice - item.buyPrice) * action.quantity;
      const newInventory = state.inventory
        .map((i) => i.itemId === action.itemId ? { ...i, quantity: i.quantity - action.quantity } : i)
        .filter((i) => i.quantity > 0);
      const charismaGain = profit > 0 ? Math.min(3, Math.floor(profit / 30000) + 1) : 0;
      const repGain = profit > 0 ? Math.floor(profit / 50000) : 0;
      const ds = state.dailyStats;
      return {
        ...state,
        tenge: state.tenge + revenue,
        reputation: Math.min(100, state.reputation + repGain),
        charisma: Math.min(100, state.charisma + charismaGain),
        focus: Math.min(100, state.focus + 10),
        inventory: newInventory,
        salesCompleted: state.salesCompleted + 1,
        totalEarned: state.totalEarned + revenue,
        dailyStats: {
          ...ds,
          earned: ds.earned + revenue,
          costOfGoods: ds.costOfGoods + item.buyPrice * action.quantity,
          dealsWon: ds.dealsWon + 1,
          bestDeal: updateBestDeal(ds.bestDeal, revenue, `${action.quantity}x ${item.name}`),
        },
        log: addLog(state.log, profit > 0 ? 'success' : 'warning', `Sold ${action.quantity}x ${item.name} for ₸${revenue.toLocaleString()}. Profit: ₸${profit.toLocaleString()}.`),
      };
    }

    // ─── Outgoing Pitches (to NPCs) ─────────────────────────────────────────

    case 'START_PITCH': {
      const pitch = getPitchById(action.pitchId);
      if (!pitch) return state;
      const npc = getNpcById(pitch.npcId);
      if (!npc) return state;
      if (state.reputation < npc.reputationRequired) {
        return { ...state, log: addLog(state.log, 'failure', `${npc.name} won't see you. Need ${npc.reputationRequired} reputation.`) };
      }
      if (!hasSufficientItem(state.inventory, pitch.itemId, 1)) {
        const item = getItemById(pitch.itemId);
        return { ...state, log: addLog(state.log, 'failure', `You don't have ${item?.name} in your inventory.`) };
      }
      return {
        ...state,
        activePitch: { pitchId: action.pitchId, currentOffer: pitch.basePrice, round: 1, maxRounds: pitch.negotiationRounds, npcMood: 'neutral', active: true, fakeScaricityUsed: false, nameDropUsed: false },
        log: addLog(state.log, 'info', `${npc.name}: "${npc.dialogues.greeting}"`),
      };
    }

    case 'NEGOTIATE': {
      if (!state.activePitch) return state;
      const pitch = getPitchById(state.activePitch.pitchId);
      if (!pitch) return state;
      const npc = getNpcById(pitch.npcId);
      if (!npc) return state;
      const ap = state.activePitch;

      if (action.action === 'walk') {
        const ds = state.dailyStats;
        return { ...state, activePitch: null, dailyStats: { ...ds, dealsFailed: ds.dealsFailed + 1 }, log: addLog(state.log, 'warning', `Walked away from ${npc.name}.`) };
      }

      if (action.action === 'accept') {
        const finalPrice = ap.currentOffer;
        const newInventory = state.inventory.map((i) => i.itemId === pitch.itemId ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0);
        const charismaGain = Math.min(5, Math.floor(finalPrice / 100000) + 2);
        const ds = state.dailyStats;
        return {
          ...state,
          tenge: state.tenge + finalPrice,
          reputation: Math.min(100, state.reputation + Math.floor(finalPrice / 30000) + 5),
          charisma: Math.min(100, state.charisma + charismaGain),
          focus: Math.min(100, state.focus + 5),
          inventory: newInventory,
          activePitch: null,
          pitchesCompleted: state.pitchesCompleted + 1,
          totalEarned: state.totalEarned + finalPrice,
          dailyStats: { ...ds, earned: ds.earned + finalPrice, costOfGoods: ds.costOfGoods + (getItemById(pitch.itemId)?.buyPrice ?? 0), dealsWon: ds.dealsWon + 1, bestDeal: updateBestDeal(ds.bestDeal, finalPrice, `Pitch: ${npc.name}`) },
          log: addLog(state.log, 'success', `DEAL CLOSED with ${npc.name}! ₸${finalPrice.toLocaleString()} secured. "${npc.dialogues.deal}"`),
        };
      }

      if (action.action === 'counter') {
        if (ap.round >= ap.maxRounds) {
          const tier = getPlayerRankTier(state.totalEarned);
          const rankReduction = BALANCE_BY_RANK[tier].negotiationRejectionReduction;
          const rejectChance = Math.max(0.05, 0.4 - charismaRejectionReduction(state.charisma) - rankReduction);
          const rejected = Math.random() < rejectChance;
          if (rejected) {
            const ds = state.dailyStats;
            return { ...state, activePitch: null, reputation: Math.max(0, state.reputation - 3), dailyStats: { ...ds, dealsFailed: ds.dealsFailed + 1 }, log: addLog(state.log, 'failure', `${npc.name} walked out. "${npc.dialogues.rejected}"`) };
          }
          const finalPrice = ap.currentOffer;
          const newInventory = state.inventory.map((i) => i.itemId === pitch.itemId ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0);
          const ds = state.dailyStats;
          return {
            ...state,
            tenge: state.tenge + finalPrice,
            reputation: Math.min(100, state.reputation + 5),
            charisma: Math.min(100, state.charisma + 2),
            focus: Math.min(100, state.focus + 5),
            inventory: newInventory,
            activePitch: null,
            pitchesCompleted: state.pitchesCompleted + 1,
            totalEarned: state.totalEarned + finalPrice,
            dailyStats: { ...ds, earned: ds.earned + finalPrice, costOfGoods: ds.costOfGoods + (getItemById(pitch.itemId)?.buyPrice ?? 0), dealsWon: ds.dealsWon + 1, bestDeal: updateBestDeal(ds.bestDeal, finalPrice, `Pitch: ${npc.name}`) },
            log: addLog(state.log, 'success', `${npc.name} caved! ₸${finalPrice.toLocaleString()} closed. "${npc.dialogues.deal}"`),
          };
        }
        const newOffer = counterOffer(ap.currentOffer, ap.round, ap.maxRounds, ap.npcMood);
        const newMood = ap.round >= ap.maxRounds - 1 ? 'annoyed' : ap.npcMood === 'neutral' ? 'interested' : ap.npcMood;
        return {
          ...state,
          activePitch: { ...ap, currentOffer: newOffer, round: ap.round + 1, npcMood: newMood },
          log: addLog(state.log, 'info', `${npc.name} counters: ₸${newOffer.toLocaleString()}. "${npc.dialogues.interested}"`),
        };
      }

      if (action.action === 'fake_scarcity') {
        if (ap.fakeScaricityUsed) {
          return { ...state, log: addLog(state.log, 'warning', `${npc.name} has heard the "other buyer" line already.`) };
        }
        if (state.focus < 20) {
          return { ...state, log: addLog(state.log, 'failure', `Not enough Focus. Need 20, have ${state.focus}.`) };
        }
        const newOffer = Math.round(ap.currentOffer * 1.08);
        const newMood = ap.npcMood === 'annoyed' ? 'annoyed' as const : 'interested' as const;
        return {
          ...state,
          focus: Math.max(0, state.focus - 20),
          activePitch: { ...ap, currentOffer: newOffer, fakeScaricityUsed: true, npcMood: newMood },
          log: addLog(state.log, 'success', `📢 "Got another call on this 5 min ago." ${npc.name} shifts in their seat. ↑8% → ₸${newOffer.toLocaleString()}.`),
        };
      }

      if (action.action === 'name_drop') {
        if (ap.nameDropUsed) {
          return { ...state, log: addLog(state.log, 'warning', `${npc.name}: "You've already name-dropped. Twice is desperate."`) };
        }
        if (state.focus < 25) {
          return { ...state, log: addLog(state.log, 'failure', `Not enough Focus. Need 25, have ${state.focus}.`) };
        }
        if (state.charisma < 15) {
          return { ...state, log: addLog(state.log, 'failure', `Need 15 Charisma to Name-Drop. You have ${state.charisma}.`) };
        }
        const bonus = Math.min(0.15, 0.05 + state.charisma * 0.002);
        const newOffer = Math.round(ap.currentOffer * (1 + bonus));
        return {
          ...state,
          focus: Math.max(0, state.focus - 25),
          activePitch: { ...ap, currentOffer: newOffer, nameDropUsed: true, npcMood: 'interested' as const },
          log: addLog(state.log, 'success', `✨ Name-Drop lands perfectly. ${npc.name} leans in. +${Math.round(bonus * 100)}% → ₸${newOffer.toLocaleString()}.`),
        };
      }

      return state;
    }

    case 'DISMISS_PITCH':
      return { ...state, activePitch: null };

    // ─── Incoming Pitches (from clients/scammers) ────────────────────────────

    case 'RESPOND_INCOMING': {
      const incomingPitch = state.incomingPitches.find((p) => p.id === action.pitchId);
      if (!incomingPitch || (incomingPitch.status !== 'pending' && incomingPitch.status !== 'callback_pending')) return state;

      if (action.action === 'decline') {
        const updatedPitches = state.incomingPitches.map((p) => p.id === action.pitchId ? { ...p, status: 'declined' as const } : p);
        const ds = state.dailyStats;

        if (incomingPitch.isScammer) {
          const bonus = 500;
          return {
            ...state,
            tenge: state.tenge + bonus,
            charisma: Math.min(100, state.charisma + 3),
            incomingPitches: updatedPitches,
            dailyStats: { ...ds, scammersDetected: ds.scammersDetected + 1, dealsWon: ds.dealsWon + 1 },
            log: addLog(state.log, 'success', `🚨 SCAM DETECTED! You spotted ${incomingPitch.sourceName}'s con. +₸${bonus} bonus!`),
          };
        }

        return {
          ...state,
          incomingPitches: updatedPitches,
          dailyStats: { ...ds, dealsFailed: ds.dealsFailed + 1 },
          log: addLog(state.log, 'warning', `Declined ${incomingPitch.sourceName}'s offer. Opportunity lost.`),
        };
      }

      // action === 'accept'
      if (!hasSufficientItem(state.inventory, incomingPitch.itemId, 1)) {
        return { ...state, log: addLog(state.log, 'failure', `You don't have ${incomingPitch.itemName} to sell to ${incomingPitch.sourceName}.`) };
      }

      const price = incomingPitch.offeredPrice;
      const item = getItemById(incomingPitch.itemId);
      const newInventory = state.inventory.map((i) => i.itemId === incomingPitch.itemId ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0);

      if (incomingPitch.isScammer) {
        const stolen = Math.round(price * 0.2);
        const net = price - stolen;
        const ds = state.dailyStats;
        return {
          ...state,
          tenge: state.tenge + net,
          inventory: newInventory,
          incomingPitches: state.incomingPitches.map((p) => p.id === action.pitchId ? { ...p, status: 'scammed' as const } : p),
          totalEarned: state.totalEarned + net,
          salesCompleted: state.salesCompleted + 1,
          dailyStats: {
            ...ds, earned: ds.earned + net, dealsFailed: ds.dealsFailed + 1,
            scammersFooled: ds.scammersFooled + 1,
          },
          log: addLog(addLog(state.log, 'failure', `💀 SCAMMED by ${incomingPitch.sourceName}! They reversed the deal and stole ₸${stolen.toLocaleString()}! Net: ₸${net.toLocaleString()}.`), 'warning', `Red flags were there: "${incomingPitch.tells[0] ?? '???'}"`),
        };
      }

      const profit = price - (item?.buyPrice ?? 0);
      const ds = state.dailyStats;
      const charismaGain = Math.max(1, Math.floor(price / 80000));
      return {
        ...state,
        tenge: state.tenge + price,
        reputation: Math.min(100, state.reputation + 1),
        charisma: Math.min(100, state.charisma + charismaGain),
        focus: Math.min(100, state.focus + 10),
        inventory: newInventory,
        incomingPitches: state.incomingPitches.map((p) => p.id === action.pitchId ? { ...p, status: 'accepted' as const } : p),
        totalEarned: state.totalEarned + price,
        salesCompleted: state.salesCompleted + 1,
        dailyStats: {
          ...ds, earned: ds.earned + price, costOfGoods: ds.costOfGoods + (item?.buyPrice ?? 0), dealsWon: ds.dealsWon + 1,
          bestDeal: updateBestDeal(ds.bestDeal, price, `${incomingPitch.sourceName} → ${incomingPitch.itemName}`),
        },
        log: addLog(state.log, profit > 0 ? 'success' : 'warning', `Sold ${incomingPitch.itemName} to ${incomingPitch.sourceName} for ₸${price.toLocaleString()}.`),
      };
    }

    case 'START_NEGOTIATION': {
      const inPitch = state.incomingPitches.find((p) => p.id === action.pitchId);
      if (!inPitch || inPitch.status !== 'pending') return state;
      const inItem = getItemById(inPitch.itemId);
      if (!inItem) return state;

      // Impulsive: 40% instant buy at player's ask price
      if (inPitch.personality === 'impulsive' && Math.random() < 0.40) {
        if (!hasSufficientItem(state.inventory, inPitch.itemId, 1)) {
          return { ...state, log: addLog(state.log, 'failure', `${inPitch.sourceName} was ready to buy instantly — but you have no stock!`) };
        }
        const salePrice = inPitch.playerAskPrice;
        const profit = salePrice - inItem.buyPrice;
        const newInv = state.inventory
          .map((i) => i.itemId === inPitch.itemId ? { ...i, quantity: i.quantity - 1 } : i)
          .filter((i) => i.quantity > 0);
        const ds = state.dailyStats;
        return {
          ...state,
          tenge: state.tenge + salePrice,
          charisma: Math.min(100, state.charisma + Math.max(1, Math.floor(salePrice / 80000))),
          focus: Math.min(100, state.focus + 5),
          inventory: newInv,
          incomingPitches: state.incomingPitches.map((p) => p.id === action.pitchId ? { ...p, status: 'accepted' as const } : p),
          totalEarned: state.totalEarned + salePrice,
          salesCompleted: state.salesCompleted + 1,
          dailyStats: {
            ...ds, earned: ds.earned + salePrice, dealsWon: ds.dealsWon + 1,
            costOfGoods: ds.costOfGoods + inItem.buyPrice,
            bestDeal: updateBestDeal(ds.bestDeal, salePrice, `${inPitch.sourceName} (impulsive!) → ${inPitch.itemName}`),
          },
          log: addLog(state.log, profit >= 0 ? 'success' : 'warning', `⚡ ${inPitch.sourceName} didn't even blink — INSTANT BUY at ₸${salePrice.toLocaleString()}!`),
        };
      }

      return {
        ...state,
        incomingPitches: state.incomingPitches.map((p) => p.id === action.pitchId ? { ...p, status: 'negotiating' as const } : p),
        log: addLog(state.log, 'info', `Negotiating with ${inPitch.sourceName}. Opening offer: ₸${inPitch.clientCurrentOffer.toLocaleString()}.`),
      };
    }

    case 'NEGOTIATE_INCOMING': {
      const np = state.incomingPitches.find((p) => p.id === action.pitchId);
      if (!np || np.status !== 'negotiating') return state;
      const npItem = getItemById(np.itemId);
      if (!npItem) return state;

      const execSale = (salePrice: number, note: string, focusAfterCost = state.focus): GameState => {
        if (!hasSufficientItem(state.inventory, np.itemId, 1)) {
          return { ...state, log: addLog(state.log, 'failure', `No stock of ${np.itemName} to sell.`) };
        }
        const profit = salePrice - npItem.buyPrice;
        const newInv = state.inventory
          .map((i) => i.itemId === np.itemId ? { ...i, quantity: i.quantity - 1 } : i)
          .filter((i) => i.quantity > 0);
        const ds = state.dailyStats;
        return {
          ...state,
          tenge: state.tenge + salePrice,
          reputation: Math.min(100, state.reputation + 1),
          charisma: Math.min(100, state.charisma + Math.max(1, Math.floor(salePrice / 80000))),
          focus: Math.min(100, focusAfterCost + 5),
          inventory: newInv,
          incomingPitches: state.incomingPitches.map((p) => p.id === action.pitchId ? { ...p, status: 'accepted' as const } : p),
          totalEarned: state.totalEarned + salePrice,
          salesCompleted: state.salesCompleted + 1,
          dailyStats: {
            ...ds, earned: ds.earned + salePrice, dealsWon: ds.dealsWon + 1,
            costOfGoods: ds.costOfGoods + npItem.buyPrice,
            bestDeal: updateBestDeal(ds.bestDeal, salePrice, `${np.sourceName} → ${np.itemName}`),
          },
          log: addLog(state.log, profit >= 0 ? 'success' : 'warning', note),
        };
      };

      if (action.action === 'accept') {
        return execSale(np.clientCurrentOffer, `✅ Accepted ${np.sourceName}'s offer: ₸${np.clientCurrentOffer.toLocaleString()}.`);
      }

      if (action.action === 'walk_away') {
        if (Math.random() < 0.30) {
          const cbOffer = Math.round(Math.min(np.clientMaxOffer * 1.05, npItem.sellPrice * 0.95));
          return {
            ...state,
            incomingPitches: state.incomingPitches.map((p) =>
              p.id === action.pitchId ? { ...p, status: 'callback_pending' as const, clientCurrentOffer: cbOffer } : p
            ),
            log: addLog(state.log, 'info', `${np.sourceName} ran after you: "Wait — ₸${cbOffer.toLocaleString()}?" CALLBACK pending.`),
          };
        }
        const ds = state.dailyStats;
        return {
          ...state,
          incomingPitches: state.incomingPitches.map((p) => p.id === action.pitchId ? { ...p, status: 'declined' as const } : p),
          dailyStats: { ...ds, dealsFailed: ds.dealsFailed + 1 },
          log: addLog(state.log, 'warning', `Walked away from ${np.sourceName}. No callback.`),
        };
      }

      // hold_firm / small_discount / big_discount / pitch_value
      let newPatience = np.patience;
      let newClientOffer = np.clientCurrentOffer;
      let newPlayerAsk = np.playerAskPrice;
      let newHoldFirmCount = np.holdFirmCount;
      const newRound = np.negotiationRound + 1;
      let focusCost = 0;
      let logMsg = '';
      const gap = np.clientMaxOffer - np.clientCurrentOffer;

      if (action.action === 'hold_firm') {
        newHoldFirmCount = np.holdFirmCount + 1;
        newPatience -= np.personality === 'aggressive' ? 5 : 15;
        if (np.personality === 'aggressive' && newHoldFirmCount >= 2) {
          newClientOffer = Math.round(npItem.sellPrice * 0.90);
        } else if (np.personality !== 'stubborn') {
          newClientOffer = Math.round(np.clientCurrentOffer + gap * 0.05);
        }
        logMsg = `Held firm at ₸${newPlayerAsk.toLocaleString()}. ${np.sourceName} moves to ₸${newClientOffer.toLocaleString()}.`;
      } else if (action.action === 'small_discount') {
        newPlayerAsk = Math.round(np.playerAskPrice * 0.90);
        newPatience -= 5;
        newClientOffer = Math.round(np.clientCurrentOffer + gap * (np.personality === 'stubborn' ? 0.02 : 0.15));
        logMsg = `Offered −10%: ₸${newPlayerAsk.toLocaleString()}. ${np.sourceName} moves to ₸${newClientOffer.toLocaleString()}.`;
      } else if (action.action === 'big_discount') {
        newPlayerAsk = Math.round(np.playerAskPrice * 0.75);
        newPatience -= 5;
        newClientOffer = Math.round(np.clientCurrentOffer + gap * (np.personality === 'stubborn' ? 0.05 : 0.30));
        logMsg = `Offered −25%: ₸${newPlayerAsk.toLocaleString()}. ${np.sourceName} moves to ₸${newClientOffer.toLocaleString()}.`;
      } else if (action.action === 'pitch_value') {
        focusCost = 25;
        if (state.focus < focusCost) {
          return { ...state, log: addLog(state.log, 'failure', `Not enough Focus. Need ${focusCost}, have ${state.focus}.`) };
        }
        newPatience -= np.personality === 'skeptical' ? 15 : 5;
        if (np.personality !== 'skeptical') {
          newClientOffer = Math.round(np.clientCurrentOffer + gap * 0.20);
          logMsg = `🎤 Value pitch lands! ${np.sourceName} moves to ₸${newClientOffer.toLocaleString()}.`;
        } else {
          logMsg = `${np.sourceName} shrugs. "Numbers don't lie, but salesmen do." No movement.`;
        }
      }

      // Scammer tell: on round ≥ 2, they match your ask exactly (too eager = red flag)
      if (np.isScammer && newRound >= 2) {
        newClientOffer = newPlayerAsk;
      }

      const newFocus = Math.max(0, state.focus - focusCost);

      // Auto-close: prices have met
      if (newPlayerAsk <= newClientOffer) {
        return execSale(
          newClientOffer,
          `✅ DEAL CLOSED! Prices met. ${np.sourceName} pays ₸${newClientOffer.toLocaleString()}.`,
          newFocus,
        );
      }

      // Patience exhausted: client leaves
      if (newPatience <= 0) {
        const ds = state.dailyStats;
        return {
          ...state,
          focus: newFocus,
          incomingPitches: state.incomingPitches.map((p) =>
            p.id === action.pitchId ? { ...p, status: 'declined' as const, patience: 0 } : p
          ),
          dailyStats: { ...ds, dealsFailed: ds.dealsFailed + 1 },
          log: addLog(state.log, 'warning', `${np.sourceName} lost patience and walked out.`),
        };
      }

      return {
        ...state,
        focus: newFocus,
        incomingPitches: state.incomingPitches.map((p) =>
          p.id === action.pitchId
            ? { ...p, patience: newPatience, clientCurrentOffer: newClientOffer, playerAskPrice: newPlayerAsk, negotiationRound: newRound, holdFirmCount: newHoldFirmCount }
            : p
        ),
        log: addLog(state.log, 'info', logMsg),
      };
    }

    case 'ACCEPT_CALLBACK': {
      const cbPitch = state.incomingPitches.find((p) => p.id === action.pitchId);
      if (!cbPitch || cbPitch.status !== 'callback_pending') return state;
      const cbItem = getItemById(cbPitch.itemId);
      if (!cbItem) return state;
      if (!hasSufficientItem(state.inventory, cbPitch.itemId, 1)) {
        return { ...state, log: addLog(state.log, 'failure', `No stock of ${cbPitch.itemName} for ${cbPitch.sourceName}'s callback.`) };
      }
      const cbPrice = cbPitch.clientCurrentOffer;
      const cbProfit = cbPrice - cbItem.buyPrice;
      const newInv = state.inventory
        .map((i) => i.itemId === cbPitch.itemId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter((i) => i.quantity > 0);
      const ds = state.dailyStats;
      return {
        ...state,
        tenge: state.tenge + cbPrice,
        reputation: Math.min(100, state.reputation + 2),
        charisma: Math.min(100, state.charisma + Math.max(1, Math.floor(cbPrice / 80000))),
        focus: Math.min(100, state.focus + 5),
        inventory: newInv,
        incomingPitches: state.incomingPitches.map((p) => p.id === action.pitchId ? { ...p, status: 'accepted' as const } : p),
        totalEarned: state.totalEarned + cbPrice,
        salesCompleted: state.salesCompleted + 1,
        dailyStats: {
          ...ds, earned: ds.earned + cbPrice, dealsWon: ds.dealsWon + 1,
          costOfGoods: ds.costOfGoods + cbItem.buyPrice,
          bestDeal: updateBestDeal(ds.bestDeal, cbPrice, `${cbPitch.sourceName} callback → ${cbPitch.itemName}`),
        },
        log: addLog(state.log, cbProfit >= 0 ? 'success' : 'warning', `📞 CALLBACK ACCEPTED: ${cbPitch.sourceName} pays ₸${cbPrice.toLocaleString()}.`),
      };
    }

    case 'COUNTER_PITCH': {
      const pitch = state.incomingPitches.find((p) => p.id === action.pitchId);
      if (!pitch || !pitch.isScammer || pitch.status !== 'pending') return state;
      if (!hasSufficientItem(state.inventory, pitch.itemId, 1)) {
        return { ...state, log: addLog(state.log, 'failure', `You don't have ${pitch.itemName} to counter with.`) };
      }
      // COUNTER-PITCH: flip the scam back — sell at 200% of offered price
      const counterValue = Math.round(pitch.offeredPrice * 2.0);
      const newInventory = state.inventory
        .map((i) => i.itemId === pitch.itemId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter((i) => i.quantity > 0);
      const ds = state.dailyStats;
      return {
        ...state,
        tenge: state.tenge + counterValue,
        charisma: Math.min(100, state.charisma + 5),
        reputation: Math.min(100, state.reputation + 3),
        inventory: newInventory,
        incomingPitches: state.incomingPitches.map((p) =>
          p.id === action.pitchId ? { ...p, status: 'accepted' as const } : p
        ),
        totalEarned: state.totalEarned + counterValue,
        salesCompleted: state.salesCompleted + 1,
        dailyStats: {
          ...ds,
          earned: ds.earned + counterValue,
          costOfGoods: ds.costOfGoods + (getItemById(pitch.itemId)?.buyPrice ?? 0),
          dealsWon: ds.dealsWon + 1,
          scammersDetected: ds.scammersDetected + 1,
          bestDeal: updateBestDeal(ds.bestDeal, counterValue, `COUNTER-PITCH vs ${pitch.sourceName}`),
        },
        log: addLog(state.log, 'success', `🎯 COUNTER-PITCH! You out-scammed ${pitch.sourceName} — ₸${counterValue.toLocaleString()} stolen right back! +5 charisma.`),
      };
    }

    case 'APPLY_RAID': {
      const raidPitch = generateRaidScammer(state.day, action.raiderName);
      return {
        ...state,
        incomingPitches: [raidPitch, ...state.incomingPitches],
        log: addLog(state.log, 'warning', `⚔️ RAIDED by ${action.raiderName}! A scammer just slipped into your pitches.`),
      };
    }

    case 'PAY_RAID_COST': {
      if (state.tenge < 500) return state;
      return {
        ...state,
        tenge: state.tenge - 500,
        log: addLog(state.log, 'info', `⚔️ Raid sent! ₸500 spent.`),
      };
    }

    // ─── Contracts ───────────────────────────────────────────────────────────

    case 'PROPOSE_CONTRACT': {
      const contract = getContractById(action.contractId);
      if (!contract) return state;
      if (state.charisma < contract.requiredCharisma) {
        return { ...state, log: addLog(state.log, 'failure', `Not enough charisma for this contract. Need ${contract.requiredCharisma}.`) };
      }
      const slot = state.availableContracts.find((c) => c.contractId === action.contractId);
      if (!slot) return state;
      return {
        ...state,
        activeContract: { ...slot, step: 'negotiating', counterRound: 0 },
        log: addLog(state.log, 'info', `Opened contract: ${contract.title}. "${contract.negotiationText}"`),
      };
    }

    case 'COUNTER_CONTRACT': {
      if (!state.activeContract) return state;
      const slot = state.activeContract;
      if (slot.counterRound >= 1) return state; // max 1 counter
      const contract = getContractById(slot.contractId);
      if (!contract) return state;
      const newOffer = Math.round(slot.currentOffer * 1.12); // counter bumps price up 12%
      return {
        ...state,
        activeContract: { ...slot, currentOffer: newOffer, counterRound: slot.counterRound + 1 },
        log: addLog(state.log, 'info', `Counter-offer sent: ₸${newOffer.toLocaleString()}. The other party is... considering.`),
      };
    }

    case 'ACCEPT_CONTRACT_TERMS': {
      if (!state.activeContract) return state;
      return {
        ...state,
        activeContract: { ...state.activeContract, step: 'ready_to_sign' },
        availableContracts: state.availableContracts.map((c) =>
          c.contractId === state.activeContract!.contractId ? { ...c, step: 'ready_to_sign', currentOffer: state.activeContract!.currentOffer } : c
        ),
        log: addLog(state.log, 'info', `Terms agreed at ₸${state.activeContract.currentOffer.toLocaleString()}. Contract ready to sign.`),
      };
    }

    case 'SIGN_CONTRACT': {
      const slot = state.availableContracts.find((c) => c.contractId === action.contractId && c.step === 'ready_to_sign');
      if (!slot) return state;
      const contract = getContractById(action.contractId);
      if (!contract) return state;
      const payout = slot.currentOffer;
      const ds = state.dailyStats;
      return {
        ...state,
        tenge: state.tenge + payout,
        charisma: Math.min(100, state.charisma + 5),
        reputation: Math.min(100, state.reputation + 8),
        totalEarned: state.totalEarned + payout,
        completedContracts: [...state.completedContracts, action.contractId],
        availableContracts: state.availableContracts.filter((c) => c.contractId !== action.contractId),
        activeContract: null,
        lifetimeStats: { ...state.lifetimeStats, contractsSigned: state.lifetimeStats.contractsSigned + 1 },
        dailyStats: { ...ds, earned: ds.earned + payout, dealsWon: ds.dealsWon + 1, bestDeal: updateBestDeal(ds.bestDeal, payout, `Contract: ${contract.title}`) },
        log: addLog(state.log, 'success', `✍ CONTRACT SIGNED: "${contract.title}" — ₸${payout.toLocaleString()} secured. ${contract.signingText}`),
      };
    }

    case 'DISMISS_CONTRACT':
      return { ...state, activeContract: null };

    // ─── Boss ─────────────────────────────────────────────────────────────────

    case 'START_BOSS':
      return {
        ...state,
        phase: 'boss',
        boss: {
          ...state.boss,
          active: true,
          playerHp: 100, bossHp: BOSS.maxHp,
          turn: 'player',
          abilityCooldowns: {}, bossAbilityCooldowns: {},
          bossNextAbility: randomBossAbility(),
          wolfHowlUsed: false,
          log: [`🦁 Yerlan: "So. The young wolf comes to my territory. Let's see what you've got."`],
        },
        log: addLog(state.log, 'boss', 'THE FINAL BOSS HAS APPEARED: Yerlan "The Godfather" Seitkali!'),
      };

    case 'BOSS_ACTION': {
      if (state.boss.turn !== 'player') return state;
      const ability = BOSS.playerAbilities.find((a) => a.id === action.abilityId);
      if (!ability) return state;
      if ((state.boss.abilityCooldowns[ability.id] || 0) > 0) return state;
      if (ability.id === 'wolf_howl' && state.boss.wolfHowlUsed) return state;

      let newTenge = state.tenge;
      if (ability.id === 'bribe') {
        if (state.tenge < 50000) return { ...state, boss: { ...state.boss, log: [...state.boss.log, '💸 Not enough tenge for a bribe!'] } };
        newTenge -= 50000;
      }

      const newBossHp = Math.max(0, state.boss.bossHp - ability.damage);
      const newCooldowns = { ...state.boss.abilityCooldowns, [ability.id]: ability.cooldown };

      if (newBossHp <= 0) {
        return {
          ...state, tenge: newTenge, phase: 'victory',
          boss: { ...state.boss, bossHp: 0, log: [...state.boss.log, `⚡ You used ${ability.name}! -${ability.damage} HP`, '🏆 YERLAN IS DEFEATED! You are the true Wolf of Almaty!'] },
          log: addLog(state.log, 'success', 'VICTORY! You defeated Yerlan "The Godfather"!'),
        };
      }

      const bossAbilityId = state.boss.bossNextAbility;
      const bossCd = state.boss.bossAbilityCooldowns[bossAbilityId] || 0;
      const actualBossAbility = bossCd > 0 ? BOSS.abilities[0] : BOSS.abilities.find((a) => a.id === bossAbilityId)!;
      const newPlayerHp = Math.max(0, state.boss.playerHp - actualBossAbility.damage);

      const newBossCooldowns: Record<string, number> = {};
      for (const [k, v] of Object.entries(state.boss.bossAbilityCooldowns)) {
        if (v > 1) newBossCooldowns[k] = v - 1;
      }
      newBossCooldowns[actualBossAbility.id] = actualBossAbility.cooldown;

      const finalPlayerCooldowns: Record<string, number> = {};
      for (const [k, v] of Object.entries(newCooldowns)) {
        if (v - 1 > 0) finalPlayerCooldowns[k] = v - 1;
      }

      const bossLog = [
        ...state.boss.log,
        `⚡ You: ${ability.name} — Yerlan takes ${ability.damage} damage!`,
        `🦁 Yerlan: ${actualBossAbility.name} — You take ${actualBossAbility.damage} damage!`,
      ];

      if (newPlayerHp <= 0) {
        return {
          ...state, tenge: newTenge, phase: 'defeat',
          boss: { ...state.boss, playerHp: 0, bossHp: newBossHp, log: [...bossLog, '💀 You have been crushed. Almaty belongs to Yerlan.'] },
          log: addLog(state.log, 'failure', 'DEFEAT. Yerlan crushed you like a steppe bug.'),
        };
      }

      return {
        ...state, tenge: newTenge,
        boss: {
          ...state.boss, playerHp: newPlayerHp, bossHp: newBossHp,
          abilityCooldowns: finalPlayerCooldowns,
          bossAbilityCooldowns: newBossCooldowns,
          bossNextAbility: randomBossAbility(),
          wolfHowlUsed: ability.id === 'wolf_howl' ? true : state.boss.wolfHowlUsed,
          log: bossLog,
        },
      };
    }

    default:
      return state;
  }
}