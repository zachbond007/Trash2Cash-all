import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  ReferenceField,
  BooleanField,
} from "react-admin";

const OnlineVoucherList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="store" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="categories" />
      <TextField source="level" />
      <BooleanField source="isActive" />
      <ReferenceField reference={"merchants"} source={"merchantId"}>
        <FunctionField render={(v: any) => `${v.name}`} />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default OnlineVoucherList;
