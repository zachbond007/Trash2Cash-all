import { Edit, SimpleForm, TextInput } from "react-admin";

const ConfigEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="key" required />
      <TextInput source="value" required />
    </SimpleForm>
  </Edit>
);

export default ConfigEdit;
