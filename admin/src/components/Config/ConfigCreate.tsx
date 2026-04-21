import { Create, SimpleForm, TextInput } from "react-admin";

const ConfigCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="key" required />
      <TextInput source="value" required />
    </SimpleForm>
  </Create>
);

export default ConfigCreate;
