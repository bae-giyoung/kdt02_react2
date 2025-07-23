import { useState, useRef, useEffect } from "react"
import TailSelect from "./TailSelect"
import sarea from "../db/sarea.json"
import scode from "../db/scode.json"

export default function Subway() {
  const [tdata, setTdata] = useState([]);
  const [resultTable, setResultTable] = useState([]);
  const isInit = useRef(true);
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
    
    // 자정이 넘어서 해당 일자의 실시간 측정 data가 존재하지 않아서 xml을 응답하는 경우가 있었음
    if (contentType.includes('application/json')) {
      const data = await resp.json();
      //console.log(data.response);
      
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

  // tdata 변경 되면
  useEffect(() => {
    if(isInit.current) return;

    // 표 그리기
    let eachTable = null;
    
    if(!isInit.current && tdata.length == 1 && tdata[0].includes("no-data")) {
      eachTable = <div>해당하는 데이터가 존재하지 않습니다.</div>

    } else if(!isInit.current && tdata.length == 1 && tdata[0].includes("extra-error")) {
      eachTable = <div>예상치 못한 에러가 발생했습니다.</div>

    } else {
      eachTable = tdata.map((obj, idx) =>
        <div key={obj["controlnumber"] + idx} className="mt-5">
          <p className="font-extrabold text-right">({date.toLocaleDateString() + " " + obj["controlnumber"].slice(-2)}:00)</p>
          <div className="flex">
            {makeTableUnits(obj)}
          </div>
        </div>
      );

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
    <div className="flex flex-col gap-5">
      {resultTable}
    </div>
    </>
  )
}