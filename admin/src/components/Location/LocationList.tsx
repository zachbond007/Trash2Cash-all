import {
  List,
  Datagrid,
  TextField,
  NumberField,
  FunctionField,
  ReferenceField,
} from "react-admin";

const LocationList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="address" />
      <NumberField source="lat" />
      <NumberField source="lng" />
      <ReferenceField reference={"merchants"} source={"merchantId"}>
        <FunctionField render={(v: any) => `${v.name}`} />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default LocationList;
