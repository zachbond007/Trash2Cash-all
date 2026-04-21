import { List, Datagrid, TextField } from "react-admin";

const ConfigList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="key" />
      <TextField source="value" />
    </Datagrid>
  </List>
);

export default ConfigList;
