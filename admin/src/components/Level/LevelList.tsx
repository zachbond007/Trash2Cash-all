import { List, Datagrid, TextField } from "react-admin";

const LevelList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="levelNumber" />
      <TextField source="requiredXP" label="Required XP" />
    </Datagrid>
  </List>
);

export default LevelList;
