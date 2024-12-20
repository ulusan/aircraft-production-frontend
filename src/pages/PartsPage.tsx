import AddIcon from "@mui/icons-material/Add";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PartsPage = () => {
  const [parts, setParts] = useState<any[]>([]);
  const [summarizedParts, setSummarizedParts] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedPartDetails, setSelectedPartDetails] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPart, setNewPart] = useState({
    name: "",
    quantity: 0,
    team: "",
    aircraft: "",
  });
  const router = useRouter();

  const handleAddPartChange = (field, value) => {
    setNewPart((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPart = async () => {
    const userToken = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8000/api/parts/",
        {
          name: newPart.name,
          quantity: newPart.quantity,
          team: newPart.team,
          aircraft: newPart.aircraft,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setAddDialogOpen(false);
      fetchParts(); // Refresh the parts list
    } catch (error) {
      console.error("Error adding part:", error);
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      router.push("/login");
    } else {
      fetchParts();
      fetchTeams();
    }
  }, [router]);

  const fetchParts = async () => {
    const userToken = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8000/api/parts/", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setParts(response.data);
      summarizeParts(response.data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  const fetchTeams = async () => {
    const userToken = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8000/api/teams/", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const summarizeParts = (partsData: any[]) => {
    const summary = partsData.reduce((acc, part) => {
      if (!acc[part.name]) {
        acc[part.name] = { ...part, count: 0, partIds: [] };
      }
      acc[part.name].count += part.quantity;
      acc[part.name].partIds.push(part.id);
      return acc;
    }, {});

    setSummarizedParts(Object.values(summary));
  };

  const handlePartClick = async (partId) => {
    const userToken = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/parts/${partId}/details/`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setSelectedPartDetails(response.data);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching part details:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Parts Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{
          marginBottom: 4,
          background: "linear-gradient(45deg, #3f51b5, #2196f3)",
        }}
        onClick={() => setAddDialogOpen(true)}
      >
        Add Part
      </Button>
      ;
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            background: "linear-gradient(45deg, #2196f3, #3f51b5)",
            color: "white",
          }}
        >
          Add New Part
        </DialogTitle>
        <DialogContent>
          <Box sx={{ padding: 2 }}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={newPart.name}
              onChange={(e) => handleAddPartChange("name", e.target.value)}
            />
            <TextField
              label="Quantity"
              fullWidth
              type="number"
              margin="normal"
              value={newPart.quantity}
              onChange={(e) =>
                handleAddPartChange("quantity", parseInt(e.target.value))
              }
            />
            <TextField
              label="Team"
              fullWidth
              margin="normal"
              value={newPart.team}
              onChange={(e) => handleAddPartChange("team", e.target.value)}
              select
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </TextField>
            <TextField
              label="Aircraft"
              fullWidth
              margin="normal"
              value={newPart.aircraft}
              onChange={(e) => handleAddPartChange("aircraft", e.target.value)}
              select
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select an aircraft</option>
              <option value="tb2">TB2</option>
              <option value="tb3">TB3</option>
              <option value="akinci">AKINCI</option>
              <option value="kizilelma">KIZILELMA</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddDialogOpen(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPart}
            color="primary"
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #3f51b5, #2196f3)",
              color: "white",
            }}
          >
            Add Part
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={4}>
        {summarizedParts.map((part) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={part.name}
            onClick={() => handlePartClick(part.id)}
            style={{ cursor: "pointer" }}
          >
            <Paper
              elevation={6}
              sx={{
                padding: 3,
                borderRadius: 3,
                background: "linear-gradient(45deg, #f3e5f5, #e3f2fd)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 1 }}
              >
                {part.name}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                Total Quantity: {part.count}
              </Typography>
              {part.count === 1 && (
                <Alert severity="warning" sx={{ marginBottom: 2 }}>
                  Warning: Low stock for {part.name}!
                </Alert>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            background: "linear-gradient(45deg, #2196f3, #3f51b5)",
            color: "white",
          }}
        >
          Part Details
        </DialogTitle>
        <DialogContent>
          {selectedPartDetails ? (
            <Box sx={{ padding: 2 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedPartDetails.name}
              </Typography>
              <Typography variant="body1">
                <strong>Quantity:</strong> {selectedPartDetails.quantity}
              </Typography>
              <Typography variant="body1">
                <strong>Aircraft:</strong> {selectedPartDetails.aircraft}
              </Typography>
              <Typography variant="body1">
                <strong>Team:</strong> {selectedPartDetails.team}
              </Typography>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDetailsDialogOpen(false)}
            color="primary"
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #3f51b5, #2196f3)",
              color: "white",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartsPage;
