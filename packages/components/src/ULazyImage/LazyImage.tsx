import { defineComponent, ImgHTMLAttributes, ref, watch } from 'vue'
import { ExtractPropTypes } from '../utils'
import './LazyImage.css'

export const ULazyImageProps = {
  src: {
    type: String
  },
  alt: {
    type: String
  }
  // defaultSrc: {
  //   type: String
  // }
} as const

export type ULazyImagePropsType = ImgHTMLAttributes & ExtractPropTypes<typeof ULazyImageProps>

const ULazyImage = defineComponent({
  name: 'ULazyImage',
  props: ULazyImageProps,
  setup(props, ctx) {
    const loaded = ref(false)
    const errored = ref(false)

    watch(
      () => props.src,
      imgSrc => {
        if (imgSrc) {
          errored.value = false
          loaded.value = false
          const img = new Image()
          img.onload = () => {
            loaded.value = true
          }
          img.onerror = () => {
            errored.value = true
          }
          img.src = imgSrc
        } else {
          errored.value = true
        }
      },
      {
        immediate: true
      }
    )

    return () =>
      loaded.value ? (
        <img class="u-lazy-image-img" src={props.src} alt={props.alt} {...{ loading: 'lazy' }} />
      ) : (
        <span class={['u-lazy-image-placeholder', { failed: errored.value }]} {...ctx.attrs}>
          {errored.value ? (
            ''
          ) : (
            <svg
              class="u-lazy-image-waves"
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
              shape-rendering="auto"
            >
              <defs>
                <path
                  id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
              </defs>
              <g class="parallax">
                <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(153,153,153,0.7)" />
                <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(153,153,153,0.5)" />
                <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(153,153,153,0.3)" />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="#999" />
              </g>
            </svg>
          )}
        </span>
      )
  }
})

export default ULazyImage
