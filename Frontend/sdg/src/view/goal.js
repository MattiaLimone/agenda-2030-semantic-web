import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Fab, Accordion, AccordionSummary, AccordionDetails, Typography, Box, Button } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Indicatori(props) {
  let navigate = useNavigate()
  const [img, setImg] = useState(false);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [comment, setComment] = useState(false);
  const [source, setSource] = useState(false);
  const { state } = useLocation();

  const [goalData, setGoalData] = useState(new Array());
  const [targetData, setTargetData] = useState(new Array());
  const [subjectData, setSubjectData] = useState(new Array());
  const [expanded, setExpanded] = useState(false);

  const regex = /\#(.*)/g;
  var getGoalData = () => {
    fetch('http://localhost:8080/getGoalInfo?res=' + state.id)
      .then(res => res.json())
      .then(
        (response) => {
          setGoalData(response.result);
          {response.result.map((item, index) => {
              if (item.predicate.includes('sdg#has_image')) {
                setImg(item.object)
              }
              if (item.predicate.includes('sdg#start_time')) {
                setStart(item.object)
              }
              if (item.predicate.includes('sdg#end_time')) {
                setEnd(item.object)
              }
              if (item.predicate.includes('rdf-schema#comment')) {
                setComment(item.object)
              }
              if (item.predicate.includes('sdg#has_source')) {
                setSource(item.object)
              }
            })
          }
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
  var getSubjectInfo = () => {
    fetch('http://localhost:8080/getSubjectInfo?res=' + state.id)
      .then(res => res.json())
      .then(
        (response) => {
          setSubjectData(response.result);
          console.log(response.result)
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
    getSubjectInfo()
  }, []);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function routeChange(id,comment, path) {
    navigate(path, { state: { id: id, comment: comment } });
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
            <h2>{comment}</h2>
            <div style={{ flexDirection: 'row', display: 'flex' }}>
              <Grid style={{ justifyContent: 'left', alignItems: 'left', paddingRight: '50px' }}>
                <Box component="img" sx={{ padding: 1, height: 250, width: 250, }} alt='{}' src={img} />
                <Typography style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ padding: 0, margin: 0 }}><span style={{ fontWeight: 'normal' }}>Start time: </span>{start}</h4>
                </Typography>
                <Typography style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ padding: 0, margin: 0 }}><span style={{ fontWeight: 'normal' }}>End time: </span>{end}</h4>
                </Typography>
                <Typography style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                  <Button onClick={() => hyperLinkChange(source)} variant="outlined">SOURCE</Button>
                </Typography>

              </Grid>
              <div style={{ flexDirection: 'row', display: 'flex' }}>
                <div>
                  <h2 style={{ width: '20%' }}>Types:</h2>
                  <div style={{ width: '80%', marginTop: '25px' }}>

                    {goalData.map((item, index) => {
                      if (item.subject.includes(state.id.replaceAll(' ', '_')) && item.predicate.includes('rdf-syntax-ns#type')) {
                        return (
                          <div key={index}>
                            <Button onClick={() => hyperLinkChange(item.object)} variant="outlined"
                            style={{margin: 5}}>{item.object.substring(item.object.indexOf('#') + 1)}</Button>

                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
                <div>
                  <h2>Tratta di:</h2>

                    {subjectData.map((item,index) => {
                      return(
                        <div>
                          <Button key={index} onClick={() => routeChange(item.label,"/corrConcept")} variant="outlined" style={{margin: 5}}>{item.label}</Button>
                        </div>
                      )
                    })}
                </div>
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
                    <Fab variant="extended" color="primary" aria-label="add" style={{ marginBottom: '15', alignSelf: 'flex-end' }} onClick={() => routeChange(item.label, comment, "/indicators")}>
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