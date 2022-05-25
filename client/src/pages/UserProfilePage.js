import { Avatar, Badge, Container, ListItem, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import * as React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";

const UserProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="xs">
      <List
        sx={{
          width: "100%",
          bgcolor: "#e3f2fd",
          borderRadius: 2,
          color: "#333",
          marginRight: 0,
        }}
      >
        <ListItem>
          <ListItemText
            primary={<Typography variant="body2">Họ tên</Typography>}
            secondary={<Typography variant="h6">{currentUser.name}</Typography>}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<Typography variant="body2">Email</Typography>}
            secondary={
              <Typography variant="h6">{currentUser.email}</Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<Typography variant="body2">CMND/CCCD</Typography>}
            secondary={
              <Typography variant="h6">
                {currentUser.identityCardNumber}
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Container>
  );
};

export default UserProfilePage;
