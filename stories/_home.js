// Pulls individual homepage sections out of src/pages/index.html so stories never drift from the site.
import raw from "../src/pages/index.html?raw";
import { parsePage } from "../src/layout.mjs";

const { body } = parsePage(raw);
export const homeSections = body.match(/<section[\s\S]*?\n<\/section>/g);
export const homeSection = (i) => homeSections[i];
