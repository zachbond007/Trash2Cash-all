import { Create, SelectInput, SimpleForm, TextInput } from "react-admin";
import { actionTypes } from "./ActionTypes";

const ActionCreate = () => (
  <Create>
    <SimpleForm>
      <SelectInput choices={actionTypes} source="actionType" required />
      <TextInput source="rewardXP" label="Reward XP" required />
    </SimpleForm>
  </Create>
);

export default ActionCreate;
