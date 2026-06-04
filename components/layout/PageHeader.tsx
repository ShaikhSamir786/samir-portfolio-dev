interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="pt-6 md:pt-10 pb-8 md:pb-12 text-center">
      <h1
        className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-text-muted text-base max-w-lg mx-auto">
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
