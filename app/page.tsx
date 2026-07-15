"use client";

import { useMemo, useState } from "react";
import humani from "@/data/humani.json";

type ProductData = {
  objective: string;
  projects: string[];
  horizon: string;
  contractMoment: string;
};

type DeliveryMetric = {
  label: string;
  value: number;
};

type DeliveryData = {
  development: DeliveryMetric[];
  design: DeliveryMetric[];
};

type BillingData = {
  monthlyTarget: number;
  previousReport: number;
  desktopDevProduced: number;
  bugs: number;
  producedWithoutTickets: number;
  tickets: number;
  currentReportBillable: number;
  remainingOrMissing: number;
  totalToBill: number;
};

type SourceLink = {
  label: string;
  url: string;
};

type SourceLinks = SourceLink[];

type ProductWorkspace = {
  id: string;
  name: string;
  client: string;
  stage: string;
  sources: {
    product: SourceLinks;
    backlog: SourceLinks;
    delivery: SourceLinks;
    billing: SourceLinks;
  };
  product: ProductData;
  backlogProjects: string[];
  delivery: DeliveryData;
  billing: BillingData;
};

const emptySource: SourceLink = {
  label: "",
  url: "",
};

function normalizeSources(
  source: SourceLinks | SourceLink | string | undefined,
): SourceLinks {
  if (!source) {
    return [];
  }

  if (typeof source === "string") {
    return [{
      label: "",
      url: source,
    }];
  }

  const sources = Array.isArray(source) ? source : [source];

  return sources.map((item) => ({
    label: item.label ?? "",
    url: item.url ?? "",
  }));
}

const initialProducts: ProductWorkspace[] = [humani];

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#000b2f] outline-none transition focus:border-[#5548e8] focus:ring-4 focus:ring-[#5548e8]/10";

const sectionLabelClass =
  "text-sm font-semibold uppercase tracking-[0.22em] text-[#7180a0]";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const common = {
    className: `h-5 w-5 ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "pencil":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "check":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v5" />
          <path d="M14 11v5" />
        </svg>
      );
    case "info":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Home() {
  const canEdit = process.env.NODE_ENV !== "production";
  const [products, setProducts] = useState(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id);
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? products[0],
    [products, selectedProductId],
  );
  const [productDraft, setProductDraft] = useState<ProductData>(selectedProduct.product);
  const [isProductEditing, setIsProductEditing] = useState(false);
  const [deliveryDraft, setDeliveryDraft] = useState<DeliveryData>(
    selectedProduct.delivery,
  );
  const [isDeliveryEditing, setIsDeliveryEditing] = useState(false);
  const [billingDraft, setBillingDraft] = useState<BillingData>(selectedProduct.billing);
  const [isBillingEditing, setIsBillingEditing] = useState(false);

  function updateSelectedProduct(updater: (product: ProductWorkspace) => ProductWorkspace) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === selectedProductId ? updater(product) : product,
      ),
    );
  }

  function selectProduct(productId: string) {
    const nextProduct = products.find((product) => product.id === productId);

    if (!nextProduct) {
      return;
    }

    setSelectedProductId(productId);
    setProductDraft(nextProduct.product);
    setDeliveryDraft(nextProduct.delivery);
    setBillingDraft(nextProduct.billing);
    setIsProductEditing(false);
    setIsDeliveryEditing(false);
    setIsBillingEditing(false);
  }

  function saveProduct() {
    const nextProductData = {
      ...productDraft,
      projects: productDraft.projects.map((project) => project.trim()).filter(Boolean),
    };

    updateSelectedProduct((product) => ({ ...product, product: nextProductData }));
    setProductDraft(nextProductData);
    setIsProductEditing(false);
  }

  function saveDelivery() {
    updateSelectedProduct((product) => ({ ...product, delivery: deliveryDraft }));
    setIsDeliveryEditing(false);
  }

  function saveBilling() {
    updateSelectedProduct((product) => ({ ...product, billing: billingDraft }));
    setIsBillingEditing(false);
  }

  return (
    <main className="min-h-screen bg-[#f0f2f6] text-[#000b2f]">
      <div className="flex min-h-screen">
        <Sidebar
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={selectProduct}
        />

        <section className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex min-h-28 w-full items-center justify-between gap-8 px-8 py-6 xl:px-10">
              <div>
                <p className="mb-1 text-sm font-medium uppercase tracking-[0.32em] text-[#7180a0]">
                  Portfólio de Produtos
                </p>
                <h1 className="text-4xl font-semibold leading-none text-[#00144a]">
                  {selectedProduct.name}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7180a0]">
                  {selectedProduct.client}
                </p>
                <p className="mt-2 text-sm font-medium text-[#7180a0]">
                  {selectedProduct.stage}
                </p>
              </div>
            </div>
          </header>

          <div className="grid w-full grid-cols-1 gap-6 p-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] xl:p-8 2xl:p-10">
            <ProductCard
              canEdit={canEdit}
              data={selectedProduct.product}
              draft={productDraft}
              isEditing={isProductEditing}
              source={selectedProduct.sources.product}
              onSourceChange={(source) =>
                updateSelectedProduct((product) => ({
                  ...product,
                  sources: { ...product.sources, product: source },
                }))
              }
              onEdit={() => {
                setProductDraft(selectedProduct.product);
                setIsProductEditing(true);
              }}
              onCancel={() => {
                setProductDraft(selectedProduct.product);
                setIsProductEditing(false);
              }}
              onChange={setProductDraft}
              onSave={saveProduct}
            />
            <DeliveryCard
              canEdit={canEdit}
              data={selectedProduct.delivery}
              draft={deliveryDraft}
              isEditing={isDeliveryEditing}
              source={selectedProduct.sources.delivery}
              onSourceChange={(source) =>
                updateSelectedProduct((product) => ({
                  ...product,
                  sources: { ...product.sources, delivery: source },
                }))
              }
              onEdit={() => {
                setDeliveryDraft(selectedProduct.delivery);
                setIsDeliveryEditing(true);
              }}
              onCancel={() => {
                setDeliveryDraft(selectedProduct.delivery);
                setIsDeliveryEditing(false);
              }}
              onChange={setDeliveryDraft}
              onSave={saveDelivery}
            />
            <BillingCard
              canEdit={canEdit}
              data={selectedProduct.billing}
              draft={billingDraft}
              isEditing={isBillingEditing}
              source={selectedProduct.sources.billing}
              onSourceChange={(source) =>
                updateSelectedProduct((product) => ({
                  ...product,
                  sources: { ...product.sources, billing: source },
                }))
              }
              onEdit={() => {
                setBillingDraft(selectedProduct.billing);
                setIsBillingEditing(true);
              }}
              onCancel={() => {
                setBillingDraft(selectedProduct.billing);
                setIsBillingEditing(false);
              }}
              onChange={setBillingDraft}
              onSave={saveBilling}
            />
            <BacklogCard
              canEdit={canEdit}
              projects={selectedProduct.backlogProjects}
              source={selectedProduct.sources.backlog}
              onSourceChange={(source) =>
                updateSelectedProduct((product) => ({
                  ...product,
                  sources: { ...product.sources, backlog: source },
                }))
              }
              onChangeProjects={(nextProjects) =>
                updateSelectedProduct((product) => ({
                  ...product,
                  backlogProjects: nextProjects,
                }))
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Sidebar({
  products,
  selectedProductId,
  onSelectProduct,
}: {
  products: ProductWorkspace[];
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
}) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:block xl:w-64">
      <div className="mb-6 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7180a0]">
          Produtos
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#00144a]">Workspace</h2>
      </div>

      <div className="space-y-2">
        {products.map((product) => {
          const isSelected = product.id === selectedProductId;

          return (
            <button
              className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                isSelected
                  ? "border-[#5548e8] bg-[#f0f1ff] shadow-sm"
                  : "border-transparent bg-white hover:border-slate-200 hover:bg-[#f7f8fb]"
              }`}
              key={product.id}
              onClick={() => onSelectProduct(product.id)}
              type="button"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-3 w-3 rounded-full ${
                    isSelected ? "bg-[#5548e8]" : "bg-slate-300"
                  }`}
                />
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
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ProductCard({
  canEdit,
  data,
  draft,
  isEditing,
  source,
  onEdit,
  onCancel,
  onChange,
  onSourceChange,
  onSave,
}: {
  canEdit: boolean;
  data: ProductData;
  draft: ProductData;
  isEditing: boolean;
  source: SourceLinks;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (value: ProductData) => void;
  onSourceChange: (source: SourceLinks) => void;
  onSave: () => void;
}) {
  const visibleData = isEditing ? draft : data;

  return (
    <section className="min-h-[340px] rounded-[18px] border border-slate-200 bg-white px-7 py-8">
      <CardTop
        title="Visão Produto"
        isEditing={isEditing}
        source={source}
        onCancel={onCancel}
        onEdit={canEdit ? onEdit : undefined}
        onSave={onSave}
      />

      {isEditing ? (
        <SourceEditor source={source} onSourceChange={onSourceChange} />
      ) : null}

      <div className="mt-8">
        <p className="mb-2 text-sm font-medium text-[#7180a0]">Objetivo Estratégico</p>
        {isEditing ? (
          <textarea
            className={`${fieldClass} min-h-28 resize-y leading-7`}
            value={draft.objective}
            onChange={(event) => onChange({ ...draft, objective: event.target.value })}
          />
        ) : (
          <p className="text-base font-normal leading-7 text-[#000b2f]">
            {visibleData.objective}
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium text-[#7180a0]">
            Planejamento Horizonte
          </p>
          {isEditing ? (
            <textarea
              className={`${fieldClass} min-h-20 resize-y leading-6`}
              value={draft.horizon}
              onChange={(event) => onChange({ ...draft, horizon: event.target.value })}
            />
          ) : (
            <p className="text-base font-medium text-[#000b2f]">{visibleData.horizon}</p>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[#7180a0]">Momento do Contrato</p>
          {isEditing ? (
            <textarea
              className={`${fieldClass} min-h-20 resize-y leading-6`}
              value={draft.contractMoment}
              onChange={(event) =>
                onChange({ ...draft, contractMoment: event.target.value })
              }
            />
          ) : (
            <p className="text-base font-normal leading-6 text-[#000b2f]">
              {visibleData.contractMoment}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function BacklogCard({
  canEdit,
  projects,
  source,
  onSourceChange,
  onChangeProjects,
}: {
  canEdit: boolean;
  projects: string[];
  source: SourceLinks;
  onSourceChange: (source: SourceLinks) => void;
  onChangeProjects: (projects: string[]) => void;
}) {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [editingProjectName, setEditingProjectName] = useState("");
  const [isBacklogEditing, setIsBacklogEditing] = useState(false);

  function addProject() {
    const projectName = newProjectName.trim();

    if (!projectName) {
      return;
    }

    onChangeProjects([...projects, projectName]);
    setNewProjectName("");
    setIsAddingProject(false);
  }

  function cancelAddProject() {
    setNewProjectName("");
    setIsAddingProject(false);
  }

  function startEditProject(index: number) {
    setEditingProjectIndex(index);
    setEditingProjectName(projects[index]);
  }

  function saveProjectEdit() {
    const projectName = editingProjectName.trim();

    if (!projectName || editingProjectIndex === null) {
      return;
    }

    onChangeProjects(
      projects.map((project, index) =>
        index === editingProjectIndex ? projectName : project,
      ),
    );
    setEditingProjectIndex(null);
    setEditingProjectName("");
  }

  function cancelProjectEdit() {
    setEditingProjectIndex(null);
    setEditingProjectName("");
  }

  function deleteProject(indexToDelete: number) {
    onChangeProjects(projects.filter((_, index) => index !== indexToDelete));

    if (editingProjectIndex === indexToDelete) {
      cancelProjectEdit();
    }
  }

  return (
    <section className="rounded-[18px] border border-slate-200 bg-white px-7 py-8">
      <CardTop
        title="Visão Backlog"
        isEditing={isBacklogEditing}
        source={source}
        onCancel={() => setIsBacklogEditing(false)}
        onEdit={canEdit ? () => setIsBacklogEditing(true) : undefined}
        onSave={() => setIsBacklogEditing(false)}
      />

      {isBacklogEditing ? (
        <SourceEditor source={source} onSourceChange={onSourceChange} />
      ) : null}

      <div className="mt-8 grid gap-10">
        <div>
          <div className="grid grid-cols-[1fr_auto] gap-6">
            <div>
              <h2 className="text-lg font-semibold text-[#000b2f]">Upstream · Gantt</h2>
              <p className="mt-1 text-sm font-medium text-[#7180a0]">
                {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
              </p>
            </div>

            <button
              className={canEdit ? "mt-1 flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-[#f3f6fb] px-4 text-sm font-medium text-[#000b2f] transition hover:border-[#5a52e8] hover:text-[#5a52e8]" : "hidden"}
              onClick={() => setIsAddingProject(true)}
              type="button"
            >
              <Icon name="plus" className="h-4 w-4" />
              Adicionar
            </button>
          </div>

          <div className="mt-9 space-y-3">
            {projects.map((project, index) => (
              <div
                className="flex h-12 items-center gap-4 rounded-[14px] border border-slate-200 bg-[#f5f7fb] px-4 shadow-sm"
                key={`${project}-${index}`}
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#5a52e8]" />

                {editingProjectIndex === index ? (
                  <input
                    autoFocus
                    className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#000b2f] outline-none"
                    value={editingProjectName}
                    onChange={(event) => setEditingProjectName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        saveProjectEdit();
                      }

                      if (event.key === "Escape") {
                        cancelProjectEdit();
                      }
                    }}
                  />
                ) : (
                  <p className="min-w-0 flex-1 truncate text-base font-medium text-[#000b2f]">
                    {project}
                  </p>
                )}

                {editingProjectIndex === index ? (
                  <div className={canEdit ? "flex items-center gap-1" : "hidden"}>
                    <button
                      aria-label="Salvar projeto"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-600 transition hover:bg-emerald-50"
                      onClick={saveProjectEdit}
                      type="button"
                    >
                      <Icon name="check" className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Cancelar edição do projeto"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#7180a0] transition hover:bg-slate-100 hover:text-[#000b2f]"
                      onClick={cancelProjectEdit}
                      type="button"
                    >
                      <Icon name="x" className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className={canEdit ? "flex items-center gap-1" : "hidden"}>
                    <button
                      aria-label="Editar projeto"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#7180a0] transition hover:bg-white hover:text-[#5548e8]"
                      onClick={() => startEditProject(index)}
                      type="button"
                    >
                      <Icon name="pencil" className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Excluir projeto"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#7180a0] transition hover:bg-white hover:text-red-500"
                      onClick={() => deleteProject(index)}
                      type="button"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isAddingProject ? (
              <div className="flex h-12 items-center rounded-[14px] border border-slate-200 bg-[#f5f7fb] px-3 shadow-sm">
                <input
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#000b2f] outline-none placeholder:text-[#7180a0]"
                  placeholder="Nome do projeto..."
                  value={newProjectName}
                  onChange={(event) => setNewProjectName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addProject();
                    }

                    if (event.key === "Escape") {
                      cancelAddProject();
                    }
                  }}
                />
                <button
                  aria-label="Confirmar projeto"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-emerald-600 transition hover:bg-emerald-50"
                  onClick={addProject}
                  type="button"
                >
                  <Icon name="check" className="h-4 w-4" />
                </button>
                <button
                  aria-label="Cancelar projeto"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#7180a0] transition hover:bg-slate-100 hover:text-[#000b2f]"
                  onClick={cancelAddProject}
                  type="button"
                >
                  <Icon name="x" className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#000b2f]">Previsão Downstream</h2>
          <p className="mt-1 text-sm font-medium text-[#7180a0]">
            Base + margem de 15%
          </p>

          <div className="mt-8 space-y-8">
            <ForecastBar
              assumed="23 itens assumidos"
              base={20}
              label="Mensal"
              margin={3}
              percentBase={31}
              percentMargin={36}
            />
            <ForecastBar
              assumed="57 itens assumidos"
              base={50}
              label="Quarter"
              margin={8}
              percentBase={77}
              percentMargin={90}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BillingCard({
  canEdit,
  data,
  draft,
  isEditing,
  source,
  onEdit,
  onCancel,
  onChange,
  onSourceChange,
  onSave,
}: {
  canEdit: boolean;
  data: BillingData;
  draft: BillingData;
  isEditing: boolean;
  source: SourceLinks;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (value: BillingData) => void;
  onSourceChange: (source: SourceLinks) => void;
  onSave: () => void;
}) {
  const visibleData = isEditing ? draft : data;

  function updateBillingField(field: keyof BillingData, value: string) {
    onChange({
      ...draft,
      [field]: Math.max(0, Math.trunc(Number(value) || 0)),
    });
  }

  return (
    <section className="rounded-[18px] border border-slate-200 bg-white px-7 py-8">
      <CardTop
        title="Faturamento"
        isEditing={isEditing}
        source={source}
        onCancel={onCancel}
        onEdit={canEdit ? onEdit : undefined}
        onSave={onSave}
      />

      {isEditing ? (
        <SourceEditor source={source} onSourceChange={onSourceChange} />
      ) : null}

      <div className="mt-8 grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <BillingHighlight
            label="Para faturar"
            tone="primary"
            value={visibleData.totalToBill}
            field="totalToBill"
            isEditing={isEditing}
            onChange={updateBillingField}
          />
          <BillingHighlight
            label="Sobram / faltam"
            tone="success"
            value={visibleData.remainingOrMissing}
            field="remainingOrMissing"
            isEditing={isEditing}
            onChange={updateBillingField}
          />
        </div>

        <div className="grid gap-3">
          <BillingRow
            label="Meta mensal para faturar"
            value={visibleData.monthlyTarget}
            field="monthlyTarget"
            isEditing={isEditing}
            onChange={updateBillingField}
          />
          <BillingRow
            label="Relatório anterior"
            value={visibleData.previousReport}
            field="previousReport"
            note="USTs que sobraram do mês anterior."
            isEditing={isEditing}
            onChange={updateBillingField}
          />
          <BillingRow
            label="Produzido Dev - desktop"
            value={visibleData.desktopDevProduced}
            field="desktopDevProduced"
            isEditing={isEditing}
            onChange={updateBillingField}
          />
          <BillingRow
            label="Bugs"
            value={visibleData.bugs}
            field="bugs"
            isEditing={isEditing}
            onChange={updateBillingField}
          />
          <BillingRow
            label="Produzido no mês sem chamados + meses anteriores"
            value={visibleData.producedWithoutTickets}
            field="producedWithoutTickets"
            isEditing={isEditing}
            onChange={updateBillingField}
          />
          <BillingRow
            label="Chamados"
            value={visibleData.tickets}
            field="tickets"
            isEditing={isEditing}
            onChange={updateBillingField}
          />
          <BillingRow
            label="Para faturar relatório atual"
            value={visibleData.currentReportBillable}
            field="currentReportBillable"
            note="Quantidade de USTs do total produzido e saldo anterior."
            isEditing={isEditing}
            onChange={updateBillingField}
          />
        </div>
      </div>
    </section>
  );
}

function DeliveryCard({
  canEdit,
  data,
  draft,
  isEditing,
  source,
  onEdit,
  onCancel,
  onChange,
  onSourceChange,
  onSave,
}: {
  canEdit: boolean;
  data: DeliveryData;
  draft: DeliveryData;
  isEditing: boolean;
  source: SourceLinks;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (value: DeliveryData) => void;
  onSourceChange: (source: SourceLinks) => void;
  onSave: () => void;
}) {
  const visibleData = isEditing ? draft : data;

  function updateMetric(group: "development" | "design", index: number, value: string) {
    const integerValue = Math.max(0, Math.trunc(Number(value) || 0));
    const nextMetrics = draft[group].map((metric, currentIndex) =>
      currentIndex === index ? { ...metric, value: integerValue } : metric,
    );

    onChange({ ...draft, [group]: nextMetrics });
  }

  return (
    <section className="min-h-[340px] rounded-[18px] border border-slate-200 bg-white px-7 py-8">
      <CardTop
        title="Média de Entrega"
        isEditing={isEditing}
        source={source}
        onCancel={onCancel}
        onEdit={canEdit ? onEdit : undefined}
        onSave={onSave}
      />

      {isEditing ? (
        <SourceEditor source={source} onSourceChange={onSourceChange} />
      ) : null}

      <div className="mt-8 grid gap-12 2xl:grid-cols-2">
        <MetricTable
          isEditing={isEditing}
          metrics={visibleData.development}
          onUpdate={(index, value) => updateMetric("development", index, value)}
          title="Desenvolvimento"
        />
        <MetricTable
          isEditing={isEditing}
          metrics={visibleData.design}
          onUpdate={(index, value) => updateMetric("design", index, value)}
          title="Design"
        />
      </div>
    </section>
  );
}

function CardTop({
  title,
  isEditing = false,
  source,
  onEdit,
  onSave,
  onCancel,
}: {
  title: string;
  isEditing?: boolean;
  source: SourceLinks;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  const safeSources = normalizeSources(source).filter((item) => item.url.trim());
  const hasSources = safeSources.length > 0;
  const sourceSummary = hasSources
    ? `${safeSources.length} ${safeSources.length === 1 ? "fonte cadastrada" : "fontes cadastradas"}`
    : "Sem fonte cadastrada";

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p className={sectionLabelClass}>{title}</p>
        <div className="flex gap-2">
          {hasSources ? (
            <div className="group/source relative">
              <button
                aria-label={`Consultar fontes de ${title.toLowerCase()}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef0ff] text-[#5548e8] transition hover:bg-[#e1e5ff]"
                title={sourceSummary}
                type="button"
              >
                <Icon name="info" className="h-4 w-4" />
              </button>

              <div className="invisible absolute right-0 top-8 z-30 w-64 translate-y-1 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover/source:visible group-hover/source:translate-y-0 group-hover/source:opacity-100 group-focus-within/source:visible group-focus-within/source:translate-y-0 group-focus-within/source:opacity-100">
                <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7180a0]">
                  Fontes de consulta
                </p>
                <div className="grid gap-1">
                  {safeSources.map((item, index) => {
                    const label = item.label.trim() || `Fonte ${index + 1}`;

                    return (
                      <a
                        className="rounded-md px-3 py-2 text-sm font-medium text-[#000b2f] transition hover:bg-[#eef0ff] hover:text-[#5548e8] focus:bg-[#eef0ff] focus:text-[#5548e8] focus:outline-none"
                        href={item.url}
                        key={`${item.url}-${index}`}
                        rel="noreferrer"
                        target="_blank"
                        title={`Abrir ${label}`}
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <span
              aria-label="Sem fonte cadastrada"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#7180a0]"
              title={sourceSummary}
            >
              <Icon name="info" className="h-4 w-4" />
            </span>
          )}

          {isEditing && onSave && onCancel ? (
            <>
              <button
                aria-label="Salvar alterações"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5548e8] text-white transition hover:bg-[#4338ca]"
                onClick={onSave}
                type="button"
              >
                <Icon name="check" className="h-4 w-4" />
              </button>
              <button
                aria-label="Cancelar edição"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-[#7180a0] transition hover:text-[#000b2f]"
                onClick={onCancel}
                type="button"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </>
          ) : onEdit ? (
            <button
              aria-label={`Editar ${title.toLowerCase()}`}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#7180a0] transition hover:bg-[#f0f2f6] hover:text-[#5548e8]"
              onClick={onEdit}
              type="button"
            >
              <Icon name="pencil" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SourceEditor({
  source,
  onSourceChange,
}: {
  source: SourceLinks;
  onSourceChange: (source: SourceLinks) => void;
}) {
  const safeSources = normalizeSources(source);

  function updateSource(index: number, value: Partial<SourceLink>) {
    onSourceChange(
      safeSources.map((item, currentIndex) =>
        currentIndex === index ? { ...item, ...value } : item,
      ),
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f7f8fb] p-3">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#7180a0]">
        Fontes da informação
      </label>
      <div className="grid gap-2">
        {safeSources.map((item, index) => (
          <div
            className="grid gap-2 md:grid-cols-[200px_minmax(0,1fr)_auto]"
            key={`source-editor-${index}`}
          >
            <input
              className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#000b2f] outline-none transition placeholder:text-[#7180a0] focus:border-[#5548e8] focus:ring-4 focus:ring-[#5548e8]/10"
              placeholder="Nome da fonte"
              value={item.label}
              onChange={(event) => updateSource(index, { label: event.target.value })}
            />
            <input
              className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#000b2f] outline-none transition placeholder:text-[#7180a0] focus:border-[#5548e8] focus:ring-4 focus:ring-[#5548e8]/10"
              placeholder="https://..."
              type="url"
              value={item.url}
              onChange={(event) => updateSource(index, { url: event.target.value })}
            />
            <button
              aria-label={`Excluir fonte ${index + 1}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#7180a0] ring-1 ring-slate-200 transition hover:text-red-500"
              onClick={() =>
                onSourceChange(safeSources.filter((_, currentIndex) => currentIndex !== index))
              }
              title="Excluir fonte"
              type="button"
            >
              <Icon name="trash" className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-[#5548e8] ring-1 ring-slate-200 transition hover:bg-[#eef0ff]"
          onClick={() => onSourceChange([...safeSources, { ...emptySource }])}
          type="button"
        >
          <Icon name="plus" className="h-4 w-4" />
          Adicionar fonte
        </button>
      </div>
    </div>
  );
}

function BillingHighlight({
  label,
  value,
  field,
  tone,
  isEditing,
  onChange,
}: {
  label: string;
  value: number;
  field: keyof BillingData;
  tone: "primary" | "success";
  isEditing: boolean;
  onChange: (field: keyof BillingData, value: string) => void;
}) {
  const toneClass =
    tone === "primary"
      ? "bg-[#f0f1ff] text-[#1c18a5]"
      : "bg-emerald-50 text-emerald-700";

  return (
    <div className={`rounded-2xl px-5 py-4 2xl:min-h-[118px] ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
        {label}
      </p>
      {isEditing ? (
        <input
          className="mt-3 h-11 w-full rounded-xl border border-white/70 bg-white px-3 text-2xl font-semibold text-[#000b2f] outline-none focus:ring-4 focus:ring-white/60"
          min="0"
          step="1"
          type="number"
          value={value}
          onChange={(event) => onChange(field, event.target.value)}
        />
      ) : (
        <p className="mt-2 text-3xl font-semibold 2xl:text-4xl">{value}</p>
      )}
    </div>
  );
}

function BillingRow({
  label,
  value,
  field,
  note,
  isEditing,
  onChange,
}: {
  label: string;
  value: number;
  field: keyof BillingData;
  note?: string;
  isEditing: boolean;
  onChange: (field: keyof BillingData, value: string) => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 md:grid-cols-[minmax(0,1fr)_140px]">
      <div>
        <p className="text-sm font-medium text-[#000b2f]">{label}</p>
        {note ? <p className="mt-1 text-xs font-medium text-[#7180a0]">{note}</p> : null}
      </div>
      {isEditing ? (
        <input
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-right text-sm font-semibold text-[#000b2f] outline-none focus:border-[#5548e8] focus:ring-4 focus:ring-[#5548e8]/10"
          min="0"
          step="1"
          type="number"
          value={value}
          onChange={(event) => onChange(field, event.target.value)}
        />
      ) : (
        <p className="text-right font-mono text-base font-semibold text-[#000b2f]">{value}</p>
      )}
    </div>
  );
}

function MetricTable({
  title,
  metrics,
  isEditing,
  onUpdate,
}: {
  title: string;
  metrics: DeliveryMetric[];
  isEditing: boolean;
  onUpdate: (index: number, value: string) => void;
}) {
  return (
    <div>
      <h2 className={sectionLabelClass}>{title}</h2>
      <div className="mt-3 divide-y divide-slate-200 border-t border-slate-200">
        {metrics.map((metric, index) => (
          <div className="grid min-h-12 grid-cols-[1fr_auto] items-center gap-6" key={metric.label}>
            <p className="text-base font-medium text-[#7180a0]">{metric.label}</p>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  className="h-9 w-24 rounded-lg border border-slate-200 text-center text-base font-semibold text-[#000b2f] outline-none focus:border-[#5548e8] focus:ring-4 focus:ring-[#5548e8]/10"
                  min="0"
                  step="1"
                  type="number"
                  value={metric.value}
                  onChange={(event) => onUpdate(index, event.target.value)}
                />
                <span className="text-sm font-medium text-[#7180a0]">
                  {metric.value === 1 ? "item" : "itens"}
                </span>
              </div>
            ) : (
              <p className="text-right font-mono text-base font-semibold text-[#000b2f]">
                {metric.value}{" "}
                <span className="font-sans text-sm font-medium text-[#7180a0]">
                  {metric.value === 1 ? "item" : "itens"}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ForecastBar({
  label,
  assumed,
  base,
  margin,
  percentBase,
  percentMargin,
}: {
  label: string;
  assumed: string;
  base: number;
  margin: number;
  percentBase: number;
  percentMargin: number;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7180a0]">
          {label}
        </p>
        <p className="font-mono text-sm font-medium text-[#7180a0]">{assumed}</p>
      </div>
      <div className="relative h-[38px] overflow-hidden rounded-full bg-[#e4e7ef]">
        <div
          className="absolute inset-y-0 left-0 rounded-l-full bg-[#5548e8]"
          style={{ width: `${percentBase}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-[#a8b6fb]"
          style={{ marginLeft: `${percentBase}%`, width: `${percentMargin - percentBase}%` }}
        />
      </div>
      <div className="mt-3 flex gap-6 text-sm font-medium text-[#7180a0]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#5548e8]" />
          Base · {base}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#a8b6fb]" />
          Margem · {margin}
        </span>
      </div>
    </div>
  );
}
