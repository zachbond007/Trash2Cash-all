import React from "react";
import { Admin, CustomRoutes, Resource } from "react-admin";
import Dashboard from "./screens/Dashboard";
import { createTheme } from "@material-ui/core";
import { dataProvider } from "./dataProvider";
import authProvider from "./authProvider";
import Layout from "./components/Layout";
import RoleCreate from "./components/Role/RoleCreate";
import RoleEdit from "./components/Role/RoleEdit";
import RoleList from "./components/Role/RoleList";
import ActionCreate from "./components/Action/ActionCreate";
import ActionEdit from "./components/Action/ActionEdit";
import ActionList from "./components/Action/ActionList";
import ConfigCreate from "./components/Config/ConfigCreate";
import ConfigEdit from "./components/Config/ConfigEdit";
import ConfigList from "./components/Config/ConfigList";
import HuntCreate from "./components/Hunt/HuntCreate";
import HuntEdit from "./components/Hunt/HuntEdit";
import HuntList from "./components/Hunt/HuntList";
import HuntVerificationCreate from "./components/HuntVerification/HuntVerificationCreate";
import HuntVerificationEdit from "./components/HuntVerification/HuntVerificationEdit";
import HuntVerificationList from "./components/HuntVerification/HuntVerificationList";
import LevelCreate from "./components/Level/LevelCreate";
import LevelEdit from "./components/Level/LevelEdit";
import LevelList from "./components/Level/LevelList";
import LocationCreate from "./components/Location/LocationCreate";
import LocationEdit from "./components/Location/LocationEdit";
import LocationList from "./components/Location/LocationList";
import MerchantCreate from "./components/Merchant/MerchantCreate";
import MerchantEdit from "./components/Merchant/MerchantEdit";
import MerchantList from "./components/Merchant/MerchantList";
import UserCreate from "./components/User/UserCreate";
import UserEdit from "./components/User/UserEdit";
import UserList from "./components/User/UserList";
import VoucherCreate from "./components/Voucher/VoucherCreate";
import VoucherEdit from "./components/Voucher/VoucherEdit";
import VoucherList from "./components/Voucher/VoucherList";
import VoucherLocationCreate from "./components/VoucherLocation/VoucherLocationCreate";
import VoucherLocationEdit from "./components/VoucherLocation/VoucherLocationEdit";
import VoucherLocationList from "./components/VoucherLocation/VoucherLocationList";
import ClaimList from "./components/Claim/ClaimList";
import PointTransactionList from "./components/PointTransaction/PointTransactionList";
import { Route } from "react-router-dom";
import ImportCoupon from "./components/ImportCoupon/ImportCoupon";
import OnlineVoucherList from "./components/OnlineVoucher/OnlineVoucherList";
import OnlineVoucherEdit from "./components/OnlineVoucher/OnlineVoucherEdit";
import OnlineVoucherCreate from "./components/OnlineVoucher/OnlineVoucherCreate";

function getTheme(theme: any) {
  return createTheme({
    palette: {
      type: theme.paletteType,

      secondary: {
        main: "#007F8E",
        dark: "#47A835",
        contrastText: "#fff",
      },
    },
  });
}
const theme = getTheme({
  paletteType: "light",
});

const App = () => {
  return (
    <Admin
      dashboard={Dashboard}
      theme={theme}
      dataProvider={dataProvider}
      authProvider={authProvider}
      // requireAuth
      layout={Layout}
      basename="/adminpanel/">
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
      />
      <CustomRoutes>
        <Route path="/import-coupons" element={<ImportCoupon />} />
      </CustomRoutes>
      <Resource
        name="merchants"
        list={MerchantList}
        edit={MerchantEdit}
        create={MerchantCreate}
      />
      <Resource
        name="locations"
        list={LocationList}
        edit={LocationEdit}
        create={LocationCreate}
      />
      <Resource
        name="vouchers"
        list={VoucherList}
        edit={VoucherEdit}
        create={VoucherCreate}
      />
      <Resource
        name="onlineVouchers"
        list={OnlineVoucherList}
        edit={OnlineVoucherEdit}
        create={OnlineVoucherCreate}
      />
      <Resource
        name="voucherLocations"
        list={VoucherLocationList}
        edit={VoucherLocationEdit}
        create={VoucherLocationCreate}
      />
      <Resource
        name="levels"
        list={LevelList}
        edit={LevelEdit}
        create={LevelCreate}
      />
      <Resource
        name="actions"
        list={ActionList}
        edit={ActionEdit}
        create={ActionCreate}
      />
      <Resource
        name="hunts"
        list={HuntList}
        edit={HuntEdit}
        create={HuntCreate}
      />
      <Resource
        name="huntVerifications"
        list={HuntVerificationList}
        edit={HuntVerificationEdit}
        create={HuntVerificationCreate}
      />
      <Resource
        name="configs"
        list={ConfigList}
        edit={ConfigEdit}
        create={ConfigCreate}
      />

      <Resource
        name="roles"
        list={RoleList}
        edit={RoleEdit}
        create={RoleCreate}
      />
      <Resource name="claims" list={ClaimList} />
      <Resource name="pointTransactions" list={PointTransactionList} />
    </Admin>
  );
};

export default App;
