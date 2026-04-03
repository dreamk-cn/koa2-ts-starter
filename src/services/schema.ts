import { z } from 'zod';

const baseSchema = z.object({
  roomId: z.string().min(1),
  userId: z.string().optional(),
  userName: z.string().optional()
});

const joinSchema = baseSchema.extend({
  type: z.literal('join'),
});

const leaveSchema = baseSchema.extend({
  type: z.literal('leave')
});

const offerSchema = baseSchema.extend({
  type: z.literal('offer'),
  data: z.object({
    type: z.literal('offer'),
    sdp: z.string()
  })
});

const answerSchema = baseSchema.extend({
  type: z.literal('answer'),
  data: z.object({
    type: z.literal('answer'),
    sdp: z.string()
  })
});

const iceCandidateSchema = baseSchema.extend({
  type: z.literal('ice-candidate'),
  data: z.object({
    candidate: z.string(),
    sdpMid: z.string().nullable().optional(),
    sdpMLineIndex: z.number().nullable().optional()
  })
});

export const messageSchema = z.discriminatedUnion('type', [
  joinSchema,
  leaveSchema,
  offerSchema,
  answerSchema,
  iceCandidateSchema
]);