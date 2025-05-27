import { Meteor } from "meteor/meteor";
import createSettingsValidator from "../../../.settingsschema";
import SimpleSchema from "meteor/aldeed:simple-schema";

const validate = createSettingsValidator(SimpleSchema);
validate(Meteor.settings);
