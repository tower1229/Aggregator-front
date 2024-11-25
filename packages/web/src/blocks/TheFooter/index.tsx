import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheFooter',
  render() {
    const currentYear = new Date().getFullYear()
    return (
      <div class="bg-color-body text-xs w-full p-6 bottom-0 left-0 text-color3 z-90 fixed <lg:static">
        <div class="text-center">
          Powered by
          <a class="text-primary px-1 hover:underline" href="//weconomy.network" target="_blank">
            WEconomy.network
          </a>
          ©{currentYear}
        </div>
      </div>
    )
  }
})
