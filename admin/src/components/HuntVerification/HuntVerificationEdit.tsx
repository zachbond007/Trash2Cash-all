import {
  AutocompleteInput,
  BooleanInput,
  Edit,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import { trashAmounts } from "./TrashAmounts";

const HuntVerificationEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <ReferenceInput source="huntId" reference="hunts">
        <AutocompleteInput optionText={(v) => `${v.id}`} />
      </ReferenceInput>
      <ReferenceInput source="verifiedBy" reference="users">
        <AutocompleteInput optionText={(v) => `${v.username} - ${v.email}`} />
      </ReferenceInput>
      <BooleanInput source="isTrashThrown" required />
      <SelectInput source="howMuchTrash" choices={trashAmounts} />
    </SimpleForm>
  </Edit>
);

export default HuntVerificationEdit;
