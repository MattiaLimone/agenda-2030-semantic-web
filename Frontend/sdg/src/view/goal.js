import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Fab, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Indicatori(props) {
  let navigate = useNavigate()
  const { state } = useLocation();

  const [goalData, setGoalData] = useState(new Array());
  const [targetData, setTargetData] = useState(new Array());
  const [expanded, setExpanded] = useState(false);
  
  const regex = /\#(.*)/g;
  var getGoalData = () => {
    fetch('http://localhost:8080/getGoalInfo?res=' + state.id)
      .then(res => res.json())
      .then(
        (response) => {
          setGoalData(response.result);
        },
        (error) => {
          console.log("Backend error" + error);
          setGoalData({
            data: []
          })
        }
      )
  }
  var getTargetData = () => {
    fetch('http://localhost:8080/getTargetInfo?res=' + state.id)
      .then(res => res.json())
      .then(
        (response) => {
          console.log(response.result)
          setTargetData(response.result.sort((a, b) => a.index - b.index));

        },
        (error) => {
          console.log("Backend error" + error);
          setTargetData({
            data: []
          })
        }
      )
  }
  useEffect(() => {
    if (state === null) {
      navigate("/");
    }
    getGoalData()
    getTargetData()
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    
    setExpanded(isExpanded ? panel : false);
  };

  function routeChange(path) {
    navigate("/target", { state: { id: path } });
  }
  function hyperLinkChange(path) {
    window.location.href = path;
    return null;
  }

  return (
    <>
      {state === null ? null :
        <Grid container justify="flex-end" style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px' }}>
          <Grid style={{ width: '60%', justifyContent: 'left', alignItems: 'left', paddingLeft: '50px', paddingRight: '50px' }}>
            <h1>{state.id}</h1>
            <div style={{ flexDirection: 'row', display: 'flex' }}>
              <h2 style={{ width: '15%' }}>Subclass of:</h2>
              <div style={{ width: '85%', marginTop: '25px' }}>

                {goalData.map((item, index) => {
                  if (item.subject.includes(state.id.replaceAll(' ', '_')) && item.predicate.includes('rdf-syntax-ns#type')) {
                    return (
                      <div key={index}>
                        <Fab variant="extended" color="primary" aria-label="add" style={{ marginBottom: '15' }} onClick={() => hyperLinkChange(item.object)}>
                          <ReadMoreIcon sx={{ mr: 1 }} />
                          {item.object.substring(item.object.indexOf('#') + 1)}
                        </Fab>
                        <div style={{ height: '10px' }} />
                      </div>
                    )
                  }
                })}
              </div>
            </div>
            <h2>Targets:</h2>
            {targetData.map((item, index) => {
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
                    <Fab variant="extended" color="primary" aria-label="add" style={{ marginBottom: '15', alignSelf: 'flex-end' }} onClick={() => routeChange(item.label)}>
                      <ReadMoreIcon sx={{ mr: 1 }} />
                      Read more...
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