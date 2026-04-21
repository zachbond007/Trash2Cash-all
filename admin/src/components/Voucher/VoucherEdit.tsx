import {
  AutocompleteInput,
  BooleanInput,
  Edit,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import { voucherTypes } from "./VoucherTypes";

const VoucherEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="title" required />
      <TextInput source="description" required />
      <NumberInput source="level" required />
      <TextInput source="code" />
      <SelectInput source="type" choices={voucherTypes} />
      <BooleanInput source="isActive" />
      <ReferenceInput source="merchantId" reference="merchants">
        <AutocompleteInput optionText={(v) => `${v.name}`} />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default VoucherEdit;
