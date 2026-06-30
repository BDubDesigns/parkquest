import { relations } from "drizzle-orm";
import { amenities, parkAmenities, parks, regions } from "./public";
import {
  badgeDefinitions,
  earnedBadges,
  familyGroups,
  familyMembers,
  questDefinitions,
  questProgress,
  visits,
  xpEvents,
} from "./private";

export * from "./enums";
export * from "./public";
export * from "./private";

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
  visits: many(visits),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  parkAmenities: many(parkAmenities),
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

// --- Private family progress relations ---

export const familyGroupsRelations = relations(familyGroups, ({ many }) => ({
  members: many(familyMembers),
  visits: many(visits),
  xpEvents: many(xpEvents),
  earnedBadges: many(earnedBadges),
  questProgress: many(questProgress),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  familyGroup: one(familyGroups, {
    fields: [familyMembers.familyGroupId],
    references: [familyGroups.id],
  }),
}));

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

export const questProgressRelations = relations(questProgress, ({ one }) => ({
  familyGroup: one(familyGroups, {
    fields: [questProgress.familyGroupId],
    references: [familyGroups.id],
  }),
  questDefinition: one(questDefinitions, {
    fields: [questProgress.questDefinitionId],
    references: [questDefinitions.id],
  }),
}));
