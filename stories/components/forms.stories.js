import raw from "../../src/pages/support.html?raw";
import { initSubmitForm } from "../../public/app.js";

export default { title: "Forms" };

const form = raw.match(/<form class="form"[\s\S]*?<\/form>/)[0];

export const ArchiveSubmission = {
  name: "Archive submission",
  render: () => {
    const d = document.createElement("div");
    d.className = "sb-pad";
    d.style.maxWidth = "640px";
    d.innerHTML = form;
    initSubmitForm(d.querySelector("form"));
    return d;
  },
};

export const Fields = {
  render: () => `<div class="sb-pad" style="max-width:520px"><div class="form">
    <label>Text<input placeholder="Your name"></label>
    <label>With help text<small>An estimate is fine</small><input></label>
    <label>Textarea<textarea></textarea></label>
    <label class="check"><input type="checkbox" checked> I give permission to display and archive this.</label>
    <p class="form-status ok">Thank you. Your contribution has been received.</p>
    <p class="form-status err">Please check your email address.</p>
  </div></div>`,
};
