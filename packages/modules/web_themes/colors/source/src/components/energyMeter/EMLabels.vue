<template>
	<g id="emBarLabels">
		<!-- Bars -->
		<g v-for="(item, i) in props.plotdata" :key="i">
			<EmLabel
				:item="item"
				:x-scale="props.xScale"
				:y-scale="props.yScale"
				:margin="props.margin"
				:height="props.height"
				:barcount="props.plotdata.length"
				:aut-text="autTxt(item)"
				:autarchy="autPct(item)"
			/>
		</g>
	</g>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import { graphData } from '../powerGraph/model'
import { historicSummary, sourceSummary, usageSummary } from '@/assets/js/model'
import EmLabel from './EmLabel.vue'
import type { MarginType, PowerItem } from '@/assets/js/types'
const props = defineProps<{
	plotdata: PowerItem[]
	xScale: d3.ScaleBand<string>
	yScale: d3.ScaleLinear<number, number>
	height: number
	margin: MarginType
}>()
// computed
// methods
function autPct(item: PowerItem) {
	if (item.name == 'PV') {
		const src =
			graphData.graphMode == 'live' || graphData.graphMode == 'day'
				? sourceSummary
				: historicSummary.items
		const usg =
			graphData.graphMode == 'live' || graphData.graphMode == 'day'
				? usageSummary
				: historicSummary.items
		const exportedEnergy = usg.evuOut.energy
		const generatedEnergy = src.pv.energy
		return Math.round(
			((generatedEnergy - exportedEnergy) / generatedEnergy) * 100,
		)
	} else if (item.name == 'Netz') {
		const src =
			graphData.graphMode == 'live' || graphData.graphMode == 'day'
				? sourceSummary
				: historicSummary.items
		const usg =
			graphData.graphMode == 'live' || graphData.graphMode == 'day'
				? usageSummary
				: historicSummary.items
		const exportedEnergy = usg.evuOut.energy
		const importedEnergy = src.evuIn.energy
		const generatedEnergy = src.pv.energy
		const batEnergy = src.batOut.energy
		const storedEnergy = usg.batIn.energy
		return Math.round(
			((generatedEnergy + batEnergy - exportedEnergy - storedEnergy) /
				(generatedEnergy +
					batEnergy +
					importedEnergy -
					exportedEnergy -
					storedEnergy)) *
				100,
		)
	} else {
		return item.pvPercentage
	}
}

function autTxt(item: PowerItem) {
	if (item.name == 'PV') {
		return 'Eigen'
	} else {
		return 'Aut'
	}
}
</script>

<style></style>
