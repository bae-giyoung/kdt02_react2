import { useState, useRef, useEffect } from "react"
import TailSelect from "./TailSelect"
import sarea from "../db/sarea.json"
import scode from "../db/scode.json"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function SubwayChart() {
    const [tdata, setTdata] = useState([]);
    const [resultTable, setResultTable] = useState([]);
    const [chart, setChart] = useState([]);
    const isInit = useRef(true);
    //const hasData = useRef(false);
    const selRef = useRef();
    const tableKeys = useRef(Object.keys(scode));
    const date = new Date();
    const today = date.getFullYear() + ("00" + (date.getMonth() + 1)).slice(-2) + ("00" + date.getDate()).slice(-2);

    // 셀렉트 값 변경되면 데이터 요청하기
    const handleSelect = async () => {
        const apikey = import.meta.env.VITE_DATA_API;
        const areaCode = selRef.current.value;
        const baseUrl = "https://apis.data.go.kr/6260000/IndoorAirQuality/getIndoorAirQualityByStation?";
        const url = `${baseUrl}serviceKey=${apikey}&pageNo=1&numOfRows=12&resultType=json&controlnumber=${today}&areaIndex=${areaCode}`;
        //console.log(url, today);

        const resp = await fetch(url);
        const contentType = resp.headers.get("content-type");
        let resultData = [];
        
        if (contentType.includes('application/json')) {  // 자정이 넘어서 해당 일자의 실시간 측정 data가 존재하지 않아서 xml을 응답하는 경우가 있었음
        const data = await resp.json();
        console.log(data.response);
        
            if(data.response.header.resultCode == "00") {  
                if(data.response.body["numOfRows"] == "0") {
                resultData = ["no-data"];
                } else {
                resultData = (data.response.body.items.item).sort((a, b) => a["controlnumber"] - b["controlnumber"]);
                }
            } else {
                resultData = ["extra-error"];
            }

        } else {
            if((await resp.text()).includes("<resultCode>03</resultCode>"))
                resultData = ["no-data"];
            else
                resultData = ["extra-error"];
        }

        if(isInit.current) isInit.current = false;
        setTdata(resultData);
    }

  const makeTableUnits = (obj) => {
    const tableUnits = tableKeys.current.map((item, idx) => {
        return (<div key={idx} className="mt-2 text-center border border-black">
            <p className="bg-green-800 text-white font-extrabold px-1 box-border">
                {scode[item]["name"]}<br />{item}
            </p>
            <p className="px-1 box-border">
                {obj[item]}
            </p>
        </div>)
    });
    return tableUnits;
  }

    // 차트 그리기
    const drawCharts = () => {
        const chartColors = ["red", "orange", "yellow", "green", "blue", "black", "violet", "gray", "brown"];
        const labels = [...tdata].map(item => item["controlnumber"].slice(-2) + "시");
        const cate1 = tableKeys.current.filter(item => (!item.includes("no") && item !=  "co"));
        const cate2 = tableKeys.current.filter(item => (item.includes("no") || item == "co")); // 0.0대에서 왔다갔다 하는 애들은 따로 빼서 차트 하나 더 그리자-> 그런데 밑으로 말고 옆으로 그리고 싶은데...


        /* const chData = {
            labels,
            datasets: tableKeys.current.map((cate, idx) => {
                return {
                    label: cate,
                    data: tdata.map(data => data[cate] == "-" ? null : parseFloat(data[cate])),
                    //spanGaps: true,
                    borderColor: chartColors[idx],
                    backgroundColor: 'transparent',
                    borderDash: idx % 3 == 0 ? [6,2,1,2] : idx % 3 == 1 ? [] : [5,2,2,2],
                    yAxisID: cate != "co2" ? 'y' : 'y1',
                }
            }),
        }; */

        const chData1 = {
            labels,
            datasets: cate1.map((cate, idx) => {
                return {
                    label: cate,
                    data: tdata.map(data => data[cate] == "-" ? null : parseFloat(data[cate])),
                    borderColor: chartColors[idx],
                    backgroundColor: 'transparent',
                    borderDash: idx % 3 == 0 ? [6,2,1,2] : idx % 3 == 1 ? [] : [5,2,2,2],
                    yAxisID: cate != "co2" ? 'y' : 'y1',
                }
            }),
        };

        const chData2 = {
            labels,
            datasets: cate2.map((cate, idx) => {
                return {
                    label: cate,
                    data: tdata.map(data => data[cate] == "-" ? null : parseFloat(data[cate])),
                    borderColor: chartColors[idx],
                    backgroundColor: 'transparent',
                    borderDash: idx % 3 == 0 ? [6,2,1,2] : idx % 3 == 1 ? [] : [5,2,2,2],
                    yAxisID: cate != "co" ? 'y' : 'y1',
                }
            }),
        };

        const [chOptions1, chOptions2] = [0,1].map(item => {
            return (
                {
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    stacked: false,
                    plugins: {
                        title: {
                            display: true,
                            text: item == 0 ? '지하철 실내 공기질 정보1' : '지하철 실내 공기질 정보2',
                            font: {
                                size: 20,
                                weight: 'bold',
                            }
                        },
                        legend: {
                            position: 'bottom',
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                            drawOnChartArea: false,
                            },
                        },
                    },
                }
        )});
        //const chOptions2 = Object.assign({}, chOptions1);
        //chOptions2.plugins.title.text = "지하철 실내 공기질 정보2 (질소 화합물)";

        //console.log(chData1);
        //setChart(<Line key={"chData1"} options={chOptions} data={chData} />);
        setChart([<Line key={"chData1"} options={chOptions1} data={chData1} />, <Line key={"chData2"} options={chOptions2} data={chData2} />]);
    }

    // tdata 변경 되면
    useEffect(() => {
        if(isInit.current) return;

        // 표 그리기
        let eachTable = null;
        
        if(!isInit.current && tdata.length == 1 && tdata[0].includes("no-data")) {
            eachTable = <div>해당하는 데이터가 존재하지 않습니다.</div>
            //hasData.current = false;

        } else if(!isInit.current && tdata.length == 1 && tdata[0].includes("extra-error")) {
            eachTable = <div>예상치 못한 에러가 발생했습니다.</div>
            //hasData.current = false;

        } else {
            eachTable = tdata.map((obj, idx) =>
                <div key={obj["controlnumber"] + idx} className="mt-5">
                <p className="font-extrabold text-right">({date.toLocaleDateString() + " " + obj["controlnumber"].slice(-2)}:00)</p>
                <div className="flex">
                    {makeTableUnits(obj)}
                </div>
                </div>
            );

            //hasData.current = true;
            drawCharts();
        }

        setResultTable(eachTable);
    }, [tdata]);

    return (
        <>
            <div>
                <TailSelect refName={selRef} 
                            opKeys={sarea.map(item => item["측정소"])} 
                            opValues={sarea.map(item => item["코드"])} 
                            onHandle={handleSelect} 
                            caption="--- 측정소를 선택하세요 ---" />
            </div>
            <div className="flex flex-col gap-5 mt-8">
                <div className="flex gap-2 max-w-full box-border">
                    <div className="w-1/2">{chart.length && chart[0]}</div>
                    <div className="w-1/2">{chart.length == 2 && chart[1]}</div>
                </div>
                <div>{resultTable}</div>
            </div>
        </>
    )
}

//{hasData.current && <Line options={chOptions} data={chData} />}