import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from "@mui/material";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const TeamsPage = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [newUserEmail, setNewUserEmail] = useState<string>("");
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const userToken = localStorage.getItem("token");
    if (!userToken) return;

    try {
      const response = await axios.get("http://localhost:8000/api/teams/", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleAddUser = async (teamId: string) => {
    if (!teamId || !newUserEmail) return;

    const userToken = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:8000/api/teams/${teamId}/add-user/`,
        { email: newUserEmail },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      fetchTeams();
      setNewUserEmail("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleRemoveUser = async (teamId: string, userId: number) => {
    const userToken = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/teams/${teamId}/remove-user/`, {
        headers: { Authorization: `Bearer ${userToken}` },
        data: { user_id: userId },
      });
      fetchTeams();
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const toggleExpandTeam = (teamId: string) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Teams
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Team Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <React.Fragment key={team.id}>
                <TableRow>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => toggleExpandTeam(team.id)}>
                      {expandedTeamId === team.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Collapse in={expandedTeamId === team.id} timeout="auto" unmountOnExit>
                      <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6">Members</Typography>
                        {team.users.map((user) => (
                          <Box
                            key={user.id}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 1,
                            }}
                          >
                            <Typography>
                              {user.first_name} {user.last_name} - {user.email}
                            </Typography>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveUser(team.id, user.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                        <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="Enter user email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddUser(team.id)}
                            disabled={!newUserEmail.trim()}
                          >
                            Add
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeamsPage;
