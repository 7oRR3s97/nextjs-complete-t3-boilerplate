export default function MultiFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="flex flex-col items-center justify-center gap-4">
        {children}
      </div>
    </div>
  );
}
