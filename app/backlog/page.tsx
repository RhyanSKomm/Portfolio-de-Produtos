"use client";

import { useState } from "react";
import backlogJson from "@/data/backlog.json";
import humani from "@/data/humani.json";
import {
  MobileViewNavigation,
  WorkspaceSidebar,
} from "@/app/components/workspace-navigation";

type BacklogItem = {
  id: number;
  type: "User Story" | "Bug" | "Demanda técnica";
  product: string;
  title: string;
  category: string;
  parent: number;
  impact: number | null;
  confidence: number | null;
  effort: number | null;
  ice: number | null;
};

type BacklogStage = {
  id: string;
  label: string;
  description: string;
  items: BacklogItem[];
};

type BacklogFlow = {
  id: "upstream" | "downstream";
  label: string;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
  stages: BacklogStage[];
};

type BacklogData = {
  updatedAt: string;
  flows: BacklogFlow[];
};

const backlogData = backlogJson as BacklogData;

function BacklogIcon({ name, className = "" }: { name: string; className?: string }) {
  const common = {
    className: `h-4 w-4 ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  };

  if (name === "search") {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }

  if (name === "external") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M15 3h6v6" />
        <path d="m10 14 11-11" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
    );
  }

  return (
    <svg {...common} aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function typeTone(type: BacklogItem["type"]) {
  if (type === "Bug") {
    return "bg-red-50 text-red-700 ring-red-200";
  }

  if (type === "Demanda técnica") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  return "bg-[#fff3ed] text-[#a9532f] ring-[#f4d8ca]";
}

function TypeBadge({ type }: { type: BacklogItem["type"] }) {
  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-md px-2 text-[11px] font-semibold ring-1 ring-inset ${typeTone(type)}`}
    >
      {type}
    </span>
  );
}

function PriorityCell({ item }: { item: BacklogItem }) {
  if (item.ice === null) {
    return <span className="text-xs font-medium text-[#9aa4bb]">A priorizar</span>;
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex gap-1 text-[10px] font-semibold text-[#7180a0]">
        <span className="rounded bg-[#f0f2f6] px-1.5 py-1">I {item.impact}</span>
        <span className="rounded bg-[#f0f2f6] px-1.5 py-1">C {item.confidence}</span>
        <span className="rounded bg-[#f0f2f6] px-1.5 py-1">E {item.effort}</span>
      </div>
      <span className="flex h-8 min-w-10 items-center justify-center rounded-md bg-[#eef0ff] px-2 font-mono text-sm font-semibold text-[#5548e8]">
        {item.ice}
      </span>
    </div>
  );
}

function BacklogTable({ items }: { items: BacklogItem[] }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[920px] table-fixed border-collapse">
          <thead>
            <tr className="border-y border-slate-200 bg-[#f7f8fb] text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7180a0]">
              <th className="w-[72px] px-3 py-3">ID</th>
              <th className="w-[125px] px-3 py-3">Tipo</th>
              <th className="w-[140px] px-3 py-3">Produto</th>
              <th className="px-3 py-3">Demanda</th>
              <th className="w-[105px] px-3 py-3">Categoria</th>
              <th className="w-[76px] px-3 py-3">Parent</th>
              <th className="w-[175px] px-3 py-3">Prioridade ICE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr className="align-middle transition hover:bg-[#fafbfe]" key={item.id}>
                <td className="px-3 py-3 font-mono text-xs font-semibold text-[#7180a0]">
                  {item.id}
                </td>
                <td className="px-3 py-3">
                  <TypeBadge type={item.type} />
                </td>
                <td className="px-3 py-3 text-xs font-medium text-[#7180a0]">
                  {item.product}
                </td>
                <td className="px-3 py-3 text-sm font-medium leading-5 text-[#000b2f]">
                  {item.title}
                </td>
                <td className="px-3 py-3 text-xs font-medium text-[#7180a0]">
                  {item.category}
                </td>
                <td className="px-3 py-3 font-mono text-xs font-medium text-[#7180a0]">
                  {item.parent}
                </td>
                <td className="px-3 py-3">
                  <PriorityCell item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-200 md:hidden">
        {items.map((item) => (
          <article className="px-4 py-4" key={item.id}>
            <div className="flex items-center justify-between gap-3">
              <TypeBadge type={item.type} />
              <span className="font-mono text-xs font-semibold text-[#7180a0]">
                #{item.id}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-5 text-[#000b2f]">
              {item.title}
            </h3>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-[#7180a0]">
              <span>{item.product}</span>
              <span>{item.category}</span>
              <span>Parent {item.parent}</span>
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3">
              <PriorityCell item={item} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

type RefinementGroupId = "billable" | "bugs" | "rewrite" | "technical";

const refinementGroups: Array<{
  id: RefinementGroupId;
  label: string;
  description: string;
  dotClass: string;
}> = [
  {
    id: "billable",
    label: "USTs faturáveis",
    description: "Histórias que podem compor o faturamento da próxima sprint.",
    dotClass: "bg-[#d77a52]",
  },
  {
    id: "bugs",
    label: "Bugs não faturáveis",
    description: "Correções necessárias que não devem compor o faturamento.",
    dotClass: "bg-red-500",
  },
  {
    id: "rewrite",
    label: "Reescrita do Humani",
    description: "Itens vinculados à evolução da nova solução.",
    dotClass: "bg-[#5548e8]",
  },
  {
    id: "technical",
    label: "Demandas técnicas",
    description: "Trabalhos de sustentação, arquitetura e melhoria técnica.",
    dotClass: "bg-emerald-500",
  },
];

function refinementGroupFor(item: BacklogItem): RefinementGroupId {
  if (item.product === "Reescrita do Humani") {
    return "rewrite";
  }

  if (item.type === "Bug") {
    return "bugs";
  }

  if (item.type === "Demanda técnica") {
    return "technical";
  }

  return "billable";
}

function RefinementGroups({
  items,
  showEmptyGroups,
}: {
  items: BacklogItem[];
  showEmptyGroups: boolean;
}) {
  return (
    <div className="divide-y divide-slate-200">
      {refinementGroups.map((group) => {
        const groupItems = items.filter(
          (item) => refinementGroupFor(item) === group.id,
        );

        if (!showEmptyGroups && groupItems.length === 0) {
          return null;
        }

        return (
          <section key={group.id}>
            <div className="flex flex-col justify-between gap-2 bg-[#fafbfe] px-4 py-3 sm:flex-row sm:items-center sm:px-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${group.dotClass}`} />
                  <h4 className="text-xs font-semibold text-[#000b2f]">
                    {group.label}
                  </h4>
                  <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[#7180a0] ring-1 ring-slate-200">
                    {groupItems.length}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-[#7180a0] sm:ml-4">
                  {group.description}
                </p>
              </div>
            </div>
            {groupItems.length > 0 ? (
              <BacklogTable items={groupItems} />
            ) : (
              <p className="border-t border-slate-200 px-5 py-4 text-xs font-medium text-[#9aa4bb]">
                Nenhum item deste grupo está no refinamento.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function FlowSummary({ items }: { items: BacklogItem[] }) {
  const metrics = [
    {
      label: "Itens em execução",
      value: items.length,
      tone: "text-[#000b2f]",
      layoutClass: "",
    },
    {
      label: "USTs faturáveis",
      value: items.filter(
        (item) => item.type === "User Story" && item.product === "USTs",
      ).length,
      tone: "text-[#a9532f]",
      layoutClass: "border-l border-slate-200",
    },
    {
      label: "Reescrita Humani",
      value: items.filter((item) => item.product === "Reescrita do Humani").length,
      tone: "text-[#5548e8]",
      layoutClass: "border-t border-slate-200 xl:border-l xl:border-t-0",
    },
    {
      label: "Demandas técnicas",
      value: items.filter((item) => item.type === "Demanda técnica").length,
      tone: "text-emerald-700",
      layoutClass: "border-l border-t border-slate-200 xl:border-t-0",
    },
    {
      label: "Bugs não faturáveis",
      value: items.filter((item) => item.type === "Bug").length,
      tone: "text-red-700",
      layoutClass:
        "col-span-2 border-t border-slate-200 xl:col-span-1 xl:border-l xl:border-t-0",
    },
  ];

  return (
    <section aria-labelledby="current-sprint-title">
      <div className="mb-3 flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7180a0]">
            Execução atual
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[#00144a]" id="current-sprint-title">
            Sprint atual
          </h3>
        </div>
        <p className="text-xs font-medium text-[#7180a0]">
          Indicadores calculados somente com os itens em desenvolvimento.
        </p>
      </div>
      <div className="grid grid-cols-2 overflow-hidden rounded-[18px] border border-slate-200 bg-white xl:grid-cols-5">
        {metrics.map((metric) => (
          <div
            className={`px-4 py-4 sm:px-5 ${metric.layoutClass}`}
            key={metric.label}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7180a0]">
              {metric.label}
            </p>
            <p className={`mt-1 font-mono text-2xl font-semibold ${metric.tone}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyStageMessage({ children }: { children: string }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-xs font-medium text-[#9aa4bb]">{children}</p>
    </div>
  );
}

function DownstreamBoard({
  refinementStage,
  showEmptyGroups,
  sprintStage,
}: {
  refinementStage?: BacklogStage;
  showEmptyGroups: boolean;
  sprintStage?: BacklogStage;
}) {
  const sprintItems = sprintStage?.items ?? [];
  const refinementItems = refinementStage?.items ?? [];

  return (
    <div className="grid gap-5">
      <section
        aria-labelledby="sprint-board-title"
        className="overflow-hidden rounded-[18px] border border-[#d9dcff] bg-white shadow-[0_4px_16px_rgba(85,72,232,0.06)]"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-[#d9dcff] bg-[#f5f4ff] px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5548e8]">
                Agora
              </span>
              <span className="inline-flex min-h-6 items-center gap-1.5 rounded-full bg-[#5548e8] px-2.5 text-[10px] font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Em execução
              </span>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-[#00144a]" id="sprint-board-title">
              Sprint atual
            </h3>
            <p className="mt-1 text-xs font-medium text-[#7180a0]">
              Trabalho já comprometido e em desenvolvimento pelo time.
            </p>
          </div>
          <div className="sm:text-right">
            <p className="font-mono text-2xl font-semibold text-[#5548e8]">
              {sprintItems.length}
            </p>
            <p className="text-[11px] font-medium text-[#7180a0]">
              {sprintItems.length === 1 ? "item na sprint" : "itens na sprint"}
            </p>
          </div>
        </div>
        {sprintItems.length > 0 ? (
          <BacklogTable items={sprintItems} />
        ) : (
          <EmptyStageMessage>
            Nenhum item da sprint corresponde aos filtros aplicados.
          </EmptyStageMessage>
        )}
      </section>

      <section
        aria-labelledby="planning-board-title"
        className="overflow-hidden rounded-[18px] border border-slate-200 bg-white"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-[#f7f8fb] px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7180a0]">
                Depois
              </span>
              <span className="inline-flex min-h-6 items-center rounded-full bg-white px-2.5 text-[10px] font-semibold text-[#7180a0] ring-1 ring-slate-200">
                Candidatos
              </span>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-[#00144a]" id="planning-board-title">
              Planejamento da próxima sprint
            </h3>
            <p className="mt-1 text-xs font-medium text-[#7180a0]">
              Itens em refinamento que ainda não foram comprometidos na sprint.
            </p>
          </div>
          <div className="sm:text-right">
            <p className="font-mono text-2xl font-semibold text-[#000b2f]">
              {refinementItems.length}
            </p>
            <p className="text-[11px] font-medium text-[#7180a0]">
              {refinementItems.length === 1 ? "item candidato" : "itens candidatos"}
            </p>
          </div>
        </div>
        {refinementItems.length > 0 || showEmptyGroups ? (
          <RefinementGroups
            items={refinementItems}
            showEmptyGroups={showEmptyGroups}
          />
        ) : (
          <EmptyStageMessage>
            Nenhum item em planejamento corresponde aos filtros aplicados.
          </EmptyStageMessage>
        )}
      </section>
    </div>
  );
}

function UpstreamBoard({ stages }: { stages: BacklogStage[] }) {
  const visibleStages = stages.filter((stage) => stage.items.length > 0);

  if (visibleStages.length === 0) {
    return (
      <section className="rounded-[18px] border border-slate-200 bg-white">
        <EmptyStageMessage>
          Nenhum item do Upstream corresponde aos filtros aplicados.
        </EmptyStageMessage>
      </section>
    );
  }

  return (
    <div className="grid gap-5">
      {visibleStages.map((stage) => (
        <section
          className="overflow-hidden rounded-[18px] border border-slate-200 bg-white"
          key={stage.id}
        >
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-[#f7f8fb] px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7180a0]">
                Upstream
              </p>
              <h3 className="mt-1 text-base font-semibold text-[#00144a]">
                {stage.label}
              </h3>
              <p className="mt-1 text-xs font-medium text-[#7180a0]">
                {stage.description}
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-[#7180a0] ring-1 ring-slate-200">
              {stage.items.length} {stage.items.length === 1 ? "item" : "itens"}
            </span>
          </div>
          <BacklogTable items={stage.items} />
        </section>
      ))}
    </div>
  );
}

export default function BacklogPage() {
  const [activeFlowId, setActiveFlowId] = useState<BacklogFlow["id"]>("downstream");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const activeFlow =
    backlogData.flows.find((flow) => flow.id === activeFlowId) ?? backlogData.flows[0];
  const allFlowItems = activeFlow.stages.flatMap((stage) => stage.items);
  const sprintItems =
    backlogData.flows
      .find((flow) => flow.id === "downstream")
      ?.stages.find((stage) => stage.id === "development")?.items ?? [];
  const productOptions = Array.from(new Set(allFlowItems.map((item) => item.product))).sort();
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const hasActiveFilters = Boolean(
    normalizedQuery || typeFilter !== "all" || productFilter !== "all",
  );
  const orderedStages =
    activeFlow.id === "downstream"
      ? [...activeFlow.stages].sort((a, b) => {
          if (a.id === "development") return -1;
          if (b.id === "development") return 1;
          return 0;
        })
      : activeFlow.stages;

  const filteredStages = orderedStages.map((stage) => ({
    ...stage,
    items: stage.items.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        String(item.id).includes(normalizedQuery) ||
        item.category.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesProduct = productFilter === "all" || item.product === productFilter;

      return matchesQuery && matchesType && matchesProduct;
    }),
  }));
  const filteredSprintStage = filteredStages.find(
    (stage) => stage.id === "development",
  );
  const filteredRefinementStage = filteredStages.find(
    (stage) => stage.id === "refinement",
  );

  function selectFlow(flowId: BacklogFlow["id"]) {
    setActiveFlowId(flowId);
    setTypeFilter("all");
    setProductFilter("all");
  }

  return (
    <main className="min-h-screen bg-[#f0f2f6] text-[#000b2f]">
      <div className="flex min-h-screen">
        <WorkspaceSidebar activeView="backlog" product={humani} />

        <section className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex min-h-28 w-full items-center justify-between gap-5 px-5 py-6 sm:px-8 xl:px-10">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.28em] text-[#7180a0] sm:text-sm sm:tracking-[0.32em]">
                  Portfólio de Produtos
                </p>
                <h1 className="text-3xl font-semibold leading-none text-[#00144a] sm:text-4xl">
                  {humani.name}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#7180a0] sm:text-sm">
                  {humani.client}
                </p>
                <p className="mt-2 text-xs font-medium text-[#7180a0] sm:text-sm">
                  {humani.stage}
                </p>
              </div>
            </div>
            <MobileViewNavigation activeView="backlog" />
          </header>

          <div className="w-full space-y-5 p-4 sm:p-6 xl:p-8 2xl:p-10">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7180a0]">
                  Planejamento e execução
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#00144a] sm:text-3xl">
                  Backlog do time
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#7180a0]">
                  Acompanhe o caminho das demandas da descoberta até a sprint, com prioridade e contexto em uma única visão.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#7180a0]">
                  Atualizado em {backlogData.updatedAt}
                </span>
                <a
                  className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#000b2f] transition hover:border-[#cbd2df] hover:bg-[#f7f8fb] focus:outline-none focus:ring-4 focus:ring-[#5548e8]/10"
                  href={activeFlow.sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {activeFlow.sourceLabel}
                  <BacklogIcon name="external" />
                </a>
              </div>
            </div>

            <FlowSummary items={sprintItems} />

            <section className="rounded-[18px] border border-slate-200 bg-white px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="inline-flex w-fit rounded-lg bg-[#f0f2f6] p-1" role="tablist">
                  {backlogData.flows.map((flow) => {
                    const count = flow.stages.reduce(
                      (total, stage) => total + stage.items.length,
                      0,
                    );
                    const isActive = flow.id === activeFlow.id;

                    return (
                      <button
                        aria-selected={isActive}
                        className={`min-h-9 rounded-md px-3 text-xs font-semibold transition sm:px-4 ${
                          isActive
                            ? "bg-white text-[#5548e8] shadow-sm"
                            : "text-[#7180a0] hover:text-[#000b2f]"
                        }`}
                        key={flow.id}
                        onClick={() => selectFlow(flow.id)}
                        role="tab"
                        type="button"
                      >
                        {flow.label}
                        <span className="ml-2 font-mono text-[10px] opacity-70">{count}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_180px_180px] xl:w-auto">
                  <label className="relative block">
                    <span className="sr-only">Buscar no backlog</span>
                    <BacklogIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7180a0]"
                      name="search"
                    />
                    <input
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-[#000b2f] outline-none transition placeholder:text-[#9aa4bb] focus:border-[#5548e8] focus:ring-4 focus:ring-[#5548e8]/10"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar por ID ou demanda"
                      type="search"
                      value={query}
                    />
                  </label>
                  <label>
                    <span className="sr-only">Filtrar por tipo</span>
                    <select
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#7180a0] outline-none transition focus:border-[#5548e8] focus:ring-4 focus:ring-[#5548e8]/10"
                      onChange={(event) => setTypeFilter(event.target.value)}
                      value={typeFilter}
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="User Story">User Story</option>
                      <option value="Demanda técnica">Demanda técnica</option>
                      <option value="Bug">Bug</option>
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">Filtrar por produto</span>
                    <select
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#7180a0] outline-none transition focus:border-[#5548e8] focus:ring-4 focus:ring-[#5548e8]/10"
                      onChange={(event) => setProductFilter(event.target.value)}
                      value={productFilter}
                    >
                      <option value="all">Todos os produtos</option>
                      {productOptions.map((product) => (
                        <option key={product} value={product}>
                          {product}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="mt-4 flex flex-col justify-between gap-1 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
                <p className="text-sm font-semibold text-[#000b2f]">{activeFlow.label}</p>
                <p className="text-xs font-medium text-[#7180a0]">
                  {activeFlow.description}
                </p>
              </div>
            </section>

            {activeFlow.id === "downstream" ? (
              <DownstreamBoard
                refinementStage={filteredRefinementStage}
                showEmptyGroups={!hasActiveFilters}
                sprintStage={filteredSprintStage}
              />
            ) : (
              <UpstreamBoard stages={filteredStages} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
