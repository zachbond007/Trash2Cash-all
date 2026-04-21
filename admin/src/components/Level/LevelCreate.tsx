import { Create, NumberInput, SimpleForm } from "react-admin";

const LevelCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="levelNumber" required />
      <NumberInput source="requiredXP" label="Required XP" required />
    </SimpleForm>
  </Create>
);

export default LevelCreate;
