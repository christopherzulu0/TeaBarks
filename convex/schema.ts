import { defineSchema, defineTable } from "convex/server";
import {
  barkCommentFields,
  barkDocFields,
  barkLikeFields,
  barkSaveFields,
  barkReportFields,
  creatorReviewFields,
  caseDocFields,
  caseFollowFields,
  caseSaveFields,
  caseReportFields,
  creatorDocFields,
  creatorFollowFields,
  evidenceUploadFields,
  membershipFields,
  organizationFields,
  subscriptionFields,
  userFields,
  webhookEventFields,
  writerDocFields,
  storyChapterDocFields,
  storyCommentFields,
  storyDocFields,
  storyLikeFields,
  storyReadFields,
  storyReportFields,
  storyWriterFollowFields,
  sourceSaveFields,
  userFollowFields,
  notificationFields,
  notificationPrefsFields,
  contestDocFields,
  contestEntryFields,
  contestJudgmentFields,
  messageThreadFields,
  messageMembershipFields,
  messageFields,
  moderationEventFields,
  userSettingsFields,
} from "./lib/validators";

export default defineSchema({
  users: defineTable(userFields)
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"]),
  organizations: defineTable(organizationFields).index("by_clerkId", [
    "clerkId",
  ]),
  memberships: defineTable(membershipFields).index("by_clerkUserId", [
    "clerkUserId",
  ]),
  subscriptions: defineTable(subscriptionFields).index("by_clerkId", [
    "clerkId",
  ]),
  webhookEvents: defineTable(webhookEventFields),
  evidenceUploads: defineTable(evidenceUploadFields).index("by_storageId", [
    "storageId",
  ]),
  barks: defineTable(barkDocFields)
    .index("by_code", ["code"])
    .index("by_status_publishedAt", ["status", "publishedAt"])
    .index("by_status_country", ["status", "country"])
    .index("by_org_status_publishedAt", ["orgClerkId", "status", "publishedAt"])
    .index("by_author", ["authorClerkId"])
    .index("by_author_status_publishedAt", [
      "authorClerkId",
      "status",
      "publishedAt",
    ])
    .index("by_sourceCreator_status_publishedAt", [
      "sourceCreatorId",
      "status",
      "publishedAt",
    ]),
  creatorReviews: defineTable(creatorReviewFields)
    .index("by_code", ["code"])
    .index("by_status_publishedAt", ["status", "publishedAt"])
    .index("by_creator_status_publishedAt", [
      "creatorId",
      "status",
      "publishedAt",
    ])
    .index("by_author", ["authorClerkId"]),
  barkLikes: defineTable(barkLikeFields)
    .index("by_bark_user", ["barkId", "clerkUserId"])
    .index("by_bark", ["barkId"]),
  barkSaves: defineTable(barkSaveFields)
    .index("by_bark_user", ["barkId", "clerkUserId"])
    .index("by_user", ["clerkUserId"]),
  barkComments: defineTable(barkCommentFields).index("by_bark_created", [
    "barkId",
    "createdAt",
  ]),
  barkReports: defineTable(barkReportFields).index("by_bark", ["barkId"]),
  cases: defineTable(caseDocFields)
    .index("by_code", ["code"])
    .index("by_status_updatedAt", ["status", "updatedAt"])
    .index("by_updatedAt", ["updatedAt"])
    .index("by_category_updatedAt", ["category", "updatedAt"])
    .index("by_creatorId_updatedAt", ["creatorId", "updatedAt"])
    .index("by_openedBy_updatedAt", ["openedByClerkId", "updatedAt"])
    .index("by_org_updatedAt", ["orgClerkId", "updatedAt"]),
  caseFollows: defineTable(caseFollowFields)
    .index("by_case_user", ["caseId", "clerkUserId"])
    .index("by_case", ["caseId"]),
  caseSaves: defineTable(caseSaveFields)
    .index("by_case_user", ["caseId", "clerkUserId"])
    .index("by_user", ["clerkUserId"]),
  caseReports: defineTable(caseReportFields).index("by_case", ["caseId"]),
  creators: defineTable(creatorDocFields)
    .index("by_handle", ["handle"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_applicant", ["applicantClerkId"])
    .index("by_applicationCode", ["applicationCode"])
    .index("by_external_identity", ["externalPlatform", "externalHandle"]),
  creatorFollows: defineTable(creatorFollowFields)
    .index("by_creator_user", ["creatorId", "clerkUserId"])
    .index("by_user", ["clerkUserId"]),
  userFollows: defineTable(userFollowFields)
    .index("by_target_user", ["targetClerkId", "clerkUserId"])
    .index("by_user", ["clerkUserId"]),
  notifications: defineTable(notificationFields)
    .index("by_user_created", ["recipientClerkId", "createdAt"])
    .index("by_user_read", ["recipientClerkId", "read"]),
  notificationPrefs: defineTable(notificationPrefsFields).index("by_user", [
    "clerkUserId",
  ]),
  sourceSaves: defineTable(sourceSaveFields)
    .index("by_user", ["clerkUserId"])
    .index("by_user_url", ["clerkUserId", "sourceUrl"]),
  writers: defineTable(writerDocFields)
    .index("by_handle", ["handle"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_applicant", ["applicantClerkId"])
    .index("by_applicationCode", ["applicationCode"]),
  stories: defineTable(storyDocFields)
    .index("by_slug", ["slug"])
    .index("by_writerId_updatedAt", ["writerId", "updatedAt"])
    .index("by_visibility_updatedAt", ["visibility", "updatedAt"])
    .index("by_visibility_genre_updatedAt", [
      "visibility",
      "genre",
      "updatedAt",
    ]),
  storyChapters: defineTable(storyChapterDocFields)
    .index("by_story_number", ["storyId", "number"])
    .index("by_story_status", ["storyId", "status"]),
  storyLikes: defineTable(storyLikeFields).index("by_story_user", [
    "storyId",
    "clerkUserId",
  ]),
  storyWriterFollows: defineTable(storyWriterFollowFields).index(
    "by_writer_user",
    ["writerId", "clerkUserId"]
  ),
  storyComments: defineTable(storyCommentFields).index("by_story_created", [
    "storyId",
    "createdAt",
  ]),
  storyReports: defineTable(storyReportFields).index("by_story", ["storyId"]),
  storyReads: defineTable(storyReadFields).index("by_story_user", [
    "storyId",
    "clerkUserId",
  ]),
  contests: defineTable(contestDocFields)
    .index("by_slug", ["slug"])
    .index("by_status_deadline", ["status", "deadlineAt"]),
  contestEntries: defineTable(contestEntryFields)
    .index("by_contest_writer", ["contestId", "writerId"])
    .index("by_writer", ["writerId"])
    .index("by_contest", ["contestId"]),
  contestJudgments: defineTable(contestJudgmentFields)
    .index("by_entry_judge", ["entryId", "clerkUserId"])
    .index("by_contest", ["contestId"]),
  messageThreads: defineTable(messageThreadFields).index("by_pairKey", [
    "pairKey",
  ]),
  messageMemberships: defineTable(messageMembershipFields)
    .index("by_user_last", ["clerkUserId", "lastMessageAt"])
    .index("by_thread_user", ["threadId", "clerkUserId"]),
  messages: defineTable(messageFields).index("by_thread_created", [
    "threadId",
    "createdAt",
  ]),
  moderationEvents: defineTable(moderationEventFields).index("by_createdAt", [
    "createdAt",
  ]),
  userSettings: defineTable(userSettingsFields).index("by_user", [
    "clerkUserId",
  ]),
});
