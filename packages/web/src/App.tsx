import {
  UStyleProvider,
  UMessage,
  UMessageProvider,
  UUploadProvider,
  ULoadingBarProvider,
  ULoadingBar,
  UModalProvider,
  NotificationProvider
} from '@aggregator/components'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { upload as onUpload } from './services/a2s.adapter'
import { useGlobalConfigStore } from './stores'

export default defineComponent({
  name: 'App',
  setup() {
    const globalConfigStore = useGlobalConfigStore()
    // init wallet state

    return () => (
      <UStyleProvider theme={globalConfigStore.theme}>
        <UMessageProvider>
          <UMessage />
        </UMessageProvider>
        <ULoadingBarProvider>
          <ULoadingBar />
          <UUploadProvider onUpload={onUpload}>
            <UModalProvider>
              <NotificationProvider>
                <RouterView />
              </NotificationProvider>
            </UModalProvider>
          </UUploadProvider>
        </ULoadingBarProvider>
      </UStyleProvider>
    )
  }
})
