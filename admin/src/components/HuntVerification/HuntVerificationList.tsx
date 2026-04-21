import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  SelectField,
  ReferenceField,
  FunctionField,
  ReferenceInput,
  SelectInput,
  DateField,
} from "react-admin";
import { trashAmounts } from "./TrashAmounts";

const HuntVerificationList = (props: any) => (
  <List
    {...props}
    filters={[
      <ReferenceInput
        label="Hunt"
        source="huntId"
        reference="hunts"
        alwaysOn
        resettable
        allowEmpty
      >
        <SelectInput optionText={(v) => `${v.id}`} resettable />
      </ReferenceInput>,
    ]}
  >
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="huntId" />
      <ReferenceField reference={"users"} source={"verifiedBy"}>
        <FunctionField render={(v: any) => `${v.username} - ${v.email}`} />
      </ReferenceField>
      <FunctionField
        source="createdAt"
        render={(v: any) => new Date(v.createdAt).toLocaleString()}
      />
      <BooleanField source="isTrashThrown" />
      <SelectField source="howMuchTrash" choices={trashAmounts} />
    </Datagrid>
  </List>
);

export default HuntVerificationList;
