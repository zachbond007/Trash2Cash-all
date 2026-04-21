import {
  AutocompleteInput,
  Create,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import { huntStatuses } from "./HuntStatuses";
import { verifiedAsOptions } from "./VerifiedAsOptions";

const HuntCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users">
        <AutocompleteInput optionText={(v) => `${v.username} - ${v.email}`} />
      </ReferenceInput>
      <TextInput source="imageKey" required />
      <SelectInput source="status" choices={huntStatuses} />
      <SelectInput source="verifiedAs" choices={verifiedAsOptions} />
      <TextInput source="earnedXP" label="Earned XP" />
    </SimpleForm>
  </Create>
);

export default HuntCreate;
