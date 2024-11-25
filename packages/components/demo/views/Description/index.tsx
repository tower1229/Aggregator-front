import { ArrowRightOutlined } from '@aggregator/icons'
import { defineComponent } from 'vue'
import { UDescription } from '@/comps/index'

const DescriptionDemoPage = defineComponent({
  name: 'DescriptionDemoPage',
  setup() {
    return () => (
      <div>
        <h4>One col</h4>
        <UDescription
          labelWidth="240px"
          contentWrap={false}
          items={[
            { label: 'Startup type', content: 'DAO' },
            {
              label: 'Startup name',
              content: 'UChain'
            },
            {
              label: 'Startup website',
              content: (
                <a href="https://u.chain" target="_blank">
                  https://u.chain
                </a>
              )
            },
            {
              label: 'Startup description',
              content:
                'UChain is a decentralized blockchain platform that enables the creation of decentralized applications.'
            },
            {
              label: 'Startup team members',
              content: 36
            },
            {
              label: 'Startup financial',
              content: (
                <div class="flex items-center">
                  1,000,100 USD
                  <ArrowRightOutlined />
                </div>
              )
            }
          ]}
        />
        <h4 class="mt-6">Tow col</h4>
        <UDescription
          labelWidth="240px"
          contentWrap={false}
          cols={2}
          items={[
            { label: 'Startup type', content: 'DAO' },
            {
              label: 'Startup name',
              content: 'UChain'
            },
            {
              label: 'Startup website',
              content: (
                <a href="https://u.chain" target="_blank">
                  https://u.chain
                </a>
              )
            },
            {
              label: 'Startup description',
              content:
                'UChain is a decentralized blockchain platform that enables the creation of decentralized applications.'
            },
            {
              label: 'Startup team members',
              content: 36
            },
            {
              label: 'Startup financial',
              content: (
                <div class="flex items-center">
                  1,000,100 USD
                  <ArrowRightOutlined />
                </div>
              )
            }
          ]}
        />
      </div>
    )
  }
})

export default DescriptionDemoPage
