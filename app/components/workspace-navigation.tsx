import Link from "next/link";

export type WorkspaceView = "overview" | "backlog";

type WorkspaceProduct = {
  name: string;
  client: string;
  stage: string;
};

const views = [
  { id: "overview" as const, label: "Visão executiva", icon: "overview" },
  { id: "backlog" as const, label: "Backlog do time", icon: "backlog" },
];

function viewHref(activeView: WorkspaceView, targetView: WorkspaceView) {
  if (process.env.NODE_ENV === "production") {
    return targetView === "backlog" ? "./backlog.html" : "./";
  }

  if (activeView === targetView) {
    return "./";
  }

  return targetView === "backlog" ? "./backlog/" : "../";
}

function NavigationIcon({ name }: { name: string }) {
  const common = {
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  };

  if (name === "overview") {
    return (
      <svg {...common} aria-hidden="true">
        <rect height="7" rx="1" width="7" x="3" y="3" />
        <rect height="7" rx="1" width="7" x="14" y="3" />
        <rect height="7" rx="1" width="7" x="3" y="14" />
        <rect height="7" rx="1" width="7" x="14" y="14" />
      </svg>
    );
  }

  return (
    <svg {...common} aria-hidden="true">
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <path d="M8 3v6" />
      <path d="M15 9v6" />
      <path d="M10 15v6" />
    </svg>
  );
}

export function WorkspaceSidebar({
  activeView,
  product,
}: {
  activeView: WorkspaceView;
  product: WorkspaceProduct;
}) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:block xl:w-64">
      <div className="mb-6 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7180a0]">
          Produtos
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#00144a]">Workspace</h2>
      </div>

      <div className="rounded-xl border border-[#5548e8] bg-[#f0f1ff] px-3 py-3 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-3 w-3 rounded-full bg-[#5548e8]" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[#000b2f]">
              {product.name}
            </span>
            <span className="mt-1 block text-xs font-medium text-[#7180a0]">
              {product.client}
            </span>
            <span className="mt-2 inline-flex rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#7180a0]">
              {product.stage}
            </span>
          </span>
        </div>
      </div>

      <nav aria-label="Visões do produto" className="mt-7 border-t border-slate-200 pt-5">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7180a0]">
          Visões
        </p>
        <div className="space-y-1">
          {views.map((view) => {
            const isActive = view.id === activeView;

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#eef0ff] text-[#5548e8]"
                    : "text-[#7180a0] hover:bg-[#f7f8fb] hover:text-[#000b2f]"
                }`}
                href={viewHref(activeView, view.id)}
                key={view.id}
              >
                <NavigationIcon name={view.icon} />
                {view.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export function MobileViewNavigation({
  activeView,
}: {
  activeView: WorkspaceView;
}) {
  return (
    <nav
      aria-label="Visões do produto"
      className="flex gap-1 overflow-x-auto border-t border-slate-200 px-4 py-2 lg:hidden"
    >
      {views.map((view) => {
        const isActive = view.id === activeView;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
              isActive
                ? "bg-[#eef0ff] text-[#5548e8]"
                : "text-[#7180a0] hover:bg-[#f7f8fb] hover:text-[#000b2f]"
            }`}
            href={viewHref(activeView, view.id)}
            key={view.id}
          >
            <NavigationIcon name={view.icon} />
            {view.label}
          </Link>
        );
      })}
    </nav>
  );
}
