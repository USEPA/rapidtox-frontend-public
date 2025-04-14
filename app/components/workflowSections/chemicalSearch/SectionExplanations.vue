<template>
  <div
    role="region"
    :aria-label="`${props.type} Search Header`"
  >
    <h2>
      <strong>
        {{ props.title }}
      </strong>
    </h2>
    <p>{{ props.subtitle }}</p>
  </div>
  <div aria-labelledby="contentinfo">
    <p>
      <strong>Chemical Search Results</strong><br>
      The chemical search results tab contains a table with all of the results of your search.
      On this tab you will select the chemical(s) to use throughout the workflow.
    </p>
    <p>
      <strong>Physchem</strong><br>
      The PhysChem tab contains experimentally derived and/or predicted physicochemical
      properties including Henry’s Law, boiling point, melting point, density, vapor pressure,
      water solubility, Log KoA, and Log Kow.
    </p>
    <p>
      <strong>Env. Fate</strong><br>
      This tab contains experimentally derived and/or predicted environmental
      fate properties including biodegradation half-life and soil adsorption coefficients.
    </p>
    <p>
      <strong class="italicized-text">In Vivo</strong><strong> Toxicity</strong><br>
      The <span class="italicized-text">In Vivo</span><span> Toxicity</span> tab
      provides navigation to existent cancer and non-cancer human health toxicity
      values and dose response summary values (DRSVs) from authoritative sources, analogue-based
      read-across analysis, and bioactivity-based (i.e., ToxCast) DRSVs, when and where
      data are available.
    </p>
    <p>
      <strong>Analogue</strong><br>
      The analogue tab facilitates identification of chemicals structurally similar
      to a target chemical of interest. The analogues are sourced only from a structural
      landscape in which a given chemical has an existent human health assessment relevant
      dose response summary value (e.g., IRIS; PPRTV; ATSDR). The tab also provides data for selected
      physicochemical and toxicokinetic properties for the analogue(s) and target chemical to
      support expert-driven read-across.
    </p>
    <p>
      <strong>Bioactivity</strong><br>
      The bioactivity tab provides in vitro cell-based assay information, where and when available,
      such as tabular and visual (plot) summaries of bioactivity (e.g., active counts, percentiles),
      alerts for modeled activity in endocrine systems (e.g., estrogen or androgen
      binding and activity), and opportunities to calculate bioactivity-exposure-ratios (BERs)
      based on ToxCast bioactivity and SEEM3 exposure data.
    </p>
    <p>
      <strong>Summary</strong><br>
      The dose response summary value (DRSV) tab collects and displays all DRSVs selected by
      the user across the options provided in the <span class="italicized-text">In Vivo</span>
      <span> Toxicity</span> tab (i.e., existent traditional assay-based DRSVs;
      read-across surrogate DRSVs; and/or bioactivity-based DRSVs). This tab also provides
      the option to derive interim non-cancer human health reference values using an uncertainty
      factor application modal.
    </p>
    <p>
      <strong>Reporting</strong><br>
      This tab allows the user to generate a PDF report based on workflow session
      selections. In addition to a “session” report, a “total data landscape” report
      is also generated in the background and may be accessed by the user as needed.
      The purpose is to provide the entire landscape of data available to the user at
      the time the RapidTox session was run.
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle: string;
  type: string;
}>();
</script>

<style scoped>

</style>
