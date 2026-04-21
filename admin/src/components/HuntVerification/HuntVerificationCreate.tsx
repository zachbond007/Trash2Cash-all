import {
  AutocompleteInput,
  BooleanInput,
  Create,
  ReferenceInput,
  SelectInput,
  SimpleForm,
} from "react-admin";
import { trashAmounts } from "./TrashAmounts";

const HuntVerificationCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="huntId" reference="hunts">
        <AutocompleteInput optionText={(v) => `${v.id}`} />
      </ReferenceInput>
      <ReferenceInput source="verifiedBy" reference="users">
        <AutocompleteInput optionText={(v) => `${v.name}`} />
      </ReferenceInput>
      <BooleanInput source="isTrashThrown" required />
      <SelectInput source="howMuchTrash" choices={trashAmounts} />
    </SimpleForm>
  </Create>
);

export default HuntVerificationCreate;
