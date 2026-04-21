import { Edit, SelectInput, SimpleForm, TextInput } from "react-admin";
import { actionTypes } from "./ActionTypes";

const ActionEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <SelectInput choices={actionTypes} source="actionType" required />
      <TextInput source="rewardXP" label="Reward XP" required />
    </SimpleForm>
  </Edit>
);

export default ActionEdit;
