import {
  AutocompleteInput,
  BooleanInput,
  DateInput,
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";

const VoucherEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="lmdId" />
      <TextInput source="title" />
      <TextInput source="store" />
      <TextInput source="description" />
      <TextInput source="code" />
      <TextInput source="link" />
      <TextInput source="smartLink" />
      <TextInput source="categories" />
      <TextInput source="offer" />
      <TextInput source="offerValue" />
      <DateInput source="startDate" />
      <DateInput source="endDate" />
      <NumberInput source="level" required />
      <BooleanInput source="isActive" />
      <ReferenceInput source="merchantId" reference="merchants" isRequired>
        <AutocompleteInput optionText={(v) => `${v.name}`} isRequired />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default VoucherEdit;
