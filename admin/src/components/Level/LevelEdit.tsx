import { Edit, NumberInput, SimpleForm, TextInput } from "react-admin";

const LevelEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <NumberInput source="levelNumber" required />
      <NumberInput source="requiredXP" label="Required XP" required />
    </SimpleForm>
  </Edit>
);

export default LevelEdit;
