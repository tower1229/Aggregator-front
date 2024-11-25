import { defineComponent, computed } from 'vue'
//
import darkImg from '@/assets/slogan/dark.png'
import lightImg from '@/assets/slogan/light.png'
import { useGlobalConfigStore } from '@/stores'

export default defineComponent({
  name: 'HomeSlogan',
  setup(props) {
    const globalConfig = useGlobalConfigStore()
    const sloganImg = computed(() => (globalConfig.theme === 'dark' ? darkImg : lightImg))

    return {
      sloganImg
    }
  },
  render() {
    const contHeadClass = 'h-6 flex items-center'

    return (
      <>
        <div class={contHeadClass + ' font-700 mb-2'}>The aggregator of aggregators</div>
        <div class="text-[13px] text-color3 leading-5">
          select the best route for your swaps from multiple aggregators
        </div>
        <img src={this.sloganImg} class="mt-6 w-full" />
      </>
    )
  }
})
