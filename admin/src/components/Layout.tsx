import React from "react";
import {
  Layout as ReactAdminLayout,
  MenuItemLink,
  usePermissions,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  menu: {
    backgroundColor: "#e1edef",
    padding: "10px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
  },
  menuItem: {
    color: "#007F8E",
    textDecoration: "none",
    padding: "10px",
    "&:hover": {
      color: "#fff",
      backgroundColor: "#e1edef",
    },
  },
});

const menuItems = [
  {
    name: "users",
    text: "Users",
    isAdminPage: false,
  },
  {
    name: "roles",
    text: "Roles",
    isAdminPage: false,
  },
  {
    name: "merchants",
    text: "Merchants",
    isAdminPage: false,
  },
  {
    name: "locations",
    text: "Locations",
    isAdminPage: false,
  },
  {
    name: "vouchers",
    text: "Vouchers",
    isAdminPage: false,
  },
  {
    name: "onlineVouchers",
    text: "Online Vouchers",
    isAdminPage: false,
  },
  {
    name: "voucherLocations",
    text: "Voucher Locations",
    isAdminPage: false,
  },
  {
    name: "levels",
    text: "Levels",
    isAdminPage: false,
  },
  {
    name: "actions",
    text: "Actions",
    isAdminPage: false,
  },
  {
    name: "hunts",
    text: "Hunts",
    isAdminPage: false,
  },
  {
    name: "huntVerifications",
    text: "Hunt Verifications",
    isAdminPage: false,
  },
  {
    name: "claims",
    text: "Claims",
    isAdminPage: false,
  },
  {
    name: "pointTransactions",
    text: "Point Transactions",
    isAdminPage: false,
  },
  {
    name: "configs",
    text: "Configs",
    isAdminPage: false,
  },
  {
    name: "import-coupons",
    text: "Import Coupons",
    isAdminPage: false,
  },
];

const Menu = (props: any) => {
  const classes = useStyles();
  const { permissions } = usePermissions();
  return (
    <div className={classes.menu}>
      {menuItems.map(
        (item) =>
          (!item.isAdminPage || permissions === "ADMIN") && (
            <MenuItemLink
              {...props}
              key={item.name}
              to={`/${item.name}`}
              primaryText={item.text}
              onClick={props.onMenuClick}
              className={classes.menuItem}
              //   leftIcon={item.icon}
            />
          )
      )}
    </div>
  );
};

const Layout = (props: any) => <ReactAdminLayout {...props} menu={Menu} />;

export default Layout;
