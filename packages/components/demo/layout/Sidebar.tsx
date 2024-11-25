import { NMenu } from 'naive-ui'
import type { MenuMixedOption } from 'naive-ui/lib/menu/src/interface'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import routes from '@/ex/router/routes'

import './style.css'

export default defineComponent({
  setup() {
    return () => {
      const router = useRouter()
      const { path } = useRoute()
      const pageRoutes = routes[0].children || []

      const menuItems: MenuMixedOption[] = pageRoutes.map(item => {
        return {
          title: item.name,
          key: item.path,
          type: 'group',
          children: (item.children || []).map(c => ({
            title: c.name,
            key: c.path.startsWith('/') ? c.path : `${item.path}/${c.path}`.replace(/\/\//g, '/')
          }))
        }
      })

      return (
        <div class="w-[200px] overflow-y-auto border-r-1 layout-sidebar">
          <NMenu
            value={path}
            class=""
            defaultExpandAll
            options={menuItems}
            onUpdateValue={key => {
              router.push({ path: key })
            }}
          />
        </div>
      )
    }
  }
})
