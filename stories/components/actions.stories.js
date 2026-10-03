export default {
  title: "Components/Button",
  args: { label: "Explore the history →", variant: "red", disabled: false, onDark: false },
  argTypes: { variant: { control: "select", options: ["default", "red", "gold", "line", "line dark-text"] } },
  render: ({ label, variant, disabled, onDark }) =>
    `<div class="sb-pad ${onDark ? "dark" : ""}" style="min-height:160px"><button class="btn ${variant === "default" ? "" : variant}" ${disabled ? "disabled" : ""}>${label}</button></div>`,
};

export const Red = {};
export const Ink = { args: { variant: "default", label: "Add" } };
export const Gold = { args: { variant: "gold", label: "Shop the collection →" } };
export const LineOnDark = { name: "Line (on dark)", args: { variant: "line", label: "Discover the story →", onDark: true } };
export const LineOnPaper = { name: "Line (on paper)", args: { variant: "line dark-text", label: "Explore more then & now →" } };
export const Disabled = { args: { disabled: true, label: "Checkout securely" } };

export const AllVariants = {
  name: "All variants",
  render: () => `<div class="sb-pad stack stack-lg">
    <div class="cluster"><button class="btn">Ink</button><button class="btn red">Red</button><button class="btn gold">Gold</button><button class="btn line dark-text">Line</button><button class="btn red" disabled>Disabled</button></div>
    <div class="dark cluster" style="padding:var(--space-5)"><button class="btn line">Line on dark</button><button class="btn gold">Gold on dark</button></div>
    <div class="cluster"><a class="arrow-link" href="#">Arrow link</a></div>
  </div>`,
};
