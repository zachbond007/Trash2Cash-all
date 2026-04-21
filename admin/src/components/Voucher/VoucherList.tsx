import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  ReferenceField,
  BooleanField,
} from "react-admin";

const VoucherList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="level" />
      <TextField source="code" />
      <TextField source="type" />
      <BooleanField source="isActive" />
      <ReferenceField reference={"merchants"} source={"merchantId"}>
        <FunctionField render={(v: any) => `${v.name}`} />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default VoucherList;
