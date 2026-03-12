import { PageHeader } from "./PageHeader";

export const BuildingPage = ({pageName}: {pageName: string}) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={pageName} showBack />
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          height: "100vh",
          justifyItems: "center",
          flexDirection: 'column',
        }}
      >
        <h1
          style={{ fontSize: 22 }}
          className="font-semibold text-foreground truncate"
        >
          Sem acesso 🚧
        </h1>
        <p className="text-x text-center text-muted-foreground mb-2">
          Esta funcionalidade não está disponível no seu plano.
        </p>
      </div>
    </div>
  );
};
