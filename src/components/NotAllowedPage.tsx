export const NotAllowedPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* <PageHeader title='' showBack /> */}
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
          Não autorizado ❌
        </h1>
        <p className="text-x text-muted-foreground mb-2">
          Você não tem as permissões necessárias para acessar essa página
        </p>
      </div>
    </div>
  );
};
