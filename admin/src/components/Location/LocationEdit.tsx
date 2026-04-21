import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  AutocompleteInput,
  ReferenceInput,
} from "react-admin";

const LocationEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" required />
      <TextInput source="address" required />
      <NumberInput source="lat" required />
      <NumberInput source="lng" required />
      <ReferenceInput source="merchantId" reference="merchants">
        <AutocompleteInput optionText={(v) => `${v.name}`} />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default LocationEdit;
