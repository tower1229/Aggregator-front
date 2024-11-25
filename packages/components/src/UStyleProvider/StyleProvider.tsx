import { hex2rgb } from '@aggregator/utils'
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { computed, defineComponent, watchEffect } from 'vue'
import './font.css'

export const themeColor = (theme?: string) => {
  return theme === 'dark'
    ? {
        primaryColor: '#1C60F3',
        primaryBg: 'rgba(28, 96, 243, 0.7)',
        bodyColor: '#0f0f0f',
        bg1: '#000',
        bg2: '#202328',
        bg3: '#1c1c1c',
        color1: '#EAECEF',
        color2: '#C0C0C0',
        color3: '#858E9B',
        color4: '#E5E5E5',
        colorBorder: '#2C3138',
        colorInputBorder: '#2C3138',
        colorHover: '#2F3144',
        colorScrollbar: '#5F6672',
        errorColor: '#CF304A',
        successColor: '#03A66D',
        warningColor: '#F29F39',
        infoColor: '#6AE0CF'
      }
    : {
        primaryColor: '#1C60F3',
        primaryBg: 'rgba(28, 96, 243, 0.7)',
        bodyColor: '#fff',
        bg1: '#F5F5F5',
        bg2: '#fff',
        bg3: '#fff',
        color1: '#1E2329',
        color2: '#858E9B',
        color3: '#707A8A',
        color4: '#293037',
        colorBorder: '#E0E0E0',
        colorInputBorder: '#E0E0E0',
        colorHover: '#F5F5F5',
        colorScrollbar: '#dadada',
        errorColor: '#F82329',
        successColor: '#21B689',
        warningColor: '#F29F39',
        infoColor: '#6AE0CF'
      }
}

const UStyleProvider = defineComponent({
  name: 'UStyleProvider',
  props: {
    theme: {
      type: String,
      default: 'dark'
    }
  },
  setup(props, ctx) {
    const style = document.createElement('style')
    const isMobile = window.innerWidth < 1024

    document.head.appendChild(style)

    const ColorOverrides = computed(() => themeColor(props.theme))

    const naiveThemeOverrides = computed<GlobalThemeOverrides>(() => ({
      common: {
        bodyColor: ColorOverrides.value.bodyColor,
        primaryColor: ColorOverrides.value.primaryColor,
        infoColor: ColorOverrides.value.infoColor,
        successColor: ColorOverrides.value.successColor,
        warningColor: ColorOverrides.value.warningColor,
        errorColor: ColorOverrides.value.errorColor,
        primaryColorHover: ColorOverrides.value.primaryColor,
        primaryColorPressed: ColorOverrides.value.primaryColor,
        successColorHover: ColorOverrides.value.successColor,
        successColorPressed: ColorOverrides.value.successColor,
        fontSizeSmall: isMobile ? '14px' : '12px',
        heightSmall: '24px'
      },
      Form: {
        asteriskColor: ColorOverrides.value.errorColor,
        labelFontSizeLeftSmall: isMobile ? '14px' : '12px',
        feedbackFontSizeSmall: isMobile ? '14px' : '12px',
        feedbackHeightSmall: '18px'
      },
      Button: {
        borderRadiusSmall: '2px',
        borderRadiusTiny: '2px',
        textColorPrimary: '#fff',
        textColorHoverPrimary: '#fff',
        colorHoverPrimary: ColorOverrides.value.primaryBg,
        textColorFocusPrimary: '#fff'
      },
      Input: {
        border: `1px solid ${ColorOverrides.value.colorInputBorder}`,
        borderFocus: `1px solid ${ColorOverrides.value.primaryColor}`,
        borderHover: `1px solid transparent`,
        borderWarning: `1px solid ${ColorOverrides.value.warningColor}`,
        borderError: `1px solid ${ColorOverrides.value.errorColor}`,
        borderDisabled: `1px solid ${ColorOverrides.value.color3}`,
        placeholderColor: ColorOverrides.value.color2,
        fontSizeSmall: isMobile ? '14px' : '12px',
        suffixTextColor: ColorOverrides.value.color3,
        color: ColorOverrides.value.bg3,
        colorFocus: ColorOverrides.value.bg2,
        textColor: ColorOverrides.value.color1
      },
      Scrollbar: {
        color: ColorOverrides.value.colorScrollbar,
        colorHover: ColorOverrides.value.primaryColor
      },
      InternalSelection: {
        borderHover: `1px solid transparent`,
        placeholderColor: ColorOverrides.value.color2,
        textColor: 'inherit'
      },
      Tabs: {
        tabFontWeightActive: 700,
        tabPaddingMediumBar: '7px 0'
      },
      Dropdown: {
        optionColorActive: ColorOverrides.value.colorHover
      },
      Pagination: {
        itemColorActive: ColorOverrides.value.primaryBg,
        itemTextColorActive: ColorOverrides.value.primaryColor,
        itemColorHover: ColorOverrides.value.primaryBg,
        itemColorActiveHover: ColorOverrides.value.primaryBg
      },
      Popover: {
        boxShadow: 'none'
      },
      Switch: {
        railColorActive: ColorOverrides.value.primaryColor
      },
      Notification: {
        color: ColorOverrides.value.bg3
      }
    }))

    watchEffect(() => {
      const { r, g, b } = hex2rgb(ColorOverrides.value.primaryColor)
      style.innerHTML = `:root {
        --u-body-color: ${ColorOverrides.value.bodyColor};
        --u-primary-value: ${r}, ${g}, ${b};
        --u-color-1: ${ColorOverrides.value.color1};
        --u-color-2: ${ColorOverrides.value.color2};
        --u-color-3: ${ColorOverrides.value.color3};
        --u-color-4: ${ColorOverrides.value.color4};
        --u-color-border: ${ColorOverrides.value.colorBorder};
        --u-color-hover: ${ColorOverrides.value.colorHover};
        --u-primary-color: ${ColorOverrides.value.primaryColor};
        --u-primary-bg: ${ColorOverrides.value.primaryBg};
        --u-bg-1: ${ColorOverrides.value.bg1};
        --u-bg-2: ${ColorOverrides.value.bg2};
        --u-bg-3: ${ColorOverrides.value.bg3};
        --u-color-scrollbar: ${ColorOverrides.value.colorScrollbar};
        --u-error-color: ${ColorOverrides.value.errorColor};
        --u-success-color: ${ColorOverrides.value.successColor};
        --u-warning-color: ${ColorOverrides.value.warningColor};
        --u-info-color: ${ColorOverrides.value.infoColor};
      }`
    })

    return () => (
      <NConfigProvider
        themeOverrides={naiveThemeOverrides.value}
        theme={props.theme === 'dark' ? darkTheme : null}
      >
        {ctx.slots.default?.()}
      </NConfigProvider>
    )
  }
})

export default UStyleProvider
