import { defineComponent, ref } from 'vue'

import { UInput, UInputGroup, UButton, UAddressInput } from '@/comps/index'

export default defineComponent({
  setup() {
    const address = ref('')
    return () => {
      return (
        <div class="h-full">
          <div class="rounded-xl p-20px">
            <div class="mb-16px text-16px">基础</div>
            <div class="flex flex-row">
              <UInput />
            </div>
            <div class="my-16px text-16px">Search</div>
            <div class="flex flex-row">
              <UInputGroup>
                <UInput />
                <UButton type="primary">搜索</UButton>
              </UInputGroup>
            </div>
            <div class="my-16px text-16px">Address Input</div>
            <UAddressInput v-model:value={address.value} />
          </div>
        </div>
      )
    }
  }
})
