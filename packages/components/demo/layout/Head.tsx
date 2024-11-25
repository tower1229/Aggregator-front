import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-[50px] flex flex-row items-center p-x-[32px] border-b-1 text-">
          Component Examples
        </div>
      )
    }
  }
})
