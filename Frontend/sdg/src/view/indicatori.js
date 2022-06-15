import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Fab, Accordion, AccordionSummary, AccordionDetails, Typography, Box, Button } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { width } from '@mui/system';

function Indicatori(props) {
  let navigate = useNavigate()
  const [img, setImg] = useState(false);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [comment, setComment] = useState(false);
  const [source, setSource] = useState(false);
  const { state } = useLocation();

  const [indicatorsData, setIndicatorsData] = useState(new Array());
  const [tiersData, setTiersData] = useState(new Array());
  const [expanded, setExpanded] = useState(false);

  const regex = /\#(.*)/g;
  var getIndicators = () => {
    fetch('http://localhost:8080/getIndicators?res=' + state.id)
      .then(res => res.json())
      .then(
        (response) => {
          setIndicatorsData(response.result);
        },
        (error) => {
          console.log("Backend error" + error);
          setIndicatorsData({
            data: []
          })
        }
      )
  }

  var getTiers = () => {
    fetch('http://localhost:8080/getTiers?res=' + state.id)
      .then(res => res.json())
      .then(
        (response) => {
          setTiersData(response.result);
        },
        (error) => {
          console.log("Backend error" + error);
          setTiersData({
            data: []
          })
        }
      )
  }
  
  useEffect(() => {
    if (state === null) {
      navigate("/");
    }
    getIndicators()
    getTiers()
  }, []);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function routeChange(id, path) {
    navigate(path, { state: { id: id } });
  }
  function hyperLinkChange(path) {
    window.location.href = path;
    return null;
  }
  

  return (
    <>
      {state === null ? null :
        <Grid container justify="flex-end" style={{
          display: 'flex', flexDirection: 'row', width: '100%',
          justifyContent: 'center', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px'
        }}>
          <Grid style={{ width: '60%', justifyContent: 'left', alignItems: 'left', paddingLeft: '50px', }}>
            <h1>{state.id}</h1>
            <h2>{state.comment}</h2>
            
            <div style={{ flexDirection: 'row', display: 'flex' }}>
                <div>
                  <h2 style={{ width: '100%' }}>Types of indicators available for this target:</h2>
                  <div style={{ width: '80%', marginTop: '25px' }}>

                    {tiersData.map((item, index) => {
                        return (
                          <div style={{ flexDirection: 'row', display: 'flex' }} key={index}>
                            <div>
                              <Button onClick={() => hyperLinkChange(item.definition)} variant="contained" color='inherit'
                              style={{margin: 25}}>{item.tier}</Button> 
                            </div>
                            <div><h5 style={{width:'80%'}}>Description: {item.description}</h5></div>
                          </div>
                        )
                    })}
                  </div>
                </div>
            </div>

            <h2>Indicators:</h2>
            {indicatorsData.map((item, index) => {
              return (
                <Accordion expanded={expanded === item.label} onChange={handleChange(item.label)}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{item.label}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {item.comment}
                    </Typography>
                    <Fab variant="extended" color="inherit" size="small" aria-label="add" style={{ marginTop:15, marginBottom: 15, alignSelf: 'flex-end' }}>
                      LEVEL:{item.tierLabel}
                    </Fab>
                    <Fab variant="extended" color="primary" size="small" aria-label="add" style={{ marginTop:15, marginBottom: 15, alignSelf: 'flex-end' }} onClick={() => hyperLinkChange(item.source)}>
                      <ReadMoreIcon sx={{ mr: 1 }} />
                      Open Source
                    </Fab>
                  </AccordionDetails>
                </Accordion>
              )
            })}
            <div style={{ height: '100px' }} />
          </Grid>
        </Grid>

      }
    </>
  );
}

export default Indicatori;