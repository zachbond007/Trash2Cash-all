import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Title } from "react-admin";
const Dashboard = () => {
  return (
    <Card style={{ margin: 48 }}>
      <Title title="Welcome to the Trash2Cash Admin Panel" />
      <CardContent>Welcome to the Trash2Cash Admin Panel</CardContent>
    </Card>
  );
};

export default Dashboard;
