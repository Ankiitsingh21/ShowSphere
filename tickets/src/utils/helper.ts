import mongoose from "mongoose";

function updateIfCurrentPlugin(schema: mongoose.Schema) {
  schema.set("versionKey", "version");

  schema.pre("save", async function () {
    if (!this.isNew) {
      const currentVersion = this.get("version") as number;
      // @ts-ignore
      this.$where = { version: currentVersion };
      // increment local doc version before saving
      this.set("version", currentVersion + 1);
    }
  });
}

export { updateIfCurrentPlugin };
