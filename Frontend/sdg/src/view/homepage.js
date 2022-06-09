import { React, useEffect, useState } from 'react';
import TreeView from '../components/TreeView';

export default function Home() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  var getData = () => {
    fetch('http://localhost:8080/homepage')
      .then(res => res.json())
      .then(
        (response) => {
          setLoading(true);
          setData(response.result);
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
    <div className='home'>
      <h1 id="test">Home</h1>
      {loading ? <TreeView data={data}/>: <></>}
    </div>
  );
}
