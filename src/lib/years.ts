import { cacheLife } from "next/cache";
import { yearsOfExperience } from "@/content";

/*
  Reading the clock during prerender needs a cache boundary with Cache Components.
  Both values refresh daily, so the static page never goes stale.
*/

export async function getYearsOfExperience(): Promise<number> {
  "use cache";
  cacheLife("days");
  return yearsOfExperience();
}

export async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getUTCFullYear();
}
