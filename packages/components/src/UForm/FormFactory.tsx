import { QuestionCircleOutlined } from '@aggregator/icons'
import { omitObject, effectiveUrlValidator, isValidAddress } from '@aggregator/utils'
import {
  FormProps,
  FormInst,
  FormItemRule,
  NForm,
  NFormItem,
  FormItemProps,
  NInput
} from 'naive-ui'
import type { PropType, Slot, VNode } from 'vue'
import { defineComponent, ref, reactive, toRaw, computed } from 'vue'
import { UAddressInput, UAddressInputPropsType } from '../UInput'
import { USkillTags } from '../USelect'
import { USingleImageUpload, USingleImageUploadPropsType } from '../UUpload'
import { SelectOption } from '../constants'
import {
  UInputPropsType,
  USelect,
  UButton,
  USelectPropsType,
  UDatePickerPropsType,
  UDatePicker,
  USwitch,
  USwitchPropsType,
  UTooltip
} from '../index'
import type { ExtractPropTypes } from '../utils'
import './FormFactory.css'

export type FormFactoryInputField = {
  t?: 'string'
} & UInputPropsType

export type FormFactoryAddrssInputField = {
  t: 'address'
} & UAddressInputPropsType

export type FormFactoryWebsiteField = {
  t: 'website'
} & UInputPropsType

export type FormFactorySelectField = {
  t: 'select'
} & USelectPropsType

// export type FormFactoryHashInputField = {
//   t: 'hashInput'
//   category: 'comerSkill' | 'startup' | 'bounty'
// } & USelectPropsType

export type FormFactorySkillTagsField = {
  value?: string[]
  t: 'skillTags'
  maxLength?: number
  options: { label: string; value: string | number }[]
} & USelectPropsType

export type FormFactoryStartupTagsField = {
  value?: string[]
  t: 'startupTags'
  maxLength?: number
  options?: SelectOption[]
} & USelectPropsType

export type FormFactorySingleUploadField = {
  t: 'singleImageUpload'
} & USingleImageUploadPropsType

export type FormFactoryCustomField = {
  t: 'custom'
  render: (value: any) => VNode
}

export type FormFactoryDateField = {
  t: 'date'
} & UDatePickerPropsType

export type FormFactorySwitchField = {
  t: 'switch'
} & USwitchPropsType

declare type InternalSlots = {
  [name: string]: Slot | undefined
}

export type FormFactoryField = {
  title: string
  name: string
  required?: boolean
  rules?: FormItemRule[]
  disabled?: boolean
  class?: string
  slots?: InternalSlots
  formItemProps?: FormItemProps
  maxlength?: number
} & (
  | FormFactoryInputField
  | FormFactoryAddrssInputField
  | FormFactoryWebsiteField
  | FormFactorySkillTagsField
  | FormFactoryStartupTagsField
  | FormFactorySelectField
  | FormFactorySingleUploadField
  | FormFactoryCustomField
  | FormFactoryDateField
  | FormFactorySwitchField
)

export type FormData = Record<string, any>

export const UFormFactoryProps = {
  fields: {
    type: Array as PropType<FormFactoryField[]>,
    required: true
  },
  onSubmit: {
    type: Function as PropType<(values: FormData) => void>
  },
  submitText: {
    type: String,
    default: 'Submit'
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  onCancel: {
    type: Function as PropType<() => void>
  },
  initialValues: {
    type: Object as PropType<FormData>
  },
  // remove '' null undefined []
  removeNil: {
    type: Boolean,
    default: true
  }
} as const

export type UFormFactoryPropsType = ExtractPropTypes<typeof UFormFactoryProps> &
  Omit<FormProps, 'onSubmit'>

function renderField(field: FormFactoryField, values: FormData) {
  const props = omitObject(field, 'title', 'name', 'required', 't', 'rules')
  switch (field.t) {
    case 'website':
      return (
        <NInput
          {...(props as UInputPropsType)}
          v-model:value={values[field.name]}
          clearable
          maxlength={props?.maxlength ?? 1000000000000000}
        />
      )
    case 'address':
      return (
        <UAddressInput {...(props as UAddressInputPropsType)} v-model:value={values[field.name]} />
      )
    // case 'hashInput':
    //   return (
    //     <UHashInput
    //       {...(props as USelectPropsType & { category: 'comerSkill' | 'startup' | 'bounty' })}
    //       v-model:value={values[field.name]}
    //       clearable
    //     />
    //   )
    case 'skillTags':
      return (
        <USkillTags
          {...(props as FormFactorySkillTagsField)}
          v-model:value={values[field.name]}
          clearable
        />
      )
    case 'select':
      return (
        <USelect {...(props as USelectPropsType)} v-model:value={values[field.name]} clearable />
      )
    case 'singleImageUpload':
      return (
        <USingleImageUpload
          {...(props as USingleImageUploadPropsType)}
          v-model:value={values[field.name]}
        />
      )
    case 'date':
      return <UDatePicker {...(props as UDatePickerPropsType)} v-model:value={values[field.name]} />
    case 'switch':
      return (
        <div class="border-b border-[#E0E0E0] w-full" style="margin-top: -24px">
          <div class="flex pb-5 items-center">
            <USwitch {...(props as USwitchPropsType)} v-model:value={values[field.name]}></USwitch>
            <span class="text-[14px] " style="margin: 0 0 0 18px;">
              Post the two fields to blockchain
            </span>
            <UTooltip trigger="hover">
              {{
                trigger: () => <QuestionCircleOutlined class="h-4 ml-2 text-color2 w-4" />,
                default: () => (
                  <p class="text-white text-left u-body2">
                    <p>Recommend strongly to post the two fields to</p>
                    <p>blockchain for using more functions of WEconomy</p>
                  </p>
                )
              }}
            </UTooltip>
          </div>
          {!values[field.name] && (
            <div class="pb-5 u-h7">
              Note：Non-blockchain Projects can only be displayed in your Dashboard.
            </div>
          )}
        </div>
      )
    case 'custom':
      return field.render(values[field.name])
    default:
      return (
        <NInput
          {...(props as UInputPropsType)}
          v-model:value={values[field.name]}
          maxlength={props?.maxlength ?? 1000000000000000}
        />
      )
  }
}

export const addressInputRule: FormItemRule = {
  validator: (rule, value) => (value ? isValidAddress(value) : true),
  message: 'Please enter a valid address',
  trigger: 'blur'
}

export const websiteInputRule: FormItemRule = {
  validator: (rule, value) => (value ? effectiveUrlValidator(value) : true),
  message: 'Invalid URL',
  trigger: 'blur'
}

export function getFieldsRules(fields: FormFactoryField[]) {
  return fields.reduce<Record<string, FormItemRule[]>>((acc, field) => {
    if (field.rules) {
      acc[field.name] = field.rules
    }
    acc[field.name] = acc[field.name] ?? []
    if (field.required) {
      acc[field.name].push({
        required: true,
        message: `${field.title} cannot be blank`,
        trigger: 'blur',
        type: ['date'].includes(field.t ?? '')
          ? 'number'
          : ['skillTags', 'startupTags'].includes(field.t ?? '')
          ? 'array'
          : field.rules?.[0]?.type ?? 'string'
      })
    }
    if (field.t === 'address') {
      acc[field.name].push(addressInputRule)
    } else if (field.t === 'website') {
      acc[field.name].push(websiteInputRule)
    }
    return acc
  }, {})
}

export const UFormItemsFactory = defineComponent({
  props: {
    fields: UFormFactoryProps.fields,
    values: {
      type: Object as PropType<Record<string, any>>,
      required: true
    }
  },
  setup(props) {
    return () => (
      <>
        {props.fields.map(field => {
          return (
            <NFormItem
              key={field.name}
              class={['u-form-factory_item', field.class]}
              label={field.title}
              path={field.name}
              required={field.required}
              v-slots={field.slots}
              {...field.formItemProps}
            >
              {renderField(field, props.values)}
            </NFormItem>
          )
        })}
      </>
    )
  }
})

export const UFormFactory = defineComponent({
  extends: NForm,
  name: 'UFormFactory',
  props: UFormFactoryProps,
  setup(props, ctx) {
    const formRef = ref<FormInst>()
    const formProps = omitObject(
      props,
      'fields',
      'onSubmit',
      'submitText',
      'showCancel',
      'cancelText',
      'initialValues'
    )
    const values = reactive(props.initialValues ?? {})

    const rules = computed(() => getFieldsRules(props.fields))

    const onSubmit = () => {
      formRef.value?.validate(errors => {
        if (!errors) {
          const _values: FormData = toRaw<FormData>(values)
          if (props.removeNil) {
            Object.keys(_values).forEach(key => {
              if (
                // _values[key] === '' ||
                _values[key] === null ||
                _values[key] === undefined ||
                (Array.isArray(_values[key]) && _values[key].length === 0)
              ) {
                // delete _values[key]
                _values[key] = ''
              }
            })
          }
          props.onSubmit?.(_values)
        }
      })
    }

    return () => (
      <NForm {...formProps} model={values} rules={rules.value} ref={formRef}>
        <UFormItemsFactory fields={props.fields} values={values} />
        <div class="flex justify-end">
          {props.showCancel && (
            <UButton type="default" class="mr-4" onClick={props.onCancel}>
              {props.cancelText}
            </UButton>
          )}
          <UButton type="primary" onClick={onSubmit}>
            {props.submitText}
          </UButton>
        </div>
        {ctx.slots.default?.()}
      </NForm>
    )
  }
})
