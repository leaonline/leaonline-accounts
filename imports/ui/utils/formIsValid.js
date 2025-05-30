/* global AutoForm */

/**
 * Reactively checks a form for input validity by a given schema.
 * Side-effect: adds sticky validation errors if form is not valid
 * @param formId {string}
 * @param schema {object}
 * @param isUpdate {boolean=}
 * @param debug {function=}
 * @return {Object|null} form document if form is valid, otherwise null
 */
export const formIsValid = function formIsValid(
	formId,
	schema,
	isUpdate,
	debug,
) {
	const formDoc = isUpdate
		? AutoForm.getFormValues(formId).updateDoc
		: AutoForm.getFormValues(formId).insertDoc
	let options
	if (isUpdate) {
		options = {}
		options.modifier = true
	}
	const context = schema.newContext()
	context.validate(formDoc, options)
	const errors = context.validationErrors()
	if (errors && errors.length > 0) {
		if (debug) debug(errors)
		for (const err of errors) {
			AutoForm.addStickyValidationError(formId, err.key, err.type, err.value)
		}
		return null
	}

	return formDoc
}

export const removeErrors = function removeErrors(formId) {
	AutoForm.removeStickyValidationError(formId)
}

/**
 * Resets a form by id.
 * @param formId
 * @return {undefined}
 */
export const formReset = (formId) => AutoForm.resetForm(formId)
