import { defineComponent } from 'vue'
import { UFormFactory } from '@/comps/UForm'
import type { FormFactoryField } from '@/comps/UForm/FormFactory'

const FormFactoryDemoPage = defineComponent({
  name: 'FormFactoryDemoPage',
  setup() {
    const fields: FormFactoryField[] = [
      {
        title: 'Name',
        name: 'name',
        required: true,
        placeholder: 'what do you want people to call you ?'
      },
      {
        title: 'Location',
        name: 'location',
        placeholder: 'Please enter the city of residence'
      },
      {
        t: 'website',
        title: 'Website',
        name: 'website',
        placeholder: 'Your home page, blog, or company site'
      },
      {
        t: 'hashInput',
        category: 'comerSkill',
        title: 'Skills',
        name: 'skills',
        required: true,
        placeholder: '#Enter you skill tag'
      },
      {
        title: 'Bio',
        name: 'bio',
        required: true,
        type: 'textarea',
        placeholder: 'Tell us about yourself, at least 100 characters',
        minlength: 100,
        rules: [{ min: 100, message: 'Tell us about yourself, at least 100 characters' }],
        // @ts-ignore
        autosize: {
          minRows: 5,
          maxRows: 10
        }
      }
    ]

    const onSubmit = async (values: Record<string, any>) => {
      console.log(values)
    }
    return () => (
      <UFormFactory fields={fields} submitText="Next step" onSubmit={onSubmit}></UFormFactory>
    )
  }
})

export default FormFactoryDemoPage
