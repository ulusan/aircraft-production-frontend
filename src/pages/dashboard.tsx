import { Container, Grid, Paper } from "@mui/material";
import { useState } from "react";
import Aircrafts from "./Aircrafts";
import PartsPage from "./PartsPage";
import Sidebar from "./Sidebar";
import TeamsPage from "./TeamsPage";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"teams" | "aircrafts">("teams");

  const renderContent = () => {
    if (activeTab === "teams") {
      return <TeamsPage />;
    } else if (activeTab === "aircrafts") {
      return <Aircrafts />;
    } else if (activeTab === "parts") {
      return <PartsPage />;
    }
    return null;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Sidebar setActiveTab={setActiveTab} />
      </Grid>
      <Grid item xs={9}>
        <Container sx={{ padding: 4 }}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
            {renderContent()}
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
