import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  AutocompleteInput,
  BooleanInput,
  ReferenceInput,
} from "react-admin";

const UserEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" required />
      <TextInput source="username" required />
      <TextInput source="email" required />
      <TextInput source="passwordHash" required type="password" />
      <DateInput source="birthday" />
      <TextInput source="currentLevel" />
      <TextInput source="earnedXP" label="Earned XP" />
      {/* <ImageField source="imageKey" /> */}
      <ReferenceInput source="roleId" reference="roles">
        <AutocompleteInput optionText={(v) => `${v.name}`} />
      </ReferenceInput>
      <BooleanInput source="active" />
      <BooleanInput source="isVerified" />
    </SimpleForm>
  </Edit>
);

export default UserEdit;
