import { Certification } from '../types';

/**
 * Cloud and DevOps credentials.
 *
 * Intentionally empty for now — the shape is defined ahead of the content so that
 * adding a certification is pure content entry with no structural work.
 *
 * Example of a completed credential:
 *   {
 *     name: "AWS Certified Solutions Architect – Associate",
 *     issuer: "Amazon Web Services",
 *     year: "2025",
 *     status: "completed",
 *     tier: "associate",
 *     credlyUrl: "https://www.credly.com/badges/..."
 *   }
 *
 * `credlyUrl` is optional: an in-progress credential has no badge to link yet.
 */
export const certifications: Certification[] = [];
