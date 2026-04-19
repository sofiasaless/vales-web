import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const AlertPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          height: "100vh",
          justifyItems: "center",
          flexDirection: "column",
          paddingInline: 5,
        }}
      >
        <h1
          style={{ fontSize: 22 }}
          className="font-semibold text-foreground truncate"
        >
          Aplicativo com pendências ❌
        </h1>
        <p className="text-x text-muted-foreground mb-2 text-center">
          O Vales Web está temporiariamente indísponível para esta conta devido
          a mensalidades vencidas.
        </p>

        <Button onClick={() => navigate("/select-manager")}>
          Voltar a tela de início
        </Button>
      </div>
    </div>
  );
};
