// import "./lineChart.css";
// //import useLagRadar from "./useLagRadar";
// import React from "react";
// import ReactDOM from "react-dom";
// import Line from "./Line";
// //


// //import DarkMode from "./components/DarkMode";




// /*const components = [
//   ["Line", Line],

// ];

// export default function App() {
//   useLagRadar();

//   return (
//     <div>
//       {components.map(([label, Comp]) => {
//         return (
//           <div key={label + ""}>
//             <h1>{label}</h1>
//             <div>
//               <Comp />
//             </div>
//           </div>
//         );
//       })}
//       <div style={{ height: "50rem" }} />
//     </div>
//   );
// }
// */

// /*const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement); */

// ChartJS.register(
//     LineElement,
//     CategoryScale,
//     LinearScale,
//     PointElement
//   )
//    function LineChart() {
//      const primaryAxis = React.useMemo(
//        () => ({
//          getValue: datum => datum.date,
//        }),
//        []
//      )

//      const secondaryAxes = React.useMemo(
//        () => [
//          {
//            getValue: datum => datum.line,
//          },
//        ],
//        []
//      )

//      return (
//        <Chart
//          options={{
//            data,
//            primaryAxis,
//            secondaryAxes,
//          }}
//        />
//      )
//    }
//    export default LineChart;
