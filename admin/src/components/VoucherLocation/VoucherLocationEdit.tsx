import {
  AutocompleteInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";

const VoucherLocationEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <ReferenceInput source="voucherId" reference="vouchers">
        <AutocompleteInput optionText={(v) => `${v.title}`} />
      </ReferenceInput>
      <ReferenceInput source="locationId" reference="locations">
        <AutocompleteInput optionText={(v) => `${v.name}`} />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default VoucherLocationEdit;
