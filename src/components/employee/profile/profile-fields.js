/** A field counts as filled when it has text, or at least one chip. */
export const isFilled = (field) => (field.type === "chips" ? field.value.length > 0 : !!field.value.trim());

/** Display text for a field's value. */
export const fieldText = (field, chipSeparator = " · ") =>
  field.type === "chips" ? field.value.join(chipSeparator) : field.value;
