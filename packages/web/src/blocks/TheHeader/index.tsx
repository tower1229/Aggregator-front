import { ShareOutlined, ThemeDarkOutlined, ThemeLightOutlined } from '@aggregator/icons'
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import WalletAddress from '../Address'
import logoDark from '@/assets/dark.png'
import logoLight from '@/assets/white.png'
import { useGlobalConfigStore } from '@/stores'

const TheHeader = defineComponent({
  name: 'TheHeader',
  setup(props, ctx) {
    const globalConfigStore = useGlobalConfigStore()
    const router = useRouter()

    const navigations = computed(() => {
      return [
        {
          name: 'Trade',
          active: true
        },
        {
          name: 'Earn',
          disabled: true
        },
        {
          name: 'Chart',
          icon: <ShareOutlined class="h-3.5" />,
          link: '//wechart.io/'
        },
        {
          name: 'Launch',
          icon: <ShareOutlined class="h-3.5" />,
          link: '//welaunch.work/'
        }
      ]
    })

    const goHome = () => {
      router.push('/')
    }

    return {
      globalConfigStore,
      navigations,
      goHome
    }
  },
  render() {
    const iconClass = 'w-full h-full align-top'

    return (
      <div
        class={`px-4 relative flex items-center h-16 border-b-1 border-color-border text-color3 sticky top-0 z-99 bg-color-body <lg:block <lg:pt-14 <lg:h-30`}
      >
        <div
          class="cursor-pointer flex h-16 px-4 top-0 left-0 absolute items-center"
          onClick={this.goHome}
        >
          <img src={this.globalConfigStore.theme === 'dark' ? logoDark : logoLight} class="h-8" />
        </div>

        <div class="flex h-full flex-1 items-center justify-center <lg:float-left">
          {this.navigations.map((item, index) => (
            <span
              key={item.name}
              class={
                'flex items-center font-700 px-4 hover:text-color1 <lg:px-2' +
                (item.active ? ' text-color1' : '') +
                (item.disabled ? ' cursor-default' : ' cursor-pointer')
              }
              onClick={() => item.link && window.open(item.link)}
            >
              <span class="mr-1">{item.name}</span>
              {item.icon}
            </span>
          ))}
        </div>

        <div
          class="border-color-border rounded-sm cursor-pointer border-1 h-8 p-1 w-8 <lg:top-18 <lg:right-4 <lg:absolute hover:border-color2 hover:text-color1"
          onClick={this.globalConfigStore.switchTheme}
        >
          {this.globalConfigStore.theme === 'dark' ? (
            <ThemeLightOutlined class={iconClass} />
          ) : (
            <ThemeDarkOutlined class={iconClass} />
          )}
        </div>
        {/* line */}
        <div class="border-color-border border-t-1 right-0 left-0 hidden absolute top:17 <lg:block"></div>
        <div class="flex h-16 px-4 top-0 right-10 gap-x-4 absolute items-center <lg:right-1">
          <WalletAddress />
        </div>
      </div>
    )
  }
})

export default TheHeader
