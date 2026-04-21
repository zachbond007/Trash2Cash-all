import {
  AutocompleteInput,
  Create,
  ReferenceInput,
  SimpleForm,
} from "react-admin";

const VoucherLocationCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="voucherId" reference="vouchers">
        <AutocompleteInput optionText={(v) => `${v.title}`} />
      </ReferenceInput>
      <ReferenceInput source="locationId" reference="locations">
        <AutocompleteInput optionText={(v) => `${v.name}`} />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export default VoucherLocationCreate;
