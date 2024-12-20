import { Box, Button, Divider, Typography } from "@mui/material";

const Sidebar = ({
  setActiveTab,
}: {
  setActiveTab: (tab: "teams" | "aircrafts" | "parts") => void;
}) => {
  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        backgroundColor: "#1e293b",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
        Dashboard
      </Typography>
      <Divider sx={{ backgroundColor: "#475569", marginBottom: 2 }} />
      <Button
        variant="text"
        fullWidth
        sx={{
          justifyContent: "flex-start",
          marginBottom: 1,
          color: "#e2e8f0",
          "&:hover": { backgroundColor: "#475569" },
        }}
        onClick={() => setActiveTab("teams")}
      >
        Teams
      </Button>
      <Divider sx={{ backgroundColor: "#475569", marginBottom: 2 }} />
      <Button
        variant="text"
        fullWidth
        sx={{
          justifyContent: "flex-start",
          marginBottom: 1,
          color: "#e2e8f0",
          "&:hover": { backgroundColor: "#475569" },
        }}
        onClick={() => setActiveTab("aircrafts")}
      >
        Aircrafts
      </Button>
      <Divider sx={{ backgroundColor: "#475569", marginBottom: 2 }} />
      <Button
        variant="text"
        fullWidth
        sx={{
          justifyContent: "flex-start",
          marginBottom: 1,
          color: "#e2e8f0",
          "&:hover": { backgroundColor: "#475569" },
        }}
        onClick={() => setActiveTab("parts")}
      >
        Parts
      </Button>
    </Box>
  );
};

export default Sidebar;
