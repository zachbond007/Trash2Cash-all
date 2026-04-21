import { Edit, SimpleForm, TextInput } from "react-admin";

const RoleEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" required />
    </SimpleForm>
  </Edit>
);

export default RoleEdit;
