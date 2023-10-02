const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative ">
      <main className=" h-full flex flex-col">
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
