import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  AutocompleteInput,
  ReferenceInput,
  SelectInput,
  BooleanInput,
} from "react-admin";
import { voucherTypes } from "./VoucherTypes";

const VoucherCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" required />
      <TextInput source="description" required />
      <NumberInput source="level" required />
      <TextInput source="code" />
      <SelectInput source="type" choices={voucherTypes} />
      <BooleanInput source="isActive" />
      <ReferenceInput source="merchantId" reference="merchants" isRequired>
        <AutocompleteInput optionText={(v) => `${v.name}`} isRequired />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export default VoucherCreate;
