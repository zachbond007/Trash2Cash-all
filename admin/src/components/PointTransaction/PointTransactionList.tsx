import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  ReferenceField,
  SelectField,
  DateField,
} from "react-admin";
import { get } from "../../api/common/RequestHelper";
import { actionTypes } from "../Action/ActionTypes";

const PointTransactionList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField reference={"users"} source={"userId"}>
        <FunctionField render={(v: any) => `${v.username} - ${v.email}`} />
      </ReferenceField>
      <SelectField choices={actionTypes} source="actionType" />
      <TextField source="earnedXP" />
      <FunctionField
        source="createdAt"
        render={(v: any) => new Date(v.createdAt).toLocaleString()}
      />
    </Datagrid>
  </List>
);

export default PointTransactionList;
