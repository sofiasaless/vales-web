import { Spin } from "antd";

export const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        height: "100vh",
        justifyItems: "center",
      }}
    >
      <Spin />
    </div>
  );
};
