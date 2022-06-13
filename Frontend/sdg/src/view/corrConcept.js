import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Fab, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Indicatori(props) {
  let navigate = useNavigate()
  const { state } = useLocation();
  const [subjectData, setSubjectData] = useState(new Array());
  const [expanded, setExpanded] = useState(false);
  const [labelData, setlabelData] = useState(new Array());

  var getCorrelatedConcept = () => {
    fetch('http://localhost:8080/getCorConcept?res=' + state.id)
      .then(res => res.json())
      .then(
        (response) => {
          setSubjectData(response.result);
        },
        (error) => {
          console.log("Backend error" + error);
          setSubjectData({
            data: []
          })
        }
      )
  }

  var getCorrelatedConceptLabel = () => {
    for (let i = 0; i < subjectData.length; i++) {
      fetch('http://localhost:8080/getMetaCorConceptLabel?res=' + subjectData[i].related)
      .then(res => res.json())
      .then(
        (response) => {
          labelData[i].push(response.result);
        },
        (error) => {
          console.log("Backend error" + error);
          setlabelData({
            data: []
          })
        }
      )
    }
  }


  
  useEffect(() => {
    if (state === null) {
      navigate("/");
    }
    getCorrelatedConcept();
    getCorrelatedConceptLabel();
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
              <h2 style={{ width: '25%' }}>Correlated Concepts:</h2>
              <div style={{ width: '85%', marginTop: '25px' }}>
              {labelData.map((item, index) => {
                      return (
                        <div key={index}>
                          <Fab variant="extended" color="primary" aria-label="add" style={{ marginBottom: '15' }}>
                            <ReadMoreIcon sx={{ mr: 1 }} />
                            {item}
                          </Fab>
                          <div style={{ height: '10px' }} />
                        </div>
                      )
                    
                })}
              </div>
              <div style={{ width: '85%', marginTop: '25px' }}>   
                {subjectData.map((item, index) => {
                      return (
                        <div key={index}>
                          <Fab variant="extended" color="primary" aria-label="add" style={{ marginBottom: '15' }} onClick={() => hyperLinkChange(item.object)}>
                            <ReadMoreIcon sx={{ mr: 1 }} />
                            {item.related}
                          </Fab>
                          <div style={{ height: '10px' }} />
                        </div>
                      )
                    
                })}
              </div>
            </div>
            <div style={{ height: '100px' }} />
          </Grid>

        </Grid>

      }
    </>
  );
}

export default Indicatori;