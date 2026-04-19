import { useIncentive } from "@/context/IncentiveContext";
import { useNavigate } from "react-router-dom";

export function useActiveIncentiveCardController() {
  const navigate = useNavigate();
  const { getActiveIncentive, getEmployeeCounter } = useIncentive();

  const activeIncentive = getActiveIncentive();

  if (!activeIncentive) return null;

  // const winner = activeIncentive.ganhador_id
  //   ? employeeState.employees.find((e) => e.id === activeIncentive.ganhador_id)
  //   : null;

  // Find current leader
  // let leader = { name: "", count: 0 };
  // if (!winner) {
  //   for (const employee of employeeState.employees) {
  //     const count = getEmployeeCounter(employee.id);
  //     if (count > leader.count) {
  //       leader = { name: employee.name, count };
  //     }
  //   }
  // }

  return {
    winner: null,
    leader: { name: "", count: 0 },
    navigate,
    activeIncentive,
  };
}
