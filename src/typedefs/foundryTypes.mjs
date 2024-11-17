// From resources/app/common/data/fields.mjs

/**
 * @callback DataFieldValidator
 * A Custom DataField validator function.
 *
 * A boolean return value indicates that the value is valid (true) or invalid (false) with certainty. With an explicit
 * boolean return value no further validation functions will be evaluated.
 *
 * An undefined return indicates that the value may be valid but further validation functions should be performed,
 * if defined.
 *
 * An Error may be thrown which provides a custom error message explaining the reason the value is invalid.
 *
 * @param {any} value                     The value provided for validation
 * @param {DataFieldValidationOptions} options  Validation options
 * @returns {boolean|void}
 * @throws {Error}
 */

/**
 * @typedef {Object} DataFieldOptions
 * @property {boolean} [required=false]   Is this field required to be populated?
 * @property {boolean} [nullable=false]   Can this field have null values?
 * @property {boolean} [gmOnly=false]     Can this field only be modified by a gamemaster or assistant gamemaster?
 * @property {Function|*} [initial]       The initial value of a field, or a function which assigns that initial value.
 * @property {string} [label]             A localizable label displayed on forms which render this field.
 * @property {string} [hint]              Localizable help text displayed on forms which render this field.
 * @property {DataFieldValidator} [validate] A custom data field validation function.
 * @property {string} [validationError]   A custom validation error string. When displayed will be prepended with the
 *                                        document name, field name, and candidate value. This error string is only
 *                                        used when the return type of the validate function is a boolean. If an Error
 *                                        is thrown in the validate function, the string message of that Error is used.
 */

/**
 * @typedef {Object} DataFieldContext
 * @property {string} [name]               A field name to assign to the constructed field
 * @property {DataField} [parent]          Another data field which is a hierarchical parent of this one
 */

/**
 * @typedef {object} DataFieldValidationOptions
 * @property {boolean} [partial]   Whether this is a partial schema validation, or a complete one.
 * @property {boolean} [fallback]  Whether to allow replacing invalid values with valid fallbacks.
 * @property {object} [source]     The full source object being evaluated.
 * @property {boolean} [dropInvalidEmbedded]  If true, invalid embedded documents will emit a warning and be placed in
 *                                            the invalidDocuments collection rather than causing the parent to be
 *                                            considered invalid.
 */

/**
 * Field Types
 * @typedef {object} DataField
 * @typedef {object} AlphaField
 * @typedef {object} AngleField
 * @typedef {object} AnyField
 * @typedef {object} ArrayField
 * @typedef {object} BooleanField
 * @typedef {object} ColorField
 * @typedef {object} DataField

 * @typedef {object} DocumentIdField
 * @typedef {object} DocumentOwnershipField
 * @typedef {object} DocumentStatsField
 * @typedef {object} DocumentTypeField
 * @typedef {object} DocumentUUIDField
 * @typedef {object} EmbeddedDataField
 * @typedef {object} EmbeddedCollectionField
 * @typedef {object} EmbeddedCollectionDeltaField
 * @typedef {object} EmbeddedDocumentField
 * @typedef {object} FilePathField
 * @typedef {object} ForeignDocumentField
 * @typedef {object} HTMLField
 * @typedef {object} HueField
 * @typedef {object} IntegerSortField
 * @typedef {object} JavaScriptField
 * @typedef {object} JSONField
 * @typedef {object} NumberField
 * @typedef {object} ObjectField
 * @typedef {object} TypedSchemaField
 * @typedef {object} SchemaField
 * @typedef {object} SetField
 * @typedef {object} StringField
 * @typedef {object} TypeDataField
 * 
 */
