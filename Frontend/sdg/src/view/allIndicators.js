import React, { useEffect, useState } from 'react';
import { Grid, Fab, Accordion, AccordionSummary, AccordionDetails, Autocomplete, Typography, TextField, Button } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import chart from '../utils/chart.json'

function Indicatori(props) {
  const [chartList, setChartList] = useState([]);
  const [indicatorsData, setIndicatorsData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [TargetList, setTargetList] = useState([]);
  const [CurrentTarget, setCurrentTarget] = useState(null)
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null)

  var getAllIndicators = () => {

    if(CurrentTarget != null) {
      fetch('http://localhost:8080/getAllIndicators?CurrentTarget='+ CurrentTarget)
      .then(res => res.json())
      .then(
        (response) => {
          console.log("risposta", response.response)
          setIndicatorsData(response.result);
          setAnswer(true);
        },
        (error) => {
          console.log("Backend error" + error);
          setIndicatorsData({
            data: []
          })
        }
      )
    }
    else {
      fetch('http://localhost:8080/getAllIndicators')
      .then(res => res.json())
      .then(
        (response) => {
          setIndicatorsData(response.result);
          setAnswer(true);
        },
        (error) => {
          console.log("Backend error" + error);
          setIndicatorsData({
            data: []
          })
        }
      )
    }
      
  }
  var getTargetList = () => {
    fetch('http://localhost:8080/getTargetList')
      .then(res => res.json())
      .then(
        (response) => {
          setTargetList(response.result);
          setLoading(true)
        },
        (error) => {
          console.log("Backend error" + error);
          setTargetList({
            data: []
          })
        }
      )
  }

  useEffect(() => {
    getTargetList()
    getAllIndicators()
    setChartList(chart)
  }, []);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function doQuestion() {
    console.log(CurrentTarget)
    if(CurrentTarget === null) {
      console.log('ciao')
    } else {
      getAllIndicators(CurrentTarget)
      console.log(indicatorsData)
    }
  }

  function setTarget(target) {
    console.log(target)
    setCurrentTarget(target)
  }

  function hyperLinkChange(path) {
    window.location.href = path;
    return null;
  }


  return (
    <>

        <Grid container justify="flex-end" style={{
          display: 'flex', flexDirection: 'row', width: '100%',
          justifyContent: 'center', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px'
        }}>
          <Grid style={{ width: '60%', justifyContent: 'left', alignItems: 'left', paddingLeft: '50px', }}>
            <h1>All Indicators:</h1>

            {loading ?
              <Autocomplete
                style={{marginBottom: 15}}
                disablePortal
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.label}>
                      {option.label}
                    </li>
                  );
                }}
                id="combo-box-demo1"
                onChange={(event, value) => {
                  setTarget(value.label)
                  }
                }
                options={TargetList}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Target" />}
              />
              :
              <></>
            }

          <Button onClick={() => doQuestion()} variant="outlined" style={{ marginBottom: 15 }}>Search</Button>
          {answer === null ? 
            null
            :
            answer ?
              <div>
              {indicatorsData.map((item, index) => {
              return (
                <Accordion key={index} expanded={expanded === item.indicator} onChange={handleChange(item.indicator)}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{item.indicator}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <Typography style={{marginBottom:10}}>
                      {item.comment}
                    </Typography>
                    <Typography>
                      Target:{item.target}
                    </Typography>
                    
                    <Fab variant="extended" color="inherit" size="small" aria-label="add" style={{ marginTop: 15, marginBottom: 15, alignSelf: 'flex-end' }}>
                      LEVEL:{item.tier}
                    </Fab>
                    <Fab variant="extended" color="primary" size="small" aria-label="add" style={{ marginTop: 15, marginBottom: 15, alignSelf: 'flex-end' }} onClick={() => hyperLinkChange(item.source)}>
                      <ReadMoreIcon sx={{ mr: 1 }} />
                      Open Source
                    </Fab>
                  </AccordionDetails>
                </Accordion>
              )
            })}

              </div>
              :
              <></>
          }
            <div style={{ height: '100px' }} />
          </Grid>
        </Grid>

      
    </>
  );
}

export default Indicatori;