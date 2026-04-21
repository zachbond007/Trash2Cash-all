import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  ReferenceField,
} from "react-admin";

const VoucherLocationList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField reference={"vouchers"} source={"voucherId"}>
        <FunctionField render={(v: any) => `${v.title}`} />
      </ReferenceField>
      <ReferenceField reference={"locations"} source={"locationId"}>
        <FunctionField render={(v: any) => `${v.name}`} />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default VoucherLocationList;
