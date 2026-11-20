"use client";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { ExternalIcon, InfoIcon, ShieldIcon } from "@/components/icons";
import { OFFICIAL_LINKS } from "@/lib/pap/domain";

export function DonateTab() {
  const { t } = useExperience();

  return (
    <>
      <div className="page-head">
        <span className="kicker">{t.donate.kicker}</span>
        <h1>{t.donate.title}</h1>
        <p className="lede">{t.donate.subtitle}</p>
      </div>

      <div className="donate-grid">
        <div className="card donate-card">
          <span className="badge badge-cyan">{t.donate.onlineKicker}</span>
          <h2 className="card-title">{t.donate.onlineTitle}</h2>
          <p className="card-body">{t.donate.onlineBody}</p>
          <a
            className="btn btn-secondary"
            href={OFFICIAL_LINKS.donate}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.donate.onlineCta} (${t.common.external})`}
          >
            {t.donate.onlineCta}
            <ExternalIcon />
          </a>
        </div>

        <div className="card donate-card">
          <span className="badge badge-coral">{t.donate.papKicker}</span>
          <h2 className="card-title">{t.donate.papTitle}</h2>
          <p className="card-body">{t.donate.papBody}</p>
          <a
            className="btn btn-primary"
            href={OFFICIAL_LINKS.pap}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.donate.papCta} (${t.common.external})`}
          >
            {t.donate.papCta}
            <ExternalIcon />
          </a>
        </div>
      </div>

      <div className="card stack">
        <div>
          <h2 className="card-title">{t.donate.differenceTitle}</h2>
          <p className="card-body">{t.donate.differenceIntro}</p>
        </div>
        <div className="compare" role="table" aria-label={t.donate.differenceTitle}>
          <div className="compare-row compare-head" role="row">
            <div role="columnheader" />
            <div role="columnheader">{t.donate.onlineKicker}</div>
            <div role="columnheader">{t.donate.papKicker}</div>
          </div>
          {t.donate.rows.map((row) => (
            <div className="compare-row" role="row" key={row.label}>
              <div role="rowheader">{row.label}</div>
              <div role="cell">{row.online}</div>
              <div role="cell">{row.pap}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="callout callout-coral">
          <span className="callout-icon" aria-hidden="true">
            <InfoIcon />
          </span>
          <div>
            <strong>{t.donate.noteTitle}</strong>
            <p>{t.donate.note}</p>
          </div>
        </div>

        <div className="card card-tight stack">
          <span className="badge">
            <ShieldIcon />
            {t.donate.officialTitle}
          </span>
          <p className="tiny muted">{t.donate.officialBody}</p>
          <div className="link-list">
            <a href={OFFICIAL_LINKS.home} target="_blank" rel="noopener noreferrer">
              {t.donate.linkHome}
              <ExternalIcon width={14} height={14} />
            </a>
            <a href={OFFICIAL_LINKS.pap} target="_blank" rel="noopener noreferrer">
              {t.donate.linkPap}
              <ExternalIcon width={14} height={14} />
            </a>
            <a href={OFFICIAL_LINKS.donate} target="_blank" rel="noopener noreferrer">
              {t.donate.linkDon}
              <ExternalIcon width={14} height={14} />
            </a>
            <a
              href={OFFICIAL_LINKS.inscription}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.donate.linkInscription}
              <ExternalIcon width={14} height={14} />
            </a>
          </div>
          <p className="tiny muted">{t.donate.independent}</p>
        </div>
      </div>
    </>
  );
}
