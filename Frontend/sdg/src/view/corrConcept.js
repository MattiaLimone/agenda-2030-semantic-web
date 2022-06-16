import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Fab, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Indicatori(props) {
  let navigate = useNavigate()
  const { state } = useLocation();
  const [subjectData, setSubjectData] = useState(new Array());
  const [changePage, setChangePage] = useState()
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

  useEffect(() => {
    if (state === null) {
      navigate("/");
    }
    getCorrelatedConcept();
    setChangePage(Math.random())
  }, [state]);

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
        <Grid container justify="flex-end" style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px' }}>
          <Grid style={{ width: '60%', justifyContent: 'left', alignItems: 'left', paddingLeft: '50px', paddingRight: '50px' }}>
            <h1>{state.id}</h1>
            <div style={{ flexDirection: 'row', display: 'flex' }}>
              <h2 style={{ width: '25%' }}>Correlated Concepts:</h2>
              <div style={{ width: '75%', marginTop: '25px' }}>   
                {subjectData.map((item, index) => {
                      return (
                        <div key={index}>
                            <Button onClick={() => routeChange(item.relatedLabel,"/corrConcept")} variant="outlined"
                            style={{margin: 5}}>{item.relatedLabel}</Button>
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