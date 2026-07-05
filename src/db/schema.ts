import { relations } from "drizzle-orm";
import {
  amenities,
  amenitySuggestions,
  parkAmenities,
  parks,
  regions,
} from "./public";
import {
  badgeDefinitions,
  earnedBadges,
  familyGroups,
  familyMembers,
  familyParkPreferences,
  questBoards,
  questDefinitions,
  questProgress,
  visits,
  xpEvents,
} from "./private";
import { user, session, account } from "./auth";

export * from "./enums";
export * from "./public";
export * from "./private";
export * from "./auth";

// --- Public atlas relations ---

export const regionsRelations = relations(regions, ({ many }) => ({
  parks: many(parks),
}));

export const parksRelations = relations(parks, ({ one, many }) => ({
  region: one(regions, {
    fields: [parks.regionId],
    references: [regions.id],
  }),
  parkAmenities: many(parkAmenities),
  amenitySuggestions: many(amenitySuggestions),
  visits: many(visits),
  familyPreferences: many(familyParkPreferences),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  parkAmenities: many(parkAmenities),
  amenitySuggestions: many(amenitySuggestions),
}));

export const parkAmenitiesRelations = relations(parkAmenities, ({ one }) => ({
  park: one(parks, {
    fields: [parkAmenities.parkId],
    references: [parks.id],
  }),
  amenity: one(amenities, {
    fields: [parkAmenities.amenityId],
    references: [amenities.id],
  }),
}));

export const amenitySuggestionsRelations = relations(
  amenitySuggestions,
  ({ one }) => ({
    park: one(parks, {
      fields: [amenitySuggestions.parkId],
      references: [parks.id],
    }),
    amenity: one(amenities, {
      fields: [amenitySuggestions.amenityId],
      references: [amenities.id],
    }),
    submittedBy: one(user, {
      relationName: "submittedBy",
      fields: [amenitySuggestions.submittedByUserId],
      references: [user.id],
    }),
    reviewedBy: one(user, {
      relationName: "reviewedBy",
      fields: [amenitySuggestions.reviewedByUserId],
      references: [user.id],
    }),
  }),
);

// --- Private family progress relations ---

export const familyGroupsRelations = relations(familyGroups, ({ many }) => ({
  members: many(familyMembers),
  visits: many(visits),
  xpEvents: many(xpEvents),
  earnedBadges: many(earnedBadges),
  questProgress: many(questProgress),
  questBoards: many(questBoards),
  parkPreferences: many(familyParkPreferences),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  familyGroup: one(familyGroups, {
    fields: [familyMembers.familyGroupId],
    references: [familyGroups.id],
  }),
  user: one(user, {
    fields: [familyMembers.userId],
    references: [user.id],
  }),
}));

export const familyParkPreferencesRelations = relations(
  familyParkPreferences,
  ({ one }) => ({
    familyGroup: one(familyGroups, {
      fields: [familyParkPreferences.familyGroupId],
      references: [familyGroups.id],
    }),
    park: one(parks, {
      fields: [familyParkPreferences.parkId],
      references: [parks.id],
    }),
  }),
);

export const visitsRelations = relations(visits, ({ one, many }) => ({
  familyGroup: one(familyGroups, {
    fields: [visits.familyGroupId],
    references: [familyGroups.id],
  }),
  park: one(parks, {
    fields: [visits.parkId],
    references: [parks.id],
  }),
  xpEvents: many(xpEvents),
}));

export const xpEventsRelations = relations(xpEvents, ({ one }) => ({
  familyGroup: one(familyGroups, {
    fields: [xpEvents.familyGroupId],
    references: [familyGroups.id],
  }),
  sourceVisit: one(visits, {
    fields: [xpEvents.sourceVisitId],
    references: [visits.id],
  }),
}));

export const badgeDefinitionsRelations = relations(
  badgeDefinitions,
  ({ many }) => ({
    earnedBadges: many(earnedBadges),
  }),
);

export const earnedBadgesRelations = relations(earnedBadges, ({ one }) => ({
  familyGroup: one(familyGroups, {
    fields: [earnedBadges.familyGroupId],
    references: [familyGroups.id],
  }),
  badgeDefinition: one(badgeDefinitions, {
    fields: [earnedBadges.badgeDefinitionId],
    references: [badgeDefinitions.id],
  }),
}));

export const questDefinitionsRelations = relations(
  questDefinitions,
  ({ many }) => ({
    questProgress: many(questProgress),
  }),
);

export const questBoardsRelations = relations(questBoards, ({ one, many }) => ({
  familyGroup: one(familyGroups, {
    fields: [questBoards.familyGroupId],
    references: [familyGroups.id],
  }),
  questProgress: many(questProgress),
}));

export const questProgressRelations = relations(questProgress, ({ one }) => ({
  familyGroup: one(familyGroups, {
    fields: [questProgress.familyGroupId],
    references: [familyGroups.id],
  }),
  questBoard: one(questBoards, {
    fields: [questProgress.questBoardId],
    references: [questBoards.id],
  }),
  questDefinition: one(questDefinitions, {
    fields: [questProgress.questDefinitionId],
    references: [questDefinitions.id],
  }),
}));

// --- Auth relations ---

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  familyMemberships: many(familyMembers),
  submittedAmenitySuggestions: many(amenitySuggestions, {
    relationName: "submittedBy",
  }),
  reviewedAmenitySuggestions: many(amenitySuggestions, {
    relationName: "reviewedBy",
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
