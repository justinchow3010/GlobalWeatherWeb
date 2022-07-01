import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2'

const HistorialChart = ({ location }) => {
    const WeatherAPIKey = "d4e491ae71ca4fa6aa5165555223004";

    let tempData = {
        label: "Temperature",
        data: [],
        fill: false,
        borderColor: "rgba(75,192,192,1)"
    };

    let humidityData = {
        label: "Humidity",
        data: [],
        fill: false,
        borderColor: "#742774"
    };

    let precpData = {
        label: "Precipitation amount in millimeters",
        data: [],
        fill: false,
        borderColor: "rgba(245, 40, 145, 0.8)"
    };

    let visibilityData = {
        label: "Visibility in km",
        data: [],
        fill: false,
        borderColor: "rgba(150, 28, 255, 0.8)"
    };

    let windKphData = {
        label: "Maximum wind speed",
        data: [],
        fill: false,
        borderColor: "rgba(255, 99, 0, 0.8)"
    };

    let prevDates = [];

    const [data, setData] = useState({
        labels: prevDates,
        datasets: []
    });

    useEffect(() => {
        let fiveDaysBefore = new Date();
        fiveDaysBefore.setDate(fiveDaysBefore.getDate() - 5);
        fiveDaysBefore = fiveDaysBefore.toLocaleDateString("en-CA");

        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday = yesterday.toLocaleDateString("en-CA");

        console.log(fiveDaysBefore);
        fetch("http://api.weatherapi.com/v1/history.json?" + new URLSearchParams({
            key: WeatherAPIKey,
            q: location,
            end_dt: yesterday,
            dt: fiveDaysBefore,
            hour: new Date().getHours()
        }))
            .then(res => res.json())
            .then(data => {
                let forecastDates = data.forecast.forecastday;
                let tmpDates = [];
                for (let date of forecastDates) {
                    let hour = date.hour;
                    let requiredInfo = hour[0];
                    tmpDates.push(date.date.toString() + "(wind drection" + requiredInfo.wind_dir + ")");
                    tempData.data.push(requiredInfo.temp_c);
                    humidityData.data.push(requiredInfo.humidity);
                    precpData.data.push(requiredInfo.precip_mm);
                    visibilityData.data.push(requiredInfo.vis_km);
                    windKphData.data.push(requiredInfo.wind_kph);
                }
                setData(prev => ({
                    ...prev,
                    labels: tmpDates,
                    datasets: [...prev.datasets, tempData, humidityData, precpData, visibilityData, windKphData]
                }));
            });
    }, [location]);

    return <>
        <Line data={data} width={100} height={200} options={{ maintainAspectRatio: false }} />
        {/* <Bar data={data} width={100} height={200} options={{ maintainAspectRatio: false }} /> */}
    </>;
}

export default HistorialChart;
