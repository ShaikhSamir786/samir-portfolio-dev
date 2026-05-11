interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="pt-12 md:pt-16 pb-10 md:pb-12 text-center">
      <h1
        className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-gray-500 text-base max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
      {children && (
        <div className="mt-6 flex justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
