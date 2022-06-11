import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Indicatori(props) {
  let navigate = useNavigate()
  const { state } = useLocation();

  useEffect(() => {
    if (state === null) {
      navigate("/");
    }
  }, []);
  return (
    <>
      {state === null ? null :
        <div className='home'>
          <h1>{state.id}</h1>
        </div>
      }
    </>
  );
}

export default Indicatori;