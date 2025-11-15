import * as db from "../lib/db";
import type { LayoutServerLoad, Actions } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
  return {
    holding: await db.getHoldingLocationWithContents(),
  };
};
