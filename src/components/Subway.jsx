import { useState, useRef, useEffect } from "react"
import TailSelect from "./TailSelect"
import sarea from "../db/sarea.json"
import scode from "../db/scode.json"

export default function Subway() {
  const [tdata, setTdata] = useState([]);
  const [resultTable, setResultTable] = useState([]);
  const isInit = useRef(true);
  const selRef = useRef();
  //const prevSelRefVal = useRef("");
  const tableKeys = Object.keys(scode);
  const date = new Date();
  const today = date.getFullYear() + ("00" + (date.getMonth() + 1)).slice(-2) + date.getDate();

  const handleSelect = async () => {
    // 불필요한 fetch 요청 막기 => 시간 되면 완성하기
    //if(prevSelRefVal.current == selRef.current.value) return;

    const apikey = import.meta.env.VITE_DATA_API;
    const areaCode = selRef.current.value;
    const baseUrl = "https://apis.data.go.kr/6260000/IndoorAirQuality/getIndoorAirQualityByStation?";
    const url = `${baseUrl}serviceKey=${apikey}&pageNo=1&numOfRows=5&resultType=json&controlnumber=${today}&areaIndex=${areaCode}`;
    console.log(url, today);

    const resp = await fetch(url);
    const data = await resp.json();
    console.log(data.response);

    if(data.response.header.resultCode == "00") {
      if(isInit.current) isInit.current = false;

      if(data.response.body["numOfRows"] == "0") {
        setTdata(["no-data"]);
      } else {
        const sortedData = (data.response.body.items.item).sort((a, b) => a["controlnumber"] - b["controlnumber"]);
        setTdata(sortedData);
        //prevSelRefVal.current = selRef.current.value;
      }
    } else {
      // 응답 에러의 경우 처리해주기!
    }
  }

  const makeTableUnits = (obj) => {
    const tableUnits = tableKeys.map((item, idx) =>
      <div key={idx} className="mt-2 text-center border border-black">
        <p className="bg-green-800 text-white font-extrabold px-1 box-border">
          {scode[item]["name"]}<br />{item}
        </p>
        <p className="px-1 box-border">
          {obj[item]}
        </p>
      </div>
    );
    return tableUnits;
  }

  // tdata 변경 되면
  useEffect(() => {
    if(isInit.current) return;

    let eachTable = null;
    
    if(!isInit.current && tdata.length == 1 && tdata[0] == "no-data") {
      eachTable = <div>해당하는 데이터가 존재하지 않습니다.</div>
    } else {
      eachTable = tdata.map((obj, idx) =>
        <div key={obj["controlnumber"] + idx} className="mt-5">
          <p className="font-extrabold text-right">기준 시간: {obj["controlnumber"].slice(-2)}시</p>
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
      <TailSelect refName={selRef} opKeys={sarea.map(item => item["측정소"])} opValues={sarea.map(item => item["코드"])} onHandle={handleSelect} caption="--- 측정소를 선택하세요 ---" />
    </div>
    <div className="flex flex-col gap-5">
      {resultTable}
    </div>
    </>
  )
}