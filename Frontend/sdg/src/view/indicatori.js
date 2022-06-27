import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Fab, Accordion, AccordionSummary, AccordionDetails, Typography, Box, Button } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import chart from '../utils/chart.json';

function Indicatori(props) {
  let navigate = useNavigate()
  const { state } = useLocation();
  const [chartList, setChartList] = useState(new Array());
  const [indicatorsData, setIndicatorsData] = useState(new Array());
  const [tiersData, setTiersData] = useState(new Array());
  const [expanded, setExpanded] = useState(false);

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
    setChartList(chart)
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
                            style={{ margin: 25 }}>{item.tier}</Button>
                        </div>
                        <div><h5 style={{ width: '80%' }}>Description: {item.description}</h5></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <h2>Indicators:</h2>
            {indicatorsData.map((item, index) => {
              return (
                <Accordion key={index} expanded={expanded === item.label} onChange={handleChange(item.label)}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography><Button variant="outlined"
                            style={{margin: 5}}>{item.tierLabel}</Button> {item.label}</Typography>
                  </AccordionSummary>


                  <AccordionDetails>
                    <Typography>
                      Agency :
                      <Button onClick={() => hyperLinkChange("https://dbpedia.org/page/"+item.labelAgency.replace(/ /g,"_"))} variant="outlined"
                            style={{margin: 5}}>{item.labelAgency}</Button>
                    
                    </Typography>
                    <Typography>
                      Source :
                      <Button onClick={() => hyperLinkChange(item.source)} variant="outlined"
                            style={{margin: 5}}>Open Source</Button>
                    </Typography>
                    <Typography>
                      {item.comment}
                    </Typography>
                    {chartList.map((i, x) => {
                      if (item.label.localeCompare(i.indicator) == 0) {
                        return (
                          <iframe key={x} title={Math.random()} src={i.link} loading="lazy" style={{ width: '100%', height: '600px' }}></iframe>
                        )
                      }
                    })}
                   
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