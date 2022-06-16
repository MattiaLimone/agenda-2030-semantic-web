import { React, useEffect, useState } from 'react';
import { Grid, Autocomplete, TextField, Button, Alert, Fab } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'row',
  p: 4,
};

export default function Home() {
  let navigate = useNavigate()
  const [subjectList, setSubjectList] = useState(new Array())
  const [goalList, setGoalList] = useState(new Array())
  const [currentGoal, setCurrentGoal] = useState(null)
  const [currentSubject, setCurrentSubject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [answer, setAnswer] = useState(null)
  function routeChange(path) {
    navigate("/goal", { state: { id: path } });
  }
  var getSubjectList = () => {
    fetch('http://localhost:8080/getSubjectList')
      .then(res => res.json())
      .then(
        (response) => {
          setSubjectList(response.result);
          setLoading(true)
        },
        (error) => {
          console.log("Backend error" + error);
          setSubjectList({
            data: []
          })
        }
      )
  }
  var getGoalList = () => {
    fetch('http://localhost:8080/getGoalList')
      .then(res => res.json())
      .then(
        (response) => {
          setGoalList(response.result);
          setLoading(true)
        },
        (error) => {
          console.log("Backend error" + error);
          setSubjectList({
            data: []
          })
        }
      )
  }
  var getAnswer = (goal, subject) => {
    fetch('http://localhost:8080/askGoalFromSubject?goal=' + goal + '&subject=' + subject)
      .then(res => res.json())
      .then(
        (response) => {
          setAnswer(response.answer);
        },
        (error) => {
          console.log("Backend error" + error);
          setAnswer(null);
        }
      )
  }
  useEffect(() => {
    getSubjectList()
    getGoalList()
  }, []);

  function setGoal(goal) {
    setCurrentGoal(goal)
  }
  function setSubject(subject) {
    setCurrentSubject(subject)
  }
  function doQuestion(item) {
    setVisible(false)
    if (currentGoal === null || currentSubject === null) {
      setVisible(true)
    } else {
      getAnswer(currentGoal, currentSubject)
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {visible ? <Alert severity="error" style={{ marginTop: '25px' }}>I campi non possono essere vuoti</Alert> : null}
      <Grid container justify="flex-end" style={{ width: '80%', justifyContent: 'center', alignItems: 'center', padding: '20px', paddingBottom: '0' }}>

        <h1 style={{ paddingRight: '25px' }}>Il goal </h1>
        {loading ?
          <Autocomplete
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
              setAnswer(null)
              }
            }
            options={goalList}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Goal" />}
          />
          :
          <></>
        }
        <h1 style={{ paddingRight: '25px', paddingLeft: '25px' }} > tratta di </h1>
        {loading ?
          <Autocomplete
            disablePortal
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.label}>
                  {option.label}
                </li>
              );
            }}
            id="combo-box-demo2"
            onChange={(event, value) => {
              setSubject(value.label)
              setAnswer(null)
              }
            }
            options={subjectList}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Subject" />}
          />
          :
          <></>
        }
        <h1 style={{ paddingLeft: '25px' }}> ?</h1>

      </Grid>
      <Grid container justify="flex-end" style={{ width: '80%', justifyContent: 'center', alignItems: 'center', padding: '15px', }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => doQuestion()} variant="outlined" style={{ margin: 5 }}>Domanda</Button>
        </div>
      </Grid>
      <Grid>
        {answer === null ? 
          null
        :
          answer ?
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <h1>Il {currentGoal} tratta della {currentSubject}</h1>
            <Fab variant="extended" color="primary" size="medium" aria-label="add" style={{margin: '25px'}} onClick={() => routeChange(currentGoal)}>
                <ReadMoreIcon sx={{ mr: 1 }} />
                Read more...
              </Fab>
            </div>
            :
            <h1>Il {currentGoal} non tratta della {currentSubject}</h1>
        }
      </Grid>
    </div>
  );
}
