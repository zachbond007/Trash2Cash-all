import { List, Datagrid, TextField } from "react-admin";

const RoleList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
    </Datagrid>
  </List>
);

export default RoleList;
