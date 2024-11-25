import { NSelect } from 'naive-ui'
import { defineComponent, PropType } from 'vue'
import { DEFAULT_SKILLS, SelectOption } from '../constants'
import useLimitTags from './tag.select'
import './SkillTags.css'

const SkillTags = defineComponent({
  name: 'SkillTags',
  inheritAttrs: true,
  extends: NSelect,
  props: {
    value: {
      type: Array as PropType<string[]>
    },
    placeholder: {
      type: String,
      default: 'Select your skill tag'
    },
    tagLimit: {
      type: Number,
      default: 8
    },
    charLimit: {
      type: Number,
      default: 16
    },
    options: {
      type: Array as PropType<SelectOption[]>
    }
  },
  setup(props) {
    const limitTags = useLimitTags(props, DEFAULT_SKILLS)

    console.warn('options==', limitTags.options.value)

    return () => (
      <NSelect
        {...props}
        class="skill-tags"
        consistentMenuWidth={false}
        clearable
        maxTagCount="responsive"
        multiple
        options={limitTags.options.value}
        tag
        filterable
        onSearch={limitTags.onSearch}
        inputProps={limitTags.inputProps.value}
      />
    )
  }
})

export default SkillTags
