import mongoose from "mongoose";

function updateIfCurrentPlugin(schema: mongoose.Schema) {
  // 1. Rename __v to version
  schema.set("versionKey", "version");

  // 2. Add OCC pre-save hook
  schema.pre("save", async function () {
    if (!this.isNew) {
      // @ts-ignore
      this.$where = { version: this.get("version") };
    }
  });
}

export { updateIfCurrentPlugin };