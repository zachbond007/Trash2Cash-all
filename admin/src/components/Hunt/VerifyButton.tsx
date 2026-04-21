import { Button, useNotify, useRecordContext } from "react-admin";
import { verifiedAsOptions } from "./VerifiedAsOptions";
import { useState } from "react";
import { MenuItem, Select } from "@material-ui/core";
import { adminVerifyHunt } from "../../api/hunt";
import { AdminVerifyHuntRequest } from "../../api/types";

const VerifyButton = (props: any) => {
  const record = useRecordContext();
  const notify = useNotify();
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleClick = async (event: any) => {
    if (record.verifiedAs === null) {
      event.stopPropagation(); // Prevent the edit page from opening
      const id = parseInt(record.id.toString());
      const req: AdminVerifyHuntRequest = {
        id,
        adminVerifiedAs: selectedOption,
      };
      const res = await adminVerifyHunt(req);
      if (res) {
        notify("Verification successful.", {
          type: "success",
        });
      } else {
        notify("An error occured.", {
          type: "error",
        });
      }
    } else {
      notify("You can verify only non-verified hunts.", {
        type: "error",
      });
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Select
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value as string);
        }}
        style={{ width: 150 }}
      >
        {verifiedAsOptions.map((x) => {
          return <MenuItem value={x.id}>{x.name}</MenuItem>;
        })}
      </Select>
      <Button onClick={handleClick} {...props} label="VERIFY" />
    </div>
  );
};

export default VerifyButton;
