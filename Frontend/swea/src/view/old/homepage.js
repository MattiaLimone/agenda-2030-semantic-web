import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import '../css/page.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { red } from '@mui/material/colors';
import { color } from '@mui/system';

export function PreLoadingPage(props) {

  return (
    <Container sx={{marginTop: 4, marginLeft: 0}}>

      <TableContainer component={Paper} sx={{ maxWidth: 260 }} className="table-dark">
        <Table aria-label="" className="table-dark">
          <TableHead>
            <TableRow>
              <TableCell style={{paddingBottom:0}}>
                <Typography variant="h4" component="div" gutterBottom sx={{color: "#FFFFFF", paddingLeft:2}}>
                    {"Loading"}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow
                key={alert}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="td" scope="row" style={{verticalAlign: "top", padding:0, paddingTop:16}}>
                  <Container maxWidth="sm" style={{marginLeft: 0, marginBottom: 16}}>
                    <List
                    sx={{ width: '90%' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    >
                      <ListItemButton className='table-dark'>
                        <ListItemText primary={"Please wait"} sx={{color: "#FFFFFF"}} />
                      </ListItemButton>
                    </List>
                  </Container>
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

    </Container>
  );

}

export function HomePage(props) {

  var callback_changePage = props.changePageCallback;

  var homedata = {
    territories: [],
    sources: []
  }

  homedata.territories = props.territories;
  homedata.sources = props.sources;

  const onPressedTerritory = (chosenTerritory) => {
    for (var i = 0; i < homedata.territories.length; i++) {
      if (chosenTerritory == homedata.territories[i].name) {
        callback_changePage(1, homedata.territories[i].address);
        break;
      }
    }
  };
  const onPressedSource = (chosenSource) => {
    for (var i = 0; i < homedata.sources.length; i++) {
      if (chosenSource == homedata.sources[i].name) {
        callback_changePage(2, homedata.sources[i].address);
        break;
      }
    }
  };

  return (

    <Box sx={{ flexGrow: 1}}>
      <Grid container spacing={2} sx= {{backgroundColor: red}}>
        <Grid item xs={3}>

        </Grid>
        <Grid item xs={6}>
          <Container sx={{marginTop: 4, marginLeft: 0}}>

            <TableContainer component={Paper} sx={{ maxWidth: 800 }} className="table-dark">
              <Table aria-label="" className="table-dark">
                <TableHead>
                  <TableRow>
                    <TableCell style={{paddingBottom:0}}>
                      <Typography variant="h4" component="div" gutterBottom sx={{color: "#FFFFFF", paddingLeft:2}}>
                          {"Select a territory"}
                      </Typography>
                    </TableCell>
                    <TableCell style={{paddingBottom:0}}>
                      <Typography variant="h4" component="div" gutterBottom sx={{color: "#FFFFFF", paddingLeft:2}}>
                          {"Select a source"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                      key={alert}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="td" scope="row" style={{verticalAlign: "top", padding:0, paddingTop:16}}>
                        <Container maxWidth="sm" style={{marginLeft: 0, marginBottom: 16}}>
                          <List
                          sx={{ width: '90%' }}
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                          >
                              {
                                homedata.territories.length > 0 ?
                                  homedata.territories.map(
                                      territory => {
                                          return (
                                              <ListItemButton className='listitem-dark' onClick={() => {onPressedTerritory(territory.name)}}>
                                                  <ListItemText primary={territory.name} sx={{color: "#FFFFFF"}}/>
                                              </ListItemButton>
                                          )
                                      }
                                  )
                                : <ListItemButton className='listitem-dark'>
                                    <ListItemText primary={"Empty"} sx={{color: "#FFFFFF"}} />
                                  </ListItemButton>
                              }
                          </List>
                        </Container>
                      </TableCell>
                      <TableCell align="left" style={{verticalAlign: "top", padding:0, paddingTop:16}}>
                        <Container maxWidth="sm" style={{marginTop: 0, marginLeft: 0}}>
                          <List
                          sx={{ width: '90%' }}
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                          >
                              {
                                homedata.sources.length > 0 ?
                                  homedata.sources.map(
                                      source => {
                                          return (
                                              <ListItemButton className='listitem-dark' onClick={() => {onPressedSource(source.name)}}>
                                                  <ListItemText primary={source.name} sx={{color: "#FFFFFF"}}/>
                                              </ListItemButton>
                                          )
                                      }
                                  )
                                : <ListItemButton className='listitem-dark'>
                                    <ListItemText primary={"Empty"} sx={{color: "#FFFFFF"}} />
                                  </ListItemButton>
                              }
                          </List>
                        </Container>
                      </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

          </Container>
        </Grid>
        <Grid item xs={3}>

        </Grid>
      </Grid>
    </Box>

  );
}