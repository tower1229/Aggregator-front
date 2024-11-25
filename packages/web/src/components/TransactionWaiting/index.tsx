import { UNotification } from '@aggregator/components'
import { ShareOutlined } from '@aggregator/icons'
import { defineComponent, watch, ref, nextTick } from 'vue'
import errorImage from './assets/error.png'
import loadingImage from './assets/loading.png'
import successImage from './assets/success.png'
import { useMockCountdown } from '@/hooks'
import { useGlobalConfigStore } from '@/stores'
import './UTransactionWaiting.css'

export default defineComponent({
  name: 'TransactionWaiting',
  setup(props, ctx) {
    const globalStore = useGlobalConfigStore()
    const notification = UNotification()
    const nRef = ref()
    const { left, start, cancel } = useMockCountdown()

    watch(
      () => globalStore.notice,
      notice => {
        const renderTitle = () => (
          <div class="flex items-center">
            {notice.state === 'pending' ? (
              <img src={loadingImage} class="object-cover h-5 transition animate-spin w-5" />
            ) : null}
            {notice.state === 'success' ? (
              <img src={successImage} class="object-cover h-5 w-5" />
            ) : null}
            {notice.state === 'failed' ? (
              <img src={errorImage} class="object-cover h-5 w-5" />
            ) : null}

            <strong class="flex-1 text-base ml-2">{notice.title}</strong>
          </div>
        )

        const renderContent = () => {
          return notice.txLink || notice.state === 'pending' ? (
            <>
              {notice.txLink ? (
                <a
                  href={notice.txLink}
                  target="_blank"
                  class={
                    'flex items-center hover:underline ' +
                    (notice.state === 'success' ? 'text-success' : 'text-color2')
                  }
                >
                  View on explorer <ShareOutlined class="h-4 w-4" />
                </a>
              ) : null}
              {notice.state === 'pending' ? (
                <div
                  class="u-transaction-waiting-bar"
                  style={{
                    transform: `scaleX(${left.value / 100})`
                  }}
                ></div>
              ) : null}
            </>
          ) : null
        }

        if (notice.title) {
          if (nRef.value) {
            cancel()
            nRef.value.destroy()
          }

          nextTick(() => {
            start()

            nRef.value = notification.create({
              title: renderTitle,
              content: renderContent
            })
          })
        } else {
          if (nRef.value) {
            cancel()
            nRef.value.destroy()
          }
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
  }
})
