import { UploadFilled } from '@aggregator/icons'
import { sizeFormat } from '@aggregator/utils'
import { NImage, NProgress, NUpload } from 'naive-ui'
import { CustomRequest, OnBeforeUpload } from 'naive-ui/lib/upload/src/interface'
import { computed, defineComponent, ref } from 'vue'
import type { ExtractPropTypes } from '../utils'
import { useUpload } from './UUploadProvider'

import './USingleImageUpload.css'

export const USingleImageUploadProps = {
  value: {
    type: String
  },
  size: {
    type: Number,
    required: false,
    default: 72
  },
  text: {
    type: String,
    required: false,
    default: 'Select a file to upload'
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  sizeLimit: {
    type: Number,
    required: false,
    default: 1024 * 1024 * 10
  },
  disabled: {
    type: Boolean,
    default: false
  }
} as const

export type USingleImageUploadPropsType = ExtractPropTypes<typeof USingleImageUploadProps>

const USingleImageUpload = defineComponent({
  name: 'USingleImageUpload',
  props: USingleImageUploadProps,
  emits: ['update:value'],
  setup(props, ctx) {
    const { onUpload } = useUpload()
    const process = ref(100)
    const imgRef = ref()
    const sizeStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`
    }))

    const onBeforeUpload: OnBeforeUpload = ({ file }) => {
      if (file.file && props.sizeLimit) {
        if (file.file?.size > props.sizeLimit) {
          return Promise.reject(
            new Error(`File should not large than ${sizeFormat(props.sizeLimit)}`)
          )
        }
      }
      return Promise.resolve()
    }

    const customRequest: CustomRequest = async ({ file, onProgress, onFinish, onError }) => {
      if (file.file) {
        process.value = 0
        onUpload(file.file, percent => {
          process.value = percent
          onProgress({ percent })
        })
          .then(url => {
            process.value = 100
            ctx.emit('update:value', url)
            onFinish()
          })
          .catch(err => {
            process.value = 100
            console.error(err)
            onError()
          })
      }
    }

    const preview = (e: Event) => {
      imgRef.value?.click()
      e.stopPropagation()
    }

    const remove = (e: Event) => {
      ctx.emit('update:value', '')
      e.stopPropagation()
    }

    return () => (
      <NUpload
        showFileList={false}
        accept={props.accept}
        onBeforeUpload={onBeforeUpload}
        customRequest={customRequest}
        disabled={props.disabled}
      >
        <div class="u-single-upload-inner">
          {/* image wrapper */}
          <div class="u-single-upload-wrapper">
            {props.value && (
              <div
                class="u-single-upload-preview"
                style={{
                  ...sizeStyle.value
                  // transform: `translateY(${props.size}px)`
                }}
              >
                {/* preview */}
                <svg viewBox="0 0 24 24" class="u-single-upload-preview__icon" onClick={preview}>
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="2"></circle>
                    <path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7"></path>
                  </g>
                </svg>
                {/*remove*/}
                <svg viewBox="0 0 24 24" class="u-single-upload-preview__icon" onClick={remove}>
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M4 7h16"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"></path>
                    <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"></path>
                  </g>
                </svg>
              </div>
            )}
            {props.value ? (
              <NImage
                ref={imgRef}
                class="u-single-upload-img"
                src={props.value}
                objectFit="cover"
                style={sizeStyle.value}
              />
            ) : (
              <div class="u-single-upload-img" style={sizeStyle.value}>
                <UploadFilled />
              </div>
            )}
          </div>
          {process.value < 100 && (
            <NProgress
              class="u-single-upload-progress"
              color="var(--u-primary-color)"
              railColor="transparent"
              strokeWidth={3}
              type="circle"
              percentage={process.value}
              showIndicator={false}
            />
          )}
          <div class="u-single-upload-txt">{props.text}</div>
        </div>
      </NUpload>
    )
  }
})

export default USingleImageUpload
