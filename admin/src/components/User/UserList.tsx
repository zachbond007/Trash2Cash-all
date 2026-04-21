import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  FunctionField,
} from "react-admin";

const UserList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="username" />
      <EmailField source="email" />
      <DateField source="birthday" />
      <FunctionField
        source="createdAt"
        render={(v: any) => new Date(v.createdAt).toLocaleString()}
      />
      <TextField source="currentLevel" />
      <TextField source="earnedXP" label="Earned XP" />
    </Datagrid>
  </List>
);

export default UserList;
