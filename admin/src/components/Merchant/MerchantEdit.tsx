import { Grid } from "@material-ui/core";
import {
  BooleanInput,
  Edit,
  ImageField,
  ImageInput,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
} from "react-admin";
import { editMerchant, updateMerchant } from "../../api/merchant";
import Compressor from "compressorjs";
import { EditMerchantRequest } from "../../api/types";

const MerchantEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  return (
    <Edit mutationMode="pessimistic">
      <SimpleForm
        onSubmit={async (values) => {
          const req: EditMerchantRequest = {
            ...values,
            id: values.id,
            name: values.name,
          };
          if (!values.imageKey?.rawFile) {
            const response = await updateMerchant(req);
            if (response) {
              notify("Success");
              redirect("/merchants");
            }
            return;
          } else {
            new Compressor(values.imageKey.rawFile, {
              quality: 1,
              async success(result: any) {
                req.imageKey = result;
                const res = await editMerchant(req);
                if (res) {
                  notify("Success");
                  redirect("/merchants");
                } else {
                  notify("Error", {
                    type: "error",
                  });
                }
              },
              error(err: any) {
                console.log(err.message);
              },
            });
          }
        }}
      >
        <TextInput source="id" disabled />
        <TextInput source="name" required />
        <TextInput source="contactName" />
        <TextInput source="contactEmail" />
        <TextInput source="contactPhone" />
        <TextInput source="color" />
        <BooleanInput source="isActive" />
        <Grid item xs={3}>
          <ImageInput source="imageKey" helperText="">
            <ImageField source="src" title="title" />
          </ImageInput>
        </Grid>
      </SimpleForm>
    </Edit>
  );
};

export default MerchantEdit;
