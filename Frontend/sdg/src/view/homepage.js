import { React, useEffect, useState } from 'react';
import { Grid, Modal, Typography, Box, Button, Fab } from '@mui/material';
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
  let navigate = useNavigate(); 
  const [data, setData] = useState(new Array());
  const [loading, setLoading] = useState(false);
  const [currItem, setItem] = useState(null)
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  function handleShow(item) {
    setOpen(true)
    setItem(item)
  };
  function routeChange(path) {  
    navigate("/goal",{ state: { id: path} });
  }
  var getData = () => {
    fetch('http://localhost:8080/homepage')
      .then(res => res.json())
      .then(
        (response) => {
          setLoading(true);
          setItem(response.result[0])
          setData(response.result.sort((a, b) => a.index - b.index));
        },
        (error) => {
          console.log("Backend error" + error);
          setData({
            data: []
          })
        }
      )
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {loading ? <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >


        <Box sx={style}>
          <Box
            component="img"
            sx={{
              padding: 1,
              height: 250,
              width: 250,
            }}
            alt={currItem.goal_label}
            src={currItem.goal_image}
          />
          <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {currItem.goal_label}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {currItem.goal_comment}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Source: <a href={currItem.goal_source}>{currItem.goal_source}</a>
            </Typography>
            <div >
              <Fab variant="extended" color="primary" aria-label="add" style={{position: 'absolute',bottom:50,right:50,}} onClick={() => routeChange(currItem.goal_label)}>
                <ReadMoreIcon sx={{ mr: 1 }} />
                  Read more
              </Fab>
            </div>
          </div>
        </Box>
      </Modal> : <></>}


      <Grid container justify="flex-end" style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px' }}>

        {
          data.map((item, index) => {
            return (
              <Box
                key={index}
                component="img"
                sx={{
                  padding: 1,
                  height: 250,
                  width: 250,
                }}
                alt={item.goal_label}
                src={item.goal_image}
                onClick={() => handleShow(item)}
              />
            )
          })
        }
      </Grid>
    </div>
  );
}
