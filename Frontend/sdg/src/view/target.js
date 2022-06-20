import React, { useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Autocomplete, Typography, TextField, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Target(props) {
  const [expanded, setExpanded] = useState(false);
  const [targetData, setTargetData] = useState([]);
  const [goalList, setGoalList] = useState([]);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null) 
  const getTargetList = () => {
    if (currentGoal != null) {
      fetch('http://localhost:8080/getTargetList?currentGoal=' + currentGoal)
      .then(res => res.json())
      .then(
        (response) => {
          console.log("Risposta nel frontend", response.result)
          setTargetData(response.result);
          setAnswer(true);
        },
        (error) => {
          console.log("Backend error" + error);
          setTargetData({
            data: []
          })
        }
      )
    } else {
      fetch('http://localhost:8080/getTargetList')
      .then(res => res.json())
      .then(
        (response) => {
          console.log("Risposta nel frontend", response.result)
          setTargetData(response.result);
          setAnswer(true);
        },
        (error) => {
          console.log("Backend error" + error);
          setTargetData({
            data: []
          })
        }
      )
    }
  }
  
  const getGoalList = () => {
    fetch('http://localhost:8080/getGoalList')
      .then(res => res.json())
      .then(
        (response) => {
          setGoalList(response.result);
          setLoading(true)
        },
        (error) => {
          console.log("Backend error" + error);
          setGoalList({
            data: []
          })
        }
      )
  }

  useEffect(() => {
    getTargetList()

    getGoalList()

  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function doQuestion() {
    console.log(currentGoal)
    if(currentGoal === null) {
      console.log('ciao')
    } else {
      getTargetList(currentGoal)
      console.log(targetData)
    }
  }

  function setGoal(goal) {
    console.log(goal)
    setCurrentGoal(goal)
  }

  return (
    <>

        <Grid container justify="flex-end" style={{
          display: 'flex', flexDirection: 'row', width: '100%',
          justifyContent: 'center', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px'
        }}>
          <Grid style={{ width: '60%', justifyContent: 'left', alignItems: 'left', paddingLeft: '50px', }}>
            <h1>All Targets:</h1>
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
                  setGoal(value.label)
                  }
                }
                options={goalList}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Goal" />}
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
                {targetData.map((item, index) => {
                return (
                  <Accordion key={index} expanded={expanded === item.target} onChange={handleChange(item.target)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{item.label}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography style={{marginBottom:10}}>
                        {item.comment}
                      </Typography>
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

export default Target;