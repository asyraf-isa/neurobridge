/**
 * PagePlaceholder — shared stub for routes that are wired up but not yet
 * implemented by their owner. Keeps every stub visually consistent.
 */
function PagePlaceholder({ title, description, children }) {
  return (
    <div className="flex flex-col gap-2 py-4">
      <h1 className="m-0 font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
        {title}
      </h1>

      {description ? (
        <p className="m-0 max-w-2xl font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
      ) : null}

      {children}
    </div>
  );
}

export default PagePlaceholder;
