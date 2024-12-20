import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Aircrafts = () => {
const [aircrafts, setAircrafts] = useState<any[]>([]);
const [partDetails, setPartDetails] = useState<Record<number, any>>({});
const [teams, setTeams] = useState<Record<number, string>>({});
const [expandedAircraftId, setExpandedAircraftId] = useState<string | null>(
  null
);
const router = useRouter();

useEffect(() => {
  const userToken = localStorage.getItem("token");
  if (!userToken) {
    router.push("/login");
  } else {
    fetchAllData(userToken);
  }
}, [router]);

const fetchAllData = async (userToken: string) => {
  try {
    const [aircraftsRes, partsRes, teamsRes] = await Promise.all([
      axios.get("http://localhost:8000/api/aircrafts/", {
        headers: { Authorization: `Bearer ${userToken}` },
      }),
      axios.get("http://localhost:8000/api/parts/", {
        headers: { Authorization: `Bearer ${userToken}` },
      }),
      axios.get("http://localhost:8000/api/teams/", {
        headers: { Authorization: `Bearer ${userToken}` },
      }),
    ]);

    setAircrafts(aircraftsRes.data);

    const parts = partsRes.data.reduce((acc: Record<number, any>, part: any) => {
      acc[part.id] = part;
      return acc;
    }, {});
    setPartDetails(parts);

    const teamMap = teamsRes.data.reduce(
      (acc: Record<number, string>, team: any) => {
        acc[team.id] = team.name;
        return acc;
      },
      {}
    );
    setTeams(teamMap);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const toggleExpandAircraft = (aircraftId: string) => {
  setExpandedAircraftId(
    expandedAircraftId === aircraftId ? null : aircraftId
  );
};

return (
  <Box sx={{ padding: 4 }}>
    <Typography variant="h4" gutterBottom>
      Aircrafts
    </Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => console.log("Add Aircraft Dialog")}
      sx={{ marginBottom: 4 }}
    >
      Add Aircraft
    </Button>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Aircraft Name</TableCell>
            <TableCell>Produced Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aircrafts.map((aircraft) => (
            <React.Fragment key={aircraft.id}>
              <TableRow>
                <TableCell>
                  <IconButton
                    onClick={() => toggleExpandAircraft(aircraft.id)}
                  >
                    {expandedAircraftId === aircraft.id ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                  {aircraft.name}
                </TableCell>
                <TableCell>
                  {new Date(aircraft.produced_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<EditIcon />}
                    onClick={() => console.log("Edit Aircraft Dialog")}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => console.log("Delete Aircraft")}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>
                  <Collapse
                    in={expandedAircraftId === aircraft.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ margin: 2 }}>
                      <Typography variant="h6">Parts</Typography>
                      {aircraft.parts && aircraft.parts.length > 0 ? (
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Part Name</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Aircraft</TableCell>
                              <TableCell>Is Used</TableCell>
                              <TableCell>Team</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {aircraft.parts.map((partId) => (
                              <TableRow key={partId}>
                                <TableCell>
                                  {partDetails[partId]?.name || "Loading..."}
                                </TableCell>
                                <TableCell>
                                  {partDetails[partId]?.quantity || "Loading..."}
                                </TableCell>
                                <TableCell>
                                  {partDetails[partId]?.aircraft || "Loading..."}
                                </TableCell>
                                <TableCell>
                                  {partDetails[partId]?.is_used ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>
                                  {teams[partDetails[partId]?.team] || "Loading..."}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <Typography>
                          No parts assigned to this aircraft.
                        </Typography>
                      )}
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

export default Aircrafts;
