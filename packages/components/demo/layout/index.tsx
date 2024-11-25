import { defineComponent } from 'vue'
import Body from './Body'
import Head from './Head'
import Sidebar from './Sidebar'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-screen flex flex-col">
          <Head />
          <div class="flex-1 flex flex-row min-h-0">
            <Sidebar />
            <div class="flex-1 min-w-0 overflow-y-auto">
              <Body />
            </div>
          </div>
        </div>
      )
    }
  }
})
