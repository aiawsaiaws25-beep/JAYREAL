import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { requireUser } from "@/auth";
import { getLead, listAgents, listPropertyOptions, markLeadViewed } from "@/lib/admin-queries";
import { scoreLead } from "@/lib/scoring";
import { LeadDetailsForm, NoteForm, StageAssignControls, ViewingForm } from "@/components/admin/LeadActions";
import { ViewingStatusForm } from "@/components/admin/ViewingStatusForm";
import { formatDateTime, Money, PageTitle, Panel, ScoreBadge, SourceLabel, StageChip, timeAgo } from "@/components/admin/ui";
import { formatAED, titleCase } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return { title: `Lead #${id}` };
}

export default async function LeadPage({ params }: Params) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id)) notFound();

  const user = await requireUser();
  const lead = await getLead(id, user);
  if (!lead) notFound();

  if (!lead.viewedAt) await markLeadViewed(id);

  const [agents, properties] = await Promise.all([listAgents(), listPropertyOptions()]);
  const agentOptions = agents.filter((a) => a.role === "agent" || a.id === user.id);
  const { breakdown } = scoreLead(lead);
  const phoneDigits = lead.phone.replace(/[^0-9]/g, "");
  const waText = encodeURIComponent(`Hello ${lead.fullName.split(" ")[0]}, this is ${user.name} from Jay Real Estate regarding your enquiry.`);

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="label flex gap-2 text-[0.55rem] text-warmgray">
        <Link href="/admin/leads" className="hover:text-gold">
          Leads
        </Link>
        <span aria-hidden>/</span>
        <span className="text-charcoal">#{lead.id}</span>
      </nav>

      <PageTitle label={`${titleCase(lead.source.replace(/_/g, " "))} · ${timeAgo(lead.createdAt)}`} title={lead.fullName}>
        <a href={`tel:${lead.phone}`} className="label inline-flex items-center gap-2 border border-charcoal bg-charcoal px-4 py-2.5 text-[0.6rem] text-white transition-colors hover:border-gold hover:bg-gold">
          <Phone size={12} strokeWidth={1.5} /> Call
        </a>
        <a
          href={`https://wa.me/${phoneDigits}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="label inline-flex items-center gap-2 border border-charcoal px-4 py-2.5 text-[0.6rem] text-charcoal transition-colors hover:bg-charcoal hover:text-white"
        >
          WhatsApp
        </a>
        <a href={`mailto:${lead.email}`} className="label inline-flex items-center border border-line px-4 py-2.5 text-[0.6rem] text-charcoal transition-colors hover:border-gold">
          Email
        </a>
      </PageTitle>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left column: profile + scoring */}
        <div className="space-y-4">
          <Panel title="Profile">
            <dl className="space-y-4 text-sm font-light">
              <Row label="Stage">
                <StageChip stage={lead.stage} />
              </Row>
              <Row label="Score">
                <ScoreBadge score={lead.score} />
              </Row>
              <Row label="Email">
                <a href={`mailto:${lead.email}`} className="text-charcoal hover:text-gold">
                  {lead.email}
                </a>
              </Row>
              <Row label="Phone">{lead.phone}</Row>
              <Row label="Source">
                <SourceLabel source={lead.source} />
              </Row>
              <Row label="Buyer">{lead.buyerType ? titleCase(lead.buyerType) : "—"}</Row>
              <Row label="Financing">{lead.financeType ? titleCase(lead.financeType) : "—"}</Row>
              <Row label="Timeline">{lead.timeline ? titleCase(lead.timeline) : "—"}</Row>
              <Row label="Budget">{lead.budgetMin || lead.budgetMax ? `${lead.budgetMin ? formatAED(lead.budgetMin) : "…"} – ${lead.budgetMax ? formatAED(lead.budgetMax) : "…"}` : "—"}</Row>
              <Row label="Expected value">
                <Money value={lead.expectedValueAed} />
              </Row>
              <Row label="Agent">{lead.agent?.name ?? "Unassigned"}</Row>
              <Row label="Received">{formatDateTime(lead.createdAt)}</Row>
              <Row label="Last update">{formatDateTime(lead.updatedAt)}</Row>
            </dl>
          </Panel>

          <Panel title="Score breakdown">
            {breakdown.length === 0 ? (
              <p className="text-xs font-light text-warmgray">No scoring signals yet. Add financing, timeline or budget below.</p>
            ) : (
              <ul className="space-y-2 text-sm font-light">
                {breakdown.map((b) => (
                  <li key={b.label} className="flex items-center justify-between border-b border-line pb-2 last:border-b-0">
                    <span className="text-charcoal">{b.label}</span>
                    <span className="tabular-nums text-gold">+{b.points}</span>
                  </li>
                ))}
                <li className="flex items-center justify-between pt-1">
                  <span className="label text-[0.55rem] text-warmgray">Total</span>
                  <span className="font-serif text-2xl text-charcoal">{lead.score}</span>
                </li>
              </ul>
            )}
          </Panel>

          {(lead.property || lead.project) && (
            <Panel title="Interest">
              {lead.property && (
                <div className="text-sm font-light">
                  <p className="label text-[0.55rem] text-warmgray">Property</p>
                  <Link href={`/properties/${lead.property.slug}`} className="mt-1 block text-charcoal hover:text-gold" target="_blank">
                    {lead.property.title}
                  </Link>
                  <p className="mt-1 text-xs text-warmgray">
                    {lead.property.community} · {formatAED(lead.property.priceAed)} · {titleCase(lead.property.status)}
                  </p>
                </div>
              )}
              {lead.project && (
                <div className={lead.property ? "mt-4 border-t border-line pt-4 text-sm font-light" : "text-sm font-light"}>
                  <p className="label text-[0.55rem] text-warmgray">Project</p>
                  <Link href={`/projects/${lead.project.slug}`} className="mt-1 block text-charcoal hover:text-gold" target="_blank">
                    {lead.project.name}
                  </Link>
                  <p className="mt-1 text-xs text-warmgray">
                    {lead.project.community}
                    {lead.project.developer ? ` · ${lead.project.developer.name}` : ""}
                  </p>
                </div>
              )}
            </Panel>
          )}
        </div>

        {/* Middle + right: actions, notes, viewings */}
        <div className="space-y-4 lg:col-span-2">
          <Panel title="Stage & assignment">
            <StageAssignControls lead={lead} agents={agentOptions} properties={properties} isAdmin={user.role === "admin"} currentUserId={user.id} />
          </Panel>

          {lead.message && (
            <Panel title="Message">
              <p className="whitespace-pre-line text-sm font-light leading-relaxed text-charcoal">{lead.message}</p>
            </Panel>
          )}

          <Panel title="Qualification">
            <LeadDetailsForm lead={lead} />
          </Panel>

          <Panel title="Notes">
            <NoteForm leadId={lead.id} />
            <ol className="mt-8 space-y-0 border-l border-line">
              {lead.notes.length === 0 && <li className="pl-6 text-xs font-light text-warmgray">No notes yet.</li>}
              {lead.notes.map((n) => (
                <li key={n.id} className="relative pb-6 pl-6 last:pb-0">
                  <span className="absolute -left-px top-1.5 h-2 w-2 -translate-x-1/2 bg-gold" aria-hidden />
                  <p className="text-xs font-light text-warmgray">
                    {n.user?.name ?? "System"} · {formatDateTime(n.createdAt)}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm font-light text-charcoal">{n.note}</p>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Viewings">
            <ViewingForm leadId={lead.id} properties={properties} agents={agentOptions} isAdmin={user.role === "admin"} defaultPropertyId={lead.propertyId} defaultAgentId={lead.assignedTo} />
            {lead.viewings.length > 0 && (
              <ul className="mt-8 divide-y divide-line border-t border-line">
                {lead.viewings.map((v) => (
                  <li key={v.id} className="py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-normal text-charcoal">{v.property?.title ?? "Property TBC"}</p>
                      <p className="text-xs font-light text-warmgray">
                        {formatDateTime(v.scheduledAt)} · {v.agent?.name ?? "—"}
                      </p>
                    </div>
                    <div className="mt-3">
                      <ViewingStatusForm viewingId={v.id} status={v.status} feedback={v.feedback} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {lead.deals.length > 0 && (
            <Panel title="Deals">
              <ul className="divide-y divide-line">
                {lead.deals.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm font-light">
                    <span className="text-charcoal">{d.property?.title ?? "Property"}</span>
                    <span className="text-warmgray">
                      {formatAED(d.salePriceAed)} · {Number(d.commissionPercent)}% = {formatAED(d.commissionAed)} · {formatDateTime(d.closedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-b-0 last:pb-0">
      <dt className="label shrink-0 text-[0.55rem] text-warmgray">{label}</dt>
      <dd className="text-right text-charcoal">{children}</dd>
    </div>
  );
}
