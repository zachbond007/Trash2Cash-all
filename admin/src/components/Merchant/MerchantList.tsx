import {
  List,
  Datagrid,
  TextField,
  ImageField,
  BooleanField,
} from "react-admin";

const MerchantList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="contactName" />
      <TextField source="contactEmail" />
      <TextField source="contactPhone" />
      <BooleanField source="isActive" />
      <ImageField source={"imageKey"} label="Image" />
    </Datagrid>
  </List>
);

export default MerchantList;
