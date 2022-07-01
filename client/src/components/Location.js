import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>


function LocationUser() {
    const [data, getData] = useState([]);
    const [cookies, setCookie] = useCookies(['username']);

    console.log(cookies.username)
    console.log(document.cookie);
    useEffect(() => {
        fetchData()
    }, [])
  
    const fetchData = () => {
        fetch("/api/location", {
            method: "GET",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                // console.log(data)
                getData(data);
            })
    }
    const sortData=()=>{
        data.sort(sortByLat);
        console.log("called")
        console.log(data)
    }
    const sortByLat=(a, b)=>{
         
        data.sort((a, b)=>{
            if ( a.lat < b.lat ){
                return -1;
              }
              if ( a.lat > b.lat ){
                return 1;
              }
              return 0;
        })
        
    }
    const sortByName=(a, b)=>{
         
        data.sort((a, b)=>{
            if ( a.name < b.name ){
                return -1;
              }
              if ( a.name > b.name ){
                return 1;
              }
              return 0;
        })
        
    }
    const sortByLong=(a, b)=>{
         
        data.sort((a, b)=>{
            if ( a.long < b.long ){
                return -1;
              }
              if ( a.long > b.long ){
                return 1;
              }
              return 0;
        })
        
    }
  
  
    return (<>
        <div>
            <h1 class="text-light">Locations</h1>
            <form class="searchform" action="">
            <input type="text" placeholder="Location..." name="search" />
            <button type="submit" class="btn btn-success" >Search</button>
            </form>
            <br/>
            <table class="table table-bordered">
                <thead class="text-light">
                    <tr>
                        <th scope="col" onClick={()=>sortByName()}>name</th>
                        <th scope="col" onClick={()=>sortByLat()}>lat</th>
                        <th scope="col" onClick={()=>sortByLong()}>long</th>
                    </tr>
                </thead>
                <tbody class="text-light">
                    {data.map((item, i) => (
                        <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.lat}</td>
                            <td>{item.long}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>);
  }

  export default LocationUser;