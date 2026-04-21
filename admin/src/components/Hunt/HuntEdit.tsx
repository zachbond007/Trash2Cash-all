import {
  AutocompleteInput,
  Edit,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import { huntStatuses } from "./HuntStatuses";
import { verifiedAsOptions } from "./VerifiedAsOptions";

const HuntEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <ReferenceInput source="userId" reference="users">
        <AutocompleteInput optionText={(v) => `${v.username} - ${v.email}`} />
      </ReferenceInput>
      <TextInput source="imageKey" required />
      <SelectInput source="status" choices={huntStatuses} />
      <SelectInput source="verifiedAs" choices={verifiedAsOptions} />
      <TextInput source="earnedXP" label="Earned XP" />
    </SimpleForm>
  </Edit>
);

export default HuntEdit;
