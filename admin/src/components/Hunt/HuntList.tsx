import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  SelectField,
} from "react-admin";
import { huntStatuses } from "./HuntStatuses";
import VerifyButton from "./VerifyButton";
import { verifiedAsOptions } from "./VerifiedAsOptions";

const HuntList = (props: any) => {
  return (
    <List
      {...props}
      filters={[
        <SelectInput
          choices={huntStatuses}
          alwaysOn
          source="status"
          resettable
        />,
        <ReferenceInput
          label="User"
          source="userId"
          reference="users"
          alwaysOn
          resettable
          allowEmpty
        >
          <SelectInput optionText={(v) => `${v.username}`} resettable />
        </ReferenceInput>,
      ]}
    >
      <Datagrid>
        <TextField source="id" />
        <ReferenceField reference={"users"} source={"userId"}>
          <FunctionField render={(v: any) => `${v.username} - ${v.email}`} />
        </ReferenceField>
          <FunctionField
          label="Image"
          render={(v: any) =>
            v.imageKey ? (
              <img
                src={`https://trash2cash-s3-bucket-1.s3.eu-north-1.amazonaws.com/${v.imageKey}`}
                style={{ maxHeight: 80 }}
                alt="hunt"
              />
            ) : null
          }
        />
        <TextField source="status" />
        <FunctionField
          label={"Time passed"}
          source="createdAt"
          render={(v: any) => {
            const givenDate = new Date(v.createdAt);
            const currentDate = new Date();
            const timeDiff = currentDate.getTime() - givenDate.getTime(); // in milliseconds
            const minutesDiff = Math.round(timeDiff / (1000 * 60)); // convert to minutes
            return minutesDiff + " minutes";
          }}
        />
        <FunctionField
          source="createdAt"
          render={(v: any) => new Date(v.createdAt).toLocaleString()}
        />
        <SelectField source="verifiedAs" choices={verifiedAsOptions} />
        <TextField source="earnedXP" label="Earned XP" />
        <VerifyButton label="*VERIFICATION*" />
      </Datagrid>
    </List>
  );
};

export default HuntList;
