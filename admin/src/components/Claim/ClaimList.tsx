import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  ReferenceField,
} from "react-admin";

const ClaimList = (props: any) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField reference={"vouchers"} source={"voucherId"}>
        <FunctionField render={(v: any) => `${v.title}`} />
      </ReferenceField>
      <ReferenceField reference={"users"} source={"userId"}>
        <FunctionField render={(v: any) => `${v.username} - ${v.email}`} />
      </ReferenceField>
      <FunctionField
        source="createdAt"
        render={(v: any) => new Date(v.createdAt).toLocaleString()}
      />
    </Datagrid>
  </List>
);

export default ClaimList;
