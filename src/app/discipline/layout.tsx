export default async function DisciplineLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <nav>Discipline Navigation</nav>
        <div>{children}</div>
      </div>
    );
  }