// 在你的 get_components.js 文件中
import { defineAsyncComponent } from 'vue'

const ComponentsMapping = {
    ImageContainer: () => import('@/components/ImageContainer.vue'),
    ImageWithText: () => import('@/components/ImageWithText.vue'),
    TextOnly: () => import('@/components/TextOnly.vue'),
    CoulorBarChart: () => import('@/components/CoulorBarChart.vue'),
    CircleChart: () => import('@/components/CircleChart.vue'),
    ImageTable: () => import('@/components/DrawImageTable.vue'),
    DrawImage: () => import('@/components/DrawImage.vue'),
    NumberBoard: () => import('@/components/NumberBoard.vue'),
    Numpad: () => import('@/components/VirtualNumPadInput.vue'),
    Calculator: () => import('@/components/calculator.vue'),
    Clock: () => import('@/components/clock.vue'),
    VirtualNumPad: () => import('@/components/VirtualNumPad.vue'),
    Input: () => import('@/components/ReplyInput.vue'),
    Fractions: () => import('@/components/Fractions.vue'),
    Markdown: () => import('@/components/Markdown.vue'),
    NumberLine: () => import('@/components/NumberLineV2.vue'),
    Water: () => import('@/components/Water.vue'),
    MoneyGenerator: () => import('@/components/MoneyGenerator.vue'),
}
export function GetComponents(name) {
    return ComponentsMapping[name] ? defineAsyncComponent(ComponentsMapping[name]) : null
}