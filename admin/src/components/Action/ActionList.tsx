import { List, Datagrid, TextField, SelectField } from "react-admin";
import { actionTypes } from "./ActionTypes";

const ActionList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <SelectField choices={actionTypes} source="actionType" />
      <TextField source="rewardXP" label="Reward XP" />
    </Datagrid>
  </List>
);

export default ActionList;
