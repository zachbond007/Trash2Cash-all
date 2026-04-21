import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";

const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="username" required />
      <TextInput source="email" required />
      <TextInput source="passwordHash" required type="password" />
      <DateInput source="birthday" />
      <TextInput source="currentLevel" />
      <TextInput source="earnedXP" label="Earned XP" />
      <TextInput source="imageKey" />
      <ReferenceInput source="roleId" reference="roles">
        <AutocompleteInput optionText={(v) => `${v.name}`} />
      </ReferenceInput>
      <BooleanInput source="active" />
      <BooleanInput source="isVerified" />
    </SimpleForm>
  </Create>
);

export default UserCreate;
