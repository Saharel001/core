<template>
	<g :transform="'translate(' + margin.left + ',' + margin.top + ')'">
		<g
			id="PGXAxis"
			class="axis"
			:origin="drawAxis1"
			:transform="'translate(0,' + (height / 2 - 6) + ')'"
		/>
		<g
			id="PGXAxis2"
			class="axis"
			:origin="drawAxis2"
			:transform="'translate(0,' + (height / 2 + 10) + ')'"
		/>
		<g v-if="globalConfig.showGrid">
			<rect
				x="0"
				y="0"
				:width="width"
				:height="height / 2 - 10"
				fill="none"
				stroke="var(--color-grid)"
				stroke-width="0.5"
			/>
		</g>
		<g v-if="globalConfig.showGrid">
			<rect
				x="0"
				:y="height / 2 + 10"
				:width="width"
				:height="height / 2 - 10"
				fill="none"
				stroke="var(--color-grid)"
				stroke-width="0.5"
			/>
		</g>
	</g>
</template>

<script setup lang="ts">
import type { AxisContainerElement, ScaleTime } from 'd3'
import {
	axisBottom,
	extent,
	scaleBand,
	scaleTime,
	select,
	timeFormat,
} from 'd3'
import { globalConfig } from '@/assets/js/themeConfig'
import { graphData } from './model'
import { computed } from 'vue'

const props = defineProps<{
	width: number
	height: number
	margin: { left: number; top: number; right: number; bottom: number }
}>()
// state
const fontsize = 12

// computed
const xAxisGenerator = computed(() => {
	return axisBottom<Date>(xScale.value as ScaleTime<number, number, never>)
		.ticks(4)
		.tickSizeInner(ticksize.value)
		.tickFormat(timeFormat('%H:%M'))
})

const xAxisGeneratorMonth = computed(() =>
	axisBottom<number>(xScaleMonth.value)
		.ticks(4)
		.tickSizeInner(ticksize.value)
		.tickFormat((d, i) => (i + 1).toString()),
)

const ticksize = computed(() => {
	if (graphData.graphMode !== 'month' && graphData.graphMode !== 'year') {
		return globalConfig.showGrid ? -(props.height / 2 - 7) : -10
	} else {
		return 0
	}
})

const xScale = computed(() => {
	let e = extent(graphData.data, (d) => d.date)
	if (e[0] && e[1]) {
		return scaleTime<number>().domain(e).range([0, props.width])
	} else {
		return scaleTime().range([0, 0])
	}
})
const xScaleMonth = computed(() => {
	return scaleBand<number>()
		.domain(Array.from({ length: graphData.data.length }, (v, k) => k))
		.paddingInner(0.4)
		.range([0, props.width + props.margin.right])
})

const drawAxis1 = computed(() => {
	let axis = select<AxisContainerElement, number>('g#PGXAxis')
	axis.selectAll('*').remove()
	if (graphData.graphMode == 'month' || graphData.graphMode == 'year') {
		axis.call(xAxisGeneratorMonth.value)
	} else {
		axis.call(xAxisGenerator.value)
	}

	axis
		.selectAll('.tick')
		.attr('color', 'var(--color-axis)')
		.attr('font-size', fontsize)

	if (globalConfig.showGrid) {
		axis
			.selectAll('.tick line')
			.attr('stroke', 'var(--color-grid)')
			.attr('stroke-width', '0.5')
	} else {
		axis.selectAll('.tick line').attr('stroke', 'var(--color-bg)')
	}
	axis.select('.domain').attr('stroke', 'var(--color-bg)')
	axis
		.append('text')
		.attr('x', -props.margin.left)
		.attr('y', 12)
		.attr('fill', 'var(--color-axis)')
		.attr('font-size', fontsize)
		.text(graphData.graphMode == 'year' ? 'MWh' : 'kWh')
		.attr('text-anchor', 'start')
	return 'PGXAxis.vue'
})
const drawAxis2 = computed(() => {
	let axis = select<AxisContainerElement, Date>('g#PGXAxis2')
	axis.selectAll('*').remove()
	if (globalConfig.showGrid) {
		//axis.call(xAxisGenerator2.value)
		axis
			.selectAll('.tick')
			.attr('color', 'var(--color-axis)')
			.attr('font-size', fontsize)
		axis
			.selectAll('.tick line')
			.attr('stroke', 'var(--color-grid)')
			.attr('stroke-width', '0.5')
		axis.select('.domain').attr('stroke', 'var(--color-bg)')
	}
	return 'PGXAxis.vue'
})
</script>

<style></style>
