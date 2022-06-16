import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Fab, Accordion, AccordionSummary, AccordionDetails, Autocomplete, Typography, Box, TextField, Button } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import chart from '../utils/chart.json';

function Indicatori(props) {
  let navigate = useNavigate()
  const [chartList, setChartList] = useState(new Array());
  const [indicatorsData, setIndicatorsData] = useState(new Array());
  const [expanded, setExpanded] = useState(false);
  const [TargetList, setTargetList] = useState(new Array());
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

  function routeChange(id, path) {
    navigate(path, { state: { id: id } });
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
                    {chartList.map((i, x) => {
                      if (item.label.localeCompare(i.indicator) == 0) {
                        return (
                          <iframe key={x} title={Math.random()} src={i.link} loading="lazy" style={{ width: '100%', height: '600px' }}></iframe>
                        )
                      }
                    })}
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
              <h1></h1>
          }
            <div style={{ height: '100px' }} />
          </Grid>
        </Grid>

      
    </>
  );
}

export default Indicatori;