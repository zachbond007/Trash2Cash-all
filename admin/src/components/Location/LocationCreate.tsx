import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  AutocompleteInput,
  ReferenceInput,
} from "react-admin";

const LocationCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="address" required />
      <NumberInput source="lat" />
      <NumberInput source="lng" />
      <ReferenceInput source="merchantId" reference="merchants">
        <AutocompleteInput optionText={(v) => `${v.name}`} />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export default LocationCreate;
