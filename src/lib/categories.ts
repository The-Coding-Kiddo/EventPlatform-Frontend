export const CATEGORIES = [
  "Technology",
  "Education",
  "Art",
  "Music",
  "Food",
  "Sports",
  "Business",
  "Health",
] as const

export type Category = (typeof CATEGORIES)[number]
