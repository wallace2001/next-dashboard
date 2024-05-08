/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/dashboard",
  "/dashboard/home",
  "/dashboard/about",
  "/dashboard/articles",
  "/dashboard/curriculum",
  "/dashboard/experiences",
  "/dashboard/projects",
  "/dashboard/projects/[projectId]",
  "/dashboard/articles/[articleId]",
  "/dashboard/articles/new-article",
  "/dashboard/projects/new-project",
  "/dashboard/:path*",
  "/profile"
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/dashboard";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";