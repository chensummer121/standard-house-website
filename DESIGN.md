---
version: 1.0.0
name: STANDERRA Intelligence
description: "An investment-intelligence dark canvas built around #080B16 (deep space navy), crystalline white text (#F0F2F5), and a signature gold accent (#D4A843) that signals value and insight. The system reads as a data-rich command center: dense, authoritative, and quietly luxurious. Display type uses Inter at weight 300 with generous negative tracking. Cards float as dark panels (#111827) with hairline borders (#1F2937). The gold accent appears on CTAs, KPI highlights, and data emphasis — never decoratively. The primary blue (#3B82F6) serves as information architecture color for links and interactive elements. Tabular figures for all numeric/KPI content. Page rhythm alternates between data-dense dashboard bands and breathing whitespace sections."

colors:
  primary: "#3B82F6"
  primary-hover: "#60A5FA"
  primary-focus: "#2563EB"
  gold: "#D4A843"
  gold-hover: "#E5BC5A"
  gold-dim: "#A68A35"
  on-primary: "#FFFFFF"
  on-gold: "#080B16"
  ink: "#F0F2F5"
  ink-muted: "#CBD5E1"
  ink-subtle: "#94A3B8"
  ink-tertiary: "#64748B"
  canvas: "#080B16"
  surface-1: "#111827"
  surface-2: "#1E293B"
  surface-3: "#1F2937"
  surface-4: "#334155"
  hairline: "#1F2937"
  hairline-strong: "#334155"
  hairline-tertiary: "#475569"
  semantic-success: "#10B981"
  semantic-warning: "#F59E0B"
  semantic-danger: "#EF4444"
  semantic-info: "#3B82F6"
  gradient-start: "#3B82F6"
  gradient-end: "#8B5CF6"

typography:
  display-xl:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 64px
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: -2.5px
    fontFeature: "ss01"
  display-lg:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.10
    letterSpacing: -1.5px
    fontFeature: "ss01"
  display-md:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 36px
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: -1.0px
    fontFeature: "ss01"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.5px
  card-title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: -0.3px
  subhead:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: -0.2px
  body-lg:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  body-tabular:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: -0.3px
    fontFeature: "tnum"
  caption:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  kpi-value:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -0.5px
    fontFeature: "tnum"
  kpi-label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.5px
    fontFeature: "tnum"
  button:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  eyebrow:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.8px
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  button-gold:
    backgroundColor: "#D4A843"
    textColor: "#080B16"
    typography: "{typography.button}"
    rounded: 8px
    padding: 10px 20px
  button-gold-hover:
    backgroundColor: "#E5BC5A"
    textColor: "#080B16"
    typography: "{typography.button}"
    rounded: 8px
    padding: 10px 20px
  button-blue:
    backgroundColor: "#3B82F6"
    textColor: "#FFFFFF"
    typography: "{typography.button}"
    rounded: 8px
    padding: 10px 20px
  button-blue-hover:
    backgroundColor: "#60A5FA"
    textColor: "#FFFFFF"
    typography: "{typography.button}"
    rounded: 8px
  button-outline:
    backgroundColor: transparent
    textColor: "#F0F2F5"
    typography: "{typography.button}"
    rounded: 8px
    padding: 10px 20px
    border: 1px solid #334155
  button-outline-hover:
    backgroundColor: "#1E293B"
    textColor: "#F0F2F5"
    border: 1px solid #475569
  card-data:
    backgroundColor: "#111827"
    textColor: "#F0F2F5"
    typography: "{typography.body}"
    rounded: 12px
    padding: 24px
    border: 1px solid #1F2937
  card-kpi:
    backgroundColor: "#111827"
    textColor: "#F0F2F5"
    rounded: 12px
    padding: 20px
    border: 1px solid #1F2937
  card-featured:
    backgroundColor: "#1E293B"
    textColor: "#F0F2F5"
    rounded: 12px
    padding: 24px
    border: 1px solid #334155
  card-gold-highlight:
    backgroundColor: "#111827"
    textColor: "#F0F2F5"
    rounded: 12px
    padding: 24px
    border: 1px solid #D4A843
  nav-bar:
    backgroundColor: "rgba(8,11,22,0.85)"
    textColor: "#CBD5E1"
    typography: "{typography.body-sm}"
    backdropFilter: blur(12px)
  pill-tag:
    backgroundColor: "#1E293B"
    textColor: "#94A3B8"
    typography: "{typography.caption}"
    rounded: 9999px
    padding: 4px 10px
  pill-tag-blue:
    backgroundColor: "rgba(59,130,246,0.15)"
    textColor: "#60A5FA"
    rounded: 9999px
    padding: 4px 10px
  pill-tag-gold:
    backgroundColor: "rgba(212,168,67,0.15)"
    textColor: "#D4A843"
    rounded: 9999px
    padding: 4px 10px
  pill-tag-green:
    backgroundColor: "rgba(16,185,129,0.15)"
    textColor: "#10B981"
    rounded: 9999px
    padding: 4px 10px
  footer:
    backgroundColor: "#080B16"
    textColor: "#64748B"
    typography: "{typography.caption}"
    padding: 64px 24px
  text-input:
    backgroundColor: "#111827"
    textColor: "#F0F2F5"
    typography: "{typography.body}"
    rounded: 8px
    padding: 10px 14px
    border: 1px solid #1F2937
---

## Overview

STANDERRA Intelligence is a data-driven investment intelligence platform for East Africa. The design language is built on a deep space navy canvas (#080B16) with two signature accents: gold (#D4A843) for value/CTA emphasis and blue (#3B82F6) for information architecture. The visual identity reads as a command center — dense data panels alternate with breathing whitespace, KPI values rendered in tabular figures with gold highlights, and a restrained color palette that lets data speak.

## Design Principles

1. **Data is the hero.** KPI values, charts, and comparison tables dominate the visual hierarchy. Decoration is minimal.
2. **Gold signals value.** The gold accent (#D4A843) appears only on CTAs, KPI highlights, and premium content markers — never as decoration.
3. **Blue signals interaction.** Primary blue (#3B82F6) marks clickable elements, links, and active states.
4. **Thin weight is authority.** Display tiers render at weight 300 with negative tracking. Heavy weights only for KPI values (weight 600).
5. **Tabular figures for all numbers.** Every KPI, price, percentage, and count uses font-feature-settings: "tnum".
6. **Hairline borders, no heavy shadows.** Cards use 1px borders (#1F2937) for separation. Shadows are minimal — the dark canvas provides natural depth.

## Do's and Don'ts

### Do
- Reserve gold (#D4A843) for CTAs and KPI value highlights
- Use weight 300 with negative tracking for all display text
- Apply font-feature-settings: "tnum" on every numeric cell
- Apply font-feature-settings: "ss01" globally on body
- Use hairline borders for card separation
- Alternate dense data sections with breathing whitespace
- Use the blue-to-purple gradient (#3B82F6 → #8B5CF6) sparingly for hero backgrounds

### Don't
- Don't use gold as a body text color
- Don't bump display weight above 300
- Don't render numbers without tnum
- Don't use colored backgrounds on cards beyond surface-1 (#111827)
- Don't add decorative shadows — the dark canvas provides depth
- Don't use more than 2 accent colors per section
- Don't use rounded pill buttons — use 8px radius buttons

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Wide | ≥ 1440px | Full data panels, 5-column KPI row |
| Desktop | 1024–1440px | Default layout, 3-column cards |
| Tablet | 768–1023px | 2-column cards, simplified nav |
| Mobile | < 768px | Single column, hamburger nav, display drops 64→36px |
