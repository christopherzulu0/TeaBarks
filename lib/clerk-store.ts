import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

export type SyncedUser = {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  updatedAt: string;
};

export type SyncedOrg = {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
};

export type SyncedMembership = {
  id: string;
  orgId: string;
  userId: string;
  role: string;
  updatedAt: string;
};

export type SyncedSubscription = {
  id: string;
  payerId: string;
  status: string;
  plan?: string;
  updatedAt: string;
};

export type SyncedEvent = {
  id: string;
  type: string;
  at: string;
};

export type ClerkSyncStore = {
  users: SyncedUser[];
  organizations: SyncedOrg[];
  memberships: SyncedMembership[];
  subscriptions: SyncedSubscription[];
  events: SyncedEvent[];
};

const FILE = path.join(process.cwd(), "data", "clerk-sync.json");

function emptyStore(): ClerkSyncStore {
  return {
    users: [],
    organizations: [],
    memberships: [],
    subscriptions: [],
    events: [],
  };
}

export function readClerkStore(): ClerkSyncStore {
  try {
    if (!existsSync(FILE)) return emptyStore();
    return JSON.parse(readFileSync(FILE, "utf8")) as ClerkSyncStore;
  } catch {
    return emptyStore();
  }
}

export function writeClerkStore(store: ClerkSyncStore): void {
  mkdirSync(path.dirname(FILE), { recursive: true });
  const trimmed = {
    ...store,
    events: store.events.slice(-80),
  };
  writeFileSync(FILE, JSON.stringify(trimmed, null, 2), "utf8");
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) return [...list, item];
  const next = [...list];
  next[i] = item;
  return next;
}

export function recordEvent(type: string, id: string): void {
  const store = readClerkStore();
  store.events.push({ id, type, at: new Date().toISOString() });
  writeClerkStore(store);
}

export function upsertUser(user: SyncedUser): void {
  const store = readClerkStore();
  store.users = upsert(store.users, user);
  writeClerkStore(store);
}

export function deleteUser(id: string): void {
  const store = readClerkStore();
  store.users = store.users.filter((u) => u.id !== id);
  store.memberships = store.memberships.filter((m) => m.userId !== id);
  writeClerkStore(store);
}

export function upsertOrg(org: SyncedOrg): void {
  const store = readClerkStore();
  store.organizations = upsert(store.organizations, org);
  writeClerkStore(store);
}

export function deleteOrg(id: string): void {
  const store = readClerkStore();
  store.organizations = store.organizations.filter((o) => o.id !== id);
  store.memberships = store.memberships.filter((m) => m.orgId !== id);
  writeClerkStore(store);
}

export function upsertMembership(membership: SyncedMembership): void {
  const store = readClerkStore();
  store.memberships = upsert(store.memberships, membership);
  writeClerkStore(store);
}

export function deleteMembership(id: string): void {
  const store = readClerkStore();
  store.memberships = store.memberships.filter((m) => m.id !== id);
  writeClerkStore(store);
}

export function upsertSubscription(sub: SyncedSubscription): void {
  const store = readClerkStore();
  store.subscriptions = upsert(store.subscriptions, sub);
  writeClerkStore(store);
}
