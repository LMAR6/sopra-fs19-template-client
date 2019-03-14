import { isProduction } from "./isProduction";

/**
 * This helper function return the current domain of the API. If is production, the Production Heroku URL will returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port)
 * @returns {string}
 */
export const getDomain = () => {
  const prodUrl = "https://dashboard.heroku.com/apps/sopra-fs19-mueller-l-server"; // TODO: insert your groups heroku prod url for server (once deployed)
  const devUrl = "http://localhost:8080";
  if (isProduction()) {
    return prodUrl;
  }
  return devUrl;
};
