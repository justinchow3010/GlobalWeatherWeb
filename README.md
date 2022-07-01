# :sunrise_over_mountains: Global Weather Web
Web Application to view weather information all around the world!  
Allowing users to monitor real-time information and admins to manipulate the location data.    
  
![alt text](https://github.com/justinchow3010/GlobalWeatherWeb/blob/main/Map.jpg)  

## :newspaper: API  
Rootpath: /api

POST /login (body: username, password)  
POST /logout  

GET /favloc  
POST /favloc/:locid  

GET /location  
GET /location/:id  
POST /location (body: name, lat, long)  
PUT /location (body: locId, name, lat, long  *only locId is required*)  
DELETE /location/:locId

GET /comment/:locId  
POST /comment/:locId (body: username, content)  

GET /users 
GET /users/:username  
POST /users  (body: newname, newpw)  
PUT /users/:username (body: newname, newpw, newfavlocs *either of them / all of them*)  
DELETE /users/:username  

***Remark: Please do not use form-data to submit data for POST API***  


## 	:elf: Accounts
User Account: user user (ac, pw)  
Admin Account: admin admin (ac, pw)
