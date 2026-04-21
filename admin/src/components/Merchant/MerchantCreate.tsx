import {
  BooleanInput,
  Create,
  ImageField,
  ImageInput,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
} from "react-admin";
import { createMerchant } from "../../api/merchant";
import { Grid } from "@material-ui/core";
import Compressor from "compressorjs";
import { CreateMerchantRequest } from "../../api/types";

const MerchantCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  return (
    <Create>
      <SimpleForm
        onSubmit={async (values) => {
          if (!values.imageKey?.rawFile) {
            const req: CreateMerchantRequest = {
              ...values,
              name: values.name,
              imageKey: null,
            };
            const res = await createMerchant(req);
            if (res) {
              notify("Success");
              redirect("/merchants");
            } else {
              notify("Error", {
                type: "error",
              });
            }
          } else {
            new Compressor(values.imageKey.rawFile, {
              quality: 1,
              async success(result: any) {
                const res = await createMerchant({
                  ...values,
                  name: values.name,
                  imageKey: result,
                });
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
    </Create>
  );
};

export default MerchantCreate;
